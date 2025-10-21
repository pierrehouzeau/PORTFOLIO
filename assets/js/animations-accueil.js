// Animation des bandes de l'accueil (canvas #fx) — 2 lignes + 4 rubans
(function(){
  let W=0,H=0,dpr=1, rafId=null; let state=null;

  function resize(canvas){ const r=canvas.parentElement.getBoundingClientRect(); W=canvas.width=Math.floor(r.width*dpr); H=canvas.height=Math.floor(r.height*dpr); canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px'; }

  function init(){
    const back=[]; // 2 lignes épaisses
    for(let i=0;i<2;i++){
      const hue=210+Math.random()*40, sat=60+Math.random()*12, alpha=0.08+Math.random()*0.05;
      const baseY=H*(0.28 + i*0.24), amp=60+Math.random()*40, offset=Math.random()*1000;
      const pts=[]; const S=6; for(let s=0;s<=S;s++){ const t=s/S; const x=t*W; const y=baseY+(Math.random()-0.5)*40; pts.push({x,y}); }
      back.push({hue,sat,alpha,baseY,amp,offset,pts});
    }
    const ribbons=[]; // 4 rubans fins (plage verticale élargie)
    const bases=[0.22,0.36,0.52,0.70];
    for(let i=0;i<bases.length;i++){
      const hue=214+Math.random()*40, sat=70+Math.random()*20, alpha=0.22+Math.random()*0.12;
      // Amplitude augmentée pour autoriser des oscillations plus haut/bas
      const baseY=H*bases[i], amp=50+Math.random()*70, offset=Math.random()*1000;
      const pts=[]; const S=8; for(let s=0;s<=S;s++){ const t=s/S; const x=t*W; const y=baseY+(Math.random()-0.5)*30; pts.push({x,y}); }
      ribbons.push({hue,sat,alpha,baseY,amp,offset,pts});
    }
    state={back,ribbons,t:0};
  }

  function draw(ctx){ const d=state; d.t += 1.15; ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter';
    // Lignes de fond (légèrement plus rapides)
    for(const r of d.back){ const t=d.t,k1=0.0017,k2=0.0012; for(let i=0;i<r.pts.length;i++){ const p=r.pts[i]; const n=Math.sin((p.x+t)*k1+r.offset)+Math.cos((p.x-t)*k2+r.offset*0.5); p.dy=Math.max(10*dpr,Math.min(H-10*dpr, r.baseY+n*r.amp)); }
      ctx.beginPath(); for(let i=0;i<r.pts.length;i++){ const p=r.pts[i]; const pr=r.pts[i-1]; if(i===0) ctx.moveTo(p.x,p.dy); else { const mx=(pr.x+p.x)/2; const my=(pr.dy+p.dy)/2; ctx.quadraticCurveTo(pr.x,pr.dy,mx,my);} }
      const g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,`hsla(${r.hue},${r.sat}%,65%,${r.alpha})`); g.addColorStop(1,`hsla(${r.hue+15},${r.sat-15}%,60%,${r.alpha*0.7})`);
      ctx.strokeStyle=g; ctx.lineWidth=8*dpr; ctx.filter='blur(12px)'; ctx.stroke(); ctx.filter='none'; }
    // Rubans (oscillations plus amples)
    for(const r of d.ribbons){ const t=d.t,k1=0.0027,k2=0.0015; for(let i=0;i<r.pts.length;i++){ const p=r.pts[i]; const n=Math.sin((p.x+t*2.3)*k1+r.offset)+Math.cos((p.x-t*3.2)*k2+r.offset*0.7); p.dy=Math.max(10*dpr,Math.min(H-10*dpr, r.baseY+n*r.amp+(Math.sin((i+t*0.034)+r.offset)*10))); }
      ctx.beginPath(); for(let i=0;i<r.pts.length;i++){ const p=r.pts[i]; const pr=r.pts[i-1]; if(i===0) ctx.moveTo(p.x,p.dy); else { const mx=(pr.x+p.x)/2; const my=(pr.dy+p.dy)/2; ctx.quadraticCurveTo(pr.x,pr.dy,mx,my);} }
      const g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,`hsla(${r.hue},${r.sat}%,58%,${r.alpha})`); g.addColorStop(1,`hsla(${r.hue+10},${r.sat-10}%,54%,${r.alpha*0.8})`);
      ctx.strokeStyle=g; ctx.lineWidth=3*dpr; ctx.stroke(); }
    ctx.globalCompositeOperation='source-over'; rafId=requestAnimationFrame(()=>draw(ctx)); }

  function start(){ const canvas=document.getElementById('fx'); if(!canvas) return; const ctx=canvas.getContext('2d'); dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1)); resize(canvas); init(); cancelAnimationFrame(rafId); rafId=requestAnimationFrame(()=>draw(ctx)); }
  function stop(){ cancelAnimationFrame(rafId); const canvas=document.getElementById('fx'); const ctx=canvas?.getContext('2d'); ctx?.clearRect(0,0,canvas.width,canvas.height); }

  document.addEventListener('includes-loaded', ()=>{
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ stop(); return; }
    start();
    window.addEventListener('resize', ()=>{ start(); });
  });
})();
