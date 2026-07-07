(function () {
  'use strict';

  var homeView = document.getElementById('home-view');
  var caseView = document.getElementById('case-view');
  var grid = document.getElementById('projects-grid');
  var countEl = document.getElementById('project-count');

  var NUMS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto'];

  // ---------- WhatsApp links ----------
  ['wa-header', 'wa-hero', 'wa-cta', 'wa-footer'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = WA_LINK;
  });

  // ---------- Icons ----------
  var lockSvg = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  var imgIconSvg = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5.5-5.5L9 17"/></svg>';

  // ---------- Shot area (image or placeholder) ----------
  function shotAreaHTML(p, hint) {
    if (p.shot) {
      return '<div class="shot-area"><img src="' + p.shot + '" alt="Screenshot ' + p.name + '" loading="lazy"></div>';
    }
    return '<div class="shot-area"><div class="shot-placeholder">' + imgIconSvg + '<span>' + hint + '</span></div></div>';
  }

  function pillHTML(p) {
    if (p.private) {
      return '<span class="pill">' + lockSvg + 'anteprima privata</span>';
    }
    return '<span class="pill">' + p.url + '</span>';
  }

  // ---------- Render project card ----------
  function cardHTML(p, i) {
    return (
      '<button class="card" data-open="' + p.slug + '" data-reveal>' +
        '<div class="card-shot">' +
          '<div class="browser-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>' + pillHTML(p) + '</div>' +
          shotAreaHTML(p, 'Screenshot ' + p.name + ' in arrivo') +
        '</div>' +
        '<div class="card-meta">' +
          '<div class="card-cat">' + p.category + '</div>' +
          '<h3 class="card-name">' + p.name + '</h3>' +
          '<p class="card-metric">' + p.metrics.map(function (m) { return m.v + ' ' + m.l; }).slice(0, 1)[0] + '</p>' +
        '</div>' +
      '</button>'
    );
  }

  function renderGrid() {
    grid.innerHTML = PROJECTS.map(cardHTML).join('');
    countEl.textContent = (NUMS[PROJECTS.length] || PROJECTS.length) + ' progetti';
    grid.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        location.hash = '#/case/' + btn.getAttribute('data-open');
      });
    });
  }

  // ---------- Render case study ----------
  function caseHTML(p) {
    var actions = p.private
      ? '<div class="nda-badge">' + lockSvg + ' Anteprima privata — su richiesta</div>'
      : '<a class="btn-accent btn-live" href="' + p.liveUrl + '" target="_blank" rel="noopener">Vedi il sito live <span>↗</span></a>';

    var facts = p.facts.map(function (f) {
      return '<div><div class="fact-k">' + f.k + '</div><div class="fact-v">' + f.v + '</div></div>';
    }).join('');

    var services = p.services.map(function (s, i) {
      return '<li><span class="num">' + String(i + 1).padStart(2, '0') + '</span><span class="txt">' + s + '</span></li>';
    }).join('');

    var metrics = p.metrics.map(function (m) {
      return '<div class="metric-card"><div class="metric-val">' + m.v + '</div><div class="metric-label">' + m.l + '</div></div>';
    }).join('');

    return (
      '<button class="back-btn" data-go-home>← Tutti i progetti</button>' +
      '<div data-reveal>' +
        '<div class="case-category">' + p.category + '</div>' +
        '<h1 class="case-title">' + p.name + '</h1>' +
        '<div class="case-actions">' + actions + '</div>' +
      '</div>' +
      '<div class="case-shot-frame" data-reveal>' +
        '<div class="browser-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="pill">' + p.url + '</span></div>' +
        shotAreaHTML(p, 'Screenshot ' + p.name + ' in arrivo') +
      '</div>' +
      '<div class="case-facts" data-reveal>' + facts + '</div>' +
      '<div class="case-block" data-reveal>' +
        '<div class="block-label">Overview</div>' +
        '<p class="case-overview">' + p.overview + '</p>' +
      '</div>' +
      '<div class="case-block" data-reveal>' +
        '<div class="block-label">Servizi erogati</div>' +
        '<ul class="services-list">' + services + '</ul>' +
      '</div>' +
      '<div class="case-block" data-reveal>' +
        '<div class="block-label">Risultati</div>' +
        '<div class="metrics-grid">' + metrics + '</div>' +
      '</div>' +
      '<div class="testimonial-slot" data-reveal>' +
        '<div class="block-label">Testimonial cliente — da inserire</div>' +
        '<p>“Spazio per la frase del cliente — mandami citazione, nome e ruolo e la inserisco qui.”</p>' +
      '</div>' +
      '<div class="case-cta" data-reveal>' +
        '<h3>Ti serve un sito così?</h3>' +
        '<a class="btn-accent btn-hero" href="' + WA_LINK + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1l-2.1 2.2Z"/></svg>' +
          'Scrivimi su WhatsApp' +
        '</a>' +
      '</div>'
    );
  }

  function findProject(slug) {
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].slug === slug) return PROJECTS[i];
    return null;
  }

  // ---------- Routing ----------
  function route() {
    var hash = location.hash || '';
    var m = hash.match(/^#\/case\/(.+)$/);
    var project = m ? findProject(decodeURIComponent(m[1])) : null;

    if (project) {
      caseView.innerHTML = caseHTML(project);
      caseView.classList.remove('hidden');
      homeView.classList.add('hidden');
      document.title = project.name + ' — 21STUDIO';
    } else {
      caseView.classList.add('hidden');
      homeView.classList.remove('hidden');
      document.title = '21STUDIO — Portfolio siti web';
    }
    window.scrollTo(0, 0);
    setupReveal();
  }

  document.addEventListener('click', function (e) {
    var goHome = e.target.closest('[data-go-home]');
    if (goHome) {
      e.preventDefault();
      location.hash = '';
    }
  });

  window.addEventListener('hashchange', route);

  // ---------- Reveal on scroll ----------
  var io = null;
  function setupReveal() {
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var scope = caseView.classList.contains('hidden') ? homeView : caseView;
    var els = scope.querySelectorAll('[data-reveal]');
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // ---------- Init ----------
  renderGrid();
  route();
})();
