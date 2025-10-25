// Tabs de catégories pour Compétences
(function(){
  function initFilters(){
    const allGrid = document.getElementById('skillsAll');
    const chips = document.querySelectorAll('.skill-tabs .tab');
    if(!allGrid || !chips.length) return;

    const tiles = Array.from(allGrid.querySelectorAll('.tile'));

    // Assure la visibilité immédiate des tuiles même si l'animation s'est initialisée avant
    requestAnimationFrame(() => tiles.forEach(t => t.classList.add('in')));

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

    // Figer la hauteur de la grille (pour éviter les sauts quand on filtre)
    function setBaselineHeight(){
      // Mesure après mise en page
      requestAnimationFrame(()=>{
        const h = Math.ceil(allGrid.getBoundingClientRect().height);
        if(h > 0) allGrid.style.minHeight = h + 'px';
      });
    }
    setBaselineHeight();

    // Recalcule une base quand l'écran change, seulement si aucun filtre n'est actif
    let rId;
    window.addEventListener('resize', () => {
      if(selected.size !== 0) return; // base reste stable si filtres actifs
      cancelAnimationFrame(rId);
      rId = requestAnimationFrame(setBaselineHeight);
    });
  }

  document.addEventListener('includes-loaded', initFilters);
})();
