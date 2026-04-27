USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Pokemon_Species;
GO

CREATE TABLE pokemon.Pokemon_Species (
    species_Id INT IDENTITY(1,1) PRIMARY KEY,
    generation_Id INT NOT NULL,
    type_one_Id INT NOT NULL,
    type_two_Id INT NULL,
    species_name NVARCHAR(50) NOT NULL,
    rarity INT NOT NULL,
    hp INT NOT NULL,
    atk INT NOT NULL,
    spatk INT NOT NULL,
    deff INT NOT NULL,
    spdef INT NOT NULL,
    speed INT NOT NULL,

    CONSTRAINT FK_Species_Generation
        FOREIGN KEY (generation_Id)
        REFERENCES pokemon.Generation(gen_Id),

    CONSTRAINT FK_Species_Type1
        FOREIGN KEY (type_one_Id)
        REFERENCES pokemon.Type(type_Id),

    CONSTRAINT FK_Species_Type2
        FOREIGN KEY (type_two_Id)
        REFERENCES pokemon.Type(type_Id)
);
GO
