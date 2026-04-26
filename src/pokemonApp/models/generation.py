
class Generation:
    def __init__(self,gen_Id,region_Id,gen_Name):
        self.gen_Id = gen_Id
        self.region_Id = region_Id 
        self.gen_Name = gen_Name
    

    @property
    def get_gen_Id(self):
        return self.gen_Id
    
    @property
    def get_region_Id(self):
        return self.region_Id
    
    @property
    def get_gen_Name(self):
        return self.gen_Name
    
    