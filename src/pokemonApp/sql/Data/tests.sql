USE cis560_s26_team8
SELECT 
    p.[PokemonId],
    s.[SpeciesName],
    t1.[Name] AS TypeOne,
    t2.[Name] AS TypeTwo,
    p.[Level],
    p.[Ability],
    p.[Nature]
FROM [Pokemon] p
JOIN [PokemonSpecies] s ON p.[SpeciesId] = s.[SpeciesId]
JOIN [Type] t1 ON s.[TypeOneId] = t1.[TypeId]
LEFT JOIN [Type] t2 ON s.[TypeTwoId] = t2.[TypeId]
ORDER BY p.[PokemonId];

SELECT 
    s.SpeciesName,
    t1.Name AS TypeOne,
    t2.Name AS TypeTwo
FROM PokemonSpecies s
JOIN Type t1 ON s.TypeOneId = t1.TypeId
LEFT JOIN Type t2 ON s.TypeTwoId = t2.TypeId
WHERE t1.Name = 'Fire' OR t2.Name = 'Fire';

SELECT TOP 1
    s.SpeciesName,
    s.Speed
FROM PokemonSpecies s
ORDER BY s.Speed DESC;

SELECT u.UserName
FROM [User] u
LEFT JOIN Team t ON u.UserId = t.UserId
WHERE t.TeamId IS NULL;

SELECT 
    UserName,
    Wins,
    Losses,
    Wins - Losses AS Score
FROM [User]
ORDER BY Score DESC;
