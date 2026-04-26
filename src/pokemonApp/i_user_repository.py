#operations:get user by id, get all users, get user by username, update users record, delete user, 

from abc import ABC, abstractmethod

class IUserRepository(ABC):
    @abstractmethod
    def create_user(self,user):
        pass

    @abstractmethod
    def delete_user(self,user):
        pass

    @abstractmethod
    def get_user_by_Id(self,user_Id):
        pass

    
    @abstractmethod
    def update_user(self, user_Id, wins,losses):
        pass

    @abstractmethod
    def get_all_users(self):
        pass
    

    