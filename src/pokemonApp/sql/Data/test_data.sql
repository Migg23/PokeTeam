-- THIS DATA IS AI GENERATED, THEN CLEANED TO BE REBUILD-SAFE.
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

/* =========================
   POKEMON SPECIES
========================= */

INSERT INTO {{SCHEMA}}.[PokemonSpecies]
(GenId, TypeOneId, TypeTwoId, SpeciesName, Rarity, Hp, Atk, SpAtk, Def, SpDef, Speed)
VALUES
(1, 2,  NULL, 'Charmander', 3, 39, 52, 60, 43, 50, 65),
(1, 3,  NULL, 'Squirtle', 3, 44, 48, 50, 65, 64, 43),
(1, 4,  8, 'Bulbasaur', 3, 45, 49, 65, 49, 65, 45),
(1, 5,  NULL, 'Pikachu', 2, 35, 55, 50, 40, 50, 90),
(1, 1,  NULL, 'Eevee', 2, 55, 55, 45, 50, 65, 55),
(1, 3,  11, 'Slowpoke', 1, 90, 65, 40, 65, 40, 15),
(1, 11, 10, 'Jynx', 2, 65, 50, 95, 35, 95, 95),
(1, 5,  9, 'Raichu', 2, 60, 90, 90, 55, 80, 110),
(1, 2,  10, 'Charizard', 1, 78, 84, 109, 78, 85, 100),
(1, 3,  NULL, 'Blastoise', 1, 79, 83, 85, 100, 105, 78),
(1, 4,  8, 'Venusaur', 1, 80, 82, 100, 83, 100, 80),
(1, 14, 8, 'Gengar', 1, 60, 65, 130, 60, 75, 110),
(1, 9,  13, 'Golem', 2, 80, 120, 55, 130, 55, 45),
(1, 11, NULL, 'Alakazam', 1, 55, 50, 135, 45, 95, 120),
(1, 3,  6, 'Lapras', 1, 130, 85, 85, 80, 95, 60),
(1, 1,  10, 'Pidgeot', 2, 83, 80, 70, 75, 70, 101),
(1, 1,  NULL, 'Snorlax', 1, 160, 110, 65, 65, 110, 30),
(1, 15, 10, 'Dragonite', 1, 91, 134, 100, 95, 100, 80),
(2, 2,  NULL, 'Cyndaquil', 3, 39, 52, 60, 43, 50, 65),
(2, 3,  NULL, 'Totodile', 3, 50, 65, 44, 64, 48, 43),
(2, 4,  NULL, 'Chikorita', 3, 45, 49, 49, 65, 65, 45),
(2, 1,  10, 'Togekiss', 1, 85, 50, 120, 95, 115, 80),
(2, 16, NULL, 'Umbreon', 2, 95, 65, 60, 110, 130, 65),
(2, 11, NULL, 'Espeon', 2, 65, 65, 130, 60, 95, 110),
(2, 3,  15, 'Kingdra', 1, 75, 95, 95, 95, 95, 85),
(2, 16, 2, 'Houndoom', 2, 75, 90, 110, 50, 80, 95),
(2, 17, 10, 'Skarmory', 2, 65, 80, 40, 140, 70, 70),
(2, 3,  NULL, 'Feraligatr', 2, 85, 105, 79, 100, 83, 78),
(2, 2,  NULL, 'Typhlosion', 2, 78, 84, 109, 78, 85, 100),
(3, 2,  NULL, 'Torchic', 3, 45, 60, 70, 40, 50, 45),
(3, 3,  NULL, 'Mudkip', 3, 50, 70, 50, 50, 50, 40),
(3, 4,  NULL, 'Treecko', 3, 40, 45, 65, 35, 55, 70),
(3, 11, 18, 'Gardevoir', 1, 68, 65, 125, 65, 115, 80),
(3, 3,  13, 'Relicanth', 2, 100, 90, 45, 130, 65, 55),
(3, 2,  7, 'Blaziken', 1, 80, 120, 110, 70, 70, 80),
(3, 3,  9, 'Swampert', 1, 100, 110, 85, 90, 85, 60),
(3, 4,  15, 'Sceptile', 1, 70, 85, 105, 65, 85, 120),
(3, 17, 11, 'Metagross', 1, 80, 135, 95, 130, 90, 70),
(3, 10, 15, 'Salamence', 1, 95, 135, 110, 80, 80, 100),
(3, 9,  15, 'Flygon', 2, 80, 100, 80, 80, 80, 100),
(4, 15, 9, 'Gible', 1, 58, 70, 40, 45, 45, 42),
(4, 15, 9, 'Garchomp', 1, 108, 130, 80, 95, 85, 102),
(4, 7,  17, 'Lucario', 1, 70, 110, 115, 70, 70, 90),
(4, 15, 9, 'Gabite', 2, 68, 90, 50, 65, 55, 82),
(4, 11, 17, 'Bronzong', 2, 67, 89, 79, 116, 116, 33),
(4, 3,  9, 'Gastrodon', 2, 111, 83, 92, 68, 82, 39),
(4, 4,  8, 'Roserade', 2, 60, 70, 125, 65, 105, 90),
(4, 5,  NULL, 'Luxray', 2, 80, 120, 95, 79, 79, 70),
(4, 6,  14, 'Froslass', 2, 70, 80, 80, 70, 70, 110),
(4, 1,  10, 'Staraptor', 2, 85, 120, 50, 70, 60, 100),
(5, 2,  NULL, 'Tepig', 3, 65, 63, 45, 45, 45, 45),
(5, 3,  NULL, 'Oshawott', 3, 55, 55, 63, 45, 45, 45),
(5, 4,  NULL, 'Snivy', 3, 45, 45, 45, 55, 55, 63),
(5, 15, 16, 'Deino', 3, 52, 65, 45, 50, 50, 38),
(5, 5,  10, 'Emolga', 2, 55, 75, 75, 60, 60, 103),
(5, 7,  NULL, 'Conkeldurr', 1, 105, 140, 55, 95, 65, 45),
(5, 16, NULL, 'Zoroark', 1, 60, 105, 105, 60, 60, 105),
(5, 2,  7, 'Emboar', 2, 110, 123, 100, 65, 65, 65),
(5, 3,  NULL, 'Samurott', 2, 95, 100, 108, 85, 70, 70),
(5, 4,  NULL, 'Serperior', 2, 75, 75, 75, 95, 95, 113),
(5, 15, 16, 'Hydreigon', 1, 92, 105, 125, 90, 90, 98),
(5, 15, NULL, 'Haxorus', 1, 76, 147, 60, 90, 70, 97),
(6, 2,  NULL, 'Fennekin', 3, 40, 45, 62, 40, 55, 60),
(6, 3,  NULL, 'Froakie', 3, 41, 56, 63, 40, 40, 71),
(6, 4,  NULL, 'Chespin', 3, 56, 61, 37, 65, 45, 38),
(6, 2,  11, 'Delphox', 2, 75, 69, 114, 72, 100, 104),
(6, 3,  16, 'Greninja', 1, 72, 95, 103, 67, 71, 122),
(6, 4,  7, 'Chesnaught', 2, 88, 107, 74, 122, 75, 64),
(6, 18, NULL, 'Sylveon', 2, 95, 65, 110, 65, 130, 60),
(6, 11, 18, 'Gardevoir-M', 1, 68, 85, 165, 65, 135, 100),
(6, 15, NULL, 'Goodra', 1, 90, 100, 110, 70, 150, 80),
(6, 6,  9, 'Avalugg', 2, 95, 117, 44, 184, 46, 28),
(7, 2,  NULL, 'Litten', 3, 45, 65, 45, 40, 40, 70),
(7, 3,  NULL, 'Popplio', 3, 50, 54, 66, 54, 56, 40),
(7, 4,  10, 'Rowlet', 3, 68, 55, 50, 55, 50, 42),
(7, 2,  16, 'Incineroar', 2, 95, 115, 80, 90, 90, 60),
(7, 3,  18, 'Primarina', 2, 80, 74, 126, 74, 116, 60),
(7, 4,  14, 'Decidueye', 2, 78, 107, 75, 75, 100, 70),
(7, 13, NULL, 'Lycanroc', 2, 75, 115, 65, 65, 65, 112),
(7, 5,  11, 'Alolan-Raichu', 2, 60, 85, 95, 50, 85, 110),
(7, 6,  17, 'Alolan-Sandslash', 2, 75, 100, 65, 120, 75, 65),
(7, 1,  15, 'Drampa', 1, 78, 60, 135, 54, 91, 36),
(7, 15, 7, 'Kommo-o', 1, 75, 110, 100, 125, 105, 85),
(7, 2,  15, 'Turtonator', 2, 60, 78, 91, 135, 91, 36),
(8, 2,  NULL, 'Scorbunny', 3, 50, 71, 45, 40, 40, 69),
(8, 3,  NULL, 'Sobble', 3, 50, 40, 70, 40, 40, 70),
(8, 4,  NULL, 'Grookey', 3, 50, 65, 40, 50, 40, 65),
(8, 2,  NULL, 'Cinderace', 2, 80, 116, 65, 75, 75, 119),
(8, 3,  NULL, 'Inteleon', 2, 70, 85, 125, 65, 65, 120),
(8, 4,  NULL, 'Rillaboom', 2, 100, 125, 60, 90, 70, 85),
(8, 7,  NULL, 'Falinks', 2, 65, 100, 70, 100, 60, 75),
(8, 5,  15, 'Dracozolt', 1, 90, 100, 80, 90, 60, 75),
(8, 3,  6, 'Arctovish', 1, 90, 90, 80, 90, 80, 55),
(8, 17, NULL, 'Copperajah', 2, 122, 130, 80, 69, 69, 30),
(8, 16, 15, 'Dragapult', 1, 88, 120, 100, 75, 75, 142),
(8, 18, NULL, 'Alcremie', 2, 65, 60, 110, 75, 121, 64),
(1, 11, NULL, 'Mewtwo', 1, 106, 110, 154, 90, 90, 130),
(1, 11, NULL, 'Mew', 1, 100, 100, 100, 100, 100, 100),
(2, 11, 10, 'Lugia', 1, 106, 90, 90, 130, 154, 110),
(2, 2,  10, 'Ho-Oh', 1, 106, 130, 110, 90, 154, 90),
(3, 15, 10, 'Rayquaza', 1, 105, 150, 150, 90, 90, 95),
(3, 15, 11, 'Latios', 1, 80, 90, 130, 80, 110, 110),
(3, 15, 11, 'Latias', 1, 80, 80, 110, 80, 130, 110),
(4, 17, 15, 'Dialga', 1, 100, 120, 150, 120, 100, 90),
(4, 3,  15, 'Palkia', 1, 90, 120, 150, 100, 120, 100),
(4, 14, 15, 'Giratina', 1, 150, 100, 100, 120, 120, 90),
(5, 5,  15, 'Zekrom', 1, 100, 150, 120, 120, 100, 90),
(5, 15, 2, 'Reshiram', 1, 100, 120, 150, 100, 120, 90),
(6, 18, NULL, 'Xerneas', 1, 126, 131, 131, 95, 98, 99),
(6, 16, 10, 'Yveltal', 1, 126, 131, 131, 95, 98, 99),
(7, 18, 17, 'Magearna', 1, 80, 95, 130, 115, 115, 65),
(8, 14, NULL, 'Spectrier', 1, 100, 65, 145, 60, 80, 130);

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
('Brock', 90, 60),
('Misty', 160, 55),
('Lance', 275, 40),
('Ash', 195, 85),
('Dawn', 210, 50),
('May', 205, 48),
('Serena', 175, 65),
('Lillie', 130, 72),
('Hop', 95, 88),
('Marnie', 200, 60),
('Raihan', 230, 55),
('Leon', 380, 15),
('Gloria', 185, 62),
('Victor', 190, 58),
('Nessa', 215, 45),
('Bea', 240, 38),
('Allister', 155, 70),
('Piers', 170, 75),
('Sonia', 145, 80),
('Zinnia', 260, 35),
('Archie', 150, 85),
('Maxie', 155, 82),
('Cyrus', 200, 60),
('Ghetsis', 220, 50),
('Lysandre', 210, 55),
('Lusamine', 235, 45),
('Kukui', 280, 32);

