// Fonctions de base du site: année, scroll fluide, lien actif
(function(){
  function ready(fn){ if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', fn);} else { fn(); } }
  ready(()=>{
    const y=document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  });

  document.addEventListener('includes-loaded', ()=>{
    // Scroll fluide
    const links = document.querySelectorAll('nav a[href^="#"]');
    links.forEach(a=>a.addEventListener('click', e=>{
      const id=a.getAttribute('href');
      if(id && id.startsWith('#')){ e.preventDefault(); const t=document.querySelector(id); t?.scrollIntoView({behavior:'smooth'}); }
    }));
    // Lien actif
    const all = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    const io = new IntersectionObserver((es)=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          navLinks.forEach(n=>n.classList.remove('active'));
          const l=document.querySelector(`nav a[href="#${e.target.id}"]`);
          l?.classList.add('active');
        }
      })
    },{rootMargin:'-50% 0px -50% 0px'});
    all.forEach(s=>io.observe(s));

    // Header intelligent: cache en scroll descendant, affiche en scroll montant
    // Header toujours visible (fixe) — pas de logique de masquage
  });
})();
