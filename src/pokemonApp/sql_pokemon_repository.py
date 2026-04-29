#this will be were we implenent the methods from the interface aka the python code that will retreive the sql 
 
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.pokemon import Pokemon
from src.pokemonApp.i_pokemon_repository import IPokemonRepository
class SqlPokemonRepository(IPokemonRepository):
    def __init__(self , executor):
        self.executor = executor
    

    def create_pokemon(self , pokemon):
        sql = f"""
            INSERT INTO {self.executor.schema}.Pokemon(SpeciesId,Level,Ability, Nature)
            VALUES( %s,%s, %s, %s);
            SELECT CAST(SCOPE_IDENTITY() AS INT) AS PokedexId;
        """

        params = {"SpeciesId" : pokemon.species_Id, "Level" : pokemon.level, "Ability" : pokemon.ability, "Nature" : pokemon.nature}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection,params)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return None

        return rows_returned[0]["PokedexId"]
    

    def get_pokemon_by_Id(self, pokedex_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Pokemon P
            WHERE P.PokedexId = %s
        """

        params = {"PokedexId" : pokedex_Id}


        with self.executor.transaction_scope() as connetion:
            temp = self.executor.execute_query(sql, connetion , params)
            rows_recieved = self.executor.get_all_rows(temp)
        
        if not rows_recieved:
            return None
        
        row = rows_recieved[0]

        return(Pokemon(pokedex_Id= row["PokedexId"] ,species_Id= row["SpeciesId"] , level = row["Level"] , ability= row["Ability"] , nature= row["Nature"] ))
    
    def delete_pokemon(self, pokedex_Id):
        sql = f"""
            DELETE FROM {self.executor.schema}.Pokemon
            WHERE PokedexId = %s
        """

        params = {"PokedexId" : pokedex_Id}


        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection,params)
    
    def update_pokemon_modifiers(self, pokemon):
        sql = f"""
            UPDATE {self.executor.schema}.Pokemon
            SET
                SpeciesId = %s,
                Level = %s,
                Nature = %s,
                Ability = %s
            WHERE PokedexId = %s
        """

        params = {
            "SpeciesId": pokemon.species_Id,
            "Level": pokemon.level,
            "Nature": pokemon.nature,
            "Ability": pokemon.ability,
            "PokedexId": pokemon.pokedex_Id,
        }

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection,params)
