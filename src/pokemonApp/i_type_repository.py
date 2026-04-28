
from abc import ABC, abstractmethod

class ITypeRepository(ABC):
    @abstractmethod
    def get_type_by_Id(self, type_Id):
        pass


    @abstractmethod 
    def get_all_types(self):
        pass

    