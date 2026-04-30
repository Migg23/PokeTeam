const API_BASE_URL = window.POKETEAM_API_BASE_URL || "http://127.0.0.1:5000";

// ==========================================
// CLIENT-SIDE POKEDEX CATALOG
// Used for browsing and visuals while API-backed actions
// handle the actual create/update/delete work.
// ==========================================
const pokedexDb = [
    { id: 1, speciesName: "Charizard", type1: "Fire", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", hp: 78, atk: 84, def: 78, spatk: 109, spdef: 85, speed: 100, rarity: "Rare", genId: 1, region: "Kanto", abilities: ["Blaze", "Solar Power"] },
    { id: 2, speciesName: "Gengar", type1: "Ghost", type2: "Poison", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", hp: 60, atk: 65, def: 60, spatk: 130, spdef: 75, speed: 110, rarity: "Rare", genId: 1, region: "Kanto", abilities: ["Cursed Body"] },
    { id: 3, speciesName: "Garchomp", type1: "Dragon", type2: "Ground", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png", hp: 108, atk: 130, def: 95, spatk: 80, spdef: 85, speed: 102, rarity: "Rare", genId: 4, region: "Sinnoh", abilities: ["Sand Veil", "Rough Skin"] },
    { id: 4, speciesName: "Pikachu", type1: "Electric", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", hp: 35, atk: 55, def: 40, spatk: 50, spdef: 50, speed: 90, rarity: "Common", genId: 1, region: "Kanto", abilities: ["Static", "Lightning Rod"] },
    { id: 5, speciesName: "Snorlax", type1: "Normal", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", hp: 160, atk: 110, def: 65, spatk: 65, spdef: 110, speed: 30, rarity: "Uncommon", genId: 1, region: "Kanto", abilities: ["Immunity", "Thick Fat", "Gluttony"] },
    { id: 6, speciesName: "Gyarados", type1: "Water", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png", hp: 95, atk: 125, def: 79, spatk: 60, spdef: 100, speed: 81, rarity: "Uncommon", genId: 1, region: "Kanto", abilities: ["Intimidate", "Moxie"] }
];

const allNatures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];

// --- NEW: POKEMON TYPE COLORS ---
function getTypeColorClass(type) {
    const typeColors = {
        "Normal": "bg-gray-400 text-white",
        "Fire": "bg-red-500 text-white",
        "Water": "bg-blue-500 text-white",
        "Electric": "bg-yellow-400 text-yellow-900",
        "Grass": "bg-green-500 text-white",
        "Ice": "bg-cyan-300 text-cyan-900",
        "Fighting": "bg-red-700 text-white",
        "Poison": "bg-purple-500 text-white",
        "Ground": "bg-yellow-600 text-white",
        "Flying": "bg-sky-400 text-sky-900",
        "Psychic": "bg-pink-500 text-white",
        "Bug": "bg-lime-500 text-white",
        "Rock": "bg-yellow-800 text-white",
        "Ghost": "bg-purple-800 text-white",
        "Dragon": "bg-indigo-600 text-white",
        "Dark": "bg-gray-800 text-white",
        "Steel": "bg-slate-400 text-white",
        "Fairy": "bg-pink-300 text-pink-900"
    };
    return typeColors[type] || "bg-gray-500 text-white";
}

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
// USER PROFILE & TRAINER SEARCH LOGIC
// ==========================================
const mockTrainerDb = [
    { id: "TR-001", username: "AshKetchum", wins: 152, losses: 14, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { id: "TR-002", username: "GaryOak", wins: 240, losses: 3, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
    { id: "TR-003", username: "MistyWaterflower", wins: 85, losses: 22, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png" },
    { id: "TR-004", username: "BrockRock", wins: 95, losses: 18, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" },
    { id: "TR-005", username: "Cynthia", wins: 500, losses: 2, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png" }
];

function getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    if (stored) return JSON.parse(stored);

    const loginName = localStorage.getItem('trainerName') || "New Trainer";
    const defaultUser = {
        id: "TR-" + Math.floor(Math.random() * 9000 + 1000), 
        username: loginName,
        wins: 0,
        losses: 0,
        avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
    };
    
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
}

function renderTrainerSidebar() {
    const user = getCurrentUser();
    
    const nameEl = document.getElementById('profile-username');
    if(nameEl) {
        nameEl.textContent = user.username;
        document.getElementById('profile-userid').textContent = `ID: ${user.id}`;
        document.getElementById('profile-wins').textContent = user.wins;
        document.getElementById('profile-losses').textContent = user.losses;
        
        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) avatarEl.src = user.avatar;
    }
}

function openProfileModal() {
    const user = getCurrentUser();
    
    document.getElementById('edit-profile-name').value = user.username;
    document.getElementById('edit-profile-wins').value = user.wins;
    document.getElementById('edit-profile-losses').value = user.losses;

    const avatarSelect = document.getElementById('edit-profile-avatar');
    if(avatarSelect) {
        avatarSelect.value = user.avatar;
        if (!avatarSelect.value) avatarSelect.value = avatarSelect.options[0].value;
        
        const preview = document.getElementById('edit-avatar-preview');
        if(preview) preview.src = avatarSelect.value;
    }

    switchProfileTab('edit');

    document.getElementById('profile-modal').classList.remove('hidden');
    document.getElementById('profile-modal').classList.add('flex');
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.add('hidden');
    document.getElementById('profile-modal').classList.remove('flex');
}

function switchProfileTab(tabName) {
    const tabEditBtn = document.getElementById('tab-btn-edit');
    const tabSearchBtn = document.getElementById('tab-btn-search');
    const contentEdit = document.getElementById('tab-content-edit');
    const contentSearch = document.getElementById('tab-content-search');

    if (!tabEditBtn) return; 

    if (tabName === 'edit') {
        tabEditBtn.className = "flex-1 py-3 font-bold uppercase tracking-wider text-sm border-b-4 border-blue-600 text-blue-600 transition-colors";
        tabSearchBtn.className = "flex-1 py-3 font-bold uppercase tracking-wider text-sm border-b-4 border-transparent text-gray-500 hover:text-gray-800 transition-colors";
        contentEdit.classList.remove('hidden');
        contentSearch.classList.add('hidden');
    } else {
        tabSearchBtn.className = "flex-1 py-3 font-bold uppercase tracking-wider text-sm border-b-4 border-blue-600 text-blue-600 transition-colors";
        tabEditBtn.className = "flex-1 py-3 font-bold uppercase tracking-wider text-sm border-b-4 border-transparent text-gray-500 hover:text-gray-800 transition-colors";
        contentSearch.classList.remove('hidden');
        contentSearch.classList.add('flex');
        
        handleTrainerSearch(""); 
    }
}

function saveUserProfile() {
    const user = getCurrentUser();
    
    user.username = document.getElementById('edit-profile-name').value;
    user.avatar = document.getElementById('edit-profile-avatar').value;
    user.wins = parseInt(document.getElementById('edit-profile-wins').value) || 0;
    user.losses = parseInt(document.getElementById('edit-profile-losses').value) || 0;

    localStorage.setItem('currentUser', JSON.stringify(user));
    renderTrainerSidebar();
    closeProfileModal();
}

function deleteUserProfile() {
    if (confirm("WARNING: Are you sure you want to delete your profile? This cannot be undone.")) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('trainerName');
        localStorage.removeItem('pokeTeams'); 
        window.location.href = 'login.html'; 
    }
}

function handleTrainerSearch(query) {
    const container = document.getElementById('trainer-search-results');
    const q = query.toLowerCase();
    
    const results = mockTrainerDb.filter(t => 
        t.username.toLowerCase().includes(q) || 
        t.id.toLowerCase().includes(q)
    );

    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-400 font-bold uppercase text-sm py-8">No trainers found.</p>`;
        return;
    }

    results.forEach(trainer => {
        container.innerHTML += `
            <div class="bg-white border-2 border-gray-200 rounded-xl p-3 flex items-center gap-4 hover:border-blue-400 transition-colors">
                <img src="${trainer.avatar}" class="w-12 h-12 bg-gray-100 rounded-full border border-gray-300 object-contain p-1">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-gray-800 truncate">${trainer.username}</div>
                    <div class="text-[10px] text-gray-500 uppercase tracking-wider">${trainer.id}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs font-black text-green-600">${trainer.wins} W</div>
                    <div class="text-xs font-black text-red-600">${trainer.losses} L</div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// SHARED POKEDEX RENDERER
// ==========================================
function renderPokedexSidebar(searchTerm = "") {
    const list = document.getElementById('pokedex-list');
    if (!list) return; 
    
    list.innerHTML = "";
    const filtered = pokedexDb.filter(p => p.speciesName.toLowerCase().includes(searchTerm.toLowerCase()));

    filtered.forEach(pokemon => {
        // Also updated the sidebar to show the colored type badges
        list.innerHTML += `
            <div class="pokemon-card bg-gray-50 border-2 border-gray-300 rounded-xl p-2 flex items-center gap-3 cursor-grab hover:border-blue-500 transition-all"
                 draggable="true" ondragstart="drag(event, '${pokemon.speciesName}')">
                <img src="${pokemon.img}" alt="${pokemon.speciesName}" class="w-12 h-12" draggable="false">
                <div>
                    <div class="font-bold text-gray-800">${pokemon.speciesName}</div>
                    <div class="flex items-center gap-1 mt-1 text-[10px] text-gray-500 uppercase tracking-wider">
                        #${pokemon.id} | 
                        <span class="px-1.5 py-0.5 rounded-md ${getTypeColorClass(pokemon.type1)}">${pokemon.type1}</span>
                        ${pokemon.type2 ? `<span class="px-1.5 py-0.5 rounded-md ${getTypeColorClass(pokemon.type2)}">${pokemon.type2}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    if (window.lucide) lucide.createIcons();
}

const searchInput = document.getElementById('pokedex-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => renderPokedexSidebar(e.target.value));
}

// ==========================================
// PAGE: MY TEAMS
// ==========================================
async function initMyTeams() {
    const grid = document.getElementById("teams-grid");
    if (!grid) return;

    const userId = getTrainerUserId();
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    try {
        const teams = await apiGet(`/users/${userId}/teams`);
        grid.innerHTML = "";

        teams.forEach(team => {
            grid.innerHTML += `
                <div class="bg-white rounded-2xl border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                    <div class="bg-red-500 p-4 border-b-4 border-gray-900 flex items-center justify-between">
                        <h2 class="text-xl font-black text-white uppercase tracking-wide truncate pr-2">${team.teamName}</h2>
                        <button onclick="deleteTeam(${team.teamId})" class="p-2 bg-red-700 rounded-lg text-red-100 hover:bg-red-800 transition-colors shrink-0" title="Delete Team">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="p-6 flex-1 flex flex-col items-center justify-center">
                        <div class="text-5xl font-black text-gray-200 mb-2">Team</div>
                        <div class="text-gray-500 font-bold uppercase text-sm mb-6">Backend Connected</div>
                        <a href="teamMemberView.html?teamId=${team.teamId}" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition-all uppercase text-center block">
                            Edit Team
                        </a>
                    </div>
                </div>
            `;
        });

        if (window.lucide) lucide.createIcons();
    } catch (error) {
        grid.innerHTML = `<div class="text-red-600 font-bold">${error.message}</div>`;
    }
}

window.addNewTeam = async function addNewTeam() {
    toggleCreateTeamForm(true);
};

window.toggleCreateTeamForm = function toggleCreateTeamForm(forceOpen) {
    const panel = document.getElementById("create-team-panel");
    const errorText = document.getElementById("create-team-error");
    const input = document.getElementById("new-team-name");

    if (!panel) return;

    const shouldOpen = typeof forceOpen === "boolean"
        ? forceOpen
        : panel.classList.contains("hidden");

    panel.classList.toggle("hidden", !shouldOpen);

    if (errorText) {
        errorText.classList.add("hidden");
        errorText.textContent = "";
    }

    if (!shouldOpen && input) {
        input.value = "";
    }

    if (shouldOpen && input) {
        input.focus();
    }
};

window.submitCreateTeam = async function submitCreateTeam(event) {
    event.preventDefault();

    const userId = getTrainerUserId();
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const teamNameInput = document.getElementById("new-team-name");
    const errorText = document.getElementById("create-team-error");
    const submitButton = event.target.querySelector("button[type='submit']");
    const teamName = teamNameInput ? teamNameInput.value.trim() : "";

    if (!teamName) {
        if (errorText) {
            errorText.textContent = "Team name is required.";
            errorText.classList.remove("hidden");
        }
        return;
    }

    try {
        if (submitButton) submitButton.disabled = true;
        await apiPost(`/users/${userId}/teams/create`, { teamName });
        toggleCreateTeamForm(false);
        await initMyTeams();
    } catch (error) {
        if (errorText) {
            errorText.textContent = error.message;
            errorText.classList.remove("hidden");
        } else {
            alert(error.message);
        }
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
};

window.deleteTeam = async function deleteTeam(teamId) {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
        await apiPost(`/teams/${teamId}/delete`, {});
        await initMyTeams();
    } catch (error) {
        alert(error.message);
    }
};

// ==========================================
// PAGE: TEAM MEMBER EDIT
// ==========================================
async function hydrateCurrentTeam(teamId) {
    const team = await apiGet(`/teams/${teamId}`);
    const members = await apiGet(`/teams/${teamId}/members`);

    const hydratedMembers = [null, null, null, null, null, null];

    for (const member of members) {
        const pokemonData = await apiGet(`/pokemon/${member.pokedexId}`);
        const slotIndex = Math.max(0, Math.min(5, member.teamNumber - 1));
        hydratedMembers[slotIndex] = buildMemberFromApi(member, pokemonData);
    }

    currentTeam = {
        id: team.teamId,
        name: team.teamName,
        members: hydratedMembers,
    };
}

async function initEditView() {
    if (!document.getElementById("team-grid")) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentTeamId = urlParams.get("teamId");

    if (!currentTeam) {
        alert("Team not found! Returning to teams page.");
        window.location.href = "myTeams.html";
        return;
    }

    try {
        await hydrateCurrentTeam(currentTeamId);
        document.getElementById("team-name-input").value = currentTeam.name;
        renderSlots();
    } catch (error) {
        alert(error.message);
        window.location.href = "myteams.html";
    }
}

window.updateTeamName = async function updateTeamName(newName) {
    if (!currentTeam) return;

    try {
        const response = await apiPost(`/teams/${currentTeam.id}/update`, { teamName: newName });
        currentTeam.name = response.team.teamName;
        document.getElementById("team-name-input").value = currentTeam.name;
    } catch (error) {
        alert(error.message);
        document.getElementById("team-name-input").value = currentTeam.name;
    }
};

window.allowDrop = function allowDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add("border-green-400", "bg-green-50");
};

window.drag = function drag(ev, speciesName) {
    ev.dataTransfer.setData("speciesName", speciesName);
};

window.drop = async function drop(ev, slotIndex) {
    ev.preventDefault();
    const speciesName = ev.dataTransfer.getData("speciesName");
    const pokeData = pokedexDb.find(p => p.speciesName === speciesName);
    
    currentTeam.members[slotIndex] = {
        speciesName: speciesName, level: 50, nature: "Hardy", ability: pokeData ? pokeData.abilities[0] : "Default", isEditing: false
    };
    saveCurrentTeamState();
    renderSlots();
}

function renderSlots() {
    if (!currentTeam) return;

    currentTeam.members.forEach((member, index) => {
        const slotDiv = document.getElementById(`slot-${index}`);
        if (!slotDiv) return;

        if (!member) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[28rem] transition-all border-dashed border-gray-300 bg-gray-100";
            slotDiv.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none">
                    <div class="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-3"><span class="text-2xl font-black text-gray-300">?</span></div>
                    <p class="font-bold uppercase tracking-wider text-sm">Drag Pokémon Here</p>
                </div>`;
            return;
        }

        const abilityOptions = member.abilityOptions && member.abilityOptions.length > 0
            ? member.abilityOptions
            : [member.ability];
        const abilityOptionsHtml = abilityOptions
            .map(ab => `<option value="${ab}" ${member.ability === ab ? "selected" : ""}>${ab}</option>`)
            .join("");
        const natureOptionsHtml = allNatures
            .map(nat => `<option value="${nat}" ${member.nature === nat ? "selected" : ""}>${nat}</option>`)
            .join("");

        if (member.isEditing) {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[28rem] transition-all border-blue-400 bg-white shadow-lg";
            slotDiv.innerHTML = `
                <div class="p-3 bg-blue-50 flex flex-col items-center relative shrink-0 border-b-2 border-blue-200">
                    <button onclick="openSearchModal(${index})" class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg flex items-center justify-center shadow-md transition-colors" title="Replace Pokemon">
                        <i data-lucide="search" class="w-4 h-4"></i>
                    </button>
                    
                    <img src="${pokeData.img}" class="w-20 h-20 object-contain drop-shadow-md z-0" draggable="false">
                    <div class="font-black text-blue-900 tracking-wide uppercase mt-1 z-0 text-lg">${pokeData.speciesName}</div>
                    
                    <div class="w-full mt-3 grid grid-cols-2 gap-2 text-left">
                        <div class="col-span-2 flex gap-2">
                            <div class="w-1/3">
                                <label class="text-[9px] font-bold text-blue-800 uppercase tracking-wider">Level</label>
                                <input type="number" id="edit-level-${index}" value="${member.level}" min="1" max="100" class="w-full border-2 border-blue-300 rounded p-1.5 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none">
                            </div>
                            <div class="w-2/3">
                                <label class="text-[9px] font-bold text-blue-800 uppercase tracking-wider">Nature</label>
                                <select id="edit-nature-${index}" class="w-full border-2 border-blue-300 rounded p-1.5 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none">${natureOptionsHtml}</select>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label class="text-[9px] font-bold text-blue-800 uppercase tracking-wider">Exclusive Ability</label>
                            <select id="edit-ability-${index}" class="w-full border-2 border-blue-300 rounded p-1.5 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none">${abilityOptionsHtml}</select>
                        </div>
                    </div>
                </div>

                <div class="p-3 flex-1 overflow-y-auto flex flex-col justify-between bg-white relative">
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center w-full block">Base Species Stats</div>
                    <div class="grid grid-cols-3 gap-2 mb-2">
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">HP</div><div class="text-sm font-black text-gray-800">${pokeData.hp}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">ATK</div><div class="text-sm font-black text-gray-800">${pokeData.atk}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">DEF</div><div class="text-sm font-black text-gray-800">${pokeData.def}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SpA</div><div class="text-sm font-black text-gray-800">${pokeData.spatk}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SpD</div><div class="text-sm font-black text-gray-800">${pokeData.spdef}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SPD</div><div class="text-sm font-black text-gray-800">${pokeData.speed}</div></div>
                    </div>

                    <div class="border-t border-gray-200 pt-2 mt-auto text-center w-full">
                        <div class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Dex #${pokeData.id} • Gen ${pokeData.genId} • ${pokeData.region} • ${pokeData.rarity}</div>
                    </div>
                </div>

                <div class="p-2 border-t flex gap-2 bg-gray-50 shrink-0">
                    <button onclick="saveSlot(${index})" class="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 flex justify-center items-center gap-1 uppercase tracking-wider text-sm shadow-sm"><i data-lucide="save" class="w-4 h-4"></i> Save Profile</button>
                </div>`;
        } else {
            slotDiv.className = "team-slot relative rounded-xl border-4 flex flex-col overflow-hidden h-[28rem] transition-all border-gray-800 bg-white shadow-md group";
            slotDiv.innerHTML = `
                <div class="p-3 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center relative shrink-0 border-b-2 border-gray-200">
                    <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onclick="toggleEdit(${index})" class="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="deleteSlot(${index})" class="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-colors" title="Remove"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                    
                    <img src="${pokeData.img}" class="w-20 h-20 object-contain drop-shadow-md z-0" draggable="false">
                    <div class="font-black text-gray-800 tracking-wide uppercase mt-1 z-0 text-lg">${pokeData.speciesName}</div>
                    
                    <div class="flex gap-1 mt-1 z-0 mb-3">
                        <span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm ${getTypeColorClass(pokeData.type1)}">${pokeData.type1}</span>
                        ${pokeData.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm ${getTypeColorClass(pokeData.type2)}">${pokeData.type2}</span>` : ''}
                    </div>

                    <div class="w-full bg-white bg-opacity-70 rounded-lg p-2 text-center grid grid-cols-3 gap-1 shadow-sm border border-gray-300">
                        <div><span class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Lv</span> <span class="font-black text-gray-800">${member.level}</span></div>
                        <div><span class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Nature</span> <span class="font-bold text-gray-800 truncate block px-1">${member.nature}</span></div>
                        <div><span class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Ability</span> <span class="font-bold text-gray-800 truncate block px-1">${member.ability}</span></div>
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col relative justify-between bg-white">
                    <div class="grid grid-cols-3 gap-2 flex-1 content-start mt-2">
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">HP</span>
                            <span class="text-xl font-black text-green-500">${pokeData.hp}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ATK</span>
                            <span class="text-xl font-black text-red-500">${pokeData.atk}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DEF</span>
                            <span class="text-xl font-black text-blue-500">${pokeData.def}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SpA</span>
                            <span class="text-xl font-black text-purple-500">${pokeData.spatk}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SpD</span>
                            <span class="text-xl font-black text-yellow-500">${pokeData.spdef}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SPD</span>
                            <span class="text-xl font-black text-pink-500">${pokeData.speed}</span>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-3 mt-auto text-center w-full">
                        <div class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Dex #${pokeData.id} • Gen ${pokeData.genId} • ${pokeData.region} • ${pokeData.rarity}</div>
                    </div>
                </div>`;
        }
    });

    if (window.lucide) lucide.createIcons();
}

window.toggleEdit = async function toggleEdit(index) {
    try {
        const member = currentTeam.members[index];
        if (!member) return;

        await loadAbilityOptionsForMember(member);
        member.isEditing = true;
        renderSlots();
    } catch (error) {
        alert(error.message);
    }
};

window.deleteSlot = async function deleteSlot(index) {
    const member = currentTeam.members[index];
    if (!member || !member.memberId) return;

    try {
        await apiPost(`/members/${member.memberId}/delete`, {});
        currentTeam.members[index] = null;
        renderSlots();
    } catch (error) {
        alert(error.message);
    }
};

window.saveSlot = async function saveSlot(index) {
    const member = currentTeam.members[index];
    if (!member) return;

    const level = parseInt(document.getElementById(`edit-level-${index}`).value, 10);
    const nature = document.getElementById(`edit-nature-${index}`).value;
    const ability = document.getElementById(`edit-ability-${index}`).value;

    try {
        const response = await apiPost(`/pokemon/${member.pokedexId}/update`, {
            pokemonName: member.speciesName,
            level,
            modifier: nature,
            ability,
        });

        const updatedPokemon = response.pokemon;
        currentTeam.members[index] = {
            ...member,
            level: updatedPokemon.level,
            nature: updatedPokemon.modifier,
            ability: updatedPokemon.ability,
            abilityOptions: response.abilityOptions || member.abilityOptions,
            baseStats: updatedPokemon.baseStats,
            calculatedStats: updatedPokemon.calculatedStats,
            isEditing: false,
        };

        renderSlots();
    } catch (error) {
        alert(error.message);
    }
};

// ==========================================
// FULL SCREEN SEARCH MODAL & FILTERS
// ==========================================
function initModalFilters() {
    const naturesContainer = document.getElementById("modal-natures-container");
    if (naturesContainer) {
        naturesContainer.innerHTML = allNatures.map(nature => `
            <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors">
                <input type="checkbox" value="${nature}" class="filter-nature rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer" onchange="applyModalFilters()">
                <span class="text-sm font-medium text-gray-700">${nature}</span>
            </label>
        `).join("");
    }

    const uniqueAbilities = [...new Set(pokedexDb.flatMap(p => p.abilities))].sort();
    populateAbilityCheckboxes(uniqueAbilities);
}

function populateAbilityCheckboxes(abilityOptions) {
    const container = document.getElementById("modal-abilities-container");
    if (!container) return;

    container.innerHTML = "";

    if (!abilityOptions || abilityOptions.length === 0) {
        container.innerHTML = '<p class="text-[10px] text-gray-400 italic text-center">No abilities found.</p>';
        return;
    }

    abilityOptions.forEach(ability => {
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "filter-ability rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer";
        checkbox.value = ability;
        checkbox.onchange = applyModalFilters;

        const textSpan = document.createElement("span");
        textSpan.textContent = ability;
        textSpan.className = "text-sm font-medium text-gray-700";

        label.appendChild(checkbox);
        label.appendChild(textSpan);
        container.appendChild(label);
    });
}

window.openSearchModal = function openSearchModal(slotIndex = null) {
    activeSlotForModal = slotIndex;
    const modal = document.getElementById("full-screen-search");
    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        applyModalFilters();
    }
};

window.closeSearchModal = function closeSearchModal() {
    const modal = document.getElementById("full-screen-search");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
    activeSlotForModal = null;
};

window.applyModalFilters = function applyModalFilters() {
    const searchInput = document.getElementById("modal-search-text");
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    const checkedAbilities = Array.from(document.querySelectorAll(".filter-ability:checked")).map(cb => cb.value);

    const filteredPokemon = pokedexDb.filter(pokemon => {
        const matchesText = pokemon.speciesName.toLowerCase().includes(searchText);
        const matchesAbilities = checkedAbilities.length === 0 || checkedAbilities.every(ability => pokemon.abilities.includes(ability));
        return matchesText && matchesAbilities;
    });

    renderModalResults(filteredPokemon);
};

function renderModalResults(pokemonList) {
    const resultsContainer = document.getElementById("modal-results");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = pokemonList.map(p => `
        <div onclick="selectPokemonFromModal('${p.speciesName}')" class="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-red-500 hover:shadow-xl transition-all group">
            <img src="${p.img}" class="w-24 h-24 object-contain group-hover:scale-110 transition-transform mb-2" draggable="false">
            <div class="font-black text-gray-800 uppercase tracking-wide text-center">${p.speciesName}</div>
            <div class="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-wider">ID: #${p.id} • ${p.region}</div>
            
            <div class="flex gap-1 mt-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm ${getTypeColorClass(p.type1)}">${p.type1}</span>
                ${p.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm ${getTypeColorClass(p.type2)}">${p.type2}</span>` : ''}
            </div>
        </div>
    `).join("");

    if (window.lucide) lucide.createIcons();
}

window.selectPokemonFromModal = async function selectPokemonFromModal(speciesName) {
    const levelInput = document.getElementById("modal-level-slider");
    const levelVal = levelInput ? parseInt(levelInput.value, 10) : 50;

    const checkedNatures = Array.from(document.querySelectorAll(".filter-nature:checked")).map(cb => cb.value);
    const checkedAbilities = Array.from(document.querySelectorAll(".filter-ability:checked")).map(cb => cb.value);
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

    if (activeSlotForModal !== null) {
        currentTeam.members[activeSlotForModal] = newMember;
    } 
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
// NAVBAR EVENT HANDLERS
// ==========================================
function navigateToQuery(event, queryId) {
    event.preventDefault();
    sessionStorage.setItem('activeAggregateQuery', queryId);
    
    if (window.location.pathname.includes('querypage.html')) {
        if (typeof loadReportData === 'function') loadReportData();
    } else {
        window.location.href = 'querypage.html';
    }
}

function handleLogout(event) {
    event.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = 'login.html';
}

// ==========================================
// BOOTSTRAP APP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    if (document.getElementById('profile-username-display') || document.getElementById('profile-username')) {
        renderTrainerSidebar();
    }

    if (document.getElementById('pokedex-list') && typeof renderPokedexSidebar === "function") {
        renderPokedexSidebar();
    }
    
    if (document.getElementById('teams-grid')) {
        initMyTeams();
    }
    
    if (document.getElementById('full-screen-search')) {
        initEditView();
        initModalFilters();
        await initEditView();
    }
});
