from src.pokemonApp.i_region_repository import IRegionRepository
from src.pokemonApp.models.region import Region

class SqlRegionRepository(IRegionRepository):
    def __init__(self , executor):
        self.executor = executor

    def get_all_regions(self):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Region R
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection)
            rows_returned = self.executor.get_all_rows(temp)
        
        if not rows_returned:
            return []
        

        all_regions = []
        for x in range(len(rows_returned)):
            row = rows_returned[x]
            all_regions.append(Region(region_Id=row["RegionId"] , region_name=row["RegionName"]))
        

        return all_regions
    


    def get_region_by_regionId(self, region_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Region R
            WHERE R.RegionId = %s
        """

        params = {"RegionId" : region_Id}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection , params)
            rows_returned = self.executor.get_all_rows(temp)
        
        if not rows_returned:
            return None
        
        row = rows_returned[0]

        return(Region(region_Id=row["RegionId"] , region_name=row["RegionName"]))

            