/* =========================
   TEAM SEEDS
========================= */

DECLARE @TeamSeeds TABLE (
    UserName NVARCHAR(50) NOT NULL,
    TeamName NVARCHAR(50) NOT NULL,
    TemplateName NVARCHAR(50) NOT NULL,
    PRIMARY KEY (UserName, TeamName)
);

INSERT INTO @TeamSeeds (UserName, TeamName, TemplateName)
VALUES
('Red', 'Red Kanto Legends', 'KANTO_LEGENDS'),
('Red', 'Red Legendary Backup', 'RED_BACKUP'),
('Steven', 'Steven Hoenn Squad', 'HOENN_SQUAD'),
('Blue', 'Blue Mixed Team', 'MIXED_BALANCE'),
('Iris', 'Iris Dragon Force', 'DRAGON_FORCE'),
('Cynthia', 'Cynthia Sinnoh Elite', 'SINNOH_ELITE'),
('Misty', 'Misty Water World', 'WATER_WORLD'),
('Lance', 'Lance Dragon Masters', 'DRAGON_FORCE'),
('Ash', 'Ash All-Stars', 'ASH_ALLSTARS'),
('Ash', 'Ash Kanto Classics', 'KANTO_CLASSICS'),
('Dawn', 'Dawn Sinnoh Crew', 'SINNOH_CREW'),
('May', 'May Hoenn Journey', 'HOENN_SQUAD'),
('Serena', 'Serena Kalos Charm', 'KALOS_CHARM'),
('Lillie', 'Lillie Alola Dreams', 'ALOLA_DREAMS'),
('Hop', 'Hop Galar Rookies', 'GALAR_ROOKIES'),
('Marnie', 'Marnie Dark Rising', 'DARK_RISING'),
('Raihan', 'Raihan Storm Chasers', 'RAIHAN_STORM'),
('Leon', 'Leon Champion Run', 'CHAMPION_RUN'),
('Gloria', 'Gloria Galar Wildcards', 'GALAR_ROOKIES'),
('Victor', 'Victor Balance Build', 'MIXED_BALANCE'),
('Nessa', 'Nessa Tide Surge', 'WATER_WORLD'),
('Bea', 'Bea Fighting Spirit', 'FIGHTING_SPIRIT'),
('Allister', 'Allister Ghost Parade', 'GHOST_PARADE'),
('Piers', 'Piers Dark Stage', 'DARK_RISING'),
('Sonia', 'Sonia Research Team', 'SONIA_RESEARCH'),
('Zinnia', 'Zinnia Lorekeeper', 'DRAGON_FORCE'),
('Archie', 'Archie Sea Marauders', 'SEA_MARAUDERS'),
('Maxie', 'Maxie Land Expanders', 'LAND_EXPANDERS'),
('Cyrus', 'Cyrus New World Order', 'WORLD_ORDER'),
('Ghetsis', 'Ghetsis Liberation Front', 'UNOVA_POWER'),
('Lysandre', 'Lysandre Ultimate Beauty', 'KALOS_CHAOS'),
('Lusamine', 'Lusamine Ultra Collection', 'ULTRA_COLLECTION'),
('Kukui', 'Kukui Island Trials', 'ISLAND_TRIALS');

