DROP TABLE IF EXISTS pokemon.Generation;
GO

CREATE TABLE pokemon.Generation (
    GenerationId INT IDENTITY(1,1) PRIMARY KEY,
    RegionId INT NOT NULL,
    GenerationName NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Generation_Region
        FOREIGN KEY (RegionId)
        REFERENCES pokemon.Region(RegionId)
);
GO
