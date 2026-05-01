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

    def get_species_preview_data(self, pokemon_name: str):
        normalized_name = self._normalize_name(pokemon_name)
        pokemon_payload = self._fetch_json(f"{self.BASE_URL}/pokemon/{parse.quote(normalized_name.lower())}")
        pokemon_species = self._get_or_create_species(normalized_name, pokemon_payload)
        ability_options = self._extract_abilities(pokemon_payload)

        return {
            "species": pokemon_species,
            "abilityOptions": ability_options,
        }

    def validate_ability_for_species(self, pokemon_name: str, ability: str):
        preview_data = self.get_species_preview_data(pokemon_name)
        normalized_ability = self._normalize_comparison_value(ability)

        for valid_ability in preview_data["abilityOptions"]:
            if self._normalize_comparison_value(valid_ability) == normalized_ability:
                return {
                    "species": preview_data["species"],
                    "ability": valid_ability,
                    "abilityOptions": preview_data["abilityOptions"],
                }

        raise ValueError(f"{ability} is not a valid ability for {preview_data['species'].species_name}")

    def _get_or_create_species(self, normalized_name: str, pokemon_payload: dict):
        existing_species = self.pokemon_species_repo.get_pokemon_species_by_name(normalized_name)
        if existing_species is not None:
            return existing_species

        species_payload = self._fetch_json(pokemon_payload["species"]["url"])

        type_ids = self._get_or_create_types(pokemon_payload["types"])
        generation_id = self._get_or_create_generation(species_payload["generation"]["name"])
        rarity = self._determine_rarity(pokemon_payload["stats"])

        species = Pokemon_Species(
            species_Id=None,
            generation_Id=generation_id,
            type_one_Id=type_ids[0],
            type_two_Id=type_ids[1] if len(type_ids) > 1 else None,
            species_name=normalized_name,
            rarity=rarity,
            hp=self._stat_value(pokemon_payload["stats"], "hp"),
            atk=self._stat_value(pokemon_payload["stats"], "attack"),
            spatk=self._stat_value(pokemon_payload["stats"], "special-attack"),
            deff=self._stat_value(pokemon_payload["stats"], "defense"),
            spdef=self._stat_value(pokemon_payload["stats"], "special-defense"),
            speed=self._stat_value(pokemon_payload["stats"], "speed"),
        )

        self.pokemon_species_repo.create_pokemon_species(species)
        return self.pokemon_species_repo.get_pokemon_species_by_name(normalized_name)

    def calculate_stats(self, pokemon_species, level: int, modifier: str | None):
        normalized_modifier = (modifier or "").strip().lower()
        increased_stat, decreased_stat = self.NATURE_MODIFIERS.get(normalized_modifier, (None, None))

        calculated_stats = {
            "hp": self._calculate_hp(pokemon_species.hp, level),
            "atk": self._calculate_other_stat(pokemon_species.atk, level),
            "def": self._calculate_other_stat(pokemon_species.deff, level),
            "spAtk": self._calculate_other_stat(pokemon_species.spatk, level),
            "spDef": self._calculate_other_stat(pokemon_species.spdef, level),
            "speed": self._calculate_other_stat(pokemon_species.speed, level),
        }

        if increased_stat:
            increased_key = self._response_key(increased_stat)
            calculated_stats[increased_key] = int(calculated_stats[increased_key] * 1.1)

        if decreased_stat:
            decreased_key = self._response_key(decreased_stat)
            calculated_stats[decreased_key] = int(calculated_stats[decreased_key] * 0.9)

        return calculated_stats

    def _get_or_create_types(self, type_entries):
        ordered_entries = sorted(type_entries, key=lambda entry: entry["slot"])
        type_ids = []

        for entry in ordered_entries:
            type_name = self._display_name(entry["type"]["name"])
            the_type = self.type_repo.get_type_by_name(type_name)

            if the_type is None:
                self.type_repo.create_type(Type(type_Id=None, name=type_name))
                the_type = self.type_repo.get_type_by_name(type_name)

            type_ids.append(the_type.type_Id)

        return type_ids

    def _get_or_create_generation(self, generation_api_name: str):
        generation_name, region_name = self.GENERATION_REGION_MAP.get(
            generation_api_name,
            (self._display_name(generation_api_name), "Unknown"),
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

        return generation.gen_Id

    def _fetch_json(self, url: str):
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
    def _stat_value(stats_payload, stat_name: str):
        for stat in stats_payload:
            if stat["stat"]["name"] == stat_name:
                return stat["base_stat"]

        raise ValueError(f"Missing stat '{stat_name}' in PokeAPI payload")

    @staticmethod
    def _determine_rarity(stats_payload):
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
    def _normalize_name(name: str):
        return name.strip().title()

    @staticmethod
    def _display_name(name: str):
        return name.replace("-", " ").title()

    @classmethod
    def _extract_abilities(cls, pokemon_payload):
        ability_options = []

        for ability_entry in pokemon_payload["abilities"]:
            ability_name = cls._display_name(ability_entry["ability"]["name"])
            if ability_name not in ability_options:
                ability_options.append(ability_name)

        return ability_options

    @staticmethod
    def _normalize_comparison_value(value: str):
        return value.strip().lower().replace("-", " ")

    @staticmethod
    def _calculate_hp(base_stat: int, level: int):
        return int(((2 * base_stat) * level) / 100) + level + 10

    @staticmethod
    def _calculate_other_stat(base_stat: int, level: int):
        return int(((2 * base_stat) * level) / 100) + 5

    @staticmethod
    def _response_key(stat_name: str):
        mapping = {
            "atk": "atk",
            "def": "def",
            "spatk": "spAtk",
            "spdef": "spDef",
            "speed": "speed",
        }
        return mapping[stat_name]