INSERT INTO {{SCHEMA}}.[Team] (UserId, TeamName)
SELECT U.UserId, S.TeamName
FROM @TeamSeeds S
INNER JOIN {{SCHEMA}}.[User] U
    ON U.UserName = S.UserName;

/* Brock intentionally has no team for sanity checks. */

/* =========================
   TEAM TEMPLATES
========================= */

DECLARE @TeamTemplates TABLE (
    TemplateName NVARCHAR(50) NOT NULL,
    TeamNumber INT NOT NULL,
    SpeciesName NVARCHAR(50) NOT NULL,
    PokemonLevel INT NOT NULL,
    Ability NVARCHAR(50) NOT NULL,
    Nature NVARCHAR(50) NOT NULL,
    PRIMARY KEY (TemplateName, TeamNumber)
);

INSERT INTO @TeamTemplates (TemplateName, TeamNumber, SpeciesName, PokemonLevel, Ability, Nature)
VALUES
('KANTO_LEGENDS', 1, 'Charizard', 85, 'Blaze', 'Brave'),
('KANTO_LEGENDS', 2, 'Blastoise', 84, 'Torrent', 'Calm'),
('KANTO_LEGENDS', 3, 'Venusaur', 84, 'Overgrow', 'Modest'),
('KANTO_LEGENDS', 4, 'Raichu', 80, 'Static', 'Jolly'),
('KANTO_LEGENDS', 5, 'Gengar', 82, 'Cursed Body', 'Timid'),
('KANTO_LEGENDS', 6, 'Dragonite', 83, 'Inner Focus', 'Serious'),

