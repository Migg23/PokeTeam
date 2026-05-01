from flask import Flask
from flask_cors import CORS

from src.web.routes.aggregate_route import aggregate_routes
from src.web.routes.generation_route import generation_routes
from src.web.routes.pokemon_route import pokemon_routes
from src.web.routes.region_route import region_routes
from src.web.routes.user_route import user_routes
from src.web.routes.team_member_route import team_member_routes
from src.web.routes.team_route import team_routes
from src.web.routes.type_route import type_routes

app = Flask(__name__)
CORS(app)
app.register_blueprint(aggregate_routes)
app.register_blueprint(user_routes)
app.register_blueprint(team_routes)
app.register_blueprint(team_member_routes)
app.register_blueprint(pokemon_routes)
app.register_blueprint(generation_routes)
app.register_blueprint(region_routes)
app.register_blueprint(type_routes)


@app.route("/")
def home():
    return {"message": "Pokemon app API is running"}




if __name__ == '__main__':
    app.run()
