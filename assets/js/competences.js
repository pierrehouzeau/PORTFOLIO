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
      // Laisse la grille s'étendre si besoin (évite la coupe)
      allGrid.style.height = 'auto';
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

    // Ajuster la hauteur minimale de la grille en fonction du contenu
    let baseline = 0;
    function setBaselineHeight(){
      // Mesure après mise en page et images
      requestAnimationFrame(()=>{
        const h = Math.ceil(allGrid.getBoundingClientRect().height);
        if(h > 0){
          // Baseline dynamique (peut rétrécir si le contenu est plus petit)
          baseline = h;
          allGrid.style.minHeight = baseline + 'px';
          // ne fige pas la hauteur: permet d'afficher la dernière ligne
          allGrid.style.height = 'auto';
        }
      });
    }
    // Attendre le chargement des icônes pour une mesure fiable
    const imgs = Array.from(allGrid.querySelectorAll('img'));
    let pending = imgs.filter(img=>!img.complete).length;
    if(pending){
      imgs.forEach(img=>{
        if(!img.complete){
          img.addEventListener('load', ()=>{ if(--pending===0) setBaselineHeight(); }, { once:true });
          img.addEventListener('error', ()=>{ if(--pending===0) setBaselineHeight(); }, { once:true });
        }
      });
      // filet de sécurité si aucun event ne se déclenche
      setTimeout(setBaselineHeight, 400);
    }else{
      setBaselineHeight();
    }

    // Recalcule la base quand l'écran change
    let rId;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(rId);
      rId = requestAnimationFrame(setBaselineHeight);
    });

    // Recalcule après chaque filtrage (évite le blanc inutile)
    const prevRefresh = refresh;
    function refreshAndResize(){ prevRefresh(); setBaselineHeight(); }
    refresh = refreshAndResize;
  }

  document.addEventListener('includes-loaded', initFilters);
})();
