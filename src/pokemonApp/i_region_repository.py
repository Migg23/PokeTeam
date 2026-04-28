from abc import ABC,abstractmethod

class IRegionRepository(ABC):

    @abstractmethod
    def get_all_regions(self):
        pass


    @abstractmethod 
    def get_region_by_regionId(self, region_Id):
        pass