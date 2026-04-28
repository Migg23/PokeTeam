from src.pokemonApp.i_generation_repository import IGenerationRepository
from src.pokemonApp.models.generation import Generation

class SqlGenerationRepository(IGenerationRepository):
    def __init__(self , executor):
        self.executor = executor
    

    def get_all_generations(self):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Generation G
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection)
            rows_returned = self.executor.get_all_rows(temp)
        

        if not rows_returned:
            return []
        
        generations = []

        for x in range(len(rows_returned)):
            row = rows_returned[x]
            generations.append(Generation(gen_Id=row["GenId"] , region_Id= row["RegionId"] , gen_Name=row["GenName"]))
        
        return generations
    

    def get_generation_by_id(self, gneration_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Generation G
            WHERE G.GenId = %s
        """

        params = {"GenerationId" : gneration_Id}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection,params)
            rows_received = self.executor.get_all_rows(temp)

        if not rows_received:
            return None
        
        row = rows_received[0]

        return(Generation(gen_Id=row["GenId"] , region_Id= row["RegionId"] , gen_Name=row["GenName"]))
    
    #should be able to return multiple gens for region
    def get_generation_by_region(self, region_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Generation G
            WHERE G.RegionId = %s
        """

        params = {"RegionId" : region_Id}
        

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection,params)
            rows_received = self.executor.get_all_rows(temp)
        
        if not rows_received:
            return None
        
        gens = []
        for x in range(len(rows_received)):
            row = rows_received[x]
            gens.append(Generation(gen_Id=row["GenId"] , region_Id=row["RegionId"], gen_Name=row["GenName"]))

        return(gens)
    


        