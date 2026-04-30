USE cis560_s26_team8
SELECT 
    p.[PokedexId],
    s.[SpeciesName],
    t1.[Name] AS TypeOne,
    t2.[Name] AS TypeTwo,
    p.[Level],
    p.[Ability],
    p.[Nature]
FROM {{SCHEMA}}.[Pokemon] p
JOIN {{SCHEMA}}.[PokemonSpecies] s ON p.[SpeciesId] = s.[SpeciesId]
JOIN {{SCHEMA}}.[Type] t1 ON s.[TypeOneId] = t1.[TypeId]
LEFT JOIN {{SCHEMA}}.[Type] t2 ON s.[TypeTwoId] = t2.[TypeId]
ORDER BY p.[PokedexId];

SELECT 
    s.SpeciesName,
    t1.Name AS TypeOne,
    t2.Name AS TypeTwo
FROM {{SCHEMA}}.PokemonSpecies s
JOIN {{SCHEMA}}.[Type] t1 ON s.TypeOneId = t1.TypeId
LEFT JOIN {{SCHEMA}}.[Type] t2 ON s.TypeTwoId = t2.TypeId
WHERE t1.Name = 'Fire' OR t2.Name = 'Fire';

SELECT TOP 1
    s.SpeciesName,
    s.Speed
FROM {{SCHEMA}}.PokemonSpecies s
ORDER BY s.Speed DESC;

SELECT u.UserName
FROM {{SCHEMA}}.[User] u
LEFT JOIN {{SCHEMA}}.Team t ON u.UserId = t.UserId
WHERE t.TeamId IS NULL;

SELECT 
    UserName,
    Wins,
    Losses,
    Wins - Losses AS Score
FROM {{SCHEMA}}.[User]
ORDER BY Score DESC;
