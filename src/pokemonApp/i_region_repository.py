from abc import ABC,abstractmethod

class IRegionRepository(ABC):
    @abstractmethod
    def create_region(self, region):
        pass

    @abstractmethod
    def get_all_regions(self):
        pass


    @abstractmethod 
    def get_region_by_regionId(self, region_Id):
        pass

    @abstractmethod
    def get_region_by_name(self, region_name):
        pass
