#this is an interface for the pokemon repository. it will be used to define the methods that will be used to interact with the data layer 
#operaionss: 
from abc import ABC,abstractmethod

class IPokemonRepository(ABC):
    @abstractmethod
    def create_pokemon(self , pokemon):
        pass

    @abstractmethod
    def get_pokemon_by_Id(self,pokedex_Id):
        pass

    @abstractmethod
    def delete_pokemon(self,pokedex_Id):
        pass

    @abstractmethod
    def update_pokemon_modifiers(self,pokemon):
        pass