('RED_BACKUP', 1, 'Mewtwo', 70, 'Pressure', 'Serious'),
('RED_BACKUP', 2, 'Mew', 70, 'Synchronize', 'Hardy'),
('RED_BACKUP', 3, 'Golem', 68, 'Sturdy', 'Relaxed'),
('RED_BACKUP', 4, 'Alakazam', 72, 'Inner Focus', 'Quirky'),
('RED_BACKUP', 5, 'Snorlax', 69, 'Immunity', 'Brave'),
('RED_BACKUP', 6, 'Lapras', 71, 'Water Absorb', 'Bold'),

('HOENN_SQUAD', 1, 'Metagross', 78, 'Clear Body', 'Jolly'),
('HOENN_SQUAD', 2, 'Salamence', 75, 'Intimidate', 'Adamant'),
('HOENN_SQUAD', 3, 'Blaziken', 74, 'Blaze', 'Serious'),
('HOENN_SQUAD', 4, 'Swampert', 76, 'Torrent', 'Calm'),
('HOENN_SQUAD', 5, 'Gardevoir', 73, 'Trace', 'Modest'),
('HOENN_SQUAD', 6, 'Flygon', 77, 'Levitate', 'Naive'),

('MIXED_BALANCE', 1, 'Charizard', 70, 'Blaze', 'Brave'),
('MIXED_BALANCE', 2, 'Espeon', 69, 'Synchronize', 'Lonely'),
('MIXED_BALANCE', 3, 'Garchomp', 72, 'Rough Skin', 'Impish'),
('MIXED_BALANCE', 4, 'Lucario', 70, 'Steadfast', 'Jolly'),
('MIXED_BALANCE', 5, 'Swampert', 68, 'Torrent', 'Relaxed'),
('MIXED_BALANCE', 6, 'Togekiss', 71, 'Serene Grace', 'Calm'),

