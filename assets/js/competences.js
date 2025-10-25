// Tabs de catégories pour Compétences
(function(){
  function initTabs(){
    const container = document.getElementById('skillGroups');
    const tabs = document.querySelectorAll('.skill-tabs .tab');
    if(!container || !tabs.length) return;

    function show(cat){
      const groups = Array.from(container.querySelectorAll('.skill-group'));
      let shown = 0;
      groups.forEach(g => {
        const ok = (cat==='all') || g.dataset.cat === cat;
        g.classList.toggle('hidden', !ok);
        if(ok) shown++;
      });
      container.classList.toggle('single', shown===1);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        const cat = tab.getAttribute('data-cat');
        show(cat);
      });
      // Navigation clavier basique (gauche/droite)
      tab.addEventListener('keydown', (e) => {
        if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;
        e.preventDefault();
        const arr = Array.from(tabs);
        const i = arr.indexOf(tab);
        const next = e.key==='ArrowRight' ? arr[(i+1)%arr.length] : arr[(i-1+arr.length)%arr.length];
        next.focus(); next.click();
      });
    });

    // État initial
    show('all');
  }

  document.addEventListener('includes-loaded', initTabs);
})();

