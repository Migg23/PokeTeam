USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Team;
GO

CREATE TABLE pokemon.Team (
    team_Id INT IDENTITY(1,1) PRIMARY KEY,
    user_Id INT NOT NULL,
    team_name NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Team_User
        FOREIGN KEY (user_Id)
        REFERENCES pokemon.[User](user_Id)
);
GO
