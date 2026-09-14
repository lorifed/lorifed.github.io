(function(){
  if(!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* 1 — barra di avanzamento in cima */
  var barra=document.createElement('div'); barra.id='avanz'; document.body.appendChild(barra);
  gsap.to(barra,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});

  /* 2 — i titoli entrano riga per riga */
  document.querySelectorAll('main section h2').forEach(function(h){
    if(h.closest('#film')) return;
    var sp;
    try{ sp=new SplitText(h,{type:'lines',mask:'lines',linesClass:'riga'}); }catch(e){ return }
    gsap.from(sp.lines,{yPercent:112,duration:.95,ease:'expo.out',stagger:.085,
      scrollTrigger:{trigger:h,start:'top 88%',once:true}});
  });

/* 4 — parallasse: i pannelli scorrono un filo piu lenti del testo */
  function parallasse(sel,forza){
    document.querySelectorAll(sel).forEach(function(el){
      var g=document.createElement('div'); g.className='par';
      el.parentNode.insertBefore(g,el); g.appendChild(el);
      gsap.fromTo(g,{y:forza},{y:-forza,ease:'none',
        scrollTrigger:{trigger:g,start:'top bottom',end:'bottom top',scrub:.6}});
    });
  }
  parallasse('#team .sbpanel',26);
  parallasse('#ceo .sbpanel',26);
  parallasse('#dentro .frame',20);

  /* 5 — il cervello si avvicina mentre entra */
  var core=document.getElementById('nucore');
  if(core) gsap.fromTo(core,{scale:.94},{scale:1,ease:'none',
    scrollTrigger:{trigger:core,start:'top bottom',end:'top 30%',scrub:.7}});

  /* 6 — le schede si alzano una dopo l'altra */
  [['#percorso .stepcard',.09],['.dove-g .dove-c',.12]].forEach(function(p){
    var el=[].slice.call(document.querySelectorAll(p[0])).filter(function(e){return !e.classList.contains('rise')});
    if(!el.length) return;
    gsap.from(el,{y:26,opacity:0,duration:.8,ease:'power3.out',stagger:p[1],
      scrollTrigger:{trigger:el[0],start:'top 86%',once:true}});
  });

  /* le mie aggiunte cambiano l'altezza della pagina: i trigger del sito
     erano tarati su quella di prima, quindi vanno ricalcolati */
  addEventListener('load',function(){ ScrollTrigger.refresh() },{once:true});

  /* rete di sicurezza: se qualcosa resta invisibile pur essendo a schermo, lo mostro */
  setTimeout(function(){
    document.querySelectorAll('.rise').forEach(function(e){
      var r=e.getBoundingClientRect();
      if(r.top<innerHeight&&r.bottom>0&&getComputedStyle(e).opacity==='0'){
        gsap.to(e,{opacity:1,y:0,duration:.6,ease:'power3.out'});
      }
    });
  },1500);
})();
