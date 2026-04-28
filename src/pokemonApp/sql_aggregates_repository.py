from data_access.sql_runner import run_query


class SqlAggregatesRepository:

    # ---------------------------------------------------------
    # 1. Eligible Users by Region
    # ---------------------------------------------------------
    def get_eligible_users_by_region(self, regionName):
        sql = """
        SELECT 
            U.UserId,
            U.UserName,
            T.TeamId,
            T.TeamName
        FROM pokemon.User U
        JOIN pokemon.Team T 
            ON T.UserId = U.UserId
        JOIN pokemon.TeamMember TM 
            ON TM.TeamId = T.TeamId
        JOIN pokemon.Pokemon P 
            ON P.PokemonId = TM.PokemonId
        JOIN pokemon.PokemonSpecies S 
            ON S.SpeciesId = P.SpeciesId
        JOIN pokemon.Generation G 
            ON G.GenerationId = S.GenerationId
        JOIN pokemon.Region R 
            ON R.RegionId = G.RegionId
        WHERE R.RegionName = ?
        GROUP BY 
            U.UserId, U.UserName,
            T.TeamId, T.TeamName
        HAVING COUNT(*) = (
            SELECT COUNT(*)
            FROM pokemon.TeamMember TM2
            WHERE TM2.TeamId = T.TeamId
        );
        """
        rows = run_query(sql, (regionName,))
        return [
            {
                "UserId": r[0],
                "UserName": r[1],
                "TeamId": r[2],
                "TeamName": r[3]
            }
            for r in rows
        ]

    # ---------------------------------------------------------
    # 2. Team Total Stats + Ranking
    # ---------------------------------------------------------
    def get_team_total_stats(self):
        sql = """
        SELECT 
            T.TeamId,
            SUM(S.Hp) AS TotalHP,
            SUM(S.Atk) AS TotalAttack,
            SUM(S.Def) AS TotalDefense,
            SUM(S.SpAtk) AS TotalSpAttack,
            SUM(S.SpDef) AS TotalSpDefense,
            SUM(S.Speed) AS TotalSpeed,
            SUM(S.Hp + S.Atk + S.Def + S.SpAtk + S.SpDef + S.Speed) AS OverallTotalStats,
            RANK() OVER (
                ORDER BY SUM(S.Hp + S.Atk + S.Def + S.SpAtk + S.SpDef + S.Speed) DESC
            ) AS TeamRank
        FROM pokemon.Team T
        JOIN pokemon.TeamMember TM ON TM.TeamId = T.TeamId
        JOIN pokemon.Pokemon P ON P.PokemonId = TM.PokemonId
        JOIN pokemon.PokemonSpecies S ON S.SpeciesId = P.SpeciesId
        GROUP BY T.TeamId
        ORDER BY OverallTotalStats DESC;
        """
        rows = run_query(sql)
        return [
            {
                "TeamId": r[0],
                "TotalHP": r[1],
                "TotalAttack": r[2],
                "TotalDefense": r[3],
                "TotalSpAttack": r[4],
                "TotalSpDefense": r[5],
                "TotalSpeed": r[6],
                "OverallTotalStats": r[7],
                "TeamRank": r[8]
            }
            for r in rows
        ]

    # ---------------------------------------------------------
    # 3. Type Usage Frequency + Ranking
    # ---------------------------------------------------------
    def get_type_usage_report(self):
        sql = """
        SELECT 
            T.TypeId,
            T.Name AS TypeName,
            COUNT(*) AS TypeUsageCount,
            RANK() OVER (ORDER BY COUNT(*) DESC) AS TypeRank
        FROM pokemon.Type T
        JOIN pokemon.PokemonSpecies S 
            ON S.TypeOneId = T.TypeId OR S.TypeTwoId = T.TypeId
        JOIN pokemon.Pokemon P 
            ON P.SpeciesId = S.SpeciesId
        JOIN pokemon.TeamMember TM 
            ON TM.PokemonId = P.PokemonId
        GROUP BY T.TypeId, T.Name
        ORDER BY TypeUsageCount DESC;
        """
        rows = run_query(sql)
        return [
            {
                "TypeId": r[0],
                "TypeName": r[1],
                "TypeUsageCount": r[2],
                "TypeRankDescription": f"Rank {r[3]}"
            }
            for r in rows
        ]

    # ---------------------------------------------------------
    # 4. Species Usage Count (Most Common Pokémon)
    # ---------------------------------------------------------
    def get_species_usage_report(self):
        sql = """
        SELECT 
            S.SpeciesId,
            S.SpeciesName,
            COUNT(P.PokemonId) AS UsageCount
        FROM pokemon.PokemonSpecies S
        LEFT JOIN pokemon.Pokemon P 
            ON P.SpeciesId = S.SpeciesId
        LEFT JOIN pokemon.TeamMember TM 
            ON TM.PokemonId = P.PokemonId
        GROUP BY S.SpeciesId, S.SpeciesName
        ORDER BY UsageCount DESC;
        """
        rows = run_query(sql)
        return [
            {
                "SpeciesId": r[0],
                "SpeciesName": r[1],
                "UsageCount": r[2]
            }
            for r in rows
        ]
