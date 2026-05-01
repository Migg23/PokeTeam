const API_BASE_URL = window.POKETEAM_API_BASE_URL || "http://127.0.0.1:5000";

const allNatures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];

let currentTeam = null;
let activeSlotForModal = null;
let modalPreviewPokemon = null;

function slugifyPokemonName(name) {
    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/[\s.]+/g, "-");
}

function getPokemonSpriteUrl(name) {
    return `https://img.pokemondb.net/sprites/home/normal/${slugifyPokemonName(name)}.png`;
}

function getDefaultTrainerAvatar() {
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
}

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
// API HELPERS
// ==========================================
function buildFormBody(payload) {
    const body = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            body.append(key, value);
        }
    });

    return body;
}

async function apiGet(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}

async function apiPost(path, payload) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: buildFormBody(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}

function getTrainerUserId() {
    return localStorage.getItem('trainerUserId');
}

function getTrainerName() {
    return localStorage.getItem('trainerName');
}

function setTrainer(user) {
    localStorage.setItem('trainerUserId', user.userId);
    localStorage.setItem('trainerName', user.userName);
}

// ==========================================
// LOGIN FLOW
// ==========================================
async function loginOrCreateTrainer(username) {
    const trimmedName = username.trim();
    if (!trimmedName) {
        throw new Error("Trainer name is required");
    }

    const users = await apiGet("/users");
    const existingUser = users.find(
        user => user.userName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingUser) {
        setTrainer(existingUser);
        return existingUser;
    }

    const createdResponse = await apiPost("/users/create", {
        userName: trimmedName,
        wins: 0,
        losses: 0,
    });

    setTrainer(createdResponse.user);
    return createdResponse.user;
}

window.handleLogin = async function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input');
    const submitButton = event.target.querySelector("button[type='submit']");
    const username = usernameInput ? usernameInput.value : "";

    try {
        if (submitButton) submitButton.disabled = true;
        await loginOrCreateTrainer(username);
        window.location.href = "home.html";
    } catch (error) {
        alert(error.message);
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
};

// ==========================================
// USER PROFILE & TRAINER SEARCH LOGIC
// ==========================================
function getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    if (stored) return JSON.parse(stored);

    const trainerUserId = getTrainerUserId();
    const loginName = getTrainerName() || "New Trainer";
    const defaultUser = {
        id: trainerUserId || "",
        username: loginName,
        wins: 0,
        losses: 0,
        avatar: getDefaultTrainerAvatar(),
    };
    
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
}

function calculateWinRatio(wins, losses) {
    const totalBattles = wins + losses;
    if (totalBattles === 0) {
        return "0%";
    }

    return `${Math.round((wins / totalBattles) * 100)}%`;
}

