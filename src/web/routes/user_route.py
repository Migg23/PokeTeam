from flask import Blueprint, request
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.user import User
from src.pokemonApp.sql_user_repository import SqlUserRepository

user_routes = Blueprint("user_routes", __name__)

executor = SqlCommandExecutor()
user_repo = SqlUserRepository(executor)

def serialize_user(u: User) -> dict:
    return {
        "userId": u.UserId,
        "userName": u.UserName,
        "wins": u.Wins,
        "losses": u.Losses,
    }

@user_routes.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = user_repo.get_user_by_id(user_id)
    if user is None:
        return {"message": "User not found"}, 404
    return serialize_user(user)

@user_routes.route("/users", methods=["GET"])
def get_users():
    users = user_repo.get_all_users()
    return [serialize_user(u) for u in users] if users else []

@user_routes.route("/users/create", methods=["POST"])
def create_user():
    name = request.form.get("userName")
    wins = request.form.get("wins", type=int)
    losses = request.form.get("losses", type=int)

    if not name or wins is None or losses is None:
        return {"message": "userName, wins, and losses are required"}, 400

    user = User(None, name, wins, losses)
    user_repo.create_user(user)
    return {"message": "User created", "user": serialize_user(user)}, 201

@user_routes.route("/users/<int:user_id>/update", methods=["POST"])
def update_user(user_id):
    wins = request.form.get("wins", type=int)
    losses = request.form.get("losses", type=int)

    if wins is None or losses is None:
        return {"message": "wins and losses are required"}, 400

    user_repo.update_user(user_id, wins, losses)
    updated = user_repo.get_user_by_id(user_id)
    return {"message": "User updated", "user": serialize_user(updated)}

@user_routes.route("/users/<int:user_id>/delete", methods=["POST"])
def delete_user(user_id):
    user_repo.delete_user(user_id)
    return {"message": "User deleted"}
