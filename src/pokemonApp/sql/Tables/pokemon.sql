USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Pokemon;
GO

CREATE TABLE pokemon.Pokemon (
    pokedex_Id INT IDENTITY(1,1) PRIMARY KEY,
    species_Id INT NOT NULL,
    level INT NOT NULL,
    ability NVARCHAR(50) NOT NULL,
    nature NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Pokemon_Species
        FOREIGN KEY (species_Id)
        REFERENCES pokemon.Pokemon_Species(species_Id)
);
GO
