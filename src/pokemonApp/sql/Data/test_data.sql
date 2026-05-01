USE cis560_s26_team8;
GO

/* =========================
   BASE DATA FOR AGGREGATES
========================= */

INSERT INTO {{SCHEMA}}.[Region] (RegionName)
VALUES
('Kanto'),
('Johto'),
('Hoenn'),
('Sinnoh'),
('Unova'),
('Kalos'),
('Alola'),
('Galar');

INSERT INTO {{SCHEMA}}.[Generation] (RegionId, GenName)
VALUES
(1, 'Generation I'),
(2, 'Generation II'),
(3, 'Generation III'),
(4, 'Generation IV'),
(5, 'Generation V'),
(6, 'Generation VI'),
(7, 'Generation VII'),
(8, 'Generation VIII');

INSERT INTO {{SCHEMA}}.[Type] ([Name])
VALUES
('Normal'), ('Fire'), ('Water'), ('Grass'), ('Electric'),
('Ice'), ('Fighting'), ('Poison'), ('Ground'), ('Flying'),
('Psychic'), ('Bug'), ('Rock'), ('Ghost'), ('Dragon'),
('Dark'), ('Steel'), ('Fairy');

INSERT INTO {{SCHEMA}}.[PokemonSpecies]
(GenId, TypeOneId, TypeTwoId, SpeciesName, Rarity, Hp, Atk, SpAtk, Def, SpDef, Speed)
VALUES
(1, 2, NULL, 'Charmander', 3, 39, 52, 60, 43, 50, 65),
(1, 3, NULL, 'Squirtle', 3, 44, 48, 50, 65, 64, 43),
(1, 4, 8, 'Bulbasaur', 3, 45, 49, 65, 49, 65, 45),
(1, 5, NULL, 'Pikachu', 2, 35, 55, 50, 40, 50, 90),
(1, 1, NULL, 'Eevee', 2, 55, 55, 45, 50, 65, 55),
(2, 2, NULL, 'Cyndaquil', 3, 39, 52, 60, 43, 50, 65),
(2, 3, NULL, 'Totodile', 3, 50, 65, 44, 64, 48, 43),
(2, 4, NULL, 'Chikorita', 3, 45, 49, 49, 65, 65, 45),
(3, 2, NULL, 'Torchic', 3, 45, 60, 70, 40, 50, 45),
(3, 3, NULL, 'Mudkip', 3, 50, 70, 50, 50, 50, 40),
(3, 4, NULL, 'Treecko', 3, 40, 45, 65, 35, 55, 70),
(4, 15, 9, 'Gible', 1, 58, 70, 40, 45, 45, 42);

/* =========================
   USERS
========================= */

INSERT INTO {{SCHEMA}}.[User] (UserName, Wins, Losses)
VALUES
('Red', 300, 20),
('Steven', 250, 30),
('Blue', 180, 70),
('Iris', 220, 45),
('Cynthia', 340, 28),
('Brock', 90, 60);

/* =========================
   TEAMS
========================= */

INSERT INTO {{SCHEMA}}.[Team] (UserId, TeamName)
SELECT U.UserId, V.TeamName
FROM {{SCHEMA}}.[User] U
INNER JOIN (
    VALUES
        ('Red', 'Red Kanto Only'),
        ('Steven', 'Steven Hoenn Only'),
        ('Blue', 'Blue Mixed Team'),
        ('Iris', 'Iris Mixed Team'),
        ('Cynthia', 'Cynthia Sinnoh Squad')
) V(UserName, TeamName)
    ON V.UserName = U.UserName;

/* Brock intentionally has no team for sanity checks. */

/* =========================
   CAPTURED TEAM IDS
========================= */

DECLARE @RedTeamId INT = (
    SELECT TeamId
    FROM {{SCHEMA}}.[Team]
    WHERE TeamName = 'Red Kanto Only'
);

DECLARE @StevenTeamId INT = (
    SELECT TeamId
    FROM {{SCHEMA}}.[Team]
    WHERE TeamName = 'Steven Hoenn Only'
);

DECLARE @BlueTeamId INT = (
    SELECT TeamId
    FROM {{SCHEMA}}.[Team]
    WHERE TeamName = 'Blue Mixed Team'
);

DECLARE @IrisTeamId INT = (
    SELECT TeamId
    FROM {{SCHEMA}}.[Team]
    WHERE TeamName = 'Iris Mixed Team'
);

DECLARE @CynthiaTeamId INT = (
    SELECT TeamId
    FROM {{SCHEMA}}.[Team]
    WHERE TeamName = 'Cynthia Sinnoh Squad'
);

/* =========================
   POKEMON INSTANCES
========================= */

DECLARE @CreatedPokemon TABLE (
    SlotKey NVARCHAR(20) NOT NULL PRIMARY KEY,
    PokedexId INT NOT NULL
);

