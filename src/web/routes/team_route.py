from flask import Blueprint, request
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.team import Team
from src.pokemonApp.sql_team_repository import SqlTeamRepository

team_routes = Blueprint("team_routes", __name__)

executor = SqlCommandExecutor()
team_repo = SqlTeamRepository(executor)

def serialize_team(t: Team) -> dict:
    return {
        "teamId": t.TeamId,
        "userId": t.UserId,
        "teamName": t.TeamName,
    }

@team_routes.route("/users/<int:user_id>/teams", methods=["GET"])
def get_users_teams(user_id):
    teams = team_repo.get_teams_by_user_id(user_id)
    return [serialize_team(t) for t in teams] if teams else []

@team_routes.route("/teams/<int:team_id>", methods=["GET"])
def get_team(team_id):
    team = team_repo.get_team_by_id(team_id)
    if team is None:
        return {"message": "Team not found"}, 404
    return serialize_team(team)

@team_routes.route("/users/<int:user_id>/teams/create", methods=["POST"])
def create_team(user_id):
    name = request.form.get("teamName")
    if not name:
        return {"message": "teamName is required"}, 400

    team = Team(None, user_id, name)
    team_repo.create_team(team)
    return {"message": "Team created", "team": serialize_team(team)}, 201

@team_routes.route("/teams/<int:team_id>/delete", methods=["POST"])
def delete_team(team_id):
    team_repo.delete_team(team_id)
    return {"message": "Team deleted"}
