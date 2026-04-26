
from abc import ABC, abstractmethod

class ITeamMemberRepository(ABC):
    @abstractmethod
    def create_team_member(self):
        pass

    @abstractmethod
    def delete_team_member(self,member_Id):
        pass

    @abstractmethod
    def update_team_member(self,member_Id):
        pass

    @abstractmethod
    def get_all_team_members(self,teamId):
        pass

    