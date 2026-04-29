from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.sql_pokemon_repository import SqlPokemonRepository
from src.pokemonApp.sql_pokemon_species_repository import SqlPokemonSpecies
from src.web.routes.pokeapi_handler import PokeApiHandler


pokemon_routes = Blueprint("pokemon_routes", __name__)

executor = SqlCommandExecutor()
pokemon_repo = SqlPokemonRepository(executor)
pokemon_species_repo = SqlPokemonSpecies(executor)
pokeapi_handler = PokeApiHandler(executor, pokemon_species_repo)


def serialize_pokemon(pokemon: Pokemon, pokemon_species, calculated_stats: dict) -> dict:
    return {
        "pokedexId": pokemon.pokedex_Id,
        "speciesId": pokemon.species_Id,
        "pokemonName": pokemon_species.species_name,
        "level": pokemon.level,
        "ability": pokemon.ability,
        "modifier": pokemon.nature,
        "baseStats": {
            "hp": pokemon_species.hp,
            "atk": pokemon_species.atk,
            "def": pokemon_species.deff,
            "spAtk": pokemon_species.spatk,
            "spDef": pokemon_species.spdef,
            "speed": pokemon_species.speed,
        },
        "calculatedStats": calculated_stats,
    }


def get_modifier_value():
    return request.form.get("modifier") or request.form.get("nature")


def get_name_value():
    return request.form.get("pokemonName") or request.form.get("name")


@pokemon_routes.route("/pokemon/<int:pokedex_id>", methods=["GET"])
def get_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_species = pokemon_species_repo.get_pokemon_species_by_id(pokemon.species_Id)
    if pokemon_species is None:
        return {"message": "Pokemon species not found for this pokemon"}, 404

    calculated_stats = pokeapi_handler.calculate_stats(pokemon_species, pokemon.level, pokemon.nature)
    return serialize_pokemon(pokemon, pokemon_species, calculated_stats)


@pokemon_routes.route("/pokemon/search", methods=["POST"])
def search_pokemon():
    pokemon_name = get_name_value()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = get_modifier_value()

    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400

    try:
        pokemon_species = pokeapi_handler.ensure_species(pokemon_name)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    calculated_stats = pokeapi_handler.calculate_stats(pokemon_species, level, modifier)

    return {
        "message": "Pokemon species loaded successfully",
        "pokemonName": pokemon_species.species_name,
        "speciesId": pokemon_species.species_Id,
        "level": level,
        "ability": ability,
        "modifier": modifier,
        "baseStats": {
            "hp": pokemon_species.hp,
            "atk": pokemon_species.atk,
            "def": pokemon_species.deff,
            "spAtk": pokemon_species.spatk,
            "spDef": pokemon_species.spdef,
            "speed": pokemon_species.speed,
        },
        "calculatedStats": calculated_stats,
    }


@pokemon_routes.route("/pokemon/create", methods=["POST"])
def create_pokemon():
    pokemon_name = get_name_value()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = get_modifier_value()

    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400

    try:
        pokemon_species = pokeapi_handler.ensure_species(pokemon_name)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    pokemon = Pokemon(
        pokedex_Id=None,
        species_Id=pokemon_species.species_Id,
        level=level,
        ability=ability,
        nature=modifier,
    )
    created_id = pokemon_repo.create_pokemon(pokemon)
    pokemon.pokedex_Id = created_id

    calculated_stats = pokeapi_handler.calculate_stats(pokemon_species, level, modifier)

    return {
        "message": "Pokemon created successfully",
        "pokemon": serialize_pokemon(pokemon, pokemon_species, calculated_stats),
    }, 201


@pokemon_routes.route("/pokemon/<int:pokedex_id>/update", methods=["POST"])
def update_pokemon(pokedex_id):
    existing_pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if existing_pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_name = get_name_value()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = get_modifier_value()

    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400

    try:
        pokemon_species = pokeapi_handler.ensure_species(pokemon_name)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    updated_pokemon = Pokemon(
        pokedex_Id=pokedex_id,
        species_Id=pokemon_species.species_Id,
        level=level,
        ability=ability,
        nature=modifier,
    )
    pokemon_repo.update_pokemon_modifiers(updated_pokemon)

    calculated_stats = pokeapi_handler.calculate_stats(pokemon_species, level, modifier)

    return {
        "message": "Pokemon updated successfully",
        "pokemon": serialize_pokemon(updated_pokemon, pokemon_species, calculated_stats),
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>/delete", methods=["POST"])
def delete_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_repo.delete_pokemon(pokedex_id)
    return {"message": "Pokemon deleted successfully"}
