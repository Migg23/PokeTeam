from src.pokemonApp.i_aggregates_repository import IAggregatesRepository


class SqlAggregatesRepository(IAggregatesRepository):
    def __init__(self, executor):
        self.executor = executor

    def get_eligible_users_by_region(self, regionName):
        sql = f"""
            SELECT
                U.UserId,
                U.UserName,
                T.TeamId,
                T.TeamName
            FROM {self.executor.schema}.[User] U
                INNER JOIN {self.executor.schema}.Team T
                    ON T.UserId = U.UserId
                INNER JOIN {self.executor.schema}.TeamMember TM
                    ON TM.TeamId = T.TeamId
                INNER JOIN {self.executor.schema}.Pokemon P
                    ON P.PokedexId = TM.PokedexId
                INNER JOIN {self.executor.schema}.PokemonSpecies S
                    ON S.SpeciesId = P.SpeciesId
                INNER JOIN {self.executor.schema}.Generation G
                    ON G.GenId = S.GenerationId
                INNER JOIN {self.executor.schema}.Region R
                    ON R.RegionId = G.RegionId
            WHERE R.RegionName = %s
            GROUP BY
                U.UserId,
                U.UserName,
                T.TeamId,
                T.TeamName
            HAVING COUNT(*) = (
                SELECT COUNT(*)
                FROM {self.executor.schema}.TeamMember TM2
                WHERE TM2.TeamId = T.TeamId
            )
        """

        params = {"RegionName": regionName}

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection, params)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return []

        return [
            {
                "UserId": row["UserId"],
                "UserName": row["UserName"],
                "TeamId": row["TeamId"],
                "TeamName": row["TeamName"],
            }
            for row in rows_returned
        ]

    def get_team_total_stats(self):
        sql = f"""
            SELECT
                T.TeamId,
                SUM(S.HP) AS TotalHP,
                SUM(S.Atk) AS TotalAttack,
                SUM(S.Def) AS TotalDefense,
                SUM(S.SpAtk) AS TotalSpAttack,
                SUM(S.SpDef) AS TotalSpDefense,
                SUM(S.Speed) AS TotalSpeed,
                SUM(S.HP + S.Atk + S.Def + S.SpAtk + S.SpDef + S.Speed) AS OverallTotalStats,
                RANK() OVER (
                    ORDER BY SUM(S.HP + S.Atk + S.Def + S.SpAtk + S.SpDef + S.Speed) DESC
                ) AS TeamRank
            FROM {self.executor.schema}.Team T
                INNER JOIN {self.executor.schema}.TeamMember TM
                    ON TM.TeamId = T.TeamId
                INNER JOIN {self.executor.schema}.Pokemon P
                    ON P.PokedexId = TM.PokedexId
                INNER JOIN {self.executor.schema}.PokemonSpecies S
                    ON S.SpeciesId = P.SpeciesId
            GROUP BY T.TeamId
            ORDER BY OverallTotalStats DESC
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return []

        return [
            {
                "TeamId": row["TeamId"],
                "TotalHP": row["TotalHP"],
                "TotalAttack": row["TotalAttack"],
                "TotalDefense": row["TotalDefense"],
                "TotalSpAttack": row["TotalSpAttack"],
                "TotalSpDefense": row["TotalSpDefense"],
                "TotalSpeed": row["TotalSpeed"],
                "OverallTotalStats": row["OverallTotalStats"],
                "TeamRank": row["TeamRank"],
            }
            for row in rows_returned
        ]

    def get_type_usage_report(self):
        sql = f"""
            SELECT
                T.TypeId,
                T.Name AS TypeName,
                COUNT(*) AS TypeUsageCount,
                RANK() OVER (ORDER BY COUNT(*) DESC) AS TypeRank
            FROM {self.executor.schema}.Type T
                INNER JOIN {self.executor.schema}.PokemonSpecies S
                    ON S.TypeOneId = T.TypeId OR S.TypeTwoId = T.TypeId
                INNER JOIN {self.executor.schema}.Pokemon P
                    ON P.SpeciesId = S.SpeciesId
                INNER JOIN {self.executor.schema}.TeamMember TM
                    ON TM.PokedexId = P.PokedexId
            GROUP BY
                T.TypeId,
                T.Name
            ORDER BY TypeUsageCount DESC
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return []

        return [
            {
                "TypeId": row["TypeId"],
                "TypeName": row["TypeName"],
                "TypeUsageCount": row["TypeUsageCount"],
                "TypeRankDescription": f"Rank {row['TypeRank']}",
            }
            for row in rows_returned
        ]

    def get_species_usage_report(self):
        sql = f"""
            SELECT
                S.SpeciesId,
                S.SpeciesName,
                COUNT(TM.MemberId) AS UsageCount
            FROM {self.executor.schema}.PokemonSpecies S
                LEFT JOIN {self.executor.schema}.Pokemon P
                    ON P.SpeciesId = S.SpeciesId
                LEFT JOIN {self.executor.schema}.TeamMember TM
                    ON TM.PokedexId = P.PokedexId
            GROUP BY
                S.SpeciesId,
                S.SpeciesName
            ORDER BY UsageCount DESC
        """

        with self.executor.transaction_scope() as connection:
            temp = self.executor.execute_query(sql, connection)
            rows_returned = self.executor.get_all_rows(temp)

        if not rows_returned:
            return []

        return [
            {
                "SpeciesId": row["SpeciesId"],
                "SpeciesName": row["SpeciesName"],
                "UsageCount": row["UsageCount"],
            }
            for row in rows_returned
        ]
