DROP TABLE IF EXISTS pokemon.Region;
GO

CREATE TABLE pokemon.Region (
    RegionId INT IDENTITY(1,1) PRIMARY KEY,
    RegionName NVARCHAR(50) NOT NULL
);
GO
