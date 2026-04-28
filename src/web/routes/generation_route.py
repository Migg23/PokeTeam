from flask import Blueprint

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.generation import Generation
from src.pokemonApp.sql_generation_repository import SqlGenerationRepository


generation_routes = Blueprint("generation_routes", __name__)

executor = SqlCommandExecutor()
generation_repo = SqlGenerationRepository(executor)


def serialize_generation(generation: Generation) -> dict:
    return {
        "genId": generation.gen_Id,
        "regionId": generation.region_Id,
        "genName": generation.gen_Name,
    }


@generation_routes.route("/generations", methods=["GET"])
def get_all_generations():
    generations = generation_repo.get_all_generations()

    if not generations:
        return []

    return [serialize_generation(generation) for generation in generations]


@generation_routes.route("/generations/<int:generation_id>", methods=["GET"])
def get_generation_by_id(generation_id):
    generation = generation_repo.get_generation_by_id(generation_id)

    if generation is None:
        return {"message": "Generation not found"}, 404

    return serialize_generation(generation)


@generation_routes.route("/regions/<int:region_id>/generations", methods=["GET"])
def get_generation_by_region(region_id):
    generations = generation_repo.get_generation_by_region(region_id)

    if not generations:
        return []

    return [serialize_generation(generation) for generation in generations]
