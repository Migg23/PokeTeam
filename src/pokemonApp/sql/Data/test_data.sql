
USE cis560_s26_team8
INSERT INTO [Region] (RegionName)
VALUES 
('Kanto'),
('Johto'),
('Hoenn'),
('Sinnoh'),
('Unova'),
('Kalos'),
('Alola'),
('Galar');

INSERT INTO [Generation] (RegionId, GenerationName)
VALUES
(1, 'Generation I'),
(2, 'Generation II'),
(3, 'Generation III'),
(4, 'Generation IV'),
(5, 'Generation V'),
(6, 'Generation VI'),
(7, 'Generation VII'),
(8, 'Generation VIII');

INSERT INTO [Type] ([Name])
VALUES
('Normal'), ('Fire'), ('Water'), ('Grass'), ('Electric'),
('Ice'), ('Fighting'), ('Poison'), ('Ground'), ('Flying'),
('Psychic'), ('Bug'), ('Rock'), ('Ghost'), ('Dragon'),
('Dark'), ('Steel'), ('Fairy');

INSERT INTO [PokemonSpecies]
(GenerationId, TypeOneId, TypeTwoId, SpeciesName, Rarity, Hp, Atk, SpAtk, Def, SpDef, Speed)
VALUES
-- Gen 1
(1, 2, NULL, 'Charmander', 3, 39, 52, 60, 43, 50, 65),
(1, 3, NULL, 'Squirtle', 3, 44, 48, 50, 65, 64, 43),
(1, 4, 8, 'Bulbasaur', 3, 45, 49, 65, 49, 65, 45),

-- Gen 2
(2, 2, NULL, 'Cyndaquil', 3, 39, 52, 60, 43, 50, 65),
(2, 3, NULL, 'Totodile', 3, 50, 65, 44, 64, 48, 43),
(2, 4, NULL, 'Chikorita', 3, 45, 49, 49, 65, 65, 45),

-- Gen 3
(3, 2, NULL, 'Torchic', 3, 45, 60, 70, 40, 50, 45),
(3, 3, NULL, 'Mudkip', 3, 50, 70, 50, 50, 50, 40),
(3, 4, NULL, 'Treecko', 3, 40, 45, 65, 35, 55, 70),

-- Popular Pokémon
(1, 5, NULL, 'Pikachu', 2, 35, 55, 50, 40, 50, 90),
(1, 1, NULL, 'Eevee', 2, 55, 55, 45, 50, 65, 55),
(4, 15, NULL, 'Gible', 1, 58, 70, 40, 45, 45, 42);

INSERT INTO [Pokemon] (SpeciesId, Level, Ability, Nature)
VALUES
(1, 12, 'Blaze', 'Brave'),
(2, 10, 'Torrent', 'Calm'),
(3, 11, 'Overgrow', 'Modest'),
(4, 14, 'Blaze', 'Hasty'),
(5, 16, 'Torrent', 'Adamant'),
(6, 13, 'Overgrow', 'Bold'),
(7, 18, 'Blaze', 'Lonely'),
(8, 15, 'Torrent', 'Relaxed'),
(9, 17, 'Overgrow', 'Timid'),
(10, 22, 'Static', 'Jolly'),
(11, 20, 'Adaptability', 'Serious'),
(12, 25, 'Sand Veil', 'Impish'),
(1, 30, 'Blaze', 'Hardy'),
(2, 28, 'Torrent', 'Quiet'),
(3, 26, 'Overgrow', 'Naive'),
(10, 33, 'Static', 'Rash'),
(11, 29, 'Adaptability', 'Docile'),
(12, 35, 'Sand Veil', 'Careful'),
(7, 21, 'Blaze', 'Sassy'),
(8, 19, 'Torrent', 'Gentle');

INSERT INTO [User] (UserName, Wins, Losses)
VALUES
('Miguel', 10, 2),
('Bradyn', 20, 5),
('Ash', 999, 3),
('Misty', 120, 40),
('Brock', 200, 60),
('Cynthia', 500, 10);

INSERT INTO [Team] (UserId, TeamName)
VALUES
(1, 'Miguel Alpha'),
(2, 'Bradyn Omega'),
(3, 'Ash Ketchum Squad'),
(4, 'Misty Water Force'),
(5, 'Brock Rock Smashers'),
(6, 'Cynthia Elite Team');

INSERT INTO [TeamMember] (TeamId, PokemonId, TeamNumber)
VALUES
-- Miguel
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6),

-- Bradyn
(2, 7, 1), (2, 8, 2), (2, 9, 3), (2, 10, 4), (2, 11, 5), (2, 12, 6),

-- Ash
(3, 10, 1), (3, 13, 2), (3, 14, 3), (3, 15, 4), (3, 16, 5), (3, 17, 6),

-- Misty
(4, 2, 1), (4, 5, 2), (4, 8, 3), (4, 20, 4), (4, 3, 5), (4, 9, 6),

-- Brock
(5, 11, 1), (5, 12, 2), (5, 18, 3), (5, 19, 4), (5, 6, 5), (5, 4, 6),

-- Cynthia
(6, 12, 1), (6, 17, 2), (6, 18, 3), (6, 19, 4), (6, 20, 5), (6, 16, 6);
