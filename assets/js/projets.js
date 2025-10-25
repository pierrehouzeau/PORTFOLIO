// Rendu dynamique de la section Projets (grille + cartes)
(function(){
  const GITHUB_PROFILE = 'https://github.com/pierrehouzeau';
  function el(tag, cls, html){ const n=document.createElement(tag); if(cls) n.className=cls; if(html!==undefined) n.innerHTML=html; return n; }
  function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return Math.abs(h); }
  function gradientFor(){ return `linear-gradient(135deg,#e6f0ff,#ece7ff 60%,#e7fff5)` }
  // Mapping d'icônes pour les technos (noir/blanc via Simple Icons)
  const ICONS = {
    'html': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/html5.svg',
    'css': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/css3.svg',
    'css3': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/css3.svg',
    'javascript': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/javascript.svg',
    'fastapi': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/fastapi.svg',
    'mysql': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg',
    'python': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg',
    'pandas': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pandas.svg',
    'scikitlearn': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/scikitlearn.svg'
  }
  function techSlug(t){
    const s = (t||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
    if(s==='html') return 'html';
    if(s==='css') return 'css3';
    if(s==='scikitlearn') return 'scikitlearn';
    return s;
  }

  // Modal singleton + accessibilité (focus trap, ARIA)
  let modal, modalContent;
  let dialogEl, closeBtn;
  let previouslyFocused = null;
  const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  function focusables(){ return dialogEl ? Array.from(dialogEl.querySelectorAll(FOCUSABLE)).filter(el=>!el.hasAttribute('disabled') && el.offsetParent!==null) : []; }
  function trapKeydown(e){
    if(e.key !== 'Tab') return;
    const f = focusables(); if(!f.length){ e.preventDefault(); return; }
    const first=f[0], last=f[f.length-1];
    const active=document.activeElement;
    if(e.shiftKey){ if(active===first || !dialogEl.contains(active)){ e.preventDefault(); last.focus(); } }
    else { if(active===last || !dialogEl.contains(active)){ e.preventDefault(); first.focus(); } }
  }
  function setBackgroundHidden(hidden){
    const nodes = Array.from(document.querySelectorAll('body > *:not(.modal-overlay)'));
    nodes.forEach(n=>{ if(hidden){ n.setAttribute('aria-hidden','true'); n.setAttribute('inert',''); } else { n.removeAttribute('aria-hidden'); n.removeAttribute('inert'); } });
  }
  function ensureModal(){
    if(modal) return modal;
    modal = el('div','modal-overlay');
    modal.innerHTML = '';
    dialogEl = el('div','modal-dialog');
    dialogEl.setAttribute('role','dialog');
    dialogEl.setAttribute('aria-modal','true');
    closeBtn = el('button','modal-close','×'); closeBtn.setAttribute('aria-label','Fermer');
    modalContent = el('div','modal-content');
    dialogEl.append(closeBtn, modalContent);
    modal.appendChild(dialogEl);
    document.body.appendChild(modal);
    // close handlers
    function hide(){
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      modal.removeEventListener('keydown', trapKeydown);
      setBackgroundHidden(false);
      if(previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
      previouslyFocused = null;
    }
    closeBtn.addEventListener('click', hide);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) hide(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.classList.contains('open')) hide(); });
    return modal;
  }
  function openModal(p){
    ensureModal();
    modalContent.innerHTML='';
    const header = el('div','modal-header');
    const cover = el('div','modal-cover');
    // Image de couverture si disponible, sinon fond par défaut
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = `${p.title} — aperçu`;
      // En cas d'échec de chargement, on revient au dégradé
      img.onerror = () => { img.remove(); cover.style.background = gradientFor(p); };
      cover.appendChild(img);
    } else {
      cover.style.background = gradientFor(p);
    }

    const info = el('div','modal-info');
    const titleEl = el('h3','modal-title', p.title);
    titleEl.id = 'modal-title';
    if(dialogEl) dialogEl.setAttribute('aria-labelledby','modal-title');
    info.append(
      titleEl,
      el('div','muted', `${p.year}`)
    );
    // Icônes de technos (modale)
    const techIconsModal = el('div','tech-icons');
    (p.tech||[]).forEach(t=>{ const u=ICONS[techSlug(t)]; if(u){ const im=document.createElement('img'); im.src=u; im.alt=t; im.title=t; techIconsModal.appendChild(im);} });
    info.appendChild(techIconsModal);
    if(p.tags?.length){ const tags=el('div','tags'); p.tags.forEach(t=> tags.appendChild(el('span','tag', t))); info.appendChild(tags); }
    const actions=el('div','cta');
    if(p.links?.demo){ const a=el('a','btn primary','Demo'); a.href=p.links.demo; a.target='_blank'; a.rel='noreferrer noopener'; actions.appendChild(a); }
    const g1=el('a','btn','GitHub'); const repo=(p.links&&p.links.github)||GITHUB_PROFILE; g1.href=repo; g1.target='_blank'; g1.rel='noreferrer noopener'; g1.setAttribute('aria-label',`Ouvrir ${p.title} sur GitHub`); actions.appendChild(g1);
    info.appendChild(actions);

    // Description courte (un seul paragraphe explicatif)
    const desc=el('div','modal-desc');
    desc.appendChild(el('p','', p.summary || "Aperçu du projet."));

    const body = el('div','modal-body stack');
    // Afficher d'abord le texte explicatif (full width), séparateur léger, puis infos principales
    const sep = el('div','modal-sep');
    body.append(desc, sep, info);

    // Texte classique: 1–2 paragraphes explicatifs si fournis
    if (Array.isArray(p.about)) {
      p.about.forEach(par => desc.appendChild(el('p','', par)));
    } else if (typeof p.detail === 'string' && p.detail.trim()) {
      // Fallback: transforme le texte multi‑lignes en 1–2 paragraphes lisibles
      const blocks = p.detail.split(/\n\n+/).map(s => s.replace(/^\$\s*/gm, '').trim()).filter(Boolean);
      (blocks.slice(0,2)).forEach(par => desc.appendChild(el('p','', par)));
    }
    if(p.insight){ desc.appendChild(el('p','insight', p.insight)); }
    header.append(cover);
    modalContent.append(header, body);

    // open + accessibilité
    previouslyFocused = document.activeElement;
    document.body.classList.add('modal-open');
    setBackgroundHidden(true);
    modal.classList.add('open');
    modal.addEventListener('keydown', trapKeydown);
    const f = focusables();
    if(f.length){ f[0].focus(); } else { closeBtn?.focus(); }
  }

  function typeWriter(target, text, speed=12){
    target.textContent=''; let i=0; const id=setInterval(()=>{
      target.textContent += text[i++]||''; if(i>=text.length){ clearInterval(id);} }, speed);
    return ()=>clearInterval(id);
  }

  function renderProjectCard(p){
    const card=el('article','card project');
    // Rendre la carte cliquable pour ouvrir les détails
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.addEventListener('click', (e)=>{
      // Ne pas interférer avec les liens internes (Demo/GitHub)
      if(e.target.closest('a,button')) return;
      openModal(p);
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openModal(p);
      }
    });

    // Vignette
    const thumb=el('div','thumb');
    // Vignette: image si fournie, sinon dégradé par défaut
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = `${p.title} — vignette`;
      img.onerror = () => { img.remove(); thumb.style.background = gradientFor(); };
      thumb.appendChild(img);
    } else {
      thumb.style.background = gradientFor();
    }
    card.appendChild(thumb);

    // Contenu
    const content=el('div','content');
    const title=el('h3','', p.title);
    const meta=el('div','muted', `${p.year}`);
    const sum=el('p','', p.summary||'');
    content.append(title, meta);
    // Icônes technos (carte)
    const techIcons = el('div','tech-icons');
    (p.tech||[]).forEach(t=>{ const u=ICONS[techSlug(t)]; if(u){ const im=document.createElement('img'); im.src=u; im.alt=t; im.title=t; techIcons.appendChild(im);} });
    content.append(techIcons, sum);

    // Tags
    if(p.tags?.length){ const tags=el('div','tags'); p.tags.forEach(t=> tags.appendChild(el('span','tag', t))); content.appendChild(tags); }

    // Actions (sans bouton "Détails" — la carte est cliquable)
    const actions=el('div','cta');
    if(p.links?.demo){ const a=el('a','btn primary','Demo'); a.href=p.links.demo; a.target='_blank'; a.rel='noreferrer noopener'; actions.appendChild(a); }
    const g=el('a','btn','GitHub'); const repoUrl=(p.links&&p.links.github)||GITHUB_PROFILE; g.href=repoUrl; g.target='_blank'; g.rel='noreferrer noopener'; g.setAttribute('aria-label',`Ouvrir ${p.title} sur GitHub`); actions.appendChild(g);
    content.appendChild(actions);

    card.appendChild(content);

    return card;
  }

  async function loadProjects(){
    const grid=document.getElementById('projectGrid'); if(!grid) return;
    grid.classList.add('grid','projects-grid');
    try{
      const res=await fetch('assets/data/projects.json', {cache:'no-cache'});
      const list=await res.json();
      const frag=document.createDocumentFragment();
      list.forEach(p=> frag.appendChild(renderProjectCard(p)));
      grid.innerHTML=''; grid.appendChild(frag);
      // Animation d’apparition
      const io=new IntersectionObserver((ents)=>{
        ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
      },{root:null, rootMargin:'0px', threshold:0.15});
      grid.querySelectorAll('.project').forEach(n=> io.observe(n));
    }catch(err){ console.error('Projects load failed', err); grid.textContent='Impossible de charger les projets.'; }
  }

  document.addEventListener('includes-loaded', loadProjects);
})();
