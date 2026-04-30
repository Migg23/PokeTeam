USE cis560_s26_team8;


IF SCHEMA_ID(N'{{SCHEMA}}') IS NULL
    EXEC (N'CREATE SCHEMA [{{SCHEMA}}];')

PRINT 'Dropping existing tables...';

DROP TABLE IF EXISTS {{SCHEMA}}.[TeamMember];
DROP TABLE IF EXISTS {{SCHEMA}}.[Team];
DROP TABLE IF EXISTS {{SCHEMA}}.[User];
DROP TABLE IF EXISTS {{SCHEMA}}.[Pokemon];
DROP TABLE IF EXISTS {{SCHEMA}}.[PokemonSpecies];
DROP TABLE IF EXISTS {{SCHEMA}}.[Type];
DROP TABLE IF EXISTS {{SCHEMA}}.[Generation];
DROP TABLE IF EXISTS {{SCHEMA}}.[Region];
GO

PRINT 'Recreating schema...';

---------------------------------------------------------
-- REGION
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.Region (
    RegionId INT IDENTITY(1,1) PRIMARY KEY,
    RegionName NVARCHAR(50) NOT NULL UNIQUE
);

---------------------------------------------------------
-- GENERATION
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.Generation (
    GenId INT IDENTITY(1,1) PRIMARY KEY,
    RegionId INT NOT NULL,
    GenName NVARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (RegionId) REFERENCES {{SCHEMA}}.Region(RegionId)
);

---------------------------------------------------------
-- TYPE
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.[Type] (
    TypeId INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(30) NOT NULL UNIQUE
);

---------------------------------------------------------
-- POKEMON SPECIES
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.PokemonSpecies (
    SpeciesId INT IDENTITY(1,1) PRIMARY KEY,
    GenId INT NOT NULL,
    TypeOneId INT NOT NULL,
    TypeTwoId INT NULL,
    SpeciesName NVARCHAR(50) NOT NULL UNIQUE,
    Rarity INT NOT NULL,
    Hp INT NOT NULL,
    Atk INT NOT NULL,
    SpAtk INT NOT NULL,
    Def INT NOT NULL,
    SpDef INT NOT NULL,
    Speed INT NOT NULL,
    FOREIGN KEY (GenId) REFERENCES {{SCHEMA}}.Generation(GenId),
    FOREIGN KEY (TypeOneId) REFERENCES {{SCHEMA}}.[Type](TypeId),
    FOREIGN KEY (TypeTwoId) REFERENCES {{SCHEMA}}.[Type](TypeId)
);

---------------------------------------------------------
-- POKEMON
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.Pokemon (
    PokedexId INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId INT NOT NULL,
    [Level] INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,
    FOREIGN KEY (SpeciesId) REFERENCES {{SCHEMA}}.PokemonSpecies(SpeciesId)
);

---------------------------------------------------------
-- USER
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.[User] (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL UNIQUE,
    Wins INT NOT NULL DEFAULT 0,
    Losses INT NOT NULL DEFAULT 0
);

---------------------------------------------------------
-- TEAM
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.Team (
    TeamId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TeamName NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES {{SCHEMA}}.[User](UserId),
    CONSTRAINT UQ_Team_UserName UNIQUE (UserId, TeamName)
);

---------------------------------------------------------
-- TEAM MEMBER
---------------------------------------------------------
CREATE TABLE {{SCHEMA}}.TeamMember (
    MemberId INT IDENTITY(1,1) PRIMARY KEY,
    TeamId INT NOT NULL,
    PokedexId INT NOT NULL,
    TeamNumber INT NOT NULL CHECK (TeamNumber BETWEEN 1 AND 6),
    FOREIGN KEY (TeamId) REFERENCES {{SCHEMA}}.Team(TeamId),
    FOREIGN KEY (PokedexId) REFERENCES {{SCHEMA}}.Pokemon(PokedexId),
    CONSTRAINT UQ_TeamMember_TeamSlot UNIQUE (TeamId, TeamNumber)
);

PRINT 'Schema created successfully.';
GO
