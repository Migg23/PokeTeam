#this will be were we implenent the methods from the interface aka the python code that will retreive the sql 
 
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.i_pokemon_repository import IPokemonRepository
class SqlPokemonRepository(IPokemonRepository):
    def __init__(self):
        self.executor = SqlCommandExecutor()