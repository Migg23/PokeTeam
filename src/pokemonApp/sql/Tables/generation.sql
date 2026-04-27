USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Generation;
GO

CREATE TABLE pokemon.Generation (
    gen_Id INT IDENTITY(1,1) PRIMARY KEY,
    region_Id INT NOT NULL,
    gen_Name NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Generation_Region
        FOREIGN KEY (region_Id)
        REFERENCES pokemon.Region(region_Id)
);
GO