('DRAGON_FORCE', 1, 'Dragonite', 72, 'Inner Focus', 'Jolly'),
('DRAGON_FORCE', 2, 'Garchomp', 70, 'Rough Skin', 'Adamant'),
('DRAGON_FORCE', 3, 'Flygon', 71, 'Levitate', 'Naive'),
('DRAGON_FORCE', 4, 'Haxorus', 69, 'Mold Breaker', 'Careful'),
('DRAGON_FORCE', 5, 'Hydreigon', 73, 'Levitate', 'Brave'),
('DRAGON_FORCE', 6, 'Salamence', 68, 'Moxie', 'Modest'),

('SINNOH_ELITE', 1, 'Garchomp', 80, 'Rough Skin', 'Jolly'),
('SINNOH_ELITE', 2, 'Lucario', 78, 'Steadfast', 'Adamant'),
('SINNOH_ELITE', 3, 'Roserade', 77, 'Natural Cure', 'Modest'),
('SINNOH_ELITE', 4, 'Bronzong', 79, 'Heatproof', 'Relaxed'),
('SINNOH_ELITE', 5, 'Froslass', 76, 'Snow Cloak', 'Timid'),
('SINNOH_ELITE', 6, 'Gastrodon', 78, 'Sticky Hold', 'Bold'),

('WATER_WORLD', 1, 'Lapras', 65, 'Water Absorb', 'Bold'),
('WATER_WORLD', 2, 'Blastoise', 63, 'Torrent', 'Calm'),
('WATER_WORLD', 3, 'Feraligatr', 62, 'Torrent', 'Relaxed'),
('WATER_WORLD', 4, 'Kingdra', 64, 'Swift Swim', 'Timid'),
('WATER_WORLD', 5, 'Slowpoke', 61, 'Oblivious', 'Sassy'),
('WATER_WORLD', 6, 'Samurott', 66, 'Torrent', 'Modest'),

('ASH_ALLSTARS', 1, 'Pikachu', 75, 'Static', 'Hardy'),
('ASH_ALLSTARS', 2, 'Charizard', 72, 'Blaze', 'Brave'),
('ASH_ALLSTARS', 3, 'Lucario', 70, 'Inner Focus', 'Jolly'),
('ASH_ALLSTARS', 4, 'Incineroar', 71, 'Blaze', 'Adamant'),
('ASH_ALLSTARS', 5, 'Greninja', 73, 'Protean', 'Timid'),
('ASH_ALLSTARS', 6, 'Sceptile', 69, 'Overgrow', 'Calm'),

('KANTO_CLASSICS', 1, 'Charmander', 60, 'Blaze', 'Quirky'),
('KANTO_CLASSICS', 2, 'Pikachu', 58, 'Static', 'Hardy'),
('KANTO_CLASSICS', 3, 'Slowpoke', 59, 'Oblivious', 'Docile'),
('KANTO_CLASSICS', 4, 'Eevee', 57, 'Run Away', 'Serious'),
('KANTO_CLASSICS', 5, 'Snorlax', 61, 'Immunity', 'Brave'),
('KANTO_CLASSICS', 6, 'Pidgeot', 62, 'Keen Eye', 'Jolly'),

