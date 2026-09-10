(function(){
const RID=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const box=document.getElementById('cvbox'), cv=document.getElementById('cvcv');
if(!box||!cv) return;
const ctx=cv.getContext('2d');
const btn=document.getElementById('cvplay'), cap=document.getElementById('cvcap'), st=document.getElementById('cvst');

/* le frasi del CEO */
const FRASI=[
 {f:'ceo-1', t:"Sono il CEO del tuo sistema. Dimmi cosa ti serve: lo passo all'agente giusto, e ti dico cosa sta facendo mentre lo fa."},
 {f:'ceo-2', t:"Ai tre lead di ieri non ha risposto nessuno. Ho pronti tre follow-up, uno per lead. Li mando?"},
 {f:'ceo-3', t:"Il preventivo è pronto, col listino di settembre. La consegna in due settimane però è fuori dai tuoi tempi: decidi tu."}
];
let giro=0;

let W=0,H=0,DPR=1,cx=0,cy=0,S=0,rot=0,amp=0,parla=false,t0=performance.now(),vista=true,attivo=false;
const rnd=s=>{const x=Math.sin(s*127.1)*43758.5453;return x-Math.floor(x)};

/* nuvola: sfera di Fibonacci */
let PT=[];
function build(){
  PT=[];
  const n = innerWidth<760 ? 1100 : 2800;
  for(let i=0;i<n;i++){
    const y=1-(i/(n-1))*2, r=Math.sqrt(Math.max(0,1-y*y));
    const th=i*2.399963229728653;
    PT.push({
      x:Math.cos(th)*r, y:y, z:Math.sin(th)*r,
      ph:rnd(i*7.1)*6.28, sp:.5+rnd(i*2.9)*1.3,
      k:rnd(i*4.7), tono: rnd(i*8.8)
    });
  }
}
function resize(){
  const r=box.getBoundingClientRect();
  DPR=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height;
  cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  cx=W/2; cy=H/2; S=Math.min(W,H)*.36;
  build();
}

const FOV=3.1;
function proj(x,y,z){
  const c=Math.cos(rot), s=Math.sin(rot);
  const X=x*c-z*s, Z=x*s+z*c;
  const cB=Math.cos(.18), sB=Math.sin(.18);
  const Y=y*cB-Z*sB, Z2=y*sB+Z*cB;
  const k=FOV/(FOV+Z2);
  return {x:cx+X*k*S, y:cy+Y*k*S, k, X:X};
}

function draw(now){
  const t=(now-t0)/1000;
  rot += parla ? .0016+amp*.004 : .0011;
  ctx.clearRect(0,0,W,H);

  const al=ctx.createRadialGradient(cx,cy,0,cx,cy,S*2.1);
  al.addColorStop(0,'rgba(183,193,126,'+(.10+amp*.18).toFixed(3)+')');
  al.addColorStop(.45,'rgba(183,193,126,'+(.03+amp*.06).toFixed(3)+')');
  al.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=al; ctx.beginPath(); ctx.arc(cx,cy,S*2.1,0,7); ctx.fill();

  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<PT.length;i++){
    const p=PT[i];
    const onda = Math.sin(t*p.sp+p.ph);
    const spinta = 1 + .035*onda + amp*(.10+.26*p.k)*(.5+.5*Math.sin(t*7+p.ph*3));
    const q=proj(p.x*spinta,p.y*spinta,p.z*spinta);
    if(q.k<=0) continue;
    const vic=(q.k-.72)/.62;
    const dim=(.5+q.k*1.2)*(1+amp*.5);
    const prof=Math.max(0,Math.min(1,(q.k-.70)/.56));
    const luce=.36+.64*Math.max(0,Math.min(1,(q.X*.70+.60)));
    let a=(.34+p.k*.44)*Math.pow(prof,.80)*luce*(.62+.38*onda);
    a*= parla ? (1+amp*1.5) : 1;
    a=Math.min(.95,a);
    let col;
    if(p.tono>.93) col='rgba(207,228,255,';
    else if(p.tono>.62) col='rgba(214,223,166,';
    else col='rgba(183,193,126,';
    if(vic<.20){
      const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,dim*3);
      g.addColorStop(0,col+(a*.45).toFixed(3)+')');
      g.addColorStop(1,col+'0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,dim*3,0,7); ctx.fill();
    } else {
      ctx.fillStyle=col+a.toFixed(3)+')';
      ctx.beginPath(); ctx.arc(q.x,q.y,dim*.50,0,7); ctx.fill();
    }
  }
  ctx.globalCompositeOperation='source-over';

  if(parla||amp>.01){
    ctx.strokeStyle='rgba(214,223,166,'+(.10+amp*.45).toFixed(3)+')';
    ctx.lineWidth=1+amp*2.4;
    ctx.beginPath(); ctx.arc(cx,cy,S*(1.12+amp*.30),0,7); ctx.stroke();
  }

  if(!RID && vista) requestAnimationFrame(draw); else attivo=false;
}
function avvia(){ if(attivo||RID) return; attivo=true; requestAnimationFrame(draw) }

/* voce */
let AC=null, an=null, dati=null, src=null, tCap=null;
function livello(){
  if(!an) return 0;
  an.getByteTimeDomainData(dati);
  let s=0; for(let i=0;i<dati.length;i++){const v=(dati[i]-128)/128; s+=v*v}
  return Math.min(1, Math.sqrt(s/dati.length)*3.4);
}
function seguiAmp(){
  if(!parla) return;
  amp = amp*.55 + livello()*.45;
  requestAnimationFrame(seguiAmp);
}
function finta(dur){
  const p=performance.now();
  (function loop(){
    if(!parla) return;
    const e=(performance.now()-p)/1000;
    if(e>dur){ stop(); return }
    const base=.45+.35*Math.sin(e*11.3)+.2*Math.sin(e*23.7+1.1);
    const pausa=Math.max(0,Math.sin(e*1.7))>.15?1:.12;
    amp = amp*.6 + Math.max(0,base)*pausa*.4;
    requestAnimationFrame(loop);
  })();
}
function didascalia(txt,dur){
  cap.textContent=''; cap.classList.add('on');
  const par=txt.split(' '); let i=0;
  const passo=Math.max(90,(dur*1000)/par.length);
  clearInterval(tCap);
  tCap=setInterval(()=>{
    if(i>=par.length){ clearInterval(tCap); return }
    cap.textContent += (i?' ':'')+par[i++];
  },passo);
}
function stop(){
  parla=false; clearInterval(tCap);
  btn.classList.remove('on'); st.textContent='Tocca per farlo parlare';
  const gi=setInterval(()=>{ amp*=.86; if(amp<.005){amp=0;clearInterval(gi)} },40);
  try{ src&&src.stop() }catch(e){}
  src=null;
}

const CACHE=new Map();
async function carica(nome){
  if(CACHE.has(nome)) return CACHE.get(nome);
  try{
    const r=await fetch('/voce/'+nome+'.mp3',{cache:'force-cache'});
    if(!r.ok) return null;
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const buf=await AC.decodeAudioData(await r.arrayBuffer());
    CACHE.set(nome,buf); return buf;
  }catch(e){ return null }
}
async function parlaOra(){
  if(parla){ stop(); return }
  const q=FRASI[giro % FRASI.length]; giro++;
  parla=true; btn.classList.add('on'); st.textContent='Sta parlando';
  avvia();
  const buf=await carica(q.f);
  if(!parla) return;
  if(buf && AC){
    if(AC.state==='suspended') await AC.resume();
    an = an || AC.createAnalyser();
    an.fftSize=1024; dati=new Uint8Array(an.fftSize);
    src=AC.createBufferSource(); src.buffer=buf;
    src.connect(an); an.connect(AC.destination);
    src.onended=stop;
    src.start();
    didascalia(q.t, buf.duration);
    seguiAmp();
  } else {
    const dur=Math.max(3.2, q.t.split(' ').length/2.7);
    didascalia(q.t, dur);
    finta(dur);
  }
}
btn.addEventListener('click',parlaOra);
box.addEventListener('click',e=>{ if(e.target===cv) parlaOra() });

resize(); addEventListener('resize',resize);
if('IntersectionObserver' in window){
  new IntersectionObserver(es=>es.forEach(e=>{ vista=e.isIntersecting; if(vista) avvia() }),{rootMargin:'160px'}).observe(box);
}
if(RID){ draw(performance.now()) } else { avvia() }
document.addEventListener('visibilitychange',()=>{ if(!document.hidden&&vista) avvia() });
})();
