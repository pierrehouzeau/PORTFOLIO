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

    // Barre de progression gérée par l'îlot React (Framer) — pas de fallback vanilla

    // Menu burger (mobile)
    const toggle=document.getElementById('menuToggle');
    const nav=document.getElementById('navMenu');
    if(toggle && nav){
      const root=document.documentElement;
      toggle.addEventListener('click',()=>{
        const open=!root.classList.contains('menu-ouvert');
        root.classList.toggle('menu-ouvert', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      // Fermer au clic sur un lien
      nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        root.classList.remove('menu-ouvert'); toggle.setAttribute('aria-expanded','false');
      }));
      // Fermer sur Esc
      document.addEventListener('keydown', (e)=>{
        if(e.key==='Escape'){ root.classList.remove('menu-ouvert'); toggle.setAttribute('aria-expanded','false'); }
      });
      // Fermer au clic en dehors
      document.addEventListener('click', (e)=>{
        const t=e.target;
        if(!root.classList.contains('menu-ouvert')) return;
        if(!nav.contains(t) && t!==toggle && !toggle.contains(t)){
          root.classList.remove('menu-ouvert'); toggle.setAttribute('aria-expanded','false');
        }
      });
    }
  });
})();
