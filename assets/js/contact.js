// Formulaire Contact: envoi direct (fetch) vers un endpoint (ex: Formspree)
(function(){
  // Configure l'endpoint de traitement (ex: https://formspree.io/f/xxxxxx)
  const FORM_ENDPOINT = 'https://formspree.io/f/xvgwejkz';
  // Mode dev: si l'endpoint n'est pas configuré, on SIMULE un envoi (pas d'ouverture de mail)
  const endpointConfigured = () => /^https?:\/\//.test(FORM_ENDPOINT) && !/XXXXXXXX$/.test(FORM_ENDPOINT);

  function init(){
    const form = document.getElementById('contactForm');
    const status = document.getElementById('sendHint');
    const chips = document.getElementById('subjectChips');
    const subjectEl = document.getElementById('c_subject');
    const msgEl = document.getElementById('c_message');
    const msgCount = document.getElementById('msgCount');
    if(!form || !status) return;

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      // honeypot
      if(form.website && form.website.value){ return; }

      const formData = new FormData(form);
      const name = (formData.get('name')||'').toString().trim();
      const email = (formData.get('email')||'').toString().trim();
      const subject = (formData.get('subject')||'').toString().trim();
      const message = (formData.get('message')||'').toString().trim();
      if(!name || !email || !subject || !message){
        status.textContent = 'Merci de compléter tous les champs.';
        return;
      }
      // Aide Formspree à définir le Reply-To correctement
      formData.set('_replyto', email);
      formData.set('_subject', subject);

      // Si l'endpoint n'est pas encore configuré, simuler un envoi (UX locale)
      if(!endpointConfigured()){
        status.textContent = 'Mode démo: message simulé (configure Formspree pour envoyer vraiment).';
        form.reset();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn?.setAttribute('disabled','true');
      status.textContent = 'Envoi en cours…';
      try{
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if(res.ok){
          form.reset();
          status.textContent = 'Message bien envoyé';
        }else{
          status.textContent = 'Erreur lors de l\'envoi. Réessaie plus tard.';
        }
      }catch(err){
        console.error(err);
        status.textContent = 'Impossible d\'envoyer (réseau).';
      }finally{
        submitBtn?.removeAttribute('disabled');
      }
    });

    // Auto‑resize textarea + compteur
    if(msgEl){
      const updateSize = ()=>{ msgEl.style.height='auto'; msgEl.style.height=Math.min(480, Math.max(140, msgEl.scrollHeight))+'px'; };
      const updateCount = ()=>{ const n=(msgEl.value||'').length; if(msgCount) msgCount.textContent = n+" caractères"; };
      msgEl.addEventListener('input', ()=>{ updateSize(); updateCount(); });
      updateSize(); updateCount();
    }

    // Suggestions de sujet + templates + saisie "IA" (machine à écrire)
    if(chips){
      let typingTimer = null; let typingToken = 0;
      function cancelTyping(){ if(typingTimer){ clearTimeout(typingTimer); typingTimer=null; } typingToken++; }
      function typeInto(el, text){
        cancelTyping();
        el.value = '';
        el.dispatchEvent(new Event('input'));
        let i = 0; const token = ++typingToken;
        const tick = ()=>{
          if(token !== typingToken) return;
          if(i > text.length) return;
          el.value = text.slice(0, i);
          el.dispatchEvent(new Event('input'));
          const prev = text[i-1] || '';
          let delay = 22 + Math.random()*18; // base vitesse
          if(prev === '.' || prev === '!' || prev === '?' ) delay = 160 + Math.random()*60;
          else if(prev === '\n') delay = 90 + Math.random()*40;
          i++;
          typingTimer = setTimeout(tick, delay);
        };
        tick();
      }
      if(msgEl){
        msgEl.addEventListener('keydown', cancelTyping);
        msgEl.addEventListener('mousedown', cancelTyping);
      }
      const templates = {
        freelance: {
          subject: 'Proposition de projet freelance',
          message: 'Bonjour Pierre,\n\nJe souhaite te proposer un projet.\nContexte : …\nObjectif : …\nBudget : …\nDélais : …\n\nMerci d\'avance,\n'
        },
        stage: {
          subject: 'Stage / Alternance — opportunité',
          message: 'Bonjour Pierre,\n\nJe te contacte au sujet d\'une opportunité de stage/alternance.\nContexte : …\nDurée / Rythme : …\nPériode : …\n\nCordialement,\n'
        },
        oss: {
          subject: 'Collaboration open‑source',
          message: 'Bonjour Pierre,\n\nJ\'aimerais collaborer sur …\nIdée / issue : …\n\nBien à toi,\n'
        },
        rdv: {
          subject: 'Demande de rendez‑vous',
          message: 'Bonjour Pierre,\n\nSerais‑tu disponible pour un appel de 15–20 minutes ?\nCréneaux possibles : …\n\nMerci,\n'
        },
        feedback: {
          subject: 'Feedback sur ton portfolio',
          message: 'Bonjour Pierre,\n\nJe voulais te partager un retour sur ton portfolio : …\n\nBonne journée,\n'
        }
      };
      chips.addEventListener('click', (e)=>{
        const btn = e.target.closest('.chip'); if(!btn) return;
        const k = btn.dataset.key; const t = templates[k]; if(!t) return;
        if(subjectEl){ subjectEl.value = t.subject; subjectEl.focus(); subjectEl.setSelectionRange(subjectEl.value.length, subjectEl.value.length); }
        if(msgEl && (!msgEl.value || msgEl.value.length < 10)){
          msgEl.focus();
          typeInto(msgEl, t.message);
        }
      });
    }
  }

  document.addEventListener('includes-loaded', init);
})();
