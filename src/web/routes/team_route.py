from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.team import Team
from src.pokemonApp.sql_team_repository import SqlTeamRepository


team_routes = Blueprint("team_routes", __name__)

executor = SqlCommandExecutor()
teams_repo = SqlTeamRepository(executor)


def serialize_team(team: Team) -> dict:
    return {
        "teamId": team.team_Id,
        "userId": team.user_Id,
        "teamName": team.team_name,
    }


@team_routes.route("/users/<int:user_id>/teams", methods=["GET"])
def get_users_teams(user_id):
    teams = teams_repo.get_team_with_userId(user_id)

    if not teams:
        return []

    return [serialize_team(team) for team in teams]


@team_routes.route("/teams/<int:team_id>", methods=["GET"])
def get_specific_team(team_id):
    team = teams_repo.get_team_with_teamId(team_id)

    if team is None:
        return {"message": "Team not found"}, 404

    return serialize_team(team)


@team_routes.route("/users/<int:user_id>/teams/create", methods=["POST"])
def create_team(user_id):
    team_name = request.form.get("teamName")

    if not team_name:
        return {"message": "teamName is required"}, 400

    team = Team(team_Id=None, user_Id=user_id, team_name=team_name)
    created_team = teams_repo.create_team(team)

    return {
        "message": "Team created successfully",
        "team": serialize_team(created_team),
    }, 201


@team_routes.route("/teams/<int:team_id>/delete", methods=["POST"])
def delete_team(team_id):
    team = teams_repo.get_team_with_teamId(team_id)

    if team is None:
        return {"message": "Team not found"}, 404

    teams_repo.delete_team(team)
    return {"message": "Team deleted successfully"}
