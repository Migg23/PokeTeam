// --- MOCK DATABASE ---
// Aligned with DB Schema: Uses 'speciesName' instead of 'name'
const pokedexDb = [
    { id: 1, speciesName: "Charizard", type1: "Fire", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", hp: 78, atk: 84, def: 78, spatk: 109, spdef: 85, speed: 100, rarity: "Rare", genId: 1 },
    { id: 2, speciesName: "Gengar", type1: "Ghost", type2: "Poison", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", hp: 60, atk: 65, def: 60, spatk: 130, spdef: 75, speed: 110, rarity: "Rare", genId: 1 },
    { id: 3, speciesName: "Garchomp", type1: "Dragon", type2: "Ground", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png", hp: 108, atk: 130, def: 95, spatk: 80, spdef: 85, speed: 102, rarity: "Rare", genId: 4 },
    { id: 4, speciesName: "Pikachu", type1: "Electric", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", hp: 35, atk: 55, def: 40, spatk: 50, spdef: 50, speed: 90, rarity: "Common", genId: 1 },
    { id: 5, speciesName: "Snorlax", type1: "Normal", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", hp: 160, atk: 110, def: 65, spatk: 65, spdef: 110, speed: 30, rarity: "Uncommon", genId: 1 },
    { id: 6, speciesName: "Gyarados", type1: "Water", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png", hp: 95, atk: 125, def: 79, spatk: 60, spdef: 100, speed: 81, rarity: "Uncommon", genId: 1 }
];

// --- LOCAL STORAGE MANAGER ---
function getTeams() {
    const stored = localStorage.getItem('pokeTeams');
    if (stored) return JSON.parse(stored);
    
    const defaultTeam = {
        id: Date.now().toString(),
        name: "My First Team",
        members: [null, null, null, null, null, null]
    };
    saveTeams([defaultTeam]);
    return [defaultTeam];
}

function saveTeams(teams) {
    localStorage.setItem('pokeTeams', JSON.stringify(teams));
}

// --- SHARED POKEDEX RENDERER ---
function renderPokedexSidebar(searchTerm = "") {
    const list = document.getElementById('pokedex-list');
    if (!list) return; 
    
    list.innerHTML = "";
    const filtered = pokedexDb.filter(p => p.speciesName.toLowerCase().includes(searchTerm.toLowerCase()));

    filtered.forEach(pokemon => {
        list.innerHTML += `
            <div class="pokemon-card bg-gray-50 border-2 border-gray-300 rounded-xl p-2 flex items-center gap-3 cursor-grab hover:border-blue-500 transition-all" 
                 draggable="true" ondragstart="drag(event, '${pokemon.speciesName}')">
                <img src="${pokemon.img}" alt="${pokemon.speciesName}" class="w-12 h-12" draggable="false">
                <div>
                    <div class="font-bold text-gray-800">${pokemon.speciesName}</div>
                    <div class="text-[10px] text-gray-500 uppercase tracking-wider">#${pokemon.id} | ${pokemon.type1} ${pokemon.type2 ? '/ ' + pokemon.type2 : ''}</div>
                </div>
            </div>
        `;
    });
    lucide.createIcons();
}

const searchInput = document.getElementById('pokedex-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => renderPokedexSidebar(e.target.value));
}


// ==========================================
// PAGE: MY TEAMS
// ==========================================
function initMyTeams() {
    const grid = document.getElementById('teams-grid');
    if (!grid) return;

    const teams = getTeams();
    grid.innerHTML = "";

    teams.forEach(team => {
        const filledCount = team.members.filter(m => m !== null).length;
        
        let dotsHtml = "";
        for(let i=0; i<6; i++) {
            if (team.members[i]) {
                dotsHtml += `<div class="w-10 h-10 rounded-full border-2 bg-blue-100 border-blue-500"></div>`;
            } else {
                dotsHtml += `<div class="w-10 h-10 rounded-full border-2 bg-gray-100 border-dashed border-gray-300"></div>`;
            }
        }

        grid.innerHTML += `
            <div class="bg-white rounded-2xl border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div class="bg-red-500 p-4 border-b-4 border-gray-900 flex items-center justify-between">
                    <h2 class="text-xl font-black text-white uppercase tracking-wide truncate pr-2">${team.name}</h2>
                    <button onclick="deleteTeam('${team.id}')" class="p-2 bg-red-700 rounded-lg text-red-100 hover:bg-red-800 transition-colors shrink-0" title="Delete Team">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="p-6 flex-1 flex flex-col items-center justify-center">
                    <div class="text-5xl font-black text-gray-200 mb-2">${filledCount}/6</div>
                    <div class="text-gray-500 font-bold uppercase text-sm mb-6">Members Filled</div>
                    <div class="flex gap-2 mb-6">${dotsHtml}</div>
                    <a href="teamMemberView.html?teamId=${team.id}" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition-all uppercase text-center block">
                        Edit Team
                    </a>
                </div>
            </div>
        `;
    });
    lucide.createIcons();
}

function addNewTeam() {
    const teams = getTeams();
    teams.push({
        id: Date.now().toString(),
        name: `New Team ${teams.length + 1}`,
        members: [null, null, null, null, null, null]
    });
    saveTeams(teams);
    initMyTeams(); 
}

function deleteTeam(id) {
    if(confirm("Are you sure you want to delete this team?")) {
        let teams = getTeams();
        teams = teams.filter(t => t.id !== id);
        saveTeams(teams);
        initMyTeams(); 
    }
}


// ==========================================
// PAGE: TEAM MEMBER EDIT
// ==========================================
let currentTeamId = null;
let currentTeam = null;

function initEditView() {
    if (!document.getElementById('team-grid')) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentTeamId = urlParams.get('teamId');

    const teams = getTeams();
    currentTeam = teams.find(t => t.id === currentTeamId);

    if (!currentTeam) {
        alert("Team not found! Returning to teams page.");
        window.location.href = "myTeams.html";
        return;
    }

    document.getElementById('team-name-input').value = currentTeam.name;
    renderSlots();
}

function updateTeamName(newName) {
    currentTeam.name = newName;
    saveCurrentTeamState();
}

function saveCurrentTeamState() {
    const teams = getTeams();
    const index = teams.findIndex(t => t.id === currentTeamId);
    if (index !== -1) {
        teams[index] = currentTeam;
        saveTeams(teams);
    }
}

// -- Drag/Drop Logic --
function allowDrop(ev) { ev.preventDefault(); ev.currentTarget.classList.add('border-green-400', 'bg-green-50'); }
function drag(ev, speciesName) { ev.dataTransfer.setData("speciesName", speciesName); }

document.querySelectorAll('.team-slot').forEach(slot => {
    slot.addEventListener('dragleave', function() { this.classList.remove('border-green-400', 'bg-green-50'); });
});

function drop(ev, slotIndex) {
    ev.preventDefault();
    const speciesName = ev.dataTransfer.getData("speciesName");
    
    currentTeam.members[slotIndex] = {
        speciesName: speciesName, 
        level: 50, 
        nature: "Hardy", 
        ability: "Default", 
        isEditing: false
    };
    saveCurrentTeamState();
    renderSlots();
}

// -- Slot Rendering --
function renderSlots() {
    if(!currentTeam) return;

    currentTeam.members.forEach((member, index) => {
        const slotDiv = document.getElementById(`slot-${index}`);
        
        if (!member) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-80 transition-all border-dashed border-gray-300 bg-gray-100";
            slotDiv.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none">
                    <div class="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-3"><span class="text-2xl font-black text-gray-300">?</span></div>
                    <p class="font-bold uppercase tracking-wider text-sm">Drag Pokémon Here</p>
                </div>`;
            return;
        }

        const pokeData = pokedexDb.find(p => p.speciesName === member.speciesName);

        if (member.isEditing) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[26rem] transition-all border-blue-400 bg-white shadow-lg";
            slotDiv.innerHTML = `
                <div class="p-2 bg-blue-50 border-b border-blue-200">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Quick Replace</label>
                    <input type="text" placeholder="Search Pokémon..." class="w-full text-sm p-1.5 border rounded" oninput="handleInlineSearch(event, ${index})">
                    <div id="search-results-${index}" class="absolute z-10 w-[calc(100%-1.5rem)] bg-white border shadow-lg max-h-32 overflow-y-auto hidden"></div>
                </div>
                
                <div class="p-3 flex-1 overflow-y-auto text-sm">
                    <div class="grid grid-cols-3 gap-2 mb-4">
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Level</label>
                            <input type="number" id="edit-level-${index}" value="${member.level}" min="1" max="100" class="w-full border rounded px-2 py-1 bg-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Nature</label>
                            <select id="edit-nature-${index}" class="w-full border rounded px-2 py-1 bg-white">
                                <option value="Hardy" ${member.nature === 'Hardy' ? 'selected' : ''}>Hardy</option>
                                <option value="Adamant" ${member.nature === 'Adamant' ? 'selected' : ''}>Adamant</option>
                                <option value="Jolly" ${member.nature === 'Jolly' ? 'selected' : ''}>Jolly</option>
                                <option value="Timid" ${member.nature === 'Timid' ? 'selected' : ''}>Timid</option>
                                <option value="Modest" ${member.nature === 'Modest' ? 'selected' : ''}>Modest</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Ability</label>
                            <select id="edit-ability-${index}" class="w-full border rounded px-2 py-1 bg-white">
                                <option value="Default" ${member.ability === 'Default' ? 'selected' : ''}>Default</option>
                                <option value="Blaze" ${member.ability === 'Blaze' ? 'selected' : ''}>Blaze</option>
                                <option value="Levitate" ${member.ability === 'Levitate' ? 'selected' : ''}>Levitate</option>
                                <option value="Intimidate" ${member.ability === 'Intimidate' ? 'selected' : ''}>Intimidate</option>
                            </select>
                        </div>
                    </div>

                    <div class="bg-gray-100 p-2 rounded border border-gray-200 mt-2">
                        <label class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Base Species Stats (Read-Only)</label>
                        <div class="grid grid-cols-4 gap-1 text-[10px] text-gray-700">
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">HP: <span class="font-bold">${pokeData.hp}</span></div>
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">Atk: <span class="font-bold">${pokeData.atk}</span></div>
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">Def: <span class="font-bold">${pokeData.def}</span></div>
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">SpA: <span class="font-bold">${pokeData.spatk}</span></div>
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">SpD: <span class="font-bold">${pokeData.spdef}</span></div>
                            <div class="bg-white px-1 py-0.5 rounded border border-gray-200">Spd: <span class="font-bold">${pokeData.speed}</span></div>
                            <div class="col-span-2 bg-white px-1 py-0.5 rounded border border-gray-200">Dex ID: <span class="font-bold">#${pokeData.id}</span></div>
                            <div class="col-span-2 bg-white px-1 py-0.5 rounded border border-gray-200">Gen: <span class="font-bold">${pokeData.genId}</span> | Rare: <span class="font-bold">${pokeData.rarity}</span></div>
                        </div>
                    </div>
                </div>

                <div class="p-2 border-t flex gap-2 bg-gray-50 shrink-0">
                    <button onclick="saveSlot(${index})" class="flex-1 bg-green-500 text-white font-bold py-1.5 rounded hover:bg-green-600 flex justify-center items-center gap-1"><i data-lucide="save" class="w-4 h-4"></i> Save</button>
                    <button onclick="deleteSlot(${index})" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>`;
        } else {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[26rem] transition-all border-gray-800 bg-white shadow-md group";
            slotDiv.innerHTML = `
                <div class="p-3 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center relative h-40 shrink-0">
                    <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onclick="toggleEdit(${index})" class="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="deleteSlot(${index})" class="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-colors" title="Remove"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                    <img src="${pokeData.img}" alt="${pokeData.speciesName}" class="w-20 h-20 object-contain drop-shadow-md z-0" draggable="false">
                    <div class="font-black text-gray-800 tracking-wide uppercase mt-1 z-0">${pokeData.speciesName}</div>
                    <div class="flex gap-1 mt-1 z-0">
                        <span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-800 text-white">${pokeData.type1}</span>
                        ${pokeData.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-500 text-white">${pokeData.type2}</span>` : ''}
                    </div>
                </div>

                <div class="p-4 bg-gray-50 border-t-2 border-gray-200 flex-1 flex flex-col relative justify-between">
                    <div class="grid grid-cols-2 gap-x-2 gap-y-3 text-sm mb-2">
                        <div><span class="font-bold text-gray-500">Lv:</span> ${member.level}</div>
                        <div><span class="font-bold text-gray-500">Nat:</span> ${member.nature}</div>
                        <div class="col-span-2"><span class="font-bold text-gray-500">Ability:</span> <span class="truncate">${member.ability}</span></div>
                    </div>

                    <div class="border-t border-gray-200 pt-3 mt-auto">
                        <div class="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                            <span>HP:${pokeData.hp}</span>
                            <span>A:${pokeData.atk}</span>
                            <span>D:${pokeData.def}</span>
                            <span>SA:${pokeData.spatk}</span>
                            <span>SD:${pokeData.spdef}</span>
                            <span>Sp:${pokeData.speed}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 text-center uppercase font-bold">Dex #${pokeData.id} • Gen ${pokeData.genId} • ${pokeData.rarity}</div>
                    </div>
                </div>`;
        }
    });
    lucide.createIcons();
}

function toggleEdit(index) { currentTeam.members[index].isEditing = true; renderSlots(); }
function deleteSlot(index) { currentTeam.members[index] = null; saveCurrentTeamState(); renderSlots(); }

function saveSlot(index) {
    currentTeam.members[index].level = document.getElementById(`edit-level-${index}`).value;
    currentTeam.members[index].nature = document.getElementById(`edit-nature-${index}`).value;
    currentTeam.members[index].ability = document.getElementById(`edit-ability-${index}`).value;
    currentTeam.members[index].isEditing = false;
    saveCurrentTeamState();
    renderSlots();
}

function handleInlineSearch(event, slotIndex) {
    const searchTerm = event.target.value.toLowerCase();
    const resultsContainer = document.getElementById(`search-results-${slotIndex}`);
    if (searchTerm.length < 1) { resultsContainer.classList.add('hidden'); return; }
    
    const filtered = pokedexDb.filter(p => p.speciesName.toLowerCase().includes(searchTerm));
    resultsContainer.innerHTML = "";
    filtered.forEach(pokemon => {
        resultsContainer.innerHTML += `
            <div class="p-2 border-b cursor-pointer hover:bg-blue-50 text-sm flex items-center gap-2" onclick="swapPokemon(${slotIndex}, '${pokemon.speciesName}')">
                <img src="${pokemon.img}" class="w-6 h-6">${pokemon.speciesName}
            </div>`;
    });
    resultsContainer.classList.remove('hidden');
}

function swapPokemon(slotIndex, newSpeciesName) {
    currentTeam.members[slotIndex].speciesName = newSpeciesName;
    saveCurrentTeamState();
    renderSlots();
}

// --- BOOTSTRAP APP ---
document.addEventListener("DOMContentLoaded", () => {
    renderPokedexSidebar();
    initMyTeams();
    initEditView();
});