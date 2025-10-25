// Animations pour la section Compétences (révélation en cascade + micro‑interactions)
(function(){
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onIncludesLoaded(){
    const section = document.getElementById('competences');
    if(!section) return;
    // Supporter les différents designs
    const tiles = Array.from(section.querySelectorAll('.skill, .badge, .bubble, .tile'));
    if(!tiles.length) return;

    // Apparition en cascade à l’entrée dans le viewport
    if(!prefersReduced && tiles.length){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry => {
          if(entry.isIntersecting){
            tiles.forEach((el, i) => {
              el.style.transitionDelay = (i * 35) + 'ms';
              requestAnimationFrame(()=> el.classList.add('in'));
            });
            io.disconnect();
          }
        });
      }, { root: null, threshold: 0.2 });
      io.observe(section);
    }else{
      tiles.forEach(el => el.classList.add('in'));
    }

    // Hover: petite pulsation + tilt très léger
    if(!prefersReduced){
      tiles.forEach(el => {
        el.addEventListener('pointerenter', ()=> el.classList.add('pop'));
        el.addEventListener('pointerleave', ()=> el.classList.remove('pop'));
      });
    }
  }

  document.addEventListener('includes-loaded', onIncludesLoaded);
})();
