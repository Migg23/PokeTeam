
class Team:
    def __init__(self,team_Id, user_Id, team_name ):
        self.team_Id = team_Id
        self.user_Id = user_Id
        self.team_name = team_name
    


    @property 
    def get_team_Id(self):
        return self.team_Id

    @property
    def get_user_Id(self):
        return self.user_Id

    @property
    def get_team_name(self):
        return self.team_name
    


    