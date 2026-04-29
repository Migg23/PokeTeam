USE cis560_s26_team8;
GO

PRINT 'Dropping existing tables...';

DROP TABLE IF EXISTS [TeamMember];
DROP TABLE IF EXISTS [Team];
DROP TABLE IF EXISTS [User];
DROP TABLE IF EXISTS [Pokemon];
DROP TABLE IF EXISTS [PokemonSpecies];
DROP TABLE IF EXISTS [Type];
DROP TABLE IF EXISTS [Generation];
DROP TABLE IF EXISTS [Region];
GO

PRINT 'Recreating schema...';

---------------------------------------------------------
-- REGION
---------------------------------------------------------
CREATE TABLE Region (
    RegionId INT IDENTITY(1,1) PRIMARY KEY,
    RegionName NVARCHAR(50) NOT NULL UNIQUE
);

---------------------------------------------------------
-- GENERATION
---------------------------------------------------------
CREATE TABLE Generation (
    GenerationId INT IDENTITY(1,1) PRIMARY KEY,
    RegionId INT NOT NULL,
    GenerationName NVARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (RegionId) REFERENCES Region(RegionId)
);

---------------------------------------------------------
-- TYPE
---------------------------------------------------------
CREATE TABLE [Type] (
    TypeId INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(30) NOT NULL UNIQUE
);

---------------------------------------------------------
-- POKEMON SPECIES
---------------------------------------------------------
CREATE TABLE PokemonSpecies (
    SpeciesId INT IDENTITY(1,1) PRIMARY KEY,
    GenerationId INT NOT NULL,
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
    FOREIGN KEY (GenerationId) REFERENCES Generation(GenerationId),
    FOREIGN KEY (TypeOneId) REFERENCES [Type](TypeId),
    FOREIGN KEY (TypeTwoId) REFERENCES [Type](TypeId)
);

---------------------------------------------------------
-- POKEMON
---------------------------------------------------------
CREATE TABLE Pokemon (
    PokemonId INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId INT NOT NULL,
    [Level] INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,
    FOREIGN KEY (SpeciesId) REFERENCES PokemonSpecies(SpeciesId)
);

---------------------------------------------------------
-- USER
---------------------------------------------------------
CREATE TABLE [User] (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL UNIQUE,
    Wins INT NOT NULL DEFAULT 0,
    Losses INT NOT NULL DEFAULT 0
);

---------------------------------------------------------
-- TEAM
---------------------------------------------------------
CREATE TABLE Team (
    TeamId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TeamName NVARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (UserId) REFERENCES [User](UserId)
);

---------------------------------------------------------
-- TEAM MEMBER
---------------------------------------------------------
CREATE TABLE TeamMember (
    MemberId INT IDENTITY(1,1) PRIMARY KEY,
    TeamId INT NOT NULL,
    PokemonId INT NOT NULL,
    TeamNumber INT NOT NULL CHECK (TeamNumber BETWEEN 1 AND 6) UNIQUE,
    FOREIGN KEY (TeamId) REFERENCES Team(TeamId),
    FOREIGN KEY (PokemonId) REFERENCES Pokemon(PokemonId)
);

PRINT 'Schema created successfully.';
GO
