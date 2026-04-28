from src.pokemonApp.i_type_repository import ITypeRepository
from src.pokemonApp.models.type import Type


class SqlTypeRepository(ITypeRepository):
    def __init__(self , executor):
        self.executor = executor
    

    def get_all_types(self):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Type T
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection)
            rows_received = self.executor.get_all_rows(temp)
        

        
        if not rows_received:
            return []
        
        the_types = []

        for x in range(len(rows_received)):
            row = rows_received[x]
            the_types.append(Type(type_Id=row["TypeId"] , name= row["Name"]))


        return the_types
    

    def get_type_by_Id(self, type_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Type T
            WHERE T.TypeId = %s
        """

        params = {"TypeId" : type_Id}


        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql,connection,params)
            rows_returned = self.executor.get_all_rows(temp)
        

        if not rows_returned:
            return None

        row = rows_returned[0]

        return(Type(type_Id=row["TypeId"] , name= row["Name"]))
