---------------------------------------------------------
-- REGION
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.Region (RegionName)
VALUES ('Kanto'), ('Johto'), ('Hoenn');

---------------------------------------------------------
-- GENERATION
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.Generation (RegionId, GenName)
VALUES
(1, 'Generation I'),
(2, 'Generation II'),
(3, 'Generation III');

---------------------------------------------------------
-- TYPE
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.[Type] (Name)
VALUES
('Fire'), ('Water'), ('Grass'), ('Electric'), ('Normal');

---------------------------------------------------------
-- POKEMON SPECIES
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.PokemonSpecies
(GenerationId, TypeOneId, TypeTwoId, SpeciesName, Rarity, Hp, Atk, SpAtk, Def, SpDef, Speed)
VALUES
(1, 1, NULL, 'Charmander', 3, 39, 52, 60, 43, 50, 65),
(1, 2, NULL, 'Squirtle', 3, 44, 48, 50, 65, 64, 43),
(1, 3, NULL, 'Bulbasaur', 3, 45, 49, 65, 49, 65, 45);

---------------------------------------------------------
-- POKEMON
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.Pokemon (SpeciesId, Level, Ability, Nature)
VALUES
(1, 5, 'Blaze', 'Brave'),
(2, 5, 'Torrent', 'Calm'),
(3, 5, 'Overgrow', 'Modest');

---------------------------------------------------------
-- USER
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.[User] (UserName, Wins, Losses)
VALUES
('Miguel', 10, 2),
('Bradyn', 20, 5);

---------------------------------------------------------
-- TEAM
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.Team (UserId, TeamName)
VALUES
(1, 'Miguel Team Alpha'),
(2, 'Bradyn Team Omega');

---------------------------------------------------------
-- TEAM MEMBER
---------------------------------------------------------
INSERT INTO {{SCHEMA}}.TeamMember (TeamId, PokedexId, TeamNumber)
VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1);
