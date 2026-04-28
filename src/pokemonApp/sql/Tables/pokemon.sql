DROP TABLE IF EXISTS pokemon.Pokemon;
GO

CREATE TABLE pokemon.Pokemon (
    PokemonId INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId INT NOT NULL,
    Level INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Pokemon_Species
        FOREIGN KEY (SpeciesId)
        REFERENCES pokemon.PokemonSpecies(SpeciesId)
);
GO
