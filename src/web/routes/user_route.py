from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.user import User
from src.pokemonApp.sql_user_repository import SqlUserRepository


user_routes = Blueprint("user_routes", __name__)

executor = SqlCommandExecutor()
users_repo = SqlUserRepository(executor)


def serialize_user(user: User) -> dict:
    return {
        "userId": user.user_id,
        "userName": user.user_name,
        "wins": user.wins,
        "losses": user.losses,
    }


@user_routes.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = users_repo.get_user_by_Id(user_id)

    if user is None:
        return {"message": "User not found"}, 404

    return serialize_user(user)


@user_routes.route("/users", methods=["GET"])
def get_users():
    users = users_repo.get_all_users()

    if not users:
        return []

    return [serialize_user(user) for user in users]


@user_routes.route("/users/create", methods=["POST"])
def create_user():
    user_name = request.form.get("userName")
    wins = request.form.get("wins", type=int)
    losses = request.form.get("losses", type=int)

    if not user_name:
        return {"message": "userName is required"}, 400

    if wins is None or losses is None:
        return {"message": "wins and losses are required"}, 400

    if wins < 0 or losses < 0:
        return {"message": "wins and losses must be 0 or greater"}, 400

    user = User(userId=None, user_name=user_name, wins=wins, losses=losses)
    created_user = users_repo.create_user(user)

    return {
        "message": "User created successfully",
        "user": serialize_user(created_user),
    }, 201


@user_routes.route("/users/<int:user_id>/update", methods=["POST"])
def update_user(user_id):
    user = users_repo.get_user_by_Id(user_id)

    if user is None:
        return {"message": "User not found"}, 404

    user_name = request.form.get("userName")
    wins = request.form.get("wins", type=int)
    losses = request.form.get("losses", type=int)

    if not user_name or wins is None or losses is None:
        return {"message": "userName, wins, and losses are required"}, 400

    if wins < 0 or losses < 0:
        return {"message": "wins and losses must be 0 or greater"}, 400

    users_repo.update_user(user_id, user_name, wins, losses)
    updated_user = users_repo.get_user_by_Id(user_id)

    return {
        "message": "User updated successfully",
        "user": serialize_user(updated_user),
    }


@user_routes.route("/users/<int:user_id>/delete", methods=["POST"])
def delete_user(user_id):
    user = users_repo.get_user_by_Id(user_id)

    if user is None:
        return {"message": "User not found"}, 404

    users_repo.delete_user(user_id)
    return {"message": "User deleted successfully"}
