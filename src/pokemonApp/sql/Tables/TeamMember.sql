DROP TABLE IF EXISTS pokemon.TeamMember;
GO

CREATE TABLE pokemon.TeamMember (
    MemberId INT IDENTITY(1,1) PRIMARY KEY,
    TeamId INT NOT NULL,
    PokemonId INT NOT NULL,
    TeamNumber INT NOT NULL CHECK (TeamNumber BETWEEN 1 AND 6),

    CONSTRAINT FK_TeamMember_Team
        FOREIGN KEY (TeamId)
        REFERENCES pokemon.Team(TeamId),

    CONSTRAINT FK_TeamMember_Pokemon
        FOREIGN KEY (PokemonId)
        REFERENCES pokemon.Pokemon(PokemonId)
);
GO
