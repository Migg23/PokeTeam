
from abc import ABC, abstractmethod

class IGenerationRepository(ABC):
    @abstractmethod
    def create_generation(self, generation):
        pass

    @abstractmethod
    def get_generation_by_id(self, gneration_Id):
        pass

    @abstractmethod
    def get_generation_by_region(self,region_Id):
        pass

    @abstractmethod
    def get_generation_by_name(self, generation_name):
        pass

    @abstractmethod
    def get_all_generations(self):
        pass

    

    
