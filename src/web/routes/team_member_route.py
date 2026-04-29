from flask import Blueprint, request
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.team_member import TeamMember
from src.pokemonApp.sql_team_member_repository import SqlTeamMemberRepository

team_member_routes = Blueprint("team_member_routes", __name__)

executor = SqlCommandExecutor()
tm_repo = SqlTeamMemberRepository(executor)

def serialize_tm(tm: TeamMember) -> dict:
    return {
        "memberId": tm.MemberId,
        "teamId": tm.TeamId,
        "pokemonId": tm.PokemonId,
        "teamNumber": tm.TeamNumber,
    }

@team_member_routes.route("/teams/<int:team_id>/members", methods=["GET"])
def get_members(team_id):
    members = tm_repo.get_members_by_team_id(team_id)
    return [serialize_tm(m) for m in members] if members else []

@team_member_routes.route("/teams/<int:team_id>/members/create", methods=["POST"])
def create_member(team_id):
    pokemon_id = request.form.get("pokemonId", type=int)
    team_number = request.form.get("teamNumber", type=int)

    if pokemon_id is None or team_number is None:
        return {"message": "pokemonId and teamNumber required"}, 400

    tm = TeamMember(None, team_id, pokemon_id, team_number)
    tm_repo.create_team_member(tm)
    return {"message": "Team member created", "teamMember": serialize_tm(tm)}, 201

@team_member_routes.route("/members/<int:member_id>/update", methods=["POST"])
def update_member(member_id):
    pokemon_id = request.form.get("pokemonId", type=int)
    team_number = request.form.get("teamNumber", type=int)

    if pokemon_id is None or team_number is None:
        return {"message": "pokemonId and teamNumber required"}, 400

    tm_repo.update_team_member(member_id, pokemon_id, team_number)
    return {"message": "Team member updated"}

@team_member_routes.route("/members/<int:member_id>/delete", methods=["POST"])
def delete_member(member_id):
    tm_repo.delete_team_member(member_id)
    return {"message": "Team member deleted"}
