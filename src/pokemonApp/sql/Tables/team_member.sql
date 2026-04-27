USE PokemonDB;
GO

DROP TABLE IF EXISTS pokemon.Team_Member;
GO

CREATE TABLE pokemon.Team_Member (
    member_Id INT IDENTITY(1,1) PRIMARY KEY,
    team_Id INT NOT NULL,
    pokedex_Id INT NOT NULL,
    team_number INT NOT NULL CHECK (team_number BETWEEN 1 AND 6),

    CONSTRAINT FK_TeamMember_Team
        FOREIGN KEY (team_Id)
        REFERENCES pokemon.Team(team_Id),

    CONSTRAINT FK_TeamMember_Pokemon
        FOREIGN KEY (pokedex_Id)
        REFERENCES pokemon.Pokemon(pokedex_Id)
);
GO
