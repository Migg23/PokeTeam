from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon_species import Pokemon_Species
from src.pokemonApp.sql_pokemon_species_repository import SqlPokemonSpecies


pokemon_species_routes = Blueprint("pokemon_species_routes", __name__)

executor = SqlCommandExecutor()
pokemon_species_repo = SqlPokemonSpecies(executor)


def serialize_pokemon_species(pokemon_species: Pokemon_Species) -> dict:
    return {
        "speciesId": pokemon_species.species_Id,
        "generationId": pokemon_species.generation_Id,
        "typeOneId": pokemon_species.type_one_Id,
        "typeTwoId": pokemon_species.type_two_Id,
        "speciesName": pokemon_species.species_name,
        "rarity": pokemon_species.rarity,
        "hp": pokemon_species.hp,
        "atk": pokemon_species.atk,
        "spAtk": pokemon_species.spatk,
        "def": pokemon_species.deff,
        "spDef": pokemon_species.spdef,
        "speed": pokemon_species.speed,
    }


@pokemon_species_routes.route("/pokemon-species/<int:species_id>", methods=["GET"])
def get_pokemon_species_by_id(species_id):
    pokemon_species = pokemon_species_repo.get_pokemon_species_by_id(species_id)

    if pokemon_species is None:
        return {"message": "Pokemon species not found"}, 404

    return serialize_pokemon_species(pokemon_species)


@pokemon_species_routes.route("/pokemon-species/by-name", methods=["GET"])
def get_pokemon_species_by_name():
    name = request.args.get("name")

    if not name:
        return {"message": "name is required"}, 400

    pokemon_species = pokemon_species_repo.get_pokemon_species_by_name(name)

    if pokemon_species is None:
        return {"message": "Pokemon species not found"}, 404

    return serialize_pokemon_species(pokemon_species)


@pokemon_species_routes.route("/pokemon-species/create", methods=["POST"])
def create_pokemon_species():
    generation_id = request.form.get("generationId", type=int)
    type_one_id = request.form.get("typeOneId", type=int)
    type_two_id = request.form.get("typeTwoId", type=int)
    species_name = request.form.get("speciesName")
    rarity = request.form.get("rarity")
    hp = request.form.get("hp", type=int)
    atk = request.form.get("atk", type=int)
    sp_atk = request.form.get("spAtk", type=int)
    defense = request.form.get("def", type=int)
    sp_def = request.form.get("spDef", type=int)
    speed = request.form.get("speed", type=int)

    required_ints = [generation_id, type_one_id, hp, atk, sp_atk, defense, sp_def, speed]
    if any(value is None for value in required_ints) or not species_name or not rarity:
        return {"message": "Missing required pokemon species information"}, 400

    pokemon_species = Pokemon_Species(
        species_Id=None,
        generation_Id=generation_id,
        type_one_Id=type_one_id,
        type_two_Id=type_two_id,
        species_name=species_name,
        rarity=rarity,
        hp=hp,
        atk=atk,
        spatk=sp_atk,
        deff=defense,
        spdef=sp_def,
        speed=speed,
    )
    pokemon_species_repo.create_pokemon_species(pokemon_species)

    return {
        "message": "Pokemon species created successfully",
        "pokemonSpecies": serialize_pokemon_species(pokemon_species),
    }, 201
