(function(){
  var t0=performance.now(), campioni=[], resize=0, rafCount=0;
  addEventListener('resize',function(){resize++});
  var box=document.createElement('div');
  box.style.cssText='position:fixed;z-index:99999;left:10px;top:10px;width:520px;max-height:92vh;overflow:auto;'+
   'background:#0b0d10;color:#dfe3d8;border:1px solid #444;border-radius:10px;padding:14px 16px;'+
   'font:12px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap';
  box.textContent='misurazione in corso…';
  addEventListener('DOMContentLoaded',function(){document.body.appendChild(box)});

  function q(s){ return document.querySelector(s) }
  function top(el){ return el ? Math.round(el.getBoundingClientRect().top) : null }

  function tick(){
    rafCount++;
    var t=Math.round(performance.now()-t0);
    campioni.push({
      t:t,
      sy:Math.round(window.scrollY),
      pill:top(q('#film .pill')),
      h1:top(q('#h1')),
      sub:top(q('#sub')),
      hh:document.documentElement.scrollHeight,
      vh:innerHeight
    });
    if(t<4000) requestAnimationFrame(tick); else mostra();
  }

  function campo(k){
    var v=campioni.map(function(c){return c[k]}).filter(function(x){return x!==null});
    if(!v.length) return {min:'-',max:'-',cambi:0,quando:[]};
    var min=Math.min.apply(null,v), max=Math.max.apply(null,v), cambi=0, quando=[];
    for(var i=1;i<campioni.length;i++){
      if(campioni[i][k]!==campioni[i-1][k]){ cambi++; if(quando.length<10) quando.push(campioni[i].t+'ms:'+campioni[i-1][k]+'>'+campioni[i][k]); }
    }
    return {min:min,max:max,cambi:cambi,quando:quando};
  }

  function riga(nome,k){
    var c=campo(k);
    return nome+': '+c.min+' > '+c.max+'  (delta '+(c.max-c.min)+', cambi '+c.cambi+')\n'+
      (c.quando.length? '   '+c.quando.join('\n   ')+'\n' : '');
  }

  function mostra(){
    var testo='DIAGNOSI 21studio — primi 4 secondi\n'+
      'fotogrammi: '+rafCount+'   resize: '+resize+'\n'+
      'scrollRestoration: '+(history.scrollRestoration||'?')+'\n'+
      'font pronti: '+(document.fonts?document.fonts.status:'?')+'\n'+
      'classe html: "'+document.documentElement.className+'"\n'+
      'gsap: '+(window.gsap?'si':'NO')+'   ScrollTrigger: '+(window.ScrollTrigger?'si':'NO')+'\n'+
      '--------------------------------------------\n'+
      riga('scrollY   ','sy')+
      riga('pill.top  ','pill')+
      riga('h1.top    ','h1')+
      riga('sub.top   ','sub')+
      riga('altezzaPag','hh')+
      riga('altezzaFin','vh');
    box.textContent=testo;
  }

  requestAnimationFrame(tick);
})();
