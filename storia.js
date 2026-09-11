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

  /* 3 — occhiello: compare e la pallina si accende */
  document.querySelectorAll('main .kicker').forEach(function(k){
    var t=gsap.timeline({scrollTrigger:{trigger:k,start:'top 92%',once:true}});
    t.from(k,{opacity:0,duration:.5,ease:'power2.out'});
    var i=k.querySelector('i');
    if(i) t.from(i,{scale:0,duration:.5,ease:'back.out(3)'},'-=.3');
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
  [['#percorso .stepcard',.09],['.g3 .asset',.1],['.dove-g .dove-c',.12],['#routine .t-card',.07]].forEach(function(p){
    var el=document.querySelectorAll(p[0]); if(!el.length) return;
    gsap.from(el,{y:26,opacity:0,duration:.8,ease:'power3.out',stagger:p[1],
      scrollTrigger:{trigger:el[0],start:'top 86%',once:true}});
  });

  ScrollTrigger.refresh();
})();
