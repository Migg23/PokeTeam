#operations: get teams by teamId, get teams by userId/Username, get team
from abc import ABC, abstractmethod

class ITeamRepository(ABC):
    @abstractmethod
    def get_team_with_teamId(self,team):
        pass

    @abstractmethod
    def get_team_with_userId(self,userId):
        pass

    @abstractmethod
    def delete_team(self,team_Id):
        pass

    @abstractmethod
    def create_team(self,team_Id):
        pass

    