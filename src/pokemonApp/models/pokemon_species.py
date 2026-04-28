
class Pokemon_Species:
    def __init__(self,species_Id, generation_Id,type_one_Id, type_two_Id, species_name, rarity, hp, atk,spatk, deff, spdef, speed):
        self.species_Id = species_Id
        self.generation_Id = generation_Id
        self.type_one_Id = type_one_Id
        self.type_two_Id = type_two_Id
        self.species_name = species_name
        self.rarity = rarity
        self.hp = hp
        self.atk = atk
        self.spatk = spatk
        self.deff = deff
        self.spdef = spdef
        self.speed = speed
    

    @property
    def get_species_Id(self):
        return self.species_Id

    @property
    def get_generation_Id(self):
        return self.generation_Id
    
    @property
    def get_type_one_Id(self):
        return self.type_one_Id
    
    @property
    def get_type_two_Id(self):
        return self.type_two_Id
    
    @property
    def get_species_name(self):
        return self.species_name
    
    @property
    def get_rarity(self):
        return self.rarity
    
    @property
    def get_hp(self):
        return self.hp

    @property
    def get_atk(self):
        return self.atk
    
    @property
    def get_spatk(self):
        return self.spatk
    
    @property
    def get_def(self):
        return self.deff

    @property
    def get_spdef(self):
        return self.spdef
    
    @property
    def get_speed(self):
        return self.speed