from src.pokemonApp.models.pokemon_species import Pokemon_Species
from src.pokemonApp.i_pokemon_species_repository import IPokemonSpeciesRepository

class SqlPokemonSpecies(IPokemonSpeciesRepository):
    def __init__(self , executor):
        self.executor = executor
    


    def create_pokemon_species(self, pokemon_species):
        sql = f"""
            INSERT INTO {self.executor.schema}.PokemonSpecies
                (GenerationId, TypeOneId, TypeTwoId, SpeciesName, Rarity, HP, Atk, SpAtk, Def, SpDef, Speed)
            VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """


        params = {
            "GenerationId": pokemon_species.generation_Id,
            "TypeOneId": pokemon_species.type_one_Id,
            "TypeTwoId": pokemon_species.type_two_Id,
            "SpeciesName": pokemon_species.species_name,
            "Rarity": pokemon_species.rarity,
            "HP": pokemon_species.hp,
            "Atk": pokemon_species.atk,
            "SpAtk": pokemon_species.spatk,
            "Def": pokemon_species.deff,
            "SpDef": pokemon_species.spdef,
            "Speed": pokemon_species.speed,
        }
        
        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)



    def get_pokemon_species_by_id(self, pokemon_species_id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.PokemonSpecies P
            WHERE P.SpeciesId = %s
        """

        params = {"SpeciesId" : pokemon_species_id}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection, params)
            rows_returned = self.executor.get_all_rows(temp)
        
        if not rows_returned:
            return None
        

        row = rows_returned[0]

        return( Pokemon_Species( species_Id= row["SpeciesId"],generation_Id= row["GenerationId"] , type_one_Id=row["TypeOneId"], type_two_Id=row["TypeTwoId"], species_name= row["SpeciesName"],
                                rarity=row["Rarity"], hp = row["HP"] , atk= row["Atk"] , spatk = row["SpAtk"] , deff = row["Def"], spdef= row["SpDef"] , speed= row["Speed"]))
    

    def get_pokemon_species_by_name(self, name):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.PokemonSpecies P
            WHERE P.SpeciesName = %s
        """

        params = {"SpeciesName" : name}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection, params)
            rows_returned = self.executor.get_all_rows(temp)
        
        if not rows_returned:
            return None
        
        row = rows_returned[0]

        return( Pokemon_Species( species_Id= row["SpeciesId"],generation_Id= row["GenerationId"] , type_one_Id=row["TypeOneId"], type_two_Id=row["TypeTwoId"], species_name= row["SpeciesName"],
                                rarity=row["Rarity"], hp = row["HP"] , atk= row["Atk"] , spatk = row["SpAtk"] , deff = row["Def"], spdef= row["SpDef"] , speed= row["Speed"]))
    

        
