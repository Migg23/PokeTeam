DROP TABLE IF EXISTS {{SCHEMA}}.Pokemon;
GO

CREATE TABLE {{SCHEMA}}.Pokemon (
    PokedexId INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId INT NOT NULL,
    [Level] INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Pokemon_Species
        FOREIGN KEY (SpeciesId)
        REFERENCES {{SCHEMA}}.PokemonSpecies(SpeciesId)
);
GO
