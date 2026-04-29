from flask import Blueprint, request
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.sql_pokemon_repository import SqlPokemonRepository
from src.pokemonApp.sql_pokemon_species_repository import SqlPokemonSpeciesRepository
from src.web.routes.pokeapi_handler import PokeApiHandler

pokemon_routes = Blueprint("pokemon_routes", __name__)

executor = SqlCommandExecutor()
pokemon_repo = SqlPokemonRepository(executor)
species_repo = SqlPokemonSpeciesRepository(executor)
pokeapi = PokeApiHandler(executor, species_repo)

def serialize_pokemon(p: Pokemon, species, stats):
    return {
        "pokemonId": p.PokemonId,
        "speciesId": p.SpeciesId,
        "pokemonName": species.SpeciesName,
        "level": p.Level,
        "ability": p.Ability,
        "nature": p.Nature,
        "baseStats": {
            "hp": species.Hp,
            "atk": species.Atk,
            "def": species.Def,
            "spAtk": species.SpAtk,
            "spDef": species.SpDef,
            "speed": species.Speed,
        },
        "calculatedStats": stats,
    }

def get_modifier():
    return request.form.get("modifier") or request.form.get("nature")

def get_name():
    return request.form.get("pokemonName") or request.form.get("name")

@pokemon_routes.route("/pokemon/<int:pokemon_id>", methods=["GET"])
def get_pokemon(pokemon_id):
    p = pokemon_repo.get_pokemon_by_id(pokemon_id)
    if p is None:
        return {"message": "Pokemon not found"}, 404

    species = species_repo.get_species_by_id(p.SpeciesId)
    stats = pokeapi.calculate_stats(species, p.Level, p.Nature)

    return serialize_pokemon(p, species, stats)

@pokemon_routes.route("/pokemon/search", methods=["POST"])
def search_pokemon():
    name = get_name()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    nature = get_modifier()

    if not name or level is None or not ability or not nature:
        return {"message": "pokemonName, level, ability, modifier required"}, 400

    species = pokeapi.ensure_species(name)
    stats = pokeapi.calculate_stats(species, level, nature)

    return {
        "message": "Species loaded",
        "speciesId": species.SpeciesId,
        "pokemonName": species.SpeciesName,
        "level": level,
        "ability": ability,
        "nature": nature,
        "baseStats": {
            "hp": species.Hp,
            "atk": species.Atk,
            "def": species.Def,
            "spAtk": species.SpAtk,
            "spDef": species.SpDef,
            "speed": species.Speed,
        },
        "calculatedStats": stats,
    }

@pokemon_routes.route("/pokemon/create", methods=["POST"])
def create_pokemon():
    name = get_name()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    nature = get_modifier()

    if not name or level is None or not ability or not nature:
        return {"message": "pokemonName, level, ability, modifier required"}, 400

    species = pokeapi.ensure_species(name)

    p = Pokemon(None, species.SpeciesId, level, ability, nature)
    new_id = pokemon_repo.create_pokemon(p)
    p.PokemonId = new_id

    stats = pokeapi.calculate_stats(species, level, nature)

    return {"message": "Pokemon created", "pokemon": serialize_pokemon(p, species, stats)}, 201

@pokemon_routes.route("/pokemon/<int:pokemon_id>/update", methods=["POST"])
def update_pokemon(pokemon_id):
    name = get_name()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    nature = get_modifier()

    if not name or level is None or not ability or not nature:
        return {"message": "pokemonName, level, ability, modifier required"}, 400

    species = pokeapi.ensure_species(name)

    p = Pokemon(pokemon_id, species.SpeciesId, level, ability, nature)
    pokemon_repo.update_pokemon(p)

    stats = pokeapi.calculate_stats(species, level, nature)

    return {"message": "Pokemon updated", "pokemon": serialize_pokemon(p, species, stats)}

@pokemon_routes.route("/pokemon/<int:pokemon_id>/delete", methods=["POST"])
def delete_pokemon(pokemon_id):
    pokemon_repo.delete_pokemon(pokemon_id)
    return {"message": "Pokemon deleted"}
