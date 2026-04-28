function renderPokedex(containerId, searchId) {
    const container = document.getElementById(containerId);
    const search = document.getElementById(searchId);
    
    if(!container) return;

    const renderList = (filter = "") => {
        container.innerHTML = "";
        const filtered = window.pokemonDatabase.filter(p => 
            p.name.toLowerCase().includes(filter.toLowerCase()) || 
            p.types.some(t => t.toLowerCase().includes(filter.toLowerCase()))
        );
        
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.draggable = true;
            card.dataset.id = p.id;
            
            card.innerHTML = `
                <div style="font-size: 10px; color: #888; font-weight: bold; text-align: left;">#${String(p.id).padStart(3, '0')}</div>
                <img src="${p.imageUrl}" alt="${p.name}" draggable="false" />
                <h3>${p.name}</h3>
                <div style="font-size: 10px; font-weight: bold; color: #666; text-transform: uppercase;">
                    ${p.types.join(' • ')}
                </div>
            `;
            
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', p.id);
            });
            
            container.appendChild(card);
        });
    };
    
    renderList();
    
    if (search) {
        search.addEventListener('input', (e) => {
            renderList(e.target.value);
        });
    }
}