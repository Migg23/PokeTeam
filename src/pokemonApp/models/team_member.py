
class Team_Member:
    def __init__(self, member_Id,team_id,pokedex_Id,team_number):
        self.member_Id = member_Id
        self.team_Id = team_id
        self.pokedex_Id = pokedex_Id
        self.team_number = team_number

    @property
    def get_member_Id(self):
        return self.member_Id

    @property
    def get_team_id(self):
        return self.team_Id

    @property
    def get_pokedex_Id(self):
        return self.pokedex_Id
    
    @property
    def get_team_number(self):
        return self.team_number
    

    