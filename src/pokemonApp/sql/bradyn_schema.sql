USE PokemonDB;
GO

PRINT 'Dropping existing tables...';

DROP TABLE IF EXISTS pokemon.TeamMember;
DROP TABLE IF EXISTS pokemon.Team;
DROP TABLE IF EXISTS pokemon.[User];
DROP TABLE IF EXISTS pokemon.Pokemon;
DROP TABLE IF EXISTS pokemon.PokemonSpecies;
DROP TABLE IF EXISTS pokemon.Type;
DROP TABLE IF EXISTS pokemon.Generation;
DROP TABLE IF EXISTS pokemon.Region;
GO

PRINT 'Recreating schema...';

-- REGION
CREATE TABLE pokemon.Region (
    RegionId INT IDENTITY(1,1) PRIMARY KEY,
    RegionName NVARCHAR(50) NOT NULL
);

-- GENERATION
CREATE TABLE pokemon.Generation (
    GenerationId INT IDENTITY(1,1) PRIMARY KEY,
    RegionId INT NOT NULL,
    GenerationName NVARCHAR(50) NOT NULL,
    FOREIGN KEY (RegionId) REFERENCES pokemon.Region(RegionId)
);

-- TYPE
CREATE TABLE pokemon.Type (
    TypeId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(30) NOT NULL UNIQUE
);

-- POKEMON SPECIES
CREATE TABLE pokemon.PokemonSpecies (
    SpeciesId INT IDENTITY(1,1) PRIMARY KEY,
    GenerationId INT NOT NULL,
    TypeOneId INT NOT NULL,
    TypeTwoId INT NULL,
    SpeciesName NVVARCHAR(50) NOT NULL,
    Rarity INT NOT NULL,
    Hp INT NOT NULL,
    Atk INT NOT NULL,
    SpAtk INT NOT NULL,
    Def INT NOT NULL,
    SpDef INT NOT NULL,
    Speed INT NOT NULL,
    FOREIGN KEY (GenerationId) REFERENCES pokemon.Generation(GenerationId),
    FOREIGN KEY (TypeOneId) REFERENCES pokemon.Type(TypeId),
    FOREIGN KEY (TypeTwoId) REFERENCES pokemon.Type(TypeId)
);

-- POKEMON
CREATE TABLE pokemon.Pokemon (
    PokemonId INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId INT NOT NULL,
    Level INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,
    FOREIGN KEY (SpeciesId) REFERENCES pokemon.PokemonSpecies(SpeciesId)
);

-- USER
CREATE TABLE pokemon.[User] (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL UNIQUE,
    Wins INT NOT NULL DEFAULT 0,
    Losses INT NOT NULL DEFAULT 0
);

-- TEAM
CREATE TABLE pokemon.Team (
    TeamId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TeamName NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES pokemon.[User](UserId)
);

-- TEAM MEMBER
CREATE TABLE pokemon.TeamMember (
    MemberId INT IDENTITY(1,1) PRIMARY KEY,
    TeamId INT NOT NULL,
    PokemonId INT NOT NULL,
    TeamNumber INT NOT NULL CHECK (TeamNumber BETWEEN 1 AND 6),
    FOREIGN KEY (TeamId) REFERENCES pokemon.Team(TeamId),
    FOREIGN KEY (PokemonId) REFERENCES pokemon.Pokemon(PokemonId)
);

PRINT 'Inserting seed data...';

-- REGION
INSERT INTO pokemon.Region (RegionName)
VALUES ('Kanto'), ('Johto'), ('Hoenn');

-- GENERATION
INSERT INTO pokemon.Generation (RegionId, GenerationName)
VALUES (1, 'Generation I'), (2, 'Generation II'), (3, 'Generation III');

-- TYPE
INSERT INTO pokemon.Type (Name)
VALUES ('Fire'), ('Water'), ('Grass'), ('Electric'), ('Normal');

-- SPECIES
INSERT INTO pokemon.PokemonSpecies
(GenerationId, TypeOneId, TypeTwoId, SpeciesName, Rarity, Hp, Atk, SpAtk, Def, SpDef, Speed)
VALUES
(1, 1, NULL, 'Charmander', 3, 39, 52, 60, 43, 50, 65),
(1, 2, NULL, 'Squirtle', 3, 44, 48, 50, 65, 64, 43),
(1, 3, NULL, 'Bulbasaur', 3, 45, 49, 65, 49, 65, 45);

-- POKEMON
INSERT INTO pokemon.Pokemon (SpeciesId, Level, Ability, Nature)
VALUES
(1, 5, 'Blaze', 'Brave'),
(2, 5, 'Torrent', 'Calm'),
(3, 5, 'Overgrow', 'Modest');

-- USERS
INSERT INTO pokemon.[User] (UserName, Wins, Losses)
VALUES ('Miguel', 10, 2), ('Bradyn', 20, 5);

-- TEAMS
INSERT INTO pokemon.Team (UserId, TeamName)
VALUES (1, 'Miguel Team Alpha'), (2, 'Bradyn Team Omega');

-- TEAM MEMBERS
INSERT INTO pokemon.TeamMember (TeamId, PokemonId, TeamNumber)
VALUES (1, 1, 1), (1, 2, 2), (2, 3, 1);

PRINT 'Bradyn Schema Complete.';
GO
