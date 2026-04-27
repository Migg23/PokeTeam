USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Region;
GO

CREATE TABLE pokemon.Region (
    region_Id INT IDENTITY(1,1) PRIMARY KEY,
    region_Name NVARCHAR(50) NOT NULL
);
GO
