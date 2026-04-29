window.pokemonDatabase = [
    { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" },
    { id: 4, name: "Charmander", types: ["Fire"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" },
    { id: 7, name: "Squirtle", types: ["Water"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" },
    { id: 25, name: "Pikachu", types: ["Electric"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
    { id: 133, name: "Eevee", types: ["Normal"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png" },
    { id: 150, name: "Mewtwo", types: ["Psychic"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" },
    { id: 94, name: "Gengar", types: ["Ghost", "Poison"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" },
    { id: 143, name: "Snorlax", types: ["Normal"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" },
    { id: 130, name: "Gyarados", types: ["Water", "Flying"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png" },
    { id: 448, name: "Lucario", types: ["Fighting", "Steel"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" },
    { id: 282, name: "Gardevoir", types: ["Psychic", "Fairy"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png" },
    { id: 149, name: "Dragonite", types: ["Dragon", "Flying"], imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" }
];

window.State = {
    getTeams: () => {
        const teams = localStorage.getItem('teams');
        if (teams) return JSON.parse(teams);
        return [{ id: 'team-1', name: 'Team 1', members: [null, null, null, null, null, null] }];
    },
    saveTeams: (teams) => localStorage.setItem('teams', JSON.stringify(teams)),
    addTeam: () => {
        const teams = window.State.getTeams();
        teams.push({ id: 'team-' + Date.now(), name: 'Team ' + (teams.length + 1), members: [null, null, null, null, null, null] });
        window.State.saveTeams(teams);
    },
    deleteTeam: (id) => {
        let teams = window.State.getTeams();
        teams = teams.filter(t => t.id !== id);
        window.State.saveTeams(teams);
    },
    updateTeamMember: (teamId, slotIndex, memberData) => {
        const teams = window.State.getTeams();
        const team = teams.find(t => t.id === teamId);
        if(team) {
            team.members[slotIndex] = memberData;
            window.State.saveTeams(teams);
        }
    }
};