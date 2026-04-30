from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.i_team_repository import ITeamRepository
from src.pokemonApp.models.team import Team


class SqlTeamRepository(ITeamRepository):
    def __init__(self, executor):
        self.executor = executor

    def create_team(self, team):
        sql = f"""
            INSERT INTO {self.executor.schema}.Team(UserId,TeamName)
            VALUES(%s,%s);
            SELECT CAST(SCOPE_IDENTITY() AS INT) AS TeamId
        """

        params = {"UserId" : team.user_Id, "TeamName" : team.team_name}


        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection, params)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return None

        return self.get_team_with_teamId(rows_returned[0]["TeamId"])
        
    
    #change this because team id = 1 not multiple teams
    def get_team_with_teamId(self, team_Id):
        sql = f"""
            SELECT *
            FROM {self.executor.schema}.Team T
            WHERE T.TeamId = %s
        """

        params = {"TeamId" : team_Id}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection, params)
            rows_related = self.executor.get_all_rows(temp)

        if not rows_related:
            return None
        
        row = rows_related[0]

        return(Team(team_Id=row["TeamId"] , user_Id=row["UserId"] , team_name=row["TeamName"]))
    

    def get_team_with_userId(self, user_Id):
        sql = f"""
            SELECT T.TeamId , T.UserId , T.TeamName
            FROM {self.executor.schema}.Team T
                INNER JOIN {self.executor.schema}.[User] U ON U.UserId = T.UserId
            WHERE T.UserId = %s
        """

        params = {"UserId" : user_Id}

        with self.executor.transaction_scope() as connection:
            tep = self.executor.execute_query(sql,connection,params)
            rows_returned = self.executor.get_all_rows(tep)

        
        if not rows_returned:
            return None


        teams = []
        for x in range(len(rows_returned)):
            row = rows_returned[x]
            teams.append(Team(team_Id = row["TeamId"] , user_Id = row["UserId"] , team_name = row["TeamName"]))

        return teams
    
    def delete_team(self, team):
        sql = f"""
            DELETE FROM {self.executor.schema}.Team
            WHERE TeamId = %s
        """

        params = {"TeamId" : team.team_Id}

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection,params)

    def update_team(self, team_Id, team_name):
        sql = f"""
            UPDATE {self.executor.schema}.Team
            SET TeamName = %s
            WHERE TeamId = %s
        """

        params = {"TeamName": team_name, "TeamId": team_Id}

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)

        return self.get_team_with_teamId(team_Id)
