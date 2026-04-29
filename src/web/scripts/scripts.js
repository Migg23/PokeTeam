// ==========================================
// MOCK DATABASE
// ==========================================
const pokedexDb = [
    { id: 1, speciesName: "Charizard", type1: "Fire", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", hp: 78, atk: 84, def: 78, spatk: 109, spdef: 85, speed: 100, rarity: "Rare", genId: 1, abilities: ["Blaze", "Solar Power"] },
    { id: 2, speciesName: "Gengar", type1: "Ghost", type2: "Poison", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", hp: 60, atk: 65, def: 60, spatk: 130, spdef: 75, speed: 110, rarity: "Rare", genId: 1, abilities: ["Cursed Body"] },
    { id: 3, speciesName: "Garchomp", type1: "Dragon", type2: "Ground", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png", hp: 108, atk: 130, def: 95, spatk: 80, spdef: 85, speed: 102, rarity: "Rare", genId: 4, abilities: ["Sand Veil", "Rough Skin"] },
    { id: 4, speciesName: "Pikachu", type1: "Electric", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", hp: 35, atk: 55, def: 40, spatk: 50, spdef: 50, speed: 90, rarity: "Common", genId: 1, abilities: ["Static", "Lightning Rod"] },
    { id: 5, speciesName: "Snorlax", type1: "Normal", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", hp: 160, atk: 110, def: 65, spatk: 65, spdef: 110, speed: 30, rarity: "Uncommon", genId: 1, abilities: ["Immunity", "Thick Fat", "Gluttony"] },
    { id: 6, speciesName: "Gyarados", type1: "Water", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png", hp: 95, atk: 125, def: 79, spatk: 60, spdef: 100, speed: 81, rarity: "Uncommon", genId: 1, abilities: ["Intimidate", "Moxie"] }
];

const allNatures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];

// ==========================================
// LOCAL STORAGE MANAGER
// ==========================================
function getTeams() {
    const stored = localStorage.getItem('pokeTeams');
    if (stored) return JSON.parse(stored);
    
    const defaultTeam = { id: Date.now().toString(), name: "My First Team", members: [null, null, null, null, null, null] };
    saveTeams([defaultTeam]);
    return [defaultTeam];
}

function saveTeams(teams) {
    localStorage.setItem('pokeTeams', JSON.stringify(teams));
}

// ==========================================
// SHARED POKEDEX RENDERING (Sidebar)
// ==========================================
function renderPokedexSidebar() {
    const list = document.getElementById('pokedex-list');
    if (!list) return; 
    
    list.innerHTML = "";
    pokedexDb.forEach(pokemon => {
        list.innerHTML += `
            <div class="pokemon-card bg-gray-50 border-2 border-gray-300 rounded-xl p-2 flex items-center gap-3 cursor-grab hover:border-blue-500 transition-all" 
                 draggable="true" ondragstart="drag(event, '${pokemon.speciesName}')">
                <img src="${pokemon.img}" alt="${pokemon.speciesName}" class="w-12 h-12" draggable="false">
                <div>
                    <div class="font-bold text-gray-800">${pokemon.speciesName}</div>
                    <div class="text-[10px] text-gray-500 uppercase tracking-wider">#${pokemon.id} | ${pokemon.type1}</div>
                </div>
            </div>
        `;
    });
    if(window.lucide) lucide.createIcons();
}

// ==========================================
// PAGE: MY TEAMS (myTeams.html)
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
    if(window.lucide) lucide.createIcons();
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
// PAGE: TEAM MEMBER EDIT (teamMemberView.html)
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
    const pokeData = pokedexDb.find(p => p.speciesName === speciesName);
    
    currentTeam.members[slotIndex] = {
        speciesName: speciesName, level: 50, nature: "Hardy", ability: pokeData.abilities[0], isEditing: false
    };
    saveCurrentTeamState();
    renderSlots();
}

// -- Slot Rendering --
function renderSlots() {
    if(!currentTeam) return;

    currentTeam.members.forEach((member, index) => {
        const slotDiv = document.getElementById(`slot-${index}`);
        if (!slotDiv) return;
        
        if (!member) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[26rem] transition-all border-dashed border-gray-300 bg-gray-100";
            slotDiv.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none">
                    <div class="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-3"><span class="text-2xl font-black text-gray-300">?</span></div>
                    <p class="font-bold uppercase tracking-wider text-sm">Drag Pokémon Here</p>
                </div>`;
            return;
        }

        const pokeData = pokedexDb.find(p => p.speciesName === member.speciesName);
        
        const abilityOptionsHtml = pokeData.abilities.map(ab => `<option value="${ab}" ${member.ability === ab ? 'selected' : ''}>${ab}</option>`).join('');
        const natureOptionsHtml = allNatures.map(nat => `<option value="${nat}" ${member.nature === nat ? 'selected' : ''}>${nat}</option>`).join('');

        if (member.isEditing) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[26rem] transition-all border-blue-400 bg-white shadow-lg";
            slotDiv.innerHTML = `
                <div class="p-4 bg-blue-50 border-b border-blue-200 flex justify-center">
                    <button onclick="openSearchModal(${index})" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-colors w-full justify-center uppercase tracking-wider text-sm">
                        <i data-lucide="search" class="w-4 h-4"></i> Search Database
                    </button>
                </div>
                
                <div class="p-3 flex-1 overflow-y-auto text-sm flex flex-col justify-center">
                    <div class="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Level</label>
                            <input type="number" id="edit-level-${index}" value="${member.level}" min="1" max="100" class="w-full border-2 border-gray-300 rounded-lg p-2 font-bold text-gray-800">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Nature</label>
                            <select id="edit-nature-${index}" class="w-full border-2 border-gray-300 rounded-lg p-2 font-bold text-gray-800">${natureOptionsHtml}</select>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-500 uppercase">Exclusive Ability</label>
                            <select id="edit-ability-${index}" class="w-full border-2 border-gray-300 rounded-lg p-2 font-bold text-gray-800">${abilityOptionsHtml}</select>
                        </div>
                    </div>
                </div>

                <div class="p-2 border-t flex gap-2 bg-gray-50 shrink-0">
                    <button onclick="saveSlot(${index})" class="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 flex justify-center items-center gap-1 uppercase tracking-wider text-sm"><i data-lucide="save" class="w-4 h-4"></i> Save</button>
                </div>`;
        } else {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[26rem] transition-all border-gray-800 bg-white shadow-md group";
            slotDiv.innerHTML = `
                <div class="p-3 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center relative h-48 shrink-0">
                    <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onclick="toggleEdit(${index})" class="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="deleteSlot(${index})" class="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-colors" title="Remove"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                    <img src="${pokeData.img}" class="w-24 h-24 object-contain drop-shadow-md z-0" draggable="false">
                    <div class="font-black text-gray-800 tracking-wide uppercase mt-2 text-lg z-0">${pokeData.speciesName}</div>
                    <div class="flex gap-1 mt-1 z-0">
                        <span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-800 text-white">${pokeData.type1}</span>
                        ${pokeData.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-500 text-white">${pokeData.type2}</span>` : ''}
                    </div>
                </div>

                <div class="p-4 bg-gray-50 border-t-2 border-gray-200 flex-1 flex flex-col relative justify-between">
                    <div class="flex justify-between items-center bg-white p-2 border-2 border-gray-200 rounded-lg mb-2">
                        <div class="text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">Level</div><div class="font-black text-gray-800">${member.level}</div></div>
                        <div class="text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">Nature</div><div class="font-bold text-gray-700">${member.nature}</div></div>
                    </div>
                    <div class="bg-white p-2 border-2 border-gray-200 rounded-lg text-center truncate mb-4">
                        <div class="text-[10px] text-gray-400 font-bold uppercase">Ability</div>
                        <div class="font-bold text-gray-700">${member.ability}</div>
                    </div>

                    <div class="border-t border-gray-200 pt-3 mt-auto">
                        <div class="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                            <span>HP:${pokeData.hp}</span><span>A:${pokeData.atk}</span><span>D:${pokeData.def}</span>
                            <span>SA:${pokeData.spatk}</span><span>SD:${pokeData.spdef}</span><span>Sp:${pokeData.speed}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 text-center uppercase font-bold">Dex #${pokeData.id} • Gen ${pokeData.genId} • ${pokeData.rarity}</div>
                    </div>
                </div>`;
        }
    });
    if(window.lucide) lucide.createIcons();
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

// ==========================================
// FULL SCREEN SEARCH MODAL & FILTERS
// ==========================================
let activeSlotForModal = null;

function initModalFilters() {
    const naturesContainer = document.getElementById('modal-natures-container');
    if(naturesContainer) {
        naturesContainer.innerHTML = allNatures.map(nature => `
            <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors">
                <input type="checkbox" value="${nature}" class="filter-nature rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer" onchange="applyModalFilters()">
                <span class="text-sm font-medium text-gray-700">${nature}</span>
            </label>
        `).join('');
    }

    const uniqueAbilities = [...new Set(pokedexDb.flatMap(p => p.abilities))].sort();
    populateAbilityCheckboxes(uniqueAbilities);
}

function populateAbilityCheckboxes(abilityOptions) {
    const container = document.getElementById('modal-abilities-container');
    if(!container) return;

    container.innerHTML = ''; 

    if (!abilityOptions || abilityOptions.length === 0) {
        container.innerHTML = '<p class="text-[10px] text-gray-400 italic text-center">No abilities found.</p>';
        return;
    }

    abilityOptions.forEach(ability => {
        const label = document.createElement('label');
        label.className = "flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors";

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "filter-ability rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer";
        checkbox.value = ability;
        checkbox.onchange = applyModalFilters;

        const textSpan = document.createElement('span');
        textSpan.textContent = ability;
        textSpan.className = "text-sm font-medium text-gray-700";

        label.appendChild(checkbox);
        label.appendChild(textSpan);
        container.appendChild(label);
    });
}

function openSearchModal(slotIndex = null) {
    activeSlotForModal = slotIndex;
    const modal = document.getElementById('full-screen-search');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        applyModalFilters(); 
    }
}

function closeSearchModal() {
    const modal = document.getElementById('full-screen-search');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    activeSlotForModal = null;
}

function applyModalFilters() {
    const searchInput = document.getElementById('modal-search-text');
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    
    const checkedAbilities = Array.from(document.querySelectorAll('.filter-ability:checked')).map(cb => cb.value);

    const filteredPokemon = pokedexDb.filter(p => {
        const matchesText = p.speciesName.toLowerCase().includes(searchText);
        const matchesAbilities = checkedAbilities.length === 0 || checkedAbilities.every(ability => p.abilities.includes(ability));
        return matchesText && matchesAbilities;
    });

    renderModalResults(filteredPokemon);
}

function renderModalResults(pokemonList) {
    const resultsContainer = document.getElementById('modal-results');
    if(!resultsContainer) return;

    resultsContainer.innerHTML = pokemonList.map(p => `
        <div onclick="selectPokemonFromModal('${p.speciesName}')" class="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-red-500 hover:shadow-xl transition-all group">
            <img src="${p.img}" class="w-24 h-24 object-contain group-hover:scale-110 transition-transform mb-2" draggable="false">
            <div class="font-black text-gray-800 uppercase tracking-wide text-center">${p.speciesName}</div>
            <div class="text-[10px] font-bold text-gray-400 uppercase mt-1">ID: #${p.id}</div>
            <div class="flex gap-1 mt-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-gray-800 text-white">${p.type1}</span>
                ${p.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-gray-500 text-white">${p.type2}</span>` : ''}
            </div>
        </div>
    `).join('');
    if(window.lucide) lucide.createIcons();
}

function selectPokemonFromModal(speciesName) {
    const pokeData = pokedexDb.find(p => p.speciesName === speciesName);
    
    const levelInput = document.getElementById('modal-level-slider');
    const levelVal = levelInput ? parseInt(levelInput.value) : 50;

    const checkedNatures = Array.from(document.querySelectorAll('.filter-nature:checked')).map(cb => cb.value);
    const checkedAbilities = Array.from(document.querySelectorAll('.filter-ability:checked')).map(cb => cb.value);

    const natureToApply = checkedNatures.length > 0 ? checkedNatures[0] : "Hardy";
    
    let abilityToApply = pokeData.abilities[0];
    if (checkedAbilities.length > 0 && pokeData.abilities.includes(checkedAbilities[0])) {
        abilityToApply = checkedAbilities[0];
    }

    const newMember = {
        speciesName: speciesName, 
        level: levelVal, 
        nature: natureToApply, 
        ability: abilityToApply, 
        isEditing: false
    };

    // Replace slot if we clicked "Search Database" from an empty/existing slot
    if (activeSlotForModal !== null) {
        currentTeam.members[activeSlotForModal] = newMember;
    } 
    // Add to first available slot if we clicked "Advanced Search" from the sidebar
    else {
        const emptySlotIndex = currentTeam.members.findIndex(member => member === null);
        
        if (emptySlotIndex !== -1) {
            currentTeam.members[emptySlotIndex] = newMember;
        } else {
            alert("Exception: You cannot add any more Pokémon to this team. Maximum 6 members allowed.");
            return; 
        }
    }

    saveCurrentTeamState();
    closeSearchModal();
    renderSlots();
}

// ==========================================
// BOOTSTRAP APP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('pokedex-list') && typeof renderPokedexSidebar === "function") renderPokedexSidebar();
    if (document.getElementById('teams-grid')) initMyTeams();
    
    if (document.getElementById('full-screen-search')) {
        initEditView();
        initModalFilters();
    }
});

// ==========================================
// BOOTSTRAP APP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // --- NEW: Load Trainer Profile Name ---
    const savedName = localStorage.getItem('trainerName');
    const profileNameEl = document.getElementById('profile-username');
    if (profileNameEl && savedName) {
        profileNameEl.textContent = savedName;
    }
    // --------------------------------------

    if (document.getElementById('pokedex-list') && typeof renderPokedexSidebar === "function") renderPokedexSidebar();
    if (document.getElementById('teams-grid')) initMyTeams();
    
    if (document.getElementById('full-screen-search')) {
        initEditView();
        initModalFilters();
    }
});