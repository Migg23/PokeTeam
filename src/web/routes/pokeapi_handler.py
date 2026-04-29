import json
from urllib import error, parse, request

from src.pokemonApp.models.pokemon_species import Pokemon_Species


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

    def __init__(self, executor, pokemon_species_repo):
        self.executor = executor
        self.pokemon_species_repo = pokemon_species_repo

    def ensure_species(self, pokemon_name: str):
        normalized_name = self._normalize_name(pokemon_name)
        existing_species = self.pokemon_species_repo.get_pokemon_species_by_name(normalized_name)
        if existing_species is not None:
            return existing_species

        pokemon_payload = self._fetch_json(f"{self.BASE_URL}/pokemon/{parse.quote(normalized_name)}")
        species_payload = self._fetch_json(pokemon_payload["species"]["url"])

        type_ids = self._ensure_types(pokemon_payload["types"])
        generation_id = self._ensure_generation(species_payload["generation"]["name"])
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

        stat_map = {
            "hp": pokemon_species.hp,
            "atk": pokemon_species.atk,
            "def": pokemon_species.deff,
            "spatk": pokemon_species.spatk,
            "spdef": pokemon_species.spdef,
            "speed": pokemon_species.speed,
        }

        calculated_stats = {
            "hp": self._calculate_hp(stat_map["hp"], level),
            "atk": self._calculate_other_stat(stat_map["atk"], level),
            "def": self._calculate_other_stat(stat_map["def"], level),
            "spAtk": self._calculate_other_stat(stat_map["spatk"], level),
            "spDef": self._calculate_other_stat(stat_map["spdef"], level),
            "speed": self._calculate_other_stat(stat_map["speed"], level),
        }

        if increased_stat:
            calculated_stats[self._response_key(increased_stat)] = int(calculated_stats[self._response_key(increased_stat)] * 1.1)
        if decreased_stat:
            calculated_stats[self._response_key(decreased_stat)] = int(calculated_stats[self._response_key(decreased_stat)] * 0.9)

        return calculated_stats

    def _fetch_json(self, url: str):
        try:
            with request.urlopen(url) as response:
                return json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            raise ValueError(f"PokeAPI request failed for {url}: {exc.code}") from exc
        except error.URLError as exc:
            raise ValueError(f"Unable to reach PokeAPI for {url}") from exc

    def _ensure_types(self, type_entries):
        ordered_entries = sorted(type_entries, key=lambda entry: entry["slot"])
        type_ids = []

        for entry in ordered_entries:
            type_name = self._display_name(entry["type"]["name"])
            type_ids.append(self._ensure_type(type_name))

        return type_ids

    def _ensure_type(self, type_name: str):
        row = self._fetch_one(
            f"SELECT TypeId FROM {self.executor.schema}.[Type] WHERE LOWER(Name) = LOWER(%s)",
            {"Name": type_name},
        )
        if row:
            return row["TypeId"]

        self._execute_non_query(
            f"INSERT INTO {self.executor.schema}.[Type] (Name) VALUES (%s)",
            {"Name": type_name},
        )
        row = self._fetch_one(
            f"SELECT TypeId FROM {self.executor.schema}.[Type] WHERE LOWER(Name) = LOWER(%s)",
            {"Name": type_name},
        )
        return row["TypeId"]

    def _ensure_generation(self, generation_api_name: str):
        generation_name, region_name = self.GENERATION_REGION_MAP.get(
            generation_api_name,
            (self._display_name(generation_api_name), "Unknown"),
        )
        region_id = self._ensure_region(region_name)

        row = self._fetch_one(
            f"SELECT GenId FROM {self.executor.schema}.Generation WHERE LOWER(GenName) = LOWER(%s)",
            {"GenName": generation_name},
        )
        if row:
            return row["GenId"]

        self._execute_non_query(
            f"INSERT INTO {self.executor.schema}.Generation (RegionId, GenName) VALUES (%s, %s)",
            {"RegionId": region_id, "GenName": generation_name},
        )
        row = self._fetch_one(
            f"SELECT GenId FROM {self.executor.schema}.Generation WHERE LOWER(GenName) = LOWER(%s)",
            {"GenName": generation_name},
        )
        return row["GenId"]

    def _ensure_region(self, region_name: str):
        row = self._fetch_one(
            f"SELECT RegionId FROM {self.executor.schema}.Region WHERE LOWER(RegionName) = LOWER(%s)",
            {"RegionName": region_name},
        )
        if row:
            return row["RegionId"]

        self._execute_non_query(
            f"INSERT INTO {self.executor.schema}.Region (RegionName) VALUES (%s)",
            {"RegionName": region_name},
        )
        row = self._fetch_one(
            f"SELECT RegionId FROM {self.executor.schema}.Region WHERE LOWER(RegionName) = LOWER(%s)",
            {"RegionName": region_name},
        )
        return row["RegionId"]

    def _fetch_one(self, sql: str, params: dict):
        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection, params)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return None

        return rows_returned[0]

    def _execute_non_query(self, sql: str, params: dict):
        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)

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
