from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.sql_pokemon_repository import SqlPokemonRepository


pokemon_routes = Blueprint("pokemon_routes", __name__)

executor = SqlCommandExecutor()
pokemon_repo = SqlPokemonRepository(executor)


def serialize_pokemon(pokemon: Pokemon) -> dict:
    return {
        "pokedexId": pokemon.pokedex_Id,
        "speciesId": pokemon.species_Id,
        "level": pokemon.level,
        "ability": pokemon.ability,
        "nature": pokemon.nature,
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>", methods=["GET"])
def get_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    return serialize_pokemon(pokemon)


@pokemon_routes.route("/pokemon/create", methods=["POST"])
def create_pokemon():
    species_id = request.form.get("speciesId", type=int)
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    nature = request.form.get("nature")

    if species_id is None or level is None or not ability or not nature:
        return {"message": "speciesId, level, ability, and nature are required"}, 400

    pokemon = Pokemon(
        pokedex_Id=None,
        species_Id=species_id,
        level=level,
        ability=ability,
        nature=nature,
    )
    pokemon_repo.create_pokemon(pokemon)

    return {
        "message": "Pokemon created successfully",
        "pokemon": serialize_pokemon(pokemon),
    }, 201


@pokemon_routes.route("/pokemon/<int:pokedex_id>/update", methods=["POST"])
def update_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    nature = request.form.get("nature")

    if level is None or not ability or not nature:
        return {"message": "level, ability, and nature are required"}, 400

    updated_pokemon = Pokemon(
        pokedex_Id=pokedex_id,
        species_Id=pokemon.species_Id,
        level=level,
        ability=ability,
        nature=nature,
    )
    pokemon_repo.update_pokemon_modifiers(updated_pokemon)

    return {
        "message": "Pokemon updated successfully",
        "pokemon": serialize_pokemon(updated_pokemon),
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>/delete", methods=["POST"])
def delete_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_repo.delete_pokemon(pokedex_id)
    return {"message": "Pokemon deleted successfully"}
