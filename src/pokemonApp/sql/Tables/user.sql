USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.[User];
GO

CREATE TABLE pokemon.[User] (
    user_Id INT IDENTITY(1,1) PRIMARY KEY,
    user_name NVARCHAR(50) NOT NULL UNIQUE,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0
);
GO