('SINNOH_CREW', 1, 'Togekiss', 66, 'Serene Grace', 'Modest'),
('SINNOH_CREW', 2, 'Roserade', 64, 'Natural Cure', 'Bold'),
('SINNOH_CREW', 3, 'Luxray', 65, 'Rivalry', 'Timid'),
('SINNOH_CREW', 4, 'Staraptor', 63, 'Intimidate', 'Careful'),
('SINNOH_CREW', 5, 'Lucario', 67, 'Inner Focus', 'Calm'),
('SINNOH_CREW', 6, 'Garchomp', 62, 'Rough Skin', 'Adamant'),

('KALOS_CHARM', 1, 'Delphox', 68, 'Blaze', 'Modest'),
('KALOS_CHARM', 2, 'Sylveon', 67, 'Cute Charm', 'Calm'),
('KALOS_CHARM', 3, 'Gardevoir-M', 66, 'Pixilate', 'Timid'),
('KALOS_CHARM', 4, 'Goodra', 65, 'Gooey', 'Sassy'),
('KALOS_CHARM', 5, 'Greninja', 69, 'Protean', 'Timid'),
('KALOS_CHARM', 6, 'Chesnaught', 64, 'Overgrow', 'Bold'),

('ALOLA_DREAMS', 1, 'Primarina', 62, 'Liquid Voice', 'Modest'),
('ALOLA_DREAMS', 2, 'Magearna', 60, 'Soul-Heart', 'Calm'),
('ALOLA_DREAMS', 3, 'Alolan-Raichu', 61, 'Surge Surfer', 'Timid'),
('ALOLA_DREAMS', 4, 'Sylveon', 59, 'Cute Charm', 'Quiet'),
('ALOLA_DREAMS', 5, 'Alolan-Sandslash', 63, 'Slush Rush', 'Careful'),
('ALOLA_DREAMS', 6, 'Togekiss', 58, 'Serene Grace', 'Bold'),

('GALAR_ROOKIES', 1, 'Cinderace', 58, 'Blaze', 'Jolly'),
('GALAR_ROOKIES', 2, 'Inteleon', 56, 'Torrent', 'Modest'),
('GALAR_ROOKIES', 3, 'Rillaboom', 55, 'Overgrow', 'Adamant'),
('GALAR_ROOKIES', 4, 'Falinks', 57, 'Battle Armor', 'Hardy'),
('GALAR_ROOKIES', 5, 'Dragapult', 54, 'Infiltrator', 'Naive'),
('GALAR_ROOKIES', 6, 'Copperajah', 59, 'Sheer Force', 'Brave'),

('DARK_RISING', 1, 'Zoroark', 68, 'Illusion', 'Jolly'),
('DARK_RISING', 2, 'Umbreon', 66, 'Synchronize', 'Sassy'),
('DARK_RISING', 3, 'Houndoom', 65, 'Flash Fire', 'Hasty'),
('DARK_RISING', 4, 'Spectrier', 67, 'Cursed Body', 'Quiet'),
('DARK_RISING', 5, 'Hydreigon', 69, 'Levitate', 'Adamant'),
('DARK_RISING', 6, 'Dragapult', 63, 'Infiltrator', 'Timid'),

('RAIHAN_STORM', 1, 'Garchomp', 72, 'Rough Skin', 'Jolly'),
('RAIHAN_STORM', 2, 'Flygon', 70, 'Levitate', 'Adamant'),
('RAIHAN_STORM', 3, 'Salamence', 71, 'Intimidate', 'Brave'),
('RAIHAN_STORM', 4, 'Dracozolt', 73, 'Static', 'Rash'),
('RAIHAN_STORM', 5, 'Dragapult', 68, 'Infiltrator', 'Bold'),
('RAIHAN_STORM', 6, 'Goodra', 74, 'Gooey', 'Calm'),

