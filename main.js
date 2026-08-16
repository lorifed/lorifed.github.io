/* 21studio — site interactions
   GSAP + ScrollTrigger + Lenis (CDN, vendor locally for production before deploy) */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- smooth scroll (Lenis) ---------- */
  let lenis;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.gsap.ticker) {
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- header on scroll ---------- */
  const header = document.querySelector('header.site');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  /* ---------- particle-network hubs (rif. foto reference: nucleo denso di particelle collegate, non un pattern piatto a griglia) ---------- */
  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  function buildParticleNet(seed) {
    const rand = seededRandom(seed);
    const N = 80;
    const R = 46;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const r = R * Math.pow(rand(), 0.55);
      const theta = rand() * Math.PI * 2;
      pts.push({
        x: 50 + r * Math.cos(theta),
        y: 50 + r * Math.sin(theta),
        rad: 0.7 + rand() * 2.1,
        op: 0.45 + rand() * 0.55
      });
    }
    const edges = [];
    const seen = new Set();
    for (let i = 0; i < pts.length; i++) {
      const dists = [];
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        dists.push({ j, d: Math.sqrt(dx * dx + dy * dy) });
      }
      dists.sort((a, b) => a.d - b.d);
      const k = rand() > 0.75 ? 3 : 2;
      for (let n = 0; n < k && n < dists.length; n++) {
        const j = dists[n].j;
        const key = i < j ? i + '-' + j : j + '-' + i;
        if (!seen.has(key) && dists[n].d < 20) {
          seen.add(key);
          edges.push({ a: pts[i], b: pts[j] });
        }
      }
    }
    let svg = '<svg class="particle-net" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    svg += '<g class="p-lines">';
    edges.forEach((e) => {
      svg += `<line x1="${e.a.x.toFixed(1)}" y1="${e.a.y.toFixed(1)}" x2="${e.b.x.toFixed(1)}" y2="${e.b.y.toFixed(1)}"></line>`;
    });
    svg += '</g><g class="p-dots">';
    pts.forEach((p) => {
      svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.rad.toFixed(2)}" fill-opacity="${p.op.toFixed(2)}"></circle>`;
    });
    svg += '</g></svg>';
    return svg;
  }
  document.querySelectorAll('.net-circle--hub').forEach((hub, i) => {
    hub.insertAdjacentHTML('afterbegin', buildParticleNet(1000 + i * 137));
  });

  /* ---------- icone nei nodi (persone / chiave) al posto del puntino pieno ---------- */
  const PEOPLE_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/><circle cx="15.7" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M3.4 18.2c0-2.9 2.3-4.6 5.1-4.6s5.1 1.7 5.1 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M12.7 13.8c2.3.2 4.1 1.9 4.1 4.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const KEY_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.8" cy="15.2" r="3.8" stroke="currentColor" stroke-width="1.4"/><path d="M10.4 12.6L18 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M15.2 6.8l2 2M12.7 9.3l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  document.querySelectorAll('.net-circle--node .net-circle-dot').forEach((dot) => {
    dot.classList.add('net-circle-icon');
    dot.innerHTML = PEOPLE_ICON;
  });
  document.querySelectorAll('.net-circle--tool .net-circle-dot').forEach((dot) => {
    dot.classList.add('net-circle-icon');
    dot.innerHTML = KEY_ICON;
  });

  /* ---------- gsap reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        delay: (i % 3) * 0.06
      });
    });

    /* hero content entrance */
    gsap.timeline({ delay: 0.15 })
      .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('.hero h1', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.45')
      .to('.hero .lede', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.hero-meta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    /* hero graphic: build up on scroll */
    const graphicPaths = gsap.utils.toArray('.hero-graphic .draw');
    if (graphicPaths.length) {
      graphicPaths.forEach((path) => {
        const len = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      });
      gsap.to(graphicPaths, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        stagger: 0.25,
        delay: 0.4
      });
      gsap.utils.toArray('.hero-graphic .node').forEach((node, i) => {
        gsap.fromTo(node, { scale: 0, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
          delay: 0.6 + i * 0.35
        });
      });
      gsap.fromTo('.hero-graphic .node-label', { opacity: 0 }, {
        opacity: 1, duration: 0.6, stagger: 0.35, delay: 1.1
      });
    }

    /* process items: subtle stagger line-draw */
    gsap.utils.toArray('.process-item').forEach((item) => {
      gsap.from(item, {
        opacity: 0, y: 24, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    /* counters */
    gsap.utils.toArray('[data-counter]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val); }
          });
        }
      });
    });

    /* parallax on diff panel accent bar height already handled via CSS */

    /* dashboard panel: log lines type in one by one once the panel is in view */
    const dashPanel = document.querySelector('.dashboard-panel');
    if (dashPanel) {
      ScrollTrigger.create({
        trigger: dashPanel,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to('.dash-log-line', {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.22,
            delay: 0.2
          });
        }
      });
    }

    /* network canvases (mappa Direttore + second brain map): staggered node reveal per-instance (rif. TheFounderOS G-BRAIN) */
    gsap.utils.toArray('.brain-map-canvas').forEach((canvas) => {
      const nodes = canvas.querySelectorAll('.brain-map-node');
      const hub = canvas.querySelector('.brain-map-hub');
      if (!nodes.length && !hub) return;
      if (nodes.length) gsap.set(nodes, { scale: 0.4, opacity: 0 });
      if (hub) gsap.set(hub, { scale: 0.85, opacity: 0 });
      ScrollTrigger.create({
        trigger: canvas,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          if (hub) gsap.to(hub, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
          if (nodes.length) gsap.to(nodes, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.09, delay: 0.25 });
        }
      });
    });

    ScrollTrigger.refresh();
  } else {
    /* no-JS-lib fallback: just show everything */
    document.querySelectorAll('.reveal, .hero-eyebrow, .hero h1, .hero .lede, .hero-cta, .hero-meta, .dash-log-line')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- second brain chat: typing effect (rif. Promptible.io) ---------- */
  const typedEl = document.querySelector('.brain-chat .typed-line');
  if (typedEl) {
    const prompts = [
      'Quanti lead nuovi abbiamo avuto questa settimana?',
      'Manda un promemoria ai clienti con preventivo in sospeso',
      'Riassumi le recensioni ricevute a ottobre'
    ];
    if (prefersReduced) {
      typedEl.textContent = prompts[0];
    } else {
      let p = 0, c = 0, deleting = false;
      (function typeLoop() {
        const current = prompts[p];
        typedEl.textContent = deleting ? current.substring(0, c--) : current.substring(0, c++);
        let delay = deleting ? 22 : 38;
        if (!deleting && c === current.length + 1) { delay = 1400; deleting = true; }
        if (deleting && c === 0) { deleting = false; p = (p + 1) % prompts.length; delay = 400; }
        setTimeout(typeLoop, delay);
      })();
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

});
