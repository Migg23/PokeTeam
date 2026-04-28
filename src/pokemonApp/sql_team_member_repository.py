from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.team_member import Team_Member
from src.pokemonApp.i_team_member_repository import ITeamMemberRepository


class SqlTeamMember(ITeamMemberRepository):
    def __init__(self, executor):
        self.executor = executor
    

    def create_team_member(self, teamMember):
        sql = f"""
            INSERT INTO {self.executor.schema}.TeamMember(TeamId , PokedexId, TeamNumber)
            VALUES(%s,%s,%s)
        """

        params = {"TeamId" : teamMember.team_Id, "PokedexId" : teamMember.pokedex_Id , "TeamNumber" : teamMember.team_number}

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection,params)
    


    def get_all_team_members(self, teamId):
        sql = f"""
            SELECT * 
            FROM {self.executor.schema}.Team T
                INNER JOIN {self.executor.schema}.TeamMember TM ON T.TeamId = TM.TeamId
            WHERE TM.TeamId = %s
        """

        params = {"TeamId" : teamId}

        with self.executor.transaction_scope() as conenction:
            temp = self.executor.execute_query(sql , conenction , params)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return []


        teamMembers = []

        for x in range(len(rows_returned)):
            row = rows_returned[x]
            teamMembers.append(Team_Member(member_Id = row["MemberId"] , team_id = row["TeamId"] , pokedex_Id = row["PokedexId"] , team_number= row["TeamNumber"]))

        return teamMembers
    
    def delete_team_member(self, member_Id):
        sql = f"""
            DELETE FROM {self.executor.schema}.TeamMember
            WHERE MemberId = %s
        """

        params = {"MemberId" : member_Id}

        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql,connection,params)
        
    def update_team_member(self, member_Id, pokedex_Id , team_number):
        sql = f"""
        UPDATE {self.executor.schema}.TeamMember
        SET
            PokedexId = %s,
            TeamNumber = %s
        WHERE MemberId = %s 
        """

        params = {"PokedexId" : pokedex_Id , "TeamNumber": team_number, "MemberId" : member_Id}


        with self.executor.transaction_scope() as connection:
            self.executor.execute_query(sql, connection, params)
        

    
