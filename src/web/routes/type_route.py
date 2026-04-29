from flask import Blueprint
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.type import Type
from src.pokemonApp.sql_type_repository import SqlTypeRepository

type_routes = Blueprint("type_routes", __name__)

executor = SqlCommandExecutor()
type_repo = SqlTypeRepository(executor)

def serialize_type(t: Type) -> dict:
    return {
        "typeId": t.TypeId,
        "name": t.Name,
    }

@type_routes.route("/types", methods=["GET"])
def get_all_types():
    types = type_repo.get_all_types()
    return [serialize_type(t) for t in types] if types else []

@type_routes.route("/types/<int:type_id>", methods=["GET"])
def get_type_by_id(type_id):
    t = type_repo.get_type_by_id(type_id)
    if t is None:
        return {"message": "Type not found"}, 404
    return serialize_type(t)
