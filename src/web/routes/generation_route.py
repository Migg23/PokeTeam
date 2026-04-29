from flask import Blueprint
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.generation import Generation
from src.pokemonApp.sql_generation_repository import SqlGenerationRepository

generation_routes = Blueprint("generation_routes", __name__)

executor = SqlCommandExecutor()
generation_repo = SqlGenerationRepository(executor)

def serialize_generation(g: Generation) -> dict:
    return {
        "genId": g.GenId,
        "regionId": g.RegionId,
        "genName": g.GenName,
    }

@generation_routes.route("/generations", methods=["GET"])
def get_all_generations():
    gens = generation_repo.get_all_generations()
    return [serialize_generation(g) for g in gens] if gens else []

@generation_routes.route("/generations/<int:generation_id>", methods=["GET"])
def get_generation_by_id(generation_id):
    gen = generation_repo.get_generation_by_id(generation_id)
    if gen is None:
        return {"message": "Generation not found"}, 404
    return serialize_generation(gen)

@generation_routes.route("/regions/<int:region_id>/generations", methods=["GET"])
def get_generations_by_region(region_id):
    gens = generation_repo.get_generations_by_region(region_id)
    return [serialize_generation(g) for g in gens] if gens else []
