from flask import Blueprint

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.type import Type
from src.pokemonApp.sql_type_repository import SqlTypeRepository


type_routes = Blueprint("type_routes", __name__)

executor = SqlCommandExecutor()
type_repo = SqlTypeRepository(executor)


def serialize_type(the_type: Type) -> dict:
    return {
        "typeId": the_type.type_Id,
        "name": the_type.name,
    }


@type_routes.route("/types", methods=["GET"])
def get_all_types():
    types = type_repo.get_all_types()

    if not types:
        return []

    return [serialize_type(the_type) for the_type in types]


@type_routes.route("/types/<int:type_id>", methods=["GET"])
def get_type_by_id(type_id):
    the_type = type_repo.get_type_by_Id(type_id)

    if the_type is None:
        return {"message": "Type not found"}, 404

    return serialize_type(the_type)
