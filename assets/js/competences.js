// Tabs de catégories pour Compétences
(function(){
  function initFilters(){
    const groups = document.getElementById('skillGroups');
    const allGrid = document.getElementById('skillsAll');
    const chips = document.querySelectorAll('.skill-tabs .tab');
    if(!groups || !allGrid || !chips.length) return;

    // Construire la grille à plat à partir des groupes
    const tiles = [];
    groups.querySelectorAll('.skill-group').forEach(group => {
      const cat = group.dataset.cat;
      group.querySelectorAll('.tile').forEach(t => {
        const c = t.cloneNode(true);
        c.dataset.cat = cat; // pour filtrage multi
        tiles.push(c);
      });
    });
    const frag = document.createDocumentFragment();
    tiles.forEach(t => frag.appendChild(t));
    allGrid.appendChild(frag);
    // Masquer les groupes (on travaille sur la grille à plat)
    groups.style.display = 'none';

    const selected = new Set();

    function refresh(){
      // Si aucun filtre → Tous
      const showAll = selected.size === 0;
      chips.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        const pressed = showAll ? (cat==='all') : (cat!=='all' && selected.has(cat));
        btn.classList.toggle('active', pressed);
        btn.setAttribute('aria-pressed', String(pressed));
      });

      tiles.forEach(t => {
        if(showAll){ t.style.display=''; return; }
        const ok = selected.has(t.dataset.cat);
        t.style.display = ok ? '' : 'none';
      });
    }

    chips.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        if(cat==='all'){ selected.clear(); }
        else{
          if(selected.has(cat)) selected.delete(cat); else selected.add(cat);
        }
        refresh();
      });
      btn.addEventListener('keydown', (e) => {
        if(e.key!=='Enter' && e.key!==' '){ return; }
        e.preventDefault(); btn.click();
      });
    });

    // État initial
    refresh();
  }

  document.addEventListener('includes-loaded', initFilters);
})();
