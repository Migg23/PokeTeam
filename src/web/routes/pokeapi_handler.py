import json
from urllib import error, parse, request

from src.pokemonApp.models.generation import Generation
from src.pokemonApp.models.pokemon_species import Pokemon_Species
from src.pokemonApp.models.region import Region
from src.pokemonApp.models.type import Type


class PokeApiHandler:
    BASE_URL = "https://pokeapi.co/api/v2"

    GENERATION_REGION_MAP = {
        "generation-i": ("Generation I", "Kanto"),
        "generation-ii": ("Generation II", "Johto"),
        "generation-iii": ("Generation III", "Hoenn"),
        "generation-iv": ("Generation IV", "Sinnoh"),
        "generation-v": ("Generation V", "Unova"),
        "generation-vi": ("Generation VI", "Kalos"),
        "generation-vii": ("Generation VII", "Alola"),
        "generation-viii": ("Generation VIII", "Galar"),
        "generation-ix": ("Generation IX", "Paldea"),
    }

    NATURE_MODIFIERS = {
        "lonely": ("atk", "def"),
        "brave": ("atk", "speed"),
        "adamant": ("atk", "spatk"),
        "naughty": ("atk", "spdef"),
        "bold": ("def", "atk"),
        "relaxed": ("def", "speed"),
        "impish": ("def", "spatk"),
        "lax": ("def", "spdef"),
        "timid": ("speed", "atk"),
        "hasty": ("speed", "def"),
        "jolly": ("speed", "spatk"),
        "naive": ("speed", "spdef"),
        "modest": ("spatk", "atk"),
        "mild": ("spatk", "def"),
        "quiet": ("spatk", "speed"),
        "rash": ("spatk", "spdef"),
        "calm": ("spdef", "atk"),
        "gentle": ("spdef", "def"),
        "sassy": ("spdef", "speed"),
        "careful": ("spdef", "spatk"),
    }

    def __init__(self, pokemon_species_repo, type_repo, region_repo, generation_repo):
        self.pokemon_species_repo = pokemon_species_repo
        self.type_repo = type_repo
        self.region_repo = region_repo
        self.generation_repo = generation_repo

    def load_species_preview(self, pokemon_name):
        clean_name = self.clean_name(pokemon_name)
        pokemon_data = self.fetch_json(
            f"{self.BASE_URL}/pokemon/{parse.quote(clean_name.lower())}"
        )

        pokemon_species = self.pokemon_species_repo.get_pokemon_species_by_name(clean_name)
        if pokemon_species is None:
            pokemon_species = self.create_species_from_api(clean_name, pokemon_data)

        ability_options = []
        for ability_entry in pokemon_data["abilities"]:
            ability_name = self.pretty_name(ability_entry["ability"]["name"])
            if ability_name not in ability_options:
                ability_options.append(ability_name)

        return {
            "species": pokemon_species,
            "abilityOptions": ability_options,
        }

    def create_species_from_api(self, species_name, pokemon_data):
        species_data = self.fetch_json(pokemon_data["species"]["url"])

        type_ids = []
        for entry in sorted(pokemon_data["types"], key=lambda item: item["slot"]):
            type_name = self.pretty_name(entry["type"]["name"])
            pokemon_type = self.type_repo.get_type_by_name(type_name)

            if pokemon_type is None:
                self.type_repo.create_type(Type(type_Id=None, name=type_name))
                pokemon_type = self.type_repo.get_type_by_name(type_name)

            type_ids.append(pokemon_type.type_Id)

        generation_name, region_name = self.GENERATION_REGION_MAP.get(
            species_data["generation"]["name"],
            (self.pretty_name(species_data["generation"]["name"]), "Unknown"),
        )

        region = self.region_repo.get_region_by_name(region_name)
        if region is None:
            self.region_repo.create_region(Region(region_Id=None, region_name=region_name))
            region = self.region_repo.get_region_by_name(region_name)

        generation = self.generation_repo.get_generation_by_name(generation_name)
        if generation is None:
            self.generation_repo.create_generation(
                Generation(gen_Id=None, region_Id=region.region_Id, gen_Name=generation_name)
            )
            generation = self.generation_repo.get_generation_by_name(generation_name)

        species = Pokemon_Species(
            species_Id=None,
            generation_Id=generation.gen_Id,
            type_one_Id=type_ids[0],
            type_two_Id=type_ids[1] if len(type_ids) > 1 else None,
            species_name=species_name,
            rarity=self.calculate_rarity(pokemon_data["stats"]),
            hp=self.get_stat(pokemon_data["stats"], "hp"),
            atk=self.get_stat(pokemon_data["stats"], "attack"),
            spatk=self.get_stat(pokemon_data["stats"], "special-attack"),
            deff=self.get_stat(pokemon_data["stats"], "defense"),
            spdef=self.get_stat(pokemon_data["stats"], "special-defense"),
            speed=self.get_stat(pokemon_data["stats"], "speed"),
        )

        self.pokemon_species_repo.create_pokemon_species(species)
        return self.pokemon_species_repo.get_pokemon_species_by_name(species_name)

    def pick_valid_ability(self, ability_options, chosen_ability):
        clean_choice = self.clean_compare_value(chosen_ability)

        for ability in ability_options:
            if self.clean_compare_value(ability) == clean_choice:
                return ability

        raise ValueError(f"{chosen_ability} is not a valid ability for this Pokemon")

    def calculate_stats(self, pokemon_species, level, modifier):
        boost_stat, lower_stat = self.NATURE_MODIFIERS.get(
            (modifier or "").strip().lower(),
            (None, None),
        )

        calculated = {
            "hp": int(((2 * pokemon_species.hp) * level) / 100) + level + 10,
            "atk": int(((2 * pokemon_species.atk) * level) / 100) + 5,
            "def": int(((2 * pokemon_species.deff) * level) / 100) + 5,
            "spAtk": int(((2 * pokemon_species.spatk) * level) / 100) + 5,
            "spDef": int(((2 * pokemon_species.spdef) * level) / 100) + 5,
            "speed": int(((2 * pokemon_species.speed) * level) / 100) + 5,
        }

        if boost_stat:
            key_name = self.stat_key(boost_stat)
            calculated[key_name] = int(calculated[key_name] * 1.1)

        if lower_stat:
            key_name = self.stat_key(lower_stat)
            calculated[key_name] = int(calculated[key_name] * 0.9)

        return calculated
