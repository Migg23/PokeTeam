DROP TABLE IF EXISTS pokemon.PokemonSpecies;
GO

CREATE TABLE pokemon.PokemonSpecies (
    SpeciesId INT IDENTITY(1,1) PRIMARY KEY,
    GenId INT NOT NULL,
    TypeOneId INT NOT NULL,
    TypeTwoId INT NULL,
    SpeciesName NVARCHAR(50) NOT NULL,
    Rarity INT NOT NULL,
    Hp INT NOT NULL,
    Atk INT NOT NULL,
    SpAtk INT NOT NULL,
    Def INT NOT NULL,
    SpDef INT NOT NULL,
    Speed INT NOT NULL,

    CONSTRAINT FK_Species_Generation
        FOREIGN KEY (GenerationId)
        REFERENCES pokemon.Generation(GenerationId),

    CONSTRAINT FK_Species_TypeOne
        FOREIGN KEY (TypeOneId)
        REFERENCES pokemon.Type(TypeId),

    CONSTRAINT FK_Species_TypeTwo
        FOREIGN KEY (TypeTwoId)
        REFERENCES pokemon.Type(TypeId)
);
GO
