from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.team_member import Team_Member
from src.pokemonApp.sql_team_member_repository import SqlTeamMember


team_member_routes = Blueprint("team_member_routes", __name__)

executor = SqlCommandExecutor()
team_member_repo = SqlTeamMember(executor)


def serialize_team_member(team_member: Team_Member) -> dict:
    return {
        "memberId": team_member.member_Id,
        "teamId": team_member.team_Id,
        "pokedexId": team_member.pokedex_Id,
        "teamNumber": team_member.team_number,
    }


@team_member_routes.route("/teams/<int:team_id>/members", methods=["GET"])
def get_team_members(team_id):
    members = team_member_repo.get_all_team_members(team_id)

    if not members:
        return []

    return [serialize_team_member(member) for member in members]


@team_member_routes.route("/teams/<int:team_id>/members/create", methods=["POST"])
def create_team_member(team_id):
    pokedex_id = request.form.get("pokedexId", type=int)
    team_number = request.form.get("teamNumber", type=int)

    if pokedex_id is None or team_number is None:
        return {"message": "pokedexId and teamNumber are required"}, 400

    team_member = Team_Member(
        member_Id=None,
        team_id=team_id,
        pokedex_Id=pokedex_id,
        team_number=team_number,
    )
    team_member_repo.create_team_member(team_member)

    return {
        "message": "Team member created successfully",
        "teamMember": serialize_team_member(team_member),
    }, 201


@team_member_routes.route("/members/<int:member_id>/update", methods=["POST"])
def update_team_member(member_id):
    pokedex_id = request.form.get("pokedexId", type=int)
    team_number = request.form.get("teamNumber", type=int)

    if pokedex_id is None or team_number is None:
        return {"message": "pokedexId and teamNumber are required"}, 400

    team_member_repo.update_team_member(member_id, pokedex_id, team_number)
    return {"message": "Team member updated successfully"}


@team_member_routes.route("/members/<int:member_id>/delete", methods=["POST"])
def delete_team_member(member_id):
    team_member_repo.delete_team_member(member_id)
    return {"message": "Team member deleted successfully"}
