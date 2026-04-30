const API_BASE_URL = window.POKETEAM_API_BASE_URL || "http://127.0.0.1:5000";

// ==========================================
// CLIENT-SIDE POKEDEX CATALOG
// Used for browsing and visuals while API-backed actions
// handle the actual create/update/delete work.
// ==========================================
const pokedexDb = [
    { id: 1, speciesName: "Charizard", type1: "Fire", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", hp: 78, atk: 84, def: 78, spatk: 109, spdef: 85, speed: 100, rarity: "Rare", genId: 1, abilities: ["Blaze", "Solar Power"] },
    { id: 2, speciesName: "Gengar", type1: "Ghost", type2: "Poison", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", hp: 60, atk: 65, def: 60, spatk: 130, spdef: 75, speed: 110, rarity: "Rare", genId: 1, abilities: ["Cursed Body"] },
    { id: 3, speciesName: "Garchomp", type1: "Dragon", type2: "Ground", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png", hp: 108, atk: 130, def: 95, spatk: 80, spdef: 85, speed: 102, rarity: "Rare", genId: 4, abilities: ["Sand Veil", "Rough Skin"] },
    { id: 4, speciesName: "Pikachu", type1: "Electric", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", hp: 35, atk: 55, def: 40, spatk: 50, spdef: 50, speed: 90, rarity: "Common", genId: 1, abilities: ["Static", "Lightning Rod"] },
    { id: 5, speciesName: "Snorlax", type1: "Normal", type2: null, img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", hp: 160, atk: 110, def: 65, spatk: 65, spdef: 110, speed: 30, rarity: "Uncommon", genId: 1, abilities: ["Immunity", "Thick Fat", "Gluttony"] },
    { id: 6, speciesName: "Gyarados", type1: "Water", type2: "Flying", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png", hp: 95, atk: 125, def: 79, spatk: 60, spdef: 100, speed: 81, rarity: "Uncommon", genId: 1, abilities: ["Intimidate", "Moxie"] }
];

const allNatures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];

let currentTeamId = null;
let currentTeam = null;
let activeSlotForModal = null;

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
    return localStorage.getItem("trainerUserId");
}

function getTrainerName() {
    return localStorage.getItem("trainerName");
}

function setTrainer(user) {
    localStorage.setItem("trainerUserId", user.userId);
    localStorage.setItem("trainerName", user.userName);
}

function clearTrainer() {
    localStorage.removeItem("trainerUserId");
    localStorage.removeItem("trainerName");
}

function getCatalogEntry(speciesName) {
    return pokedexDb.find(
        pokemon => pokemon.speciesName.toLowerCase() === speciesName.toLowerCase()
    );
}

function createFallbackCatalogEntry(speciesName) {
    return {
        id: 0,
        speciesName,
        type1: "Unknown",
        type2: null,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
        hp: 0,
        atk: 0,
        def: 0,
        spatk: 0,
        spdef: 0,
        speed: 0,
        rarity: "Unknown",
        genId: "?",
        abilities: [],
    };
}

function buildMemberFromApi(teamMember, pokemonData) {
    const catalogEntry = getCatalogEntry(pokemonData.pokemonName) || createFallbackCatalogEntry(pokemonData.pokemonName);

    return {
        memberId: teamMember.memberId,
        teamId: teamMember.teamId,
        pokedexId: teamMember.pokedexId,
        teamNumber: teamMember.teamNumber,
        speciesName: pokemonData.pokemonName,
        level: pokemonData.level,
        nature: pokemonData.modifier,
        ability: pokemonData.ability,
        abilityOptions: pokemonData.abilityOptions || catalogEntry.abilities || [pokemonData.ability],
        baseStats: pokemonData.baseStats,
        calculatedStats: pokemonData.calculatedStats,
        img: catalogEntry.img,
        type1: catalogEntry.type1,
        type2: catalogEntry.type2,
        rarity: catalogEntry.rarity,
        genId: catalogEntry.genId,
        dexNumber: catalogEntry.id,
        isEditing: false,
    };
}

async function fetchPokemonPreview(speciesName, level, nature) {
    const response = await apiPost("/pokemon/search", {
        pokemonName: speciesName,
        level,
        modifier: nature,
    });

    return response.pokemon;
}

async function loadAbilityOptionsForMember(member) {
    const preview = await fetchPokemonPreview(member.speciesName, member.level, member.nature);
    member.abilityOptions = preview.abilityOptions;
    member.baseStats = preview.baseStats;
    member.calculatedStats = preview.calculatedStats;
    return preview;
}

// ==========================================
// PAGE: LOGIN
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

    const usernameInput = document.getElementById("username-input");
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
// SHARED POKEDEX RENDERING (Sidebar)
// ==========================================
function renderPokedexSidebar() {
    const list = document.getElementById("pokedex-list");
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

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// PAGE: HOME
// ==========================================
async function initHomeProfile() {
    const savedUserId = getTrainerUserId();
    const savedName = getTrainerName();
    const profileNameEl = document.getElementById("profile-username");
    const profileUserIdEl = document.getElementById("profile-userid");
    const winsEl = document.getElementById("profile-wins");
    const lossesEl = document.getElementById("profile-losses");

    if (!savedUserId) {
        if (window.location.pathname.toLowerCase().includes("home")) {
            window.location.href = "login.html";
        }
        return;
    }

    if (profileNameEl && savedName) {
        profileNameEl.textContent = savedName;
    }

    try {
        const user = await apiGet(`/users/${savedUserId}`);
        setTrainer(user);

        if (profileNameEl) profileNameEl.textContent = user.userName;
        if (profileUserIdEl) profileUserIdEl.textContent = `ID: #${String(user.userId).padStart(5, "0")}`;
        if (winsEl) winsEl.textContent = user.wins;
        if (lossesEl) lossesEl.textContent = user.losses;
    } catch (error) {
        clearTrainer();
        alert(error.message);
        window.location.href = "login.html";
    }
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

    if (!currentTeamId) {
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

    try {
        await createOrReplaceTeamMemberFromSelection({
            speciesName,
            level: 50,
            nature: "Hardy",
            preferredAbility: null,
            slotIndex,
        });
    } catch (error) {
        alert(error.message);
    } finally {
        ev.currentTarget.classList.remove("border-green-400", "bg-green-50");
    }
};

async function createOrReplaceTeamMemberFromSelection({ speciesName, level, nature, preferredAbility, slotIndex }) {
    const preview = await fetchPokemonPreview(speciesName, level, nature);
    const abilityOptions = preview.abilityOptions || [];
    const selectedAbility = abilityOptions.includes(preferredAbility) ? preferredAbility : abilityOptions[0];

    if (!selectedAbility) {
        throw new Error(`No valid ability found for ${speciesName}`);
    }

    const createPokemonResponse = await apiPost("/pokemon/create", {
        pokemonName: speciesName,
        level,
        modifier: nature,
        ability: selectedAbility,
    });

    const pokemon = createPokemonResponse.pokemon;
    const existingMember = currentTeam.members[slotIndex];
    let teamMember;

    if (existingMember && existingMember.memberId) {
        await apiPost(`/members/${existingMember.memberId}/update`, {
            pokedexId: pokemon.pokedexId,
            teamNumber: slotIndex + 1,
        });

        teamMember = {
            memberId: existingMember.memberId,
            teamId: currentTeam.id,
            pokedexId: pokemon.pokedexId,
            teamNumber: slotIndex + 1,
        };
    } else {
        const createMemberResponse = await apiPost(`/teams/${currentTeam.id}/members/create`, {
            pokedexId: pokemon.pokedexId,
            teamNumber: slotIndex + 1,
        });

        teamMember = createMemberResponse.teamMember;
    }

    currentTeam.members[slotIndex] = buildMemberFromApi(teamMember, {
        ...pokemon,
        abilityOptions: createPokemonResponse.abilityOptions || abilityOptions,
    });

    renderSlots();
}

function renderSlots() {
    if (!currentTeam) return;

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
                    <img src="${member.img}" class="w-24 h-24 object-contain drop-shadow-md z-0" draggable="false">
                    <div class="font-black text-gray-800 tracking-wide uppercase mt-2 text-lg z-0">${member.speciesName}</div>
                    <div class="flex gap-1 mt-1 z-0">
                        <span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-800 text-white">${member.type1}</span>
                        ${member.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-gray-500 text-white">${member.type2}</span>` : ""}
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
                            <span>HP:${member.calculatedStats?.hp ?? member.baseStats?.hp ?? 0}</span>
                            <span>A:${member.calculatedStats?.atk ?? member.baseStats?.atk ?? 0}</span>
                            <span>D:${member.calculatedStats?.def ?? member.baseStats?.def ?? 0}</span>
                            <span>SA:${member.calculatedStats?.spAtk ?? member.baseStats?.spAtk ?? 0}</span>
                            <span>SD:${member.calculatedStats?.spDef ?? member.baseStats?.spDef ?? 0}</span>
                            <span>Sp:${member.calculatedStats?.speed ?? member.baseStats?.speed ?? 0}</span>
                        </div>
                        <div class="text-[10px] text-gray-400 text-center uppercase font-bold">Dex #${member.dexNumber || "?"} • Gen ${member.genId || "?"} • ${member.rarity || "Unknown"}</div>
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

    resultsContainer.innerHTML = pokemonList.map(pokemon => `
        <div onclick="selectPokemonFromModal('${pokemon.speciesName}')" class="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-red-500 hover:shadow-xl transition-all group">
            <img src="${pokemon.img}" class="w-24 h-24 object-contain group-hover:scale-110 transition-transform mb-2" draggable="false">
            <div class="font-black text-gray-800 uppercase tracking-wide text-center">${pokemon.speciesName}</div>
            <div class="text-[10px] font-bold text-gray-400 uppercase mt-1">ID: #${pokemon.id}</div>
            <div class="flex gap-1 mt-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-gray-800 text-white">${pokemon.type1}</span>
                ${pokemon.type2 ? `<span class="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-gray-500 text-white">${pokemon.type2}</span>` : ""}
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
    const targetSlotIndex = activeSlotForModal !== null
        ? activeSlotForModal
        : currentTeam.members.findIndex(member => member === null);

    if (targetSlotIndex === -1) {
        alert("Exception: You cannot add any more Pokémon to this team. Maximum 6 members allowed.");
        return;
    }

    try {
        const preview = await fetchPokemonPreview(speciesName, levelVal, natureToApply);
        const preferredAbility = checkedAbilities.find(ability => preview.abilityOptions.includes(ability)) || preview.abilityOptions[0];

        await createOrReplaceTeamMemberFromSelection({
            speciesName,
            level: levelVal,
            nature: natureToApply,
            preferredAbility,
            slotIndex: targetSlotIndex,
        });

        closeSearchModal();
    } catch (error) {
        alert(error.message);
    }
};

// ==========================================
// BOOTSTRAP APP
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) lucide.createIcons();

    if (document.getElementById("profile-username")) {
        await initHomeProfile();
    }

    if (document.getElementById("pokedex-list")) {
        renderPokedexSidebar();
    }

    if (document.getElementById("teams-grid")) {
        await initMyTeams();
    }

    if (document.getElementById("full-screen-search")) {
        initModalFilters();
        await initEditView();
    }
});
