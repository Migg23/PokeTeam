#this here is an example of a table from our schema. it is an object that we will use to store data from the database

class User:
    def __init__(self, userId, user_name, wins,losses):
        self.user_id = userId
        self.user_name = user_name
        self.wins = wins
        self.losses = losses
    
    @property
    def get_user_id(self):
        return self.user_id


    @property
    def get_user_name(self):
        return self.user_name
    
    @property
    def get_wins(self):
        return self.wins

    @property
    def get_losses(self):
        return self.losses