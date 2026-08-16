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

    ScrollTrigger.refresh();
  } else {
    /* no-JS-lib fallback: just show everything */
    document.querySelectorAll('.reveal, .hero-eyebrow, .hero h1, .hero .lede, .hero-cta, .hero-meta')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
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
