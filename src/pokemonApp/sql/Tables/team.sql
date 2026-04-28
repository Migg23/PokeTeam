DROP TABLE IF EXISTS pokemon.Team;
GO

CREATE TABLE pokemon.Team (
    TeamId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TeamName NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_Team_User
        FOREIGN KEY (UserId)
        REFERENCES pokemon.[User](UserId)
);
GO