async function renderTrainerSidebar() {
    let user = getCurrentUser();
    const trainerUserId = getTrainerUserId();
    const trainerName = getTrainerName();

    if (trainerUserId) {
        try {
            const routeUser = await apiGet(`/users/${trainerUserId}`);
            user = {
                ...user,
                id: routeUser.userId,
                username: routeUser.userName,
                wins: routeUser.wins,
                losses: routeUser.losses,
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            setTrainer(routeUser);
        } catch (error) {
            console.error("Unable to load trainer sidebar from routes:", error);
        }
    }
    
    const nameEl = document.getElementById('profile-username');
    if(nameEl) {
        nameEl.textContent = trainerName || user.username;
        document.getElementById('profile-userid').textContent = trainerUserId
            ? `ID: #${String(trainerUserId).padStart(5, "0")}`
            : `ID: ${user.id}`;
        document.getElementById('profile-wins').textContent = user.wins;
        document.getElementById('profile-losses').textContent = user.losses;
        document.getElementById('profile-win-ratio').textContent = calculateWinRatio(user.wins, user.losses);
        
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

async function saveUserProfile() {
    const user = getCurrentUser();
    const trainerUserId = getTrainerUserId();

    const updatedUserName = document.getElementById('edit-profile-name').value.trim();
    const winsValue = parseInt(document.getElementById('edit-profile-wins').value, 10);
    const lossesValue = parseInt(document.getElementById('edit-profile-losses').value, 10);

    if (!updatedUserName) {
        alert("Trainer name is required.");
        return;
    }

    if (Number.isNaN(winsValue) || Number.isNaN(lossesValue)) {
        alert("Wins and losses must be numbers.");
        return;
    }

    if (winsValue < 0 || lossesValue < 0) {
        alert("Wins and losses cannot be negative.");
        return;
    }

    user.username = updatedUserName;
    user.avatar = document.getElementById('edit-profile-avatar').value;
    user.wins = winsValue;
    user.losses = lossesValue;

    try {
        if (trainerUserId) {
            const response = await apiPost(`/users/${trainerUserId}/update`, {
                userName: user.username,
                wins: user.wins,
                losses: user.losses,
            });

            user.id = response.user.userId;
            user.username = response.user.userName;
            user.wins = response.user.wins;
            user.losses = response.user.losses;
            setTrainer(response.user);
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        await renderTrainerSidebar();
        closeProfileModal();
    } catch (error) {
        alert(error.message);
    }
}

async function handleTrainerSearch(query) {
    const container = document.getElementById('trainer-search-results');
    if (!container) return;

    const q = query.toLowerCase();
    container.innerHTML = `<p class="col-span-full text-center text-gray-400 font-bold uppercase text-sm py-8">Loading trainers...</p>`;

    try {
        const users = await apiGet("/users");
        const results = users.filter(trainer =>
            trainer.userName.toLowerCase().includes(q) ||
            String(trainer.userId).includes(q)
        );

        container.innerHTML = "";

        if (results.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-gray-400 font-bold uppercase text-sm py-8">No trainers found.</p>`;
            return;
        }

        results.forEach(trainer => {
            container.innerHTML += `
                <div class="bg-white border-2 border-gray-200 rounded-xl p-3 flex items-center gap-4 hover:border-blue-400 transition-colors">
                    <img src="${getDefaultTrainerAvatar()}" class="w-12 h-12 bg-gray-100 rounded-full border border-gray-300 object-contain p-1">
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-gray-800 truncate">${trainer.userName}</div>
                        <div class="text-[10px] text-gray-500 uppercase tracking-wider">#${String(trainer.userId).padStart(5, "0")}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs font-black text-green-600">${trainer.wins} W</div>
                        <div class="text-xs font-black text-red-600">${trainer.losses} L</div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        container.innerHTML = `<p class="col-span-full text-center text-red-500 font-bold uppercase text-sm py-8">${error.message}</p>`;
    }
}

// ==========================================
// SHARED POKEDEX RENDERER
// ==========================================
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
function buildMemberFromApi(member, pokemonData) {
    return {
        memberId: member.memberId,
        teamId: member.teamId,
        pokedexId: member.pokedexId,
        teamNumber: member.teamNumber,
        speciesName: pokemonData.pokemonName,
        speciesId: pokemonData.speciesId,
        level: pokemonData.level,
        nature: pokemonData.modifier,
        ability: pokemonData.ability,
        abilityOptions: pokemonData.abilityOptions || [],
        baseStats: pokemonData.baseStats,
        calculatedStats: pokemonData.calculatedStats,
        type1: pokemonData.typeOne,
        type2: pokemonData.typeTwo,
        genId: pokemonData.genId,
        genName: pokemonData.genName,
        region: pokemonData.regionName,
        rarity: pokemonData.rarityLabel,
        img: pokemonData.spriteUrl || getPokemonSpriteUrl(pokemonData.pokemonName),
        isEditing: false,
    };
}

function buildDraftMemberFromPreview(pokemonData, index, existingMember = null) {
    return {
        memberId: existingMember ? existingMember.memberId : null,
        teamId: currentTeam ? currentTeam.id : null,
        pokedexId: existingMember ? existingMember.pokedexId : null,
        teamNumber: index + 1,
        speciesName: pokemonData.pokemonName,
        speciesId: pokemonData.speciesId,
        level: pokemonData.level,
        nature: pokemonData.modifier,
        ability: pokemonData.ability || (pokemonData.abilityOptions ? pokemonData.abilityOptions[0] : ""),
        abilityOptions: pokemonData.abilityOptions || [],
        baseStats: pokemonData.baseStats,
        calculatedStats: pokemonData.calculatedStats,
        type1: pokemonData.typeOne,
        type2: pokemonData.typeTwo,
        genId: pokemonData.genId,
        genName: pokemonData.genName,
        region: pokemonData.regionName,
        rarity: pokemonData.rarityLabel,
        img: pokemonData.spriteUrl || getPokemonSpriteUrl(pokemonData.pokemonName),
        isEditing: true,
    };
}

async function loadPokemonPreview(speciesName, level, nature) {
    const response = await apiPost("/pokemon/search", {
        pokemonName: speciesName,
        level,
        modifier: nature,
    });

    return {
        ...response.pokemon,
        abilityOptions: response.pokemon.abilityOptions || [],
    };
}

async function loadAbilityOptionsForMember(member) {
    const preview = await loadPokemonPreview(member.speciesName, member.level, member.nature);
    member.abilityOptions = preview.abilityOptions || [];
    member.baseStats = preview.baseStats;
    member.calculatedStats = preview.calculatedStats;
    member.type1 = preview.typeOne;
    member.type2 = preview.typeTwo;
    member.genId = preview.genId;
    member.genName = preview.genName;
    member.region = preview.regionName;
    member.rarity = preview.rarityLabel;
    member.img = getPokemonSpriteUrl(preview.pokemonName);
}

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
    const currentTeamId = urlParams.get("teamId");

    if (!currentTeamId) {
        alert("Team not found! Returning to teams page.");
        window.location.href = "myteams.html";
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
    if (!speciesName) return;

    try {
        const preview = await loadPokemonPreview(speciesName, 50, "Hardy");
        currentTeam.members[slotIndex] = buildDraftMemberFromPreview(
            preview,
            slotIndex,
            currentTeam.members[slotIndex],
        );
        renderSlots();
    } catch (error) {
        alert(error.message);
    }
};

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

        const pokeData = member;
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
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">HP</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.hp}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">ATK</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.atk}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">DEF</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.def}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SpA</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.spAtk}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SpD</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.spDef}</div></div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-lg p-2 text-center"><div class="text-[10px] text-gray-400 font-bold uppercase">SPD</div><div class="text-sm font-black text-gray-800">${pokeData.baseStats.speed}</div></div>
                    </div>

                    <div class="border-t border-gray-200 pt-2 mt-auto text-center w-full">
                        <div class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Species #${pokeData.speciesId} • ${pokeData.genName || `Gen ${pokeData.genId || "?"}`} • ${pokeData.region || "Unknown"} • ${pokeData.rarity || "Unknown"}</div>
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
                            <span class="text-xl font-black text-green-500">${pokeData.baseStats.hp}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ATK</span>
                            <span class="text-xl font-black text-red-500">${pokeData.baseStats.atk}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DEF</span>
                            <span class="text-xl font-black text-blue-500">${pokeData.baseStats.def}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SpA</span>
                            <span class="text-xl font-black text-purple-500">${pokeData.baseStats.spAtk}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SpD</span>
                            <span class="text-xl font-black text-yellow-500">${pokeData.baseStats.spDef}</span>
                        </div>
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SPD</span>
                            <span class="text-xl font-black text-pink-500">${pokeData.baseStats.speed}</span>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-3 mt-auto text-center w-full">
                        <div class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Species #${pokeData.speciesId} • ${pokeData.genName || `Gen ${pokeData.genId || "?"}`} • ${pokeData.region || "Unknown"} • ${pokeData.rarity || "Unknown"}</div>
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
        let updatedPokemon;
        let updatedAbilityOptions;
        let memberId = member.memberId;
        let pokedexId = member.pokedexId;

        if (pokedexId) {
            const response = await apiPost(`/pokemon/${pokedexId}/update`, {
                pokemonName: member.speciesName,
                level,
                modifier: nature,
                ability,
            });
            updatedPokemon = response.pokemon;
            updatedAbilityOptions = response.abilityOptions || member.abilityOptions;
        } else {
            const createPokemonResponse = await apiPost("/pokemon/create", {
                pokemonName: member.speciesName,
                level,
                modifier: nature,
                ability,
            });
            updatedPokemon = createPokemonResponse.pokemon;
            updatedAbilityOptions = createPokemonResponse.abilityOptions || member.abilityOptions;
            pokedexId = updatedPokemon.pokedexId;

            const createTeamMemberResponse = await apiPost(`/teams/${currentTeam.id}/members/create`, {
                pokedexId,
                teamNumber: index + 1,
            });
            memberId = createTeamMemberResponse.teamMember.memberId;
        }

        currentTeam.members[index] = {
            ...member,
            memberId,
            pokedexId,
            teamNumber: index + 1,
            speciesName: updatedPokemon.pokemonName,
            speciesId: updatedPokemon.speciesId,
            level: updatedPokemon.level,
            nature: updatedPokemon.modifier,
            ability: updatedPokemon.ability,
            abilityOptions: updatedAbilityOptions,
            baseStats: updatedPokemon.baseStats,
            calculatedStats: updatedPokemon.calculatedStats,
            type1: updatedPokemon.typeOne,
            type2: updatedPokemon.typeTwo,
            genId: updatedPokemon.genId,
            genName: updatedPokemon.genName,
            region: updatedPokemon.regionName,
            rarity: updatedPokemon.rarityLabel,
            img: updatedPokemon.spriteUrl || getPokemonSpriteUrl(updatedPokemon.pokemonName),
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
                <input type="radio" name="modal-nature" value="${nature}" class="filter-nature border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer">
                <span class="text-sm font-medium text-gray-700">${nature}</span>
            </label>
        `).join("");
    }

    resetModalSelection();
}

function resetModalSelection() {
    modalPreviewPokemon = null;

    const errorText = document.getElementById("modal-search-error");
    const abilityStep = document.getElementById("modal-ability-step");
    const confirmButton = document.getElementById("modal-confirm-button");
    const resultsContainer = document.getElementById("modal-results");
    const searchInput = document.getElementById("modal-search-text");
    const levelSlider = document.getElementById("modal-level-slider");
    const levelDisplay = document.getElementById("modal-level-display");

    if (errorText) {
        errorText.textContent = "";
        errorText.classList.add("hidden");
    }

    if (abilityStep) {
        abilityStep.classList.add("hidden");
    }

    if (confirmButton) {
        confirmButton.disabled = true;
    }

    if (resultsContainer) {
        resultsContainer.innerHTML = `<div class="col-span-full text-center text-gray-400 font-bold uppercase text-sm py-10">Enter a Pokemon name, choose one nature, then preview it.</div>`;
    }

    if (searchInput) {
        searchInput.value = "";
    }

    if (levelSlider) {
        levelSlider.value = "50";
    }

    if (levelDisplay) {
        levelDisplay.textContent = "50";
    }

    document.querySelectorAll('input[name="modal-nature"]').forEach(input => {
        input.checked = false;
    });

    populateAbilityOptions([]);
}

function populateAbilityOptions(abilityOptions) {
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

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "modal-ability";
        radio.className = "filter-ability border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer";
        radio.value = ability;
        radio.onchange = () => {
            const confirmButton = document.getElementById("modal-confirm-button");
            if (confirmButton) {
                confirmButton.disabled = false;
            }
        };

        const textSpan = document.createElement("span");
        textSpan.textContent = ability;
        textSpan.className = "text-sm font-medium text-gray-700";

        label.appendChild(radio);
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
        resetModalSelection();
    }
};

window.closeSearchModal = function closeSearchModal() {
    const modal = document.getElementById("full-screen-search");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
    activeSlotForModal = null;
    modalPreviewPokemon = null;
};

function renderModalPreviewCard(previewPokemon) {
    const resultsContainer = document.getElementById("modal-results");
    if (!resultsContainer) return;

    const card = {
        speciesId: previewPokemon.speciesId,
        speciesName: previewPokemon.pokemonName,
        type1: previewPokemon.typeOne,
        type2: previewPokemon.typeTwo,
        img: previewPokemon.spriteUrl || getPokemonSpriteUrl(previewPokemon.pokemonName),
        hp: previewPokemon.baseStats.hp,
        atk: previewPokemon.baseStats.atk,
        def: previewPokemon.baseStats.def,
        spatk: previewPokemon.baseStats.spAtk,
        spdef: previewPokemon.baseStats.spDef,
        speed: previewPokemon.baseStats.speed,
        region: previewPokemon.regionName,
    };
    resultsContainer.innerHTML = `
        <div class="col-span-full max-w-md mx-auto bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-md">
            <img src="${card.img}" class="w-32 h-32 object-contain mb-3" draggable="false">
            <div class="font-black text-2xl text-gray-800 uppercase tracking-wide text-center">${card.speciesName}</div>
            <div class="text-[11px] font-bold text-gray-400 uppercase mt-1 tracking-wider">Species #${card.speciesId || "??"} • ${card.region || "Unknown"}</div>
            <div class="flex gap-1 mt-3">
                <span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm ${getTypeColorClass(card.type1)}">${card.type1}</span>
                ${card.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm ${getTypeColorClass(card.type2)}">${card.type2}</span>` : ''}
            </div>
            <div class="grid grid-cols-3 gap-2 w-full mt-4 text-center">
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">HP</div><div class="font-black text-green-500">${card.hp}</div></div>
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">ATK</div><div class="font-black text-red-500">${card.atk}</div></div>
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">DEF</div><div class="font-black text-blue-500">${card.def}</div></div>
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">SpA</div><div class="font-black text-purple-500">${card.spatk}</div></div>
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">SpD</div><div class="font-black text-yellow-500">${card.spdef}</div></div>
                <div class="bg-gray-50 border rounded-lg p-2"><div class="text-[10px] font-bold text-gray-400 uppercase">SPD</div><div class="font-black text-pink-500">${card.speed}</div></div>
            </div>
            <p class="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preview confirmed. Choose one ability to continue.</p>
        </div>
    `;
}

function getSelectedNature() {
    const selectedNature = document.querySelector('input[name="modal-nature"]:checked');
    return selectedNature ? selectedNature.value : null;
}

function getSelectedAbility() {
    const selectedAbility = document.querySelector('input[name="modal-ability"]:checked');
    return selectedAbility ? selectedAbility.value : null;
}

function setModalError(message) {
    const errorText = document.getElementById("modal-search-error");
    if (!errorText) return;

    if (message) {
        errorText.textContent = message;
        errorText.classList.remove("hidden");
    } else {
        errorText.textContent = "";
        errorText.classList.add("hidden");
    }
}

window.previewPokemonSelection = async function previewPokemonSelection() {
    const searchInput = document.getElementById("modal-search-text");
    const searchText = searchInput ? searchInput.value.trim() : "";
    const natureToApply = getSelectedNature();
    const levelInput = document.getElementById("modal-level-slider");
    const levelVal = levelInput ? parseInt(levelInput.value, 10) : 50;

    if (!searchText) {
        setModalError("Type a Pokemon name first.");
        return;
    }

    if (!natureToApply) {
        setModalError("Choose exactly one nature before previewing.");
        return;
    }

    setModalError("");

    const resultsContainer = document.getElementById("modal-results");
    if (resultsContainer) {
        resultsContainer.innerHTML = `<div class="col-span-full text-center text-gray-400 font-bold uppercase text-sm py-10">Loading Pokémon preview...</div>`;
    }

    try {
        const preview = await loadPokemonPreview(searchText, levelVal, natureToApply);
        modalPreviewPokemon = preview;
        renderModalPreviewCard(preview);
        populateAbilityOptions(preview.abilityOptions || []);

        const abilityStep = document.getElementById("modal-ability-step");
        const confirmButton = document.getElementById("modal-confirm-button");
        if (abilityStep) {
            abilityStep.classList.remove("hidden");
        }
        if (confirmButton) {
            confirmButton.disabled = true;
        }
    } catch (error) {
        modalPreviewPokemon = null;
        populateAbilityOptions([]);
        const abilityStep = document.getElementById("modal-ability-step");
        if (abilityStep) {
            abilityStep.classList.add("hidden");
        }
        setModalError(error.message);
        if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold uppercase text-sm py-10">${error.message}</div>`;
        }
    }
};

window.confirmPokemonSelection = async function confirmPokemonSelection() {
    if (!modalPreviewPokemon) {
        setModalError("Preview a Pokemon before confirming an ability.");
        return;
    }

    const selectedAbility = getSelectedAbility();
    if (!selectedAbility) {
        setModalError("Choose one ability before confirming.");
        return;
    }

    const targetIndex = activeSlotForModal !== null
        ? activeSlotForModal
        : currentTeam.members.findIndex(member => member === null);

    if (targetIndex === -1) {
        alert("Maximum 6 team members allowed.");
        return;
    }

    const existingMember = currentTeam.members[targetIndex];

    try {
        let persistedPokemon;
        let abilityOptions;
        let memberId = existingMember ? existingMember.memberId : null;
        let pokedexId = existingMember ? existingMember.pokedexId : null;

        if (pokedexId) {
            const response = await apiPost(`/pokemon/${pokedexId}/update`, {
                pokemonName: modalPreviewPokemon.pokemonName,
                level: modalPreviewPokemon.level,
                modifier: modalPreviewPokemon.modifier,
                ability: selectedAbility,
            });
            persistedPokemon = response.pokemon;
            abilityOptions = response.abilityOptions || modalPreviewPokemon.abilityOptions;
        } else {
            const createPokemonResponse = await apiPost("/pokemon/create", {
                pokemonName: modalPreviewPokemon.pokemonName,
                level: modalPreviewPokemon.level,
                modifier: modalPreviewPokemon.modifier,
                ability: selectedAbility,
            });
            persistedPokemon = createPokemonResponse.pokemon;
            abilityOptions = createPokemonResponse.abilityOptions || modalPreviewPokemon.abilityOptions;
            pokedexId = persistedPokemon.pokedexId;

            const createTeamMemberResponse = await apiPost(`/teams/${currentTeam.id}/members/create`, {
                pokedexId,
                teamNumber: targetIndex + 1,
            });
            memberId = createTeamMemberResponse.teamMember.memberId;
        }

        currentTeam.members[targetIndex] = buildDraftMemberFromPreview(
            {
                ...persistedPokemon,
                ability: selectedAbility,
                abilityOptions,
            },
            targetIndex,
            existingMember,
        );
        currentTeam.members[targetIndex].memberId = memberId;
        currentTeam.members[targetIndex].pokedexId = pokedexId;
        currentTeam.members[targetIndex].teamId = currentTeam.id;
        currentTeam.members[targetIndex].teamNumber = targetIndex + 1;
        currentTeam.members[targetIndex].isEditing = false;

        closeSearchModal();
        renderSlots();
    } catch (error) {
        setModalError(error.message);
    }
};

function handleLogout(event) {
    event.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = 'login.html';
}

// ==========================================
// AGGREGATE PAGES
// ==========================================
async function loadRegionOptions() {
    const select = document.getElementById("region-select");
    if (!select) return;

    try {
        const regions = await apiGet("/regions");
        select.innerHTML = regions
            .map(region => `<option value="${region.regionName}">${region.regionName}</option>`)
            .join("");
    } catch (error) {
        const errorText = document.getElementById("region-query-error");
        if (errorText) {
            errorText.textContent = error.message;
            errorText.classList.remove("hidden");
        }
    }
}

window.loadEligibleUsers = async function loadEligibleUsers(event) {
    if (event) event.preventDefault();

    const regionSelect = document.getElementById("region-select");
    const tbody = document.getElementById("eligible-users-body");
    const errorText = document.getElementById("region-query-error");

    if (!regionSelect || !tbody) return;

    if (errorText) {
        errorText.classList.add("hidden");
        errorText.textContent = "";
    }

    try {
        const rows = await apiGet(`/aggregates/eligible-users?regionName=${encodeURIComponent(regionSelect.value)}`);
        tbody.innerHTML = rows.map(row => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-3 font-bold text-gray-600">#${row.UserId}</td>
                <td class="p-3 font-black text-gray-900">${row.UserName}</td>
                <td class="p-3 font-bold text-gray-600">#${row.TeamId}</td>
                <td class="p-3 font-medium text-gray-700">${row.TeamName}</td>
            </tr>
        `).join("");

        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-gray-400 font-bold uppercase">No eligible users found.</td></tr>`;
        }
    } catch (error) {
        if (errorText) {
            errorText.textContent = error.message;
            errorText.classList.remove("hidden");
        }
    }
};

async function loadTypeFrequencyPage() {
    const tbody = document.getElementById("type-frequency-body");
    if (!tbody) return;

    const rows = await apiGet("/aggregates/type-usage");
    tbody.innerHTML = rows.map(row => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="p-3 font-bold text-gray-600">${row.TypeRankDescription}</td>
            <td class="p-3 font-bold text-gray-600">#${row.TypeId}</td>
            <td class="p-3 font-black text-gray-900">${row.TypeName}</td>
            <td class="p-3 font-bold text-blue-700">${row.TypeUsageCount}</td>
        </tr>
    `).join("");
};

async function loadStrengthPage() {
    const tbody = document.getElementById("strength-body");
    if (!tbody) return;

    const rows = await apiGet("/aggregates/team-stats");
    tbody.innerHTML = rows.map(row => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="p-3 font-bold text-gray-600">${row.TeamRank}</td>
            <td class="p-3 font-bold text-gray-600">#${row.TeamId}</td>
            <td class="p-3 font-bold text-green-700">${row.TotalHP}</td>
            <td class="p-3 font-bold text-orange-700">${row.TotalAttack}</td>
            <td class="p-3 font-bold text-yellow-700">${row.TotalDefense}</td>
            <td class="p-3 font-bold text-orange-500">${row.TotalSpAttack}</td>
            <td class="p-3 font-bold text-yellow-500">${row.TotalSpDefense}</td>
            <td class="p-3 font-bold text-pink-700">${row.TotalSpeed}</td>
            <td class="p-3 font-black text-blue-700">${row.OverallTotalStats}</td>
        </tr>
    `).join("");
};

async function loadSpeciesCounterPage() {
    const tbody = document.getElementById("species-counter-body");
    if (!tbody) return;

    const rows = await apiGet("/aggregates/species-usage");
    tbody.innerHTML = rows.map(row => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="p-3 font-bold text-gray-600">#${row.SpeciesId}</td>
            <td class="p-3 font-black text-gray-900">${row.SpeciesName}</td>
            <td class="p-3 font-bold text-blue-700">${row.UsageCount}</td>
        </tr>
    `).join("");
};

// ==========================================
// BOOTSTRAP APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    
    if (document.getElementById('profile-username-display') || document.getElementById('profile-username')) {
        await renderTrainerSidebar();
    }

    if (document.getElementById('teams-grid')) {
        await initMyTeams();
    }
    
    if (document.getElementById('full-screen-search')) {
        initModalFilters();
        await initEditView();
    }

    if (document.getElementById("region-aggregate-view")) {
        await loadRegionOptions();
        await loadEligibleUsers();
    }

    if (document.getElementById("type-aggregate-view")) {
        await loadTypeFrequencyPage();
    }

    if (document.getElementById("strength-aggregate-view")) {
        await loadStrengthPage();
    }

    if (document.getElementById("species-aggregate-view")) {
        await loadSpeciesCounterPage();
    }
});
