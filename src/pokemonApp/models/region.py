
class Region:
    def __init__(self, region_Id, region_name):
        self.region_Id = region_Id
        self.region_Name = region_name

    
    @property
    def get_region_Id(self):
        return self.region_Id
    
    @property
    def get_region_name(self):
        return self.region_Name