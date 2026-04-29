from flask import Blueprint
from src.data_access.sql_command_executor import SqlCommandExecutor
from src.pokemonApp.models.region import Region
from src.pokemonApp.sql_region_repository import SqlRegionRepository

region_routes = Blueprint("region_routes", __name__)

executor = SqlCommandExecutor()
region_repo = SqlRegionRepository(executor)

def serialize_region(region: Region) -> dict:
    return {
        "regionId": region.RegionId,
        "regionName": region.RegionName,
    }

@region_routes.route("/regions", methods=["GET"])
def get_all_regions():
    regions = region_repo.get_all_regions()
    return [serialize_region(r) for r in regions] if regions else []

@region_routes.route("/regions/<int:region_id>", methods=["GET"])
def get_region_by_id(region_id):
    region = region_repo.get_region_by_id(region_id)
    if region is None:
        return {"message": "Region not found"}, 404
    return serialize_region(region)