#methods from chat taht helps run smoothr
    def fetch_json(self, url):
        try:
            api_request = request.Request(
                url,
                headers={
                    "User-Agent": "PokeTeamApp/1.0",
                    "Accept": "application/json",
                },
            )
            with request.urlopen(api_request) as response:
                return json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            raise ValueError(f"PokeAPI request failed for {url}: {exc.code}") from exc
        except error.URLError as exc:
            reason = getattr(exc, "reason", exc)
            raise ValueError(f"Unable to reach PokeAPI for {url}: {reason}") from exc

    @staticmethod
    def get_stat(stats_payload, stat_name):
        for stat in stats_payload:
            if stat["stat"]["name"] == stat_name:
                return stat["base_stat"]
        raise ValueError(f"Missing stat '{stat_name}' in PokeAPI payload")

    @staticmethod
    def calculate_rarity(stats_payload):
        total_stats = sum(stat["base_stat"] for stat in stats_payload)
        if total_stats >= 600:
            return 5
        if total_stats >= 500:
            return 4
        if total_stats >= 400:
            return 3
        if total_stats >= 300:
            return 2
        return 1

    @staticmethod
    def clean_name(name):
        return name.strip().title()

    @staticmethod
    def pretty_name(name):
        return name.replace("-", " ").title()

    @staticmethod
    def clean_compare_value(value):
        return value.strip().lower().replace("-", " ")

    @staticmethod
    def stat_key(stat_name):
        return {
            "atk": "atk",
            "def": "def",
            "spatk": "spAtk",
            "spdef": "spDef",
            "speed": "speed",
        }[stat_name]
