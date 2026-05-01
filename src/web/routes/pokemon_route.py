from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.sql_generation_repository import SqlGenerationRepository
from src.pokemonApp.sql_pokemon_repository import SqlPokemonRepository
from src.pokemonApp.sql_pokemon_species_repository import SqlPokemonSpecies
from src.pokemonApp.sql_region_repository import SqlRegionRepository
from src.pokemonApp.sql_type_repository import SqlTypeRepository
from src.web.routes.pokeapi_handler import PokeApiHandler


pokemon_routes = Blueprint("pokemon_routes", __name__)

executor = SqlCommandExecutor()
pokemon_repo = SqlPokemonRepository(executor)
pokemon_species_repo = SqlPokemonSpecies(executor)
type_repo = SqlTypeRepository(executor)
region_repo = SqlRegionRepository(executor)
generation_repo = SqlGenerationRepository(executor)
pokeapi_handler = PokeApiHandler(
    pokemon_species_repo,
    type_repo,
    region_repo,
    generation_repo,
)


def get_rarity_label(rarity_value):
    rarity_names = {
        1: "Common",
        2: "Uncommon",
        3: "Rare",
        4: "Epic",
        5: "Legendary",
    }
    return rarity_names.get(rarity_value, f"Tier {rarity_value}")


def serialize_species(pokemon_species):
    type_one = type_repo.get_type_by_Id(pokemon_species.type_one_Id)
    type_two = None
    if pokemon_species.type_two_Id:
        type_two = type_repo.get_type_by_Id(pokemon_species.type_two_Id)

    generation = generation_repo.get_generation_by_id(pokemon_species.generation_Id)
    region = None
    if generation is not None:
        region = region_repo.get_region_by_regionId(generation.region_Id)

    return {
        "pokemonName": pokemon_species.species_name,
        "speciesId": pokemon_species.species_Id,
        "typeOne": type_one.name if type_one else None,
        "typeTwo": type_two.name if type_two else None,
        "genId": generation.gen_Id if generation else None,
        "genName": generation.gen_Name if generation else None,
        "regionId": region.region_Id if region else None,
        "regionName": region.region_Name if region else None,
        "rarity": pokemon_species.rarity,
        "rarityLabel": get_rarity_label(pokemon_species.rarity),
        "baseStats": {
            "hp": pokemon_species.hp,
            "atk": pokemon_species.atk,
            "def": pokemon_species.deff,
            "spAtk": pokemon_species.spatk,
            "spDef": pokemon_species.spdef,
            "speed": pokemon_species.speed,
        },
    }


def serialize_pokemon(pokemon, pokemon_species):
    return {
        "pokedexId": pokemon.pokedex_Id,
        "speciesId": pokemon.species_Id,
        "level": pokemon.level,
        "ability": pokemon.ability,
        "modifier": pokemon.nature,
        "calculatedStats": pokeapi_handler.calculate_stats(
            pokemon_species,
            pokemon.level,
            pokemon.nature,
        ),
        **serialize_species(pokemon_species),
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>", methods=["GET"])
def get_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)
    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_species = pokemon_species_repo.get_pokemon_species_by_id(pokemon.species_Id)
    if pokemon_species is None:
        return {"message": "Pokemon species not found for this pokemon"}, 404

    return serialize_pokemon(pokemon, pokemon_species)


@pokemon_routes.route("/pokemon-species", methods=["GET"])
def get_pokemon_species():
    search_term = (request.args.get("search") or "").strip().lower()
    all_species = pokemon_species_repo.get_all_pokemon_species()

    if search_term:
        all_species = [
            pokemon_species
            for pokemon_species in all_species
            if search_term in pokemon_species.species_name.lower()
        ]

    return [serialize_species(pokemon_species) for pokemon_species in all_species]


@pokemon_routes.route("/pokemon/search", methods=["POST"])
def search_pokemon():
    pokemon_name = request.form.get("pokemonName") or request.form.get("name")
    level = request.form.get("level", type=int)
    modifier = request.form.get("modifier") or request.form.get("nature")
    selected_ability = request.form.get("ability")

    if not pokemon_name or level is None or not modifier:
        return {"message": "pokemonName, level, and modifier are required"}, 400

    try:
        preview = pokeapi_handler.load_species_preview(pokemon_name)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    return {
        "message": "Pokemon species loaded successfully",
        "pokemon": {
            "level": level,
            "ability": selected_ability,
            "modifier": modifier,
            "calculatedStats": pokeapi_handler.calculate_stats(
                preview["species"],
                level,
                modifier,
            ),
            "abilityOptions": preview["abilityOptions"],
            **serialize_species(preview["species"]),
        },
    }


@pokemon_routes.route("/pokemon/create", methods=["POST"])
def create_pokemon():
    pokemon_name = request.form.get("pokemonName") or request.form.get("name")
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = request.form.get("modifier") or request.form.get("nature")

    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400

    try:
        preview = pokeapi_handler.load_species_preview(pokemon_name)
        final_ability = pokeapi_handler.pick_valid_ability(preview["abilityOptions"], ability)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    pokemon = Pokemon(
        pokedex_Id=None,
        species_Id=preview["species"].species_Id,
        level=level,
        ability=final_ability,
        nature=modifier,
    )
    pokemon.pokedex_Id = pokemon_repo.create_pokemon(pokemon)

    return {
        "message": "Pokemon created successfully",
        "pokemon": serialize_pokemon(pokemon, preview["species"]),
        "abilityOptions": preview["abilityOptions"],
    }, 201


@pokemon_routes.route("/pokemon/<int:pokedex_id>/update", methods=["POST"])
def update_pokemon(pokedex_id):
    existing_pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)
    if existing_pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_name = request.form.get("pokemonName") or request.form.get("name")
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = request.form.get("modifier") or request.form.get("nature")

    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400

    try:
        preview = pokeapi_handler.load_species_preview(pokemon_name)
        final_ability = pokeapi_handler.pick_valid_ability(preview["abilityOptions"], ability)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    updated_pokemon = Pokemon(
        pokedex_Id=pokedex_id,
        species_Id=preview["species"].species_Id,
        level=level,
        ability=final_ability,
        nature=modifier,
    )
    pokemon_repo.update_pokemon_modifiers(updated_pokemon)

    return {
        "message": "Pokemon updated successfully",
        "pokemon": serialize_pokemon(updated_pokemon, preview["species"]),
        "abilityOptions": preview["abilityOptions"],
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>/delete", methods=["POST"])
def delete_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)
    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_repo.delete_pokemon(pokedex_id)
    return {"message": "Pokemon deleted successfully"}
