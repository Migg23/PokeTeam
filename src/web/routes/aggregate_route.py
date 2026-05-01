from flask import Blueprint, request

from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.sql_aggregates_repository import SqlAggregatesRepository


aggregate_routes = Blueprint("aggregate_routes", __name__)

executor = SqlCommandExecutor()
aggregates_repo = SqlAggregatesRepository(executor)


@aggregate_routes.route("/aggregates/eligible-users", methods=["GET"])
def get_eligible_users_by_region():
    region_name = request.args.get("regionName")

    if not region_name:
        return {"message": "regionName is required"}, 400

    return aggregates_repo.get_eligible_users_by_region(region_name)


@aggregate_routes.route("/aggregates/team-stats", methods=["GET"])
def get_team_total_stats():
    return aggregates_repo.get_team_total_stats()


@aggregate_routes.route("/aggregates/type-usage", methods=["GET"])
def get_type_usage_report():
    return aggregates_repo.get_type_usage_report()


@aggregate_routes.route("/aggregates/species-usage", methods=["GET"])
def get_species_usage_report():
    return aggregates_repo.get_species_usage_report()
