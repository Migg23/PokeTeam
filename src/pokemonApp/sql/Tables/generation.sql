DROP TABLE IF EXISTS pokemon.Generation;
GO

CREATE TABLE pokemon.Generation (
    GenId INT IDENTITY(1,1) PRIMARY KEY,
    RegionId INT NOT NULL,
    GenName NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Generation_Region
        FOREIGN KEY (RegionId)
        REFERENCES pokemon.Region(RegionId)
);
GO
