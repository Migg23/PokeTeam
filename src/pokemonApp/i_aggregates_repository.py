from abc import ABC, abstractmethod


class IAggregatesRepository(ABC):

    @abstractmethod
    def get_eligible_users_by_region(self, regionName: str) -> list[dict]:
        """
        Show all users who are eligible to play in a given region.
        A user is eligible only if every Pokémon on their team originates
        from the selected region’s generation.

        Parameters:
            regionName (str): The region to filter by (e.g., "Kanto").

        Returns:
            list[dict]: Each dict contains:
                - UserId
                - UserName
                - TeamId
                - TeamName
        """
        pass

    @abstractmethod
    def get_team_total_stats(self) -> list[dict]:
        """
        Summarize each team’s total combined Pokémon stats and rank teams
        from strongest to weakest.

        Returns:
            list[dict]: Each dict contains:
                - TeamId
                - TotalHP
                - TotalAttack
                - TotalDefense
                - TotalSpAttack
                - TotalSpDefense
                - TotalSpeed
                - OverallTotalStats
                - TeamRank
        """
        pass

    @abstractmethod
    def get_type_usage_report(self) -> list[dict]:
        """
        Determine which Pokémon types appear most frequently across all teams.
        Counts how many Pokémon of each type are used and ranks them.

        Returns:
            list[dict]: Each dict contains:
                - TypeId
                - TypeName
                - TypeUsageCount
                - TypeRankDescription
        """
        pass

    @abstractmethod
    def get_species_usage_report(self) -> list[dict]:
        """
        Count how many times each Pokémon species appears across all users’ teams.
        Sorted descending by usage count.

        Returns:
            list[dict]: Each dict contains:
                - SpeciesId
                - SpeciesName
                - UsageCount
        """
        pass
