
from abc import ABC, abstractmethod
class IPokemonSpeciesRepository(ABC):
    # Base species data comes from PokeAPI and is stored locally once needed.
    @abstractmethod
    def create_pokemon_species(self, pokemon_species):
        pass

    @abstractmethod
    def get_pokemon_species_by_id(self, pokemon_species_id):
        pass

    @abstractmethod
    def get_pokemon_species_by_name(self, name):
        pass

    @abstractmethod
    def get_all_pokemon_species(self):
        pass
