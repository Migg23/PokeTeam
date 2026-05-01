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


def serialize_pokemon(pokemon: Pokemon, pokemon_species, calculated_stats: dict) -> dict:
    return {
        "pokedexId": pokemon.pokedex_Id,
        "speciesId": pokemon.species_Id,
        **serialize_species_summary(pokemon_species),
        "level": pokemon.level,
        "ability": pokemon.ability,
        "modifier": pokemon.nature,
        "calculatedStats": calculated_stats,
    }


def get_modifier_value():
    return request.form.get("modifier") or request.form.get("nature")


def get_name_value():
    return request.form.get("pokemonName") or request.form.get("name")


def build_species_response(pokemon_species, level, ability, modifier):
    calculated_stats = pokeapi_handler.calculate_stats(pokemon_species, level, modifier)
    return {
        **serialize_species_summary(pokemon_species),
        "level": level,
        "ability": ability,
        "modifier": modifier,
        "calculatedStats": calculated_stats,
    }


def get_rarity_label(rarity_value):
    rarity_map = {
        1: "Common",
        2: "Uncommon",
        3: "Rare",
        4: "Epic",
        5: "Legendary",
    }
    return rarity_map.get(rarity_value, f"Tier {rarity_value}")


def serialize_species_summary(pokemon_species) -> dict:
    type_one = type_repo.get_type_by_Id(pokemon_species.type_one_Id)
    type_two = type_repo.get_type_by_Id(pokemon_species.type_two_Id) if pokemon_species.type_two_Id else None
    generation = generation_repo.get_generation_by_id(pokemon_species.generation_Id)
    region = (
        region_repo.get_region_by_regionId(generation.region_Id)
        if generation is not None else None
    )

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


def get_request_pokemon_fields():
    pokemon_name = get_name_value()
    level = request.form.get("level", type=int)
    ability = request.form.get("ability")
    modifier = get_modifier_value()
    return pokemon_name, level, ability, modifier


def validate_search_fields(pokemon_name, level, modifier):
    if not pokemon_name or level is None or not modifier:
        return {"message": "pokemonName, level, and modifier are required"}, 400

    return None


def validate_create_or_update_fields(pokemon_name, level, ability, modifier):
    if not pokemon_name or level is None or not ability or not modifier:
        return {"message": "pokemonName, level, modifier, and ability are required"}, 400
    return None


@pokemon_routes.route("/pokemon/<int:pokedex_id>", methods=["GET"])
def get_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_species = pokemon_species_repo.get_pokemon_species_by_id(pokemon.species_Id)
    if pokemon_species is None:
        return {"message": "Pokemon species not found for this pokemon"}, 404

    calculated_stats = pokeapi_handler.calculate_stats(
        pokemon_species,
        pokemon.level,
        pokemon.nature,
    )
    return serialize_pokemon(pokemon, pokemon_species, calculated_stats)


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

    return [serialize_species_summary(pokemon_species) for pokemon_species in all_species]


@pokemon_routes.route("/pokemon/search", methods=["POST"])
def search_pokemon():
    pokemon_name, level, ability, modifier = get_request_pokemon_fields()
    validation_error = validate_search_fields(pokemon_name, level, modifier)
    if validation_error:
        return validation_error

    try:
        preview_data = pokeapi_handler.get_species_preview_data(pokemon_name)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    pokemon_species = preview_data["species"]
    selected_ability = ability if ability else None

    return {
        "message": "Pokemon species loaded successfully",
        "pokemon": {
            **build_species_response(pokemon_species, level, selected_ability, modifier),
            "abilityOptions": preview_data["abilityOptions"],
        },
    }


@pokemon_routes.route("/pokemon/create", methods=["POST"])
def create_pokemon():
    pokemon_name, level, ability, modifier = get_request_pokemon_fields()
    validation_error = validate_create_or_update_fields(pokemon_name, level, ability, modifier)
    if validation_error:
        return validation_error

    try:
        validated_data = pokeapi_handler.validate_ability_for_species(pokemon_name, ability)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    pokemon_species = validated_data["species"]
    validated_ability = validated_data["ability"]

    pokemon = Pokemon(
        pokedex_Id=None,
        species_Id=pokemon_species.species_Id,
        level=level,
        ability=validated_ability,
        nature=modifier,
    )
    created_id = pokemon_repo.create_pokemon(pokemon)
    pokemon.pokedex_Id = created_id

    return {
        "message": "Pokemon created successfully",
        "pokemon": serialize_pokemon(
            pokemon,
            pokemon_species,
            pokeapi_handler.calculate_stats(pokemon_species, level, modifier),
        ),
        "abilityOptions": validated_data["abilityOptions"],
    }, 201


@pokemon_routes.route("/pokemon/<int:pokedex_id>/update", methods=["POST"])
def update_pokemon(pokedex_id):
    existing_pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if existing_pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_name, level, ability, modifier = get_request_pokemon_fields()
    validation_error = validate_create_or_update_fields(pokemon_name, level, ability, modifier)
    if validation_error:
        return validation_error

    try:
        validated_data = pokeapi_handler.validate_ability_for_species(pokemon_name, ability)
    except ValueError as exc:
        return {"message": str(exc)}, 400

    pokemon_species = validated_data["species"]
    validated_ability = validated_data["ability"]

    updated_pokemon = Pokemon(
        pokedex_Id=pokedex_id,
        species_Id=pokemon_species.species_Id,
        level=level,
        ability=validated_ability,
        nature=modifier,
    )
    pokemon_repo.update_pokemon_modifiers(updated_pokemon)

    return {
        "message": "Pokemon updated successfully",
        "pokemon": serialize_pokemon(
            updated_pokemon,
            pokemon_species,
            pokeapi_handler.calculate_stats(pokemon_species, level, modifier),
        ),
        "abilityOptions": validated_data["abilityOptions"],
    }


@pokemon_routes.route("/pokemon/<int:pokedex_id>/delete", methods=["POST"])
def delete_pokemon(pokedex_id):
    pokemon = pokemon_repo.get_pokemon_by_Id(pokedex_id)

    if pokemon is None:
        return {"message": "Pokemon not found"}, 404

    pokemon_repo.delete_pokemon(pokedex_id)
    return {"message": "Pokemon deleted successfully"}
