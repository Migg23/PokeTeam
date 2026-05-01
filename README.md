# PokéTeam

## Introduction
This project is a competitive Pokémon team-building web application. The purpose is for players who battle against friends, want to record teams, or just make an ideal team for themselves. This project allows users to create as many teams as they want with whatever Pokémon they want, along with keeping stats on the user. The user has the ability to search for any Pokémon, add them to the team, and customize them to their preference. 

## Requirements
To run this project, we use a combination of resources to connect the project. The primary language of the project is Python, where we use version 3.10. Technologies like Flask and mssql are used, however a requirements.txt file is included, which can be run to download the imports used. A local environment must be used and have a certain structure to be able to run the project.

- DB_HOST=ksus server
- DB_PORT=port
- DB_NAME=database name
- DB_USER=temo
- DB_PASSWORD=temp
- DB_SCHEMA=dbo <- use this
- BASE_URL=https://pokeapi.co/api/v2/pokemon
<br/>
This is required because the original structure of the project was designed for multiple schemas, which fell apart later on, but it was too late to change.
The next thing to do would be to seed the database with the rebuild Python file, which can be run as src.db.rebuild, assuming that you are in your virtual environment. Next, you would need to start the Flask development server with -m flask --app src.web.app run, which will start the app and connect the routes. Finally, a VS Code live preview extension is used to view the frontend since it is basic HTML/CSS/JS, but Tailwind CSS is imported.
AKA do this:

- src.db.rebuild
- -m flask --app src.web.app run
- Use live preview on the login HTML page
<br/>

Some notes: the project calls an API, so you need an internet connection. There were also errors with the HTTPS request, which were only resolved by configuring Python certificates.

## Architecture
This project is heavily inspired by the textbooks repository design. The idea being that there are layers that handle certain operations and keep the frontend and backend from being directly connected. In the src folder, there are four main folders where the layers are incorporated.
The data_access folder has a class that is responsible for establishing a connection to the database and executing queries from the repository classes. The db folder contains the rebuild Python file that seeds the database and resets it back to default data. 
The pokemonApp folder contains the stuff in the assignment. The most important stuff for the assignment is located in the SQL folder. This SQL folder contains the creation of the schema/tables and the insertion of the fake data. The real SQL code that is being sent to the database to be executed will be found inside the repository classes. Certain methods have hard-coded SQL queries where rows from the database are returned. Based on the operation, we parse these rows and
store the wanted information into the models, aka the objects. The frontend gets these models and displays the wanted information to the user. The web folder contains not only the basic HTML/CSS/JS, but also the Flask routes, which connect the frontend event handlers with the repositories in our pokemonApp.
