#here would be the model aka the object representation of the pokemon table

class Pokemon:
    def __init__(self,pokedex_Id, species_Id,level,ability, nature):
        self.pokedex_Id = pokedex_Id
        self.species_Id = species_Id
        self.level = level
        self.ability = ability
        self.nature = nature
    

    @property
    def get_pokedex_Id(self):
        return self.pokedex_Id

    @property
    def get_species_Id(self):
        return self.species_Id
    
    @property
    def get_level(self):
        return self.level
    
    @property
    def get_ability(self):
        return self.ability
    
    @property
    def get_nature(self):
        return self.nature