from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.user import User
from src.pokemonApp.i_user_repository import IUserRepository

"""
Context
This class inherits from its User interface and we implement those methods
This injects sql code into our sqlcommandexecutor class where it will be sent to the database
based on the method we can either just execute or execute AND recieve rows of information

"""
class SqlUserRepository(IUserRepository):

    def __init__(self , executor):
        self.executor = executor    

    
    def create_user(self, user):
        sql = f"""
            INSERT INTO {self.executor.schema}.[User]
                (UserName, Wins, Losses)
            VALUES
                (%s, %s, %s) 
        """ # the %s represents where the variables we want to insert aka what the query needs to run the way we want
        
        #here are hte params that are inserted into %s so that the quert can run
        params = {
            "UserName": user.user_name,
            "Wins": user.wins,
            "Losses": user.losses
        }

        #this represents the connection the executor esablishes and we execute the query in SqlCommandExecutor
        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)

    def get_user_by_Id(self, user_Id):
        sql = f"""
            SELECT UserId,UserName,Wins,Losses
            FROM {self.executor.schema}.[User]
            WHERE UserId = %s
        """

        

        with self.executor.transaction_scope() as connection:
            params = {
                "UserId" : user_Id
            }
            temp = self.executor.execute_query(sql,connection,params)
            rows_recieved = self.executor.get_all_rows(temp)

            if not rows_recieved:
                return None
            
        row = rows_recieved[0]
        return User(userId=row["UserId"], user_name = row["UserName"] , wins = row["Wins"] , losses = row["Losses"])
    

    def get_all_users(self):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.[User]
        """


        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql , connection)
            rows_recieved = self.executor.get_all_rows(temp)

        if not rows_recieved :
            return []

        da_users  = []
        for x in range(len(rows_recieved)):
            row = rows_recieved[x]
            da_users.append(User(userId = row["UserId"],user_name = row["UserName"] , wins = row['Wins'], losses = row["Losses"] ))
        
        return da_users
    

    def update_user(self, user_Id, wins, losses):
        
        sql = f"""
            UPDATE {self.executor.schema}.[User]
            SET
                Wins = %s,
                Losses = %s
            FROM {self.executor.schema}.[User] U
            WHERE U.UserId = %s
        """

        params = {"UserId": user_Id, "Wins": wins,"Losses": losses}

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection, params)


        
        
    

    def delete_user(self, user):
        sql = f"""
            DELETE FROM {self.executor.schema}.[User]
            WHERE UserId = %s
        """
        params = {"UserId" : user.user_id}
        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)
        




        


        