('CHAMPION_RUN', 1, 'Cinderace', 82, 'Blaze', 'Jolly'),
('CHAMPION_RUN', 2, 'Dragapult', 80, 'Infiltrator', 'Timid'),
('CHAMPION_RUN', 3, 'Lucario', 81, 'Steadfast', 'Adamant'),
('CHAMPION_RUN', 4, 'Copperajah', 79, 'Sturdy', 'Brave'),
('CHAMPION_RUN', 5, 'Raichu', 83, 'Lightning Rod', 'Modest'),
('CHAMPION_RUN', 6, 'Hydreigon', 78, 'Levitate', 'Adamant'),

('FIGHTING_SPIRIT', 1, 'Lucario', 72, 'Steadfast', 'Adamant'),
('FIGHTING_SPIRIT', 2, 'Conkeldurr', 70, 'Sheer Force', 'Brave'),
('FIGHTING_SPIRIT', 3, 'Blaziken', 71, 'Blaze', 'Jolly'),
('FIGHTING_SPIRIT', 4, 'Falinks', 69, 'Battle Armor', 'Careful'),
('FIGHTING_SPIRIT', 5, 'Kommo-o', 73, 'Soundproof', 'Naive'),
('FIGHTING_SPIRIT', 6, 'Chesnaught', 68, 'Bulletproof', 'Hardy'),

('GHOST_PARADE', 1, 'Gengar', 68, 'Cursed Body', 'Quiet'),
('GHOST_PARADE', 2, 'Spectrier', 66, 'Cursed Body', 'Timid'),
('GHOST_PARADE', 3, 'Froslass', 67, 'Snow Cloak', 'Sassy'),
('GHOST_PARADE', 4, 'Giratina', 65, 'Pressure', 'Modest'),
('GHOST_PARADE', 5, 'Dragapult', 69, 'Infiltrator', 'Bold'),
('GHOST_PARADE', 6, 'Decidueye', 64, 'Long Reach', 'Relaxed'),

('SONIA_RESEARCH', 1, 'Espeon', 62, 'Synchronize', 'Modest'),
('SONIA_RESEARCH', 2, 'Togekiss', 60, 'Serene Grace', 'Bold'),
('SONIA_RESEARCH', 3, 'Roserade', 61, 'Natural Cure', 'Calm'),
('SONIA_RESEARCH', 4, 'Eevee', 63, 'Run Away', 'Docile'),
('SONIA_RESEARCH', 5, 'Gardevoir', 59, 'Trace', 'Quirky'),
('SONIA_RESEARCH', 6, 'Luxray', 58, 'Static', 'Jolly'),

('SEA_MARAUDERS', 1, 'Lugia', 68, 'Pressure', 'Bold'),
('SEA_MARAUDERS', 2, 'Swampert', 65, 'Torrent', 'Calm'),
('SEA_MARAUDERS', 3, 'Kingdra', 66, 'Swift Swim', 'Timid'),
('SEA_MARAUDERS', 4, 'Feraligatr', 64, 'Torrent', 'Relaxed'),
('SEA_MARAUDERS', 5, 'Lapras', 67, 'Water Absorb', 'Sassy'),
('SEA_MARAUDERS', 6, 'Slowpoke', 63, 'Oblivious', 'Modest'),

('LAND_EXPANDERS', 1, 'Ho-Oh', 68, 'Pressure', 'Naughty'),
('LAND_EXPANDERS', 2, 'Blaziken', 65, 'Blaze', 'Brave'),
('LAND_EXPANDERS', 3, 'Golem', 66, 'Sturdy', 'Impish'),
('LAND_EXPANDERS', 4, 'Garchomp', 64, 'Rough Skin', 'Adamant'),
('LAND_EXPANDERS', 5, 'Metagross', 67, 'Clear Body', 'Calm'),
('LAND_EXPANDERS', 6, 'Flygon', 63, 'Levitate', 'Naive'),

('WORLD_ORDER', 1, 'Dialga', 78, 'Pressure', 'Serious'),
('WORLD_ORDER', 2, 'Palkia', 78, 'Pressure', 'Modest'),
('WORLD_ORDER', 3, 'Giratina', 76, 'Pressure', 'Quiet'),
('WORLD_ORDER', 4, 'Bronzong', 74, 'Heatproof', 'Relaxed'),
('WORLD_ORDER', 5, 'Garchomp', 75, 'Rough Skin', 'Hardy'),
('WORLD_ORDER', 6, 'Lucario', 73, 'Steadfast', 'Adamant'),

