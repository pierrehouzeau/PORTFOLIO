// Animation des bandes de l'accueil (canvas #fx) — 2 lignes + 3 rubans
(function(){
  let W=0,H=0,dpr=1, rafId=null; let state=null;

  function resize(canvas){ const r=canvas.parentElement.getBoundingClientRect(); W=canvas.width=Math.floor(r.width*dpr); H=canvas.height=Math.floor(r.height*dpr); canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px'; }

  function init(){
    // Harmonise les bandes avec le dégradé de la scroll-bar (bleu → violet → vert)
    const style={
      alpha: 0.22,
      width: 3*dpr,
      colors: [
        'rgba(96,165,250,0.9)',   // #60a5fa
        'rgba(167,139,250,0.9)',  // #a78bfa
        'rgba(52,211,153,0.9)'    // #34d399
      ]
    };

    const back=[]; // 2 lignes (même style que les autres)
    for(let i=0;i<2;i++){
      const offset=Math.random()*1000;
      const pts=[]; const S=6; for(let s=0;s<=S;s++){ const t=s/S; const x=t*W; const y=(Math.random())*H; pts.push({x,y,dy:y}); }
      back.push({offset,pts});
    }
    const ribbons=[]; // 3 autres lignes (identiques en style)
    const bases=[0.22,0.46,0.70];
    for(let i=0;i<bases.length;i++){
      const offset=Math.random()*1000;
      const pts=[]; const S=8; for(let s=0;s<=S;s++){ const t=s/S; const x=t*W; const y=(Math.random())*H; pts.push({x,y,dy:y}); }
      ribbons.push({offset,pts});
    }
    state={back,ribbons,t:0,style};
  }

  function draw(ctx){ const d=state; d.t += 0.35; ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='source-over';
    // Paramètres communs pour des mouvements homogènes et fluides
    const k1=0.0016, k2=0.0011;        // fréquences proches pour douceur
    const vx1=1.0, vx2=1.0;            // mêmes vitesses pour toutes les bandes
    const smooth=0.06;                 // lissage (interpolation vers la cible)
    // Regrouper toutes les bandes et les dessiner avec le même style
    const bands=[...d.back, ...d.ribbons];
    const margin=Math.max(2*dpr, d.style.width*0.6); // proche du bord sans recouper
    for(const r of bands){ const t=d.t; for(let i=0;i<r.pts.length;i++){ const p=r.pts[i];
        const sum=Math.sin((p.x+t*vx1)*k1+r.offset)+Math.cos((p.x-t*vx2)*k2+r.offset*0.6); // [-2,2]
        const n=sum*0.5; // [-1,1]
        const wobble=Math.sin((i+t*0.034)+r.offset)*6;
        const y=margin + ((n+1)*0.5) * (H-2*margin) + wobble; // couvrent toute la hauteur
        const target=Math.max(margin, Math.min(H-margin, y));
        p.dy += (target - p.dy) * smooth; }
      ctx.beginPath(); for(let i=0;i<r.pts.length;i++){ const p=r.pts[i]; const pr=r.pts[i-1]; if(i===0) ctx.moveTo(p.x,p.dy); else { const mx=(pr.x+p.x)/2; const my=(pr.dy+p.dy)/2; ctx.quadraticCurveTo(pr.x,pr.dy,mx,my);} }
      const g=ctx.createLinearGradient(0,0,W,0);
      g.addColorStop(0, d.style.colors[0]);
      g.addColorStop(0.5, d.style.colors[1]);
      g.addColorStop(1, d.style.colors[2]);
      ctx.strokeStyle=g; ctx.lineWidth=d.style.width; ctx.lineCap='round';
      ctx.globalAlpha=d.style.alpha; ctx.shadowBlur=6*dpr; ctx.shadowColor='rgba(96,165,250,0.18)';
      ctx.stroke();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
    }
    ctx.globalCompositeOperation='source-over'; rafId=requestAnimationFrame(()=>draw(ctx)); }

  function start(){ const canvas=document.getElementById('fx'); if(!canvas) return; const ctx=canvas.getContext('2d'); dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1)); resize(canvas); init(); cancelAnimationFrame(rafId); rafId=requestAnimationFrame(()=>draw(ctx)); }
  function stop(){ cancelAnimationFrame(rafId); const canvas=document.getElementById('fx'); const ctx=canvas?.getContext('2d'); ctx?.clearRect(0,0,canvas.width,canvas.height); }

  document.addEventListener('includes-loaded', ()=>{
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ stop(); return; }
    start();
    window.addEventListener('resize', ()=>{ start(); });
  });
})();