/* Red: all Kanto */
INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red1', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 45, 'Blaze', 'Brave'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Charmander';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red2', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 42, 'Torrent', 'Calm'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Squirtle';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red3', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 43, 'Overgrow', 'Modest'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Bulbasaur';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red4', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 50, 'Static', 'Jolly'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Pikachu';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red5', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 47, 'Run Away', 'Serious'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Eevee';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Red6', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 52, 'Blaze', 'Hardy'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Charmander';

/* Steven: all Hoenn */
INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven1', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 46, 'Blaze', 'Lonely'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Torchic';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven2', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 44, 'Torrent', 'Relaxed'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Mudkip';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven3', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 45, 'Overgrow', 'Timid'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Treecko';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven4', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 48, 'Blaze', 'Adamant'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Torchic';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven5', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 49, 'Torrent', 'Bold'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Mudkip';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Steven6', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 51, 'Overgrow', 'Naive'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Treecko';

/* Blue: mixed regions */
INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue1', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 40, 'Blaze', 'Brave'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Charmander';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue2', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 38, 'Blaze', 'Hasty'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Cyndaquil';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue3', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 41, 'Blaze', 'Lonely'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Torchic';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue4', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 44, 'Static', 'Jolly'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Pikachu';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue5', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 46, 'Rough Skin', 'Impish'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Blue6', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 39, 'Torrent', 'Adamant'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Totodile';

/* Iris: mixed regions */
INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris1', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 42, 'Overgrow', 'Modest'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Bulbasaur';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris2', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 43, 'Overgrow', 'Bold'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Chikorita';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris3', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 45, 'Torrent', 'Relaxed'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Mudkip';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris4', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 41, 'Run Away', 'Docile'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Eevee';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris5', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 50, 'Sand Veil', 'Careful'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Iris6', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 44, 'Overgrow', 'Timid'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Treecko';

/* Cynthia: all Sinnoh */
INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia1', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 58, 'Rough Skin', 'Jolly'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia2', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 56, 'Sand Veil', 'Adamant'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia3', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 54, 'Rough Skin', 'Careful'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia4', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 60, 'Sand Veil', 'Impish'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia5', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 57, 'Rough Skin', 'Brave'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
OUTPUT 'Cynthia6', inserted.PokedexId INTO @CreatedPokemon (SlotKey, PokedexId)
SELECT SpeciesId, 59, 'Sand Veil', 'Serious'
FROM {{SCHEMA}}.[PokemonSpecies]
WHERE SpeciesName = 'Gible';

/* =========================
   TEAM MEMBERS
========================= */

INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
SELECT @RedTeamId, CP.PokedexId, Slots.TeamNumber
FROM (
    VALUES
        ('Red1', 1), ('Red2', 2), ('Red3', 3),
        ('Red4', 4), ('Red5', 5), ('Red6', 6)
) Slots(SlotKey, TeamNumber)
INNER JOIN @CreatedPokemon CP
    ON CP.SlotKey = Slots.SlotKey;

INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
SELECT @StevenTeamId, CP.PokedexId, Slots.TeamNumber
FROM (
    VALUES
        ('Steven1', 1), ('Steven2', 2), ('Steven3', 3),
        ('Steven4', 4), ('Steven5', 5), ('Steven6', 6)
) Slots(SlotKey, TeamNumber)
INNER JOIN @CreatedPokemon CP
    ON CP.SlotKey = Slots.SlotKey;

INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
SELECT @BlueTeamId, CP.PokedexId, Slots.TeamNumber
FROM (
    VALUES
        ('Blue1', 1), ('Blue2', 2), ('Blue3', 3),
        ('Blue4', 4), ('Blue5', 5), ('Blue6', 6)
) Slots(SlotKey, TeamNumber)
INNER JOIN @CreatedPokemon CP
    ON CP.SlotKey = Slots.SlotKey;

INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
SELECT @IrisTeamId, CP.PokedexId, Slots.TeamNumber
FROM (
    VALUES
        ('Iris1', 1), ('Iris2', 2), ('Iris3', 3),
        ('Iris4', 4), ('Iris5', 5), ('Iris6', 6)
) Slots(SlotKey, TeamNumber)
INNER JOIN @CreatedPokemon CP
    ON CP.SlotKey = Slots.SlotKey;

INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
SELECT @CynthiaTeamId, CP.PokedexId, Slots.TeamNumber
FROM (
    VALUES
        ('Cynthia1', 1), ('Cynthia2', 2), ('Cynthia3', 3),
        ('Cynthia4', 4), ('Cynthia5', 5), ('Cynthia6', 6)
) Slots(SlotKey, TeamNumber)
INNER JOIN @CreatedPokemon CP
    ON CP.SlotKey = Slots.SlotKey;
GO