('UNOVA_POWER', 1, 'Reshiram', 80, 'Pressure', 'Brave'),
('UNOVA_POWER', 2, 'Zekrom', 78, 'Teravolt', 'Bold'),
('UNOVA_POWER', 3, 'Hydreigon', 76, 'Levitate', 'Serious'),
('UNOVA_POWER', 4, 'Haxorus', 75, 'Mold Breaker', 'Naive'),
('UNOVA_POWER', 5, 'Conkeldurr', 77, 'Guts', 'Calm'),
('UNOVA_POWER', 6, 'Zoroark', 74, 'Illusion', 'Timid'),

('KALOS_CHAOS', 1, 'Yveltal', 76, 'Dark Aura', 'Brave'),
('KALOS_CHAOS', 2, 'Houndoom', 74, 'Flash Fire', 'Hardy'),
('KALOS_CHAOS', 3, 'Zoroark', 75, 'Illusion', 'Timid'),
('KALOS_CHAOS', 4, 'Salamence', 73, 'Intimidate', 'Adamant'),
('KALOS_CHAOS', 5, 'Greninja', 77, 'Protean', 'Hasty'),
('KALOS_CHAOS', 6, 'Goodra', 72, 'Gooey', 'Calm'),

('ULTRA_COLLECTION', 1, 'Xerneas', 78, 'Fairy Aura', 'Bold'),
('ULTRA_COLLECTION', 2, 'Magearna', 76, 'Soul-Heart', 'Modest'),
('ULTRA_COLLECTION', 3, 'Sylveon', 74, 'Cute Charm', 'Calm'),
('ULTRA_COLLECTION', 4, 'Goodra', 75, 'Gooey', 'Sassy'),
('ULTRA_COLLECTION', 5, 'Primarina', 77, 'Liquid Voice', 'Modest'),
('ULTRA_COLLECTION', 6, 'Espeon', 73, 'Synchronize', 'Timid'),

('ISLAND_TRIALS', 1, 'Incineroar', 76, 'Blaze', 'Adamant'),
('ISLAND_TRIALS', 2, 'Primarina', 74, 'Liquid Voice', 'Modest'),
('ISLAND_TRIALS', 3, 'Decidueye', 75, 'Long Reach', 'Timid'),
('ISLAND_TRIALS', 4, 'Alolan-Raichu', 73, 'Surge Surfer', 'Hasty'),
('ISLAND_TRIALS', 5, 'Turtonator', 77, 'Shell Armor', 'Careful'),
('ISLAND_TRIALS', 6, 'Kommo-o', 74, 'Soundproof', 'Jolly');

/* =========================
   BUILD POKEMON AND TEAM MEMBERS
========================= */

DECLARE @TeamId INT;
DECLARE @TeamNumber INT;
DECLARE @SpeciesId INT;
DECLARE @PokemonLevel INT;
DECLARE @Ability NVARCHAR(50);
DECLARE @Nature NVARCHAR(50);
DECLARE @PokedexId INT;

DECLARE team_roster_cursor CURSOR LOCAL FAST_FORWARD FOR
SELECT
    T.TeamId,
    TT.TeamNumber,
    PS.SpeciesId,
    TT.PokemonLevel,
    TT.Ability,
    TT.Nature
FROM @TeamSeeds TS
INNER JOIN {{SCHEMA}}.[Team] T
    ON T.TeamName = TS.TeamName
INNER JOIN @TeamTemplates TT
    ON TT.TemplateName = TS.TemplateName
INNER JOIN {{SCHEMA}}.[PokemonSpecies] PS
    ON PS.SpeciesName = TT.SpeciesName
ORDER BY T.TeamId, TT.TeamNumber;

OPEN team_roster_cursor;

FETCH NEXT FROM team_roster_cursor
INTO @TeamId, @TeamNumber, @SpeciesId, @PokemonLevel, @Ability, @Nature;

WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO {{SCHEMA}}.[Pokemon] (SpeciesId, [Level], Ability, Nature)
    VALUES (@SpeciesId, @PokemonLevel, @Ability, @Nature);

    SET @PokedexId = SCOPE_IDENTITY();

    INSERT INTO {{SCHEMA}}.[TeamMember] (TeamId, PokedexId, TeamNumber)
    VALUES (@TeamId, @PokedexId, @TeamNumber);

    FETCH NEXT FROM team_roster_cursor
    INTO @TeamId, @TeamNumber, @SpeciesId, @PokemonLevel, @Ability, @Nature;
END;

CLOSE team_roster_cursor;
DEALLOCATE team_roster_cursor;

GO
