
class Type:
    def __init__(self,type_Id,name):
        self.type_Id = type_Id
        self.name = name
    
    @property
    def get_type_Id(self):
        return self.type_Id
    
    @property
    def get_type_name(self):
        return self.name