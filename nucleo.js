(function(){
const RID=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const MOB=innerWidth<760||!!(window.matchMedia&&window.matchMedia('(hover:none)').matches);
let vista=true, giro=false;
const box=document.getElementById('nucore'), cv=document.getElementById('nucv'), ctx=cv.getContext('2d');
const dw=document.getElementById('nudw');

/* ═════════ dati ═════════ */
const DEPS=[
 {id:'command', nome:'Command',      n:4, col:'#B7C17E', path:'brain/command',
  txt:'Dove tutto converge. Ogni richiesta arriva qui, viene smistata al reparto che sa farla e ricontrollata prima di tornare da te.',
  ag:[['Direttore','lavora','4 job'],['Approvazioni','aspetta','6 in coda'],['Controllo qualità','lavora','3 job'],['Assistente','fermo','2 job']]},
 {id:'content', nome:'Content',      n:6, col:'#B7C17E', path:'brain/content',
  txt:'Ricerca, copy, video, design, social. Ogni lunedì riparte da quello che ha funzionato la settimana prima.',
  ag:[['Copywriter','lavora','12 job'],['Video editor','lavora','7 job'],['Designer','fermo','3 job'],['Social','aspetta','4 job'],['Ricerca','lavora','1 job'],['Voce del brand','fermo','4 job']]},
 {id:'marketing',nome:'Marketing',   n:4, col:'#B7C17E', path:'brain/marketing',
  txt:'Campagne, funnel, performance. Controlla la spesa ogni mattina e si ferma prima di alzare un budget.',
  ag:[['Meta Ads','aspetta','3 job'],['Funnel','lavora','3 job'],['Analisi','lavora','3 job'],['PR','fermo','2 job']]},
 {id:'sales',   nome:'Sales',        n:6, col:'#D6DFA6', path:'brain/sales',
  txt:'Primo contatto, qualifica, preventivi, follow-up. Il CRM si aggiorna da solo leggendo mail, call e calendario.',
  ag:[['Outbound','lavora','17 job'],['Lead manager','lavora','2 job'],['Assistente call','fermo','3 job'],['Preventivi','aspetta','3 job'],['Deal desk','lavora','4 job'],['CRM','lavora','4 job']]},
 {id:'delivery',nome:'Delivery',     n:5, col:'#E0A26F', path:'brain/delivery',
  txt:'Il prodotto: dalla mappa dei processi alla configurazione, al collaudo, alla consegna al tuo team.',
  ag:[['Consulente audit','lavora','3 job'],['Configuratore','lavora','3 job'],['Collaudo','fermo','3 job'],['Project manager','lavora','4 job'],['Monitoraggio','lavora','4 job']]},
 {id:'customer',nome:'Customer',     n:4, col:'#7FA7E0', path:'brain/customer',
  txt:'Assistenza, avvio, community. Svuota la coda ogni sera e passa a Sales chi vale una call.',
  ag:[['Assistenza','lavora','3 job'],['Onboarding','aspetta','3 job'],['Customer success','fermo','2 job'],['Community','lavora','3 job']]},
 {id:'intel',   nome:'Intelligence', n:5, col:'#7FA7E0', path:'brain/intelligence',
  txt:'Concorrenti, mercato, prospect. Ti scrive solo quando è cambiato qualcosa che ti riguarda.',
  ag:[['Dossier','lavora','1 job'],['Competitor','lavora','2 job'],['Mercato','fermo','2 job'],['Tecnologie','fermo','1 job'],['Account watch','aspetta','4 job']]},
 {id:'back',    nome:'Back Office',  n:6, col:'#E0A26F', path:'brain/back-office',
  txt:'Amministrazione, documenti, sicurezza, persone. La parte che non si vede e che non deve mai fermarsi.',
  ag:[['Finance','aspetta','3 job'],['Amministrazione','lavora','4 job'],['Automazioni','lavora','3 job'],['Documenti','fermo','2 job'],['Sicurezza','lavora','4 job'],['Persone','fermo','2 job']]}
];
/* etichette-agente sparse, come le loro */
const PICK=[['sales',0],['sales',4],['sales',5],['content',0],['content',1],['content',3],
            ['marketing',0],['marketing',1],['command',0],['command',1],
            ['intel',1],['intel',2],['back',0],['back',3],['customer',0],['delivery',1]];

/* ═════════ stato ═════════ */
let W=0,H=0,DPR=1,cx=0,cy=0,S=0;
let rotY=0, rotX=.12, velY=.00035, dragging=false, last={x:0,y:0};
let mouse={x:-9999,y:-9999,in:false};
let hover=null, sel=null, t0=performance.now();
const rnd=s=>{const x=Math.sin(s*127.1)*43758.5453;return x-Math.floor(x)};

/* nuvola di punti in profondità */
let cloud=[];
function buildCloud(){
  cloud=[];
  const n=MOB?150:Math.min(460,Math.round(W*H/2600));
  for(let i=0;i<n;i++){
    const th=rnd(i*1.7)*Math.PI*2, ph=Math.acos(2*rnd(i*3.3)-1), r=.35+Math.pow(rnd(i*5.9),.5)*.95;
    cloud.push({
      x:Math.sin(ph)*Math.cos(th)*r, y:Math.cos(ph)*r*.62, z:Math.sin(ph)*Math.sin(th)*r,
      ph:rnd(i*7.1)*6.28, sp:.2+rnd(i*2.9)*.6, s:.5+rnd(i*4.1)*1.4,
      tono: rnd(i*8.8)<.18?1:0
    });
  }
}

/* nodi: nucleo, reparti (hub), agenti scelti */
const N=[];
function buildNodes(){
  N.length=0;
  DEPS.forEach((d,i)=>{
    const th=i/DEPS.length*Math.PI*2+.5, r=1.02;
    N.push({t:'hub',dep:d,i,bx:Math.cos(th)*r,by:(rnd(i*11)-.5)*.42,bz:Math.sin(th)*r,
      ph:rnd(i*13)*6.28, sp:.18+rnd(i*19)*.30});
  });
  PICK.forEach(([id,k],j)=>{
    const d=DEPS.find(x=>x.id===id), h=N.find(x=>x.t==='hub'&&x.dep===d);
    const a=rnd(j*17.3)*6.28, rr=.30+rnd(j*23.1)*.22;
    N.push({t:'ag',dep:d,k,hub:h,nome:d.ag[k][0],stato:d.ag[k][1],job:d.ag[k][2],
      bx:h.bx+Math.cos(a)*rr, by:h.by+(rnd(j*29)-.5)*.36, bz:h.bz+Math.sin(a)*rr,
      ph:rnd(j*31)*6.28, sp:.22+rnd(j*37)*.42});
  });
}

/* impulsi */
let P=[];
function pulse(){
  const ags=N.filter(n=>n.t==='ag');
  const a=ags[Math.floor(Math.random()*ags.length)];
  P.push({ag:a,t:0,sp:.007+Math.random()*.009});
}

function resize(){
  const r=box.getBoundingClientRect();
  DPR=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height;
  cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  cx=W/2; cy=H/2; S=Math.min(W,H)*.46;
  buildCloud(); makeLabels();
  document.getElementById('nubNeur').textContent=(cloud.length*7).toLocaleString('it-IT')+' sinapsi · 8 regioni';
}

/* proiezione 3D → 2D */
const FOV=2.6;
function proj(x,y,z,t,drift){
  if(drift){ x+=Math.sin(t*drift.sp+drift.ph)*.035; y+=Math.cos(t*drift.sp*.8+drift.ph)*.03; }
  const cA=Math.cos(rotY), sA=Math.sin(rotY);
  let X=x*cA - z*sA, Z=x*sA + z*cA;
  const cB=Math.cos(rotX), sB=Math.sin(rotX);
  let Y=y*cB - Z*sB; Z=y*sB + Z*cB;
  const k=FOV/(FOV+Z);
  return {x:cx+X*k*S, y:cy+Y*k*S, k, z:Z};
}

/* ═════════ etichette ═════════ */
let labels=[];
function makeLabels(){
  labels.forEach(l=>l.el.remove()); labels=[];
  N.forEach(n=>{
    const el=document.createElement('div');
    if(n.t==='hub'){ el.className='node hub'; el.innerHTML='◎ '+n.dep.nome.toUpperCase()+'<em>'+n.dep.n+'</em>'; }
    else{ el.className='node'; el.textContent=n.nome; }
    el.addEventListener('mouseenter',()=>hover=n.dep.id);
    el.addEventListener('mouseleave',()=>hover=null);
    el.addEventListener('click',e=>{e.stopPropagation();apri(n.dep)});
    box.appendChild(el); labels.push({el,n});
  });
}
function moveLabels(t){
  labels.forEach(({el,n})=>{
    const p=proj(n.bx,n.by,n.bz,t,n);
    const acceso = !cur() || cur()===n.dep.id;
    el.style.transform='translate(-50%,-50%) translate('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px) scale('+(.82+p.k*.3).toFixed(3)+')';
    el.style.opacity = (acceso? Math.min(1,p.k*1.15) : .12).toFixed(2);
    el.style.zIndex = 4+Math.round(p.k*10);
    el.classList.toggle('on', cur()===n.dep.id);
    el.style.pointerEvents = acceso?'auto':'none';
  });
}
const cur=()=> sel?sel.id:hover;

/* ═════════ pannello ═════════ */
function apri(d){
  sel=d;
  document.getElementById('nudwName').textContent=d.nome.toUpperCase();
  document.getElementById('nudwAv').textContent=d.nome[0];
  document.getElementById('nudwTit').textContent=d.nome;
  document.getElementById('nudwSub').textContent='reparto · '+d.n+' agenti';
  document.getElementById('nudwTxt').textContent=d.txt;
  document.getElementById('nudwPath').textContent=d.path;
  document.getElementById('nudwRows').innerHTML=d.ag.map(a=>
    '<div class="row"><u><i class="'+(a[1]==='lavora'?'':a[1]==='aspetta'?'w':'f')+'"></i>'+a[0]+'</u><span>'+a[2]+'</span></div>').join('');
  dw.classList.add('on');
}
function chiudi(){ sel=null; dw.classList.remove('on') }
document.getElementById('nudwX').addEventListener('click',chiudi);
document.getElementById('nudwTabs').addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON')return;
  [...e.currentTarget.children].forEach(b=>b.classList.toggle('on',b===e.target));
});
document.getElementById('nutabs').addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON')return;
  [...e.currentTarget.children].forEach(b=>b.classList.toggle('on',b===e.target));
});
document.getElementById('nuseg').addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON')return;
  [...e.currentTarget.children].forEach(b=>b.classList.toggle('on',b===e.target));
});

/* ═════════ mouse e trascinamento ═════════ */
box.addEventListener('pointerdown',e=>{
  if(MOB||e.target!==cv) return;
  dragging=true; last={x:e.clientX,y:e.clientY}; box.setPointerCapture(e.pointerId);
});
box.addEventListener('pointerup',()=>dragging=false);
box.addEventListener('pointermove',e=>{
  const r=box.getBoundingClientRect();
  mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.in=true;
  if(dragging){
    rotY += (e.clientX-last.x)*.005;
    rotX = Math.max(-.5,Math.min(.5, rotX + (e.clientY-last.y)*.003));
    last={x:e.clientX,y:e.clientY}; velY=0;
  }
});
box.addEventListener('pointerleave',()=>{mouse.in=false;dragging=false;hover=null});
box.addEventListener('click',e=>{ if(e.target===cv) chiudi() });

/* ═════════ disegno ═════════ */
function draw(now){
  const t=(now-t0)/1000;
  if(!dragging) rotY += velY;
  ctx.clearRect(0,0,W,H);
  const attivo=cur(), giu=attivo?.16:1;

  /* 1 · nuvola in profondità, con sfocatura sui lontani */
  const pts=cloud.map(c=>{
    const p=proj(c.x,c.y,c.z,t,c);
    return {p,c};
  }).sort((a,b)=>a.p.k-b.p.k);

  ctx.globalCompositeOperation='lighter';
  pts.forEach(({p,c})=>{
    if(p.k<=0) return;
    const pul=.55+.45*Math.sin(t*c.sp*2+c.ph);
    const near=(p.k-.6)/.8;
    const r=c.s*(.6+p.k*1.5);
    const a=(c.tono?.55:.3)*pul*giu*Math.min(1,p.k*1.1);
    if(near<.35){ /* lontano → alone morbido, effetto sfocato */
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3.2);
      g.addColorStop(0,'rgba(183,193,126,'+(a*.5).toFixed(3)+')');
      g.addColorStop(1,'rgba(183,193,126,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,r*3.2,0,7); ctx.fill();
    }else{
      ctx.fillStyle=(c.tono?'rgba(214,223,166,':'rgba(183,193,126,')+a.toFixed(3)+')';
      ctx.beginPath(); ctx.arc(p.x,p.y,r*.75,0,7); ctx.fill();
    }
  });
  ctx.globalCompositeOperation='source-over';

  /* fili sottili fra punti vicini */
  ctx.lineWidth=1;
  for(let i=0;i<pts.length;i+=2){
    for(let j=i+2;j<i+10&&j<pts.length;j+=2){
      const A=pts[i].p,B=pts[j].p;
      if(A.k<.5||B.k<.5) continue;
      const d=Math.hypot(A.x-B.x,A.y-B.y);
      if(d<S*.19){
        ctx.strokeStyle='rgba(183,193,126,'+((1-d/(S*.19))*.10*giu).toFixed(3)+')';
        ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();
      }
    }
  }

  /* 2 · fili nucleo → hub → agente, tratteggiati e in movimento */
  const O={x:cx,y:cy};
  ctx.setLineDash([2,5]); ctx.lineDashOffset=-t*22;
  N.forEach(n=>{
    if(n.t!=='hub') return;
    const p=proj(n.bx,n.by,n.bz,t,n);
    const on=!attivo||attivo===n.dep.id;
    ctx.strokeStyle=on?'rgba(183,193,126,.34)':'rgba(183,193,126,.06)';
    ctx.lineWidth=on?1.2:1;
    ctx.beginPath();ctx.moveTo(O.x,O.y);ctx.lineTo(p.x,p.y);ctx.stroke();
  });
  ctx.setLineDash([]);
  N.forEach(n=>{
    if(n.t!=='ag') return;
    const a=proj(n.bx,n.by,n.bz,t,n), h=proj(n.hub.bx,n.hub.by,n.hub.bz,t,n.hub);
    const on=!attivo||attivo===n.dep.id;
    ctx.strokeStyle=on?'rgba(255,255,255,.15)':'rgba(255,255,255,.03)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(a.x,a.y);ctx.stroke();
  });

  /* 3 · impulsi */
  ctx.globalCompositeOperation='lighter';
  P.forEach(q=>{
    q.t+=q.sp;
    const h=proj(q.ag.hub.bx,q.ag.hub.by,q.ag.hub.bz,t,q.ag.hub);
    const a=proj(q.ag.bx,q.ag.by,q.ag.bz,t,q.ag);
    let x,y;
    if(q.t<1){ x=O.x+(h.x-O.x)*q.t; y=O.y+(h.y-O.y)*q.t }
    else{ const k=q.t-1; x=h.x+(a.x-h.x)*k; y=h.y+(a.y-h.y)*k }
    const on=!attivo||attivo===q.ag.dep.id, al=on?1:.12;
    const g=ctx.createRadialGradient(x,y,0,x,y,10);
    g.addColorStop(0,'rgba(230,240,200,'+(.95*al)+')');
    g.addColorStop(1,'rgba(183,193,126,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.fill();
  });
  P=P.filter(q=>q.t<2);

  /* 4 · il vortice al centro */
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,S*.85);
  glow.addColorStop(0,'rgba(150,190,255,.14)');
  glow.addColorStop(.35,'rgba(120,160,230,.05)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,S*.85,0,7);ctx.fill();

  const RR=S*.42;
  for(let i=0;i<7;i++){
    const sp=.22+i*.085, tilt=i*.62+t*sp, sq=.20+.30*Math.abs(Math.sin(t*.31+i));
    const a0=t*(.55+i*.14)+i*1.9, a1=a0+1.5+Math.sin(t*.4+i)*.8;
    ctx.save();
    ctx.translate(cx,cy); ctx.rotate(tilt); ctx.scale(1,sq);
    const g=ctx.createLinearGradient(-RR,0,RR,0);
    g.addColorStop(0,'rgba(120,170,255,0)');
    g.addColorStop(.45,'rgba(220,236,255,'+(.55-i*.05)+')');
    g.addColorStop(.75,'rgba(255,255,255,'+(.75-i*.07)+')');
    g.addColorStop(1,'rgba(140,190,255,0)');
    ctx.strokeStyle=g; ctx.lineWidth=(7-i)*.9+1; ctx.lineCap='round';
    ctx.shadowColor='rgba(160,200,255,.7)'; ctx.shadowBlur=22;
    ctx.beginPath(); ctx.arc(0,0,RR*(.62+i*.055),a0,a1); ctx.stroke();
    ctx.restore();
  }
  for(let i=0;i<18;i++){
    const a=t*(.5+rnd(i)*1.4)+i, rr=RR*(.5+rnd(i*3)*.62), sq=.3+rnd(i*7)*.5;
    const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr*sq;
    ctx.fillStyle='rgba(235,245,255,'+(.25+rnd(i*5)*.5)+')';
    ctx.beginPath();ctx.arc(x,y,1.1+rnd(i*9),0,7);ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
  const hole=ctx.createRadialGradient(cx,cy,0,cx,cy,RR*.52);
  hole.addColorStop(0,'#02040A'); hole.addColorStop(.75,'#03050B'); hole.addColorStop(1,'rgba(3,5,11,0)');
  ctx.fillStyle=hole;ctx.beginPath();ctx.arc(cx,cy,RR*.52,0,7);ctx.fill();

  /* 5 · pallini dei nodi sopra il canvas */
  N.forEach(n=>{
    const p=proj(n.bx,n.by,n.bz,t,n);
    if(p.k<=0) return;
    const on=!attivo||attivo===n.dep.id;
    if(n.t==='hub'){
      ctx.strokeStyle=on?'rgba(214,223,166,.8)':'rgba(183,193,126,.15)';
      ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,5.5*p.k,0,7);ctx.stroke();
      ctx.fillStyle='#05070B';ctx.fill();
      if(on){ctx.fillStyle='rgba(214,223,166,.9)';ctx.beginPath();ctx.arc(p.x,p.y,1.9*p.k,0,7);ctx.fill()}
    }else{
      const col = n.stato==='lavora'?[183,193,126]: n.stato==='aspetta'?[127,167,224]:[242,243,239];
      const pul=.6+.4*Math.sin(t*1.7+n.ph);
      if(on&&n.stato!=='fermo'){
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,12*p.k);
        g.addColorStop(0,'rgba('+col+','+(.30*pul)+')');g.addColorStop(1,'rgba('+col+',0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,12*p.k,0,7);ctx.fill();
      }
      ctx.fillStyle='rgba('+col+','+((on?.95:.14)*(n.stato==='fermo'?.55:pul)).toFixed(3)+')';
      ctx.beginPath();ctx.arc(p.x,p.y,(n.stato==='fermo'?2:2.9)*p.k,0,7);ctx.fill();
    }
  });

  moveLabels(t);
  if(!RID && vista) requestAnimationFrame(draw); else giro=false;
}

/* orologio */
setInterval(()=>{
  const s=Math.floor((performance.now()-t0)/1000), p=v=>String(v).padStart(2,'0');
  document.getElementById('nukUp').textContent=p(s/3600|0)+':'+p((s/60|0)%60)+':'+p(s%60);
  const j=document.getElementById('nukJob'); j.textContent=(25967+ (s*3|0)).toLocaleString('it-IT');
},1000);

buildNodes(); resize(); addEventListener('resize',resize);
function avvia(){ if(giro||RID) return; giro=true; requestAnimationFrame(draw) }
if(RID){ draw(performance.now()); }
else{
  for(let i=0;i<6;i++) pulse();
  setInterval(()=>{ if(vista && !document.hidden && P.length<16) pulse() },380);
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>es.forEach(e=>{ vista=e.isIntersecting; if(vista) avvia() }),
      {rootMargin:'120px'}).observe(box);
  } else { vista=true; }
  avvia();
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden && vista) avvia() });
}
})();
