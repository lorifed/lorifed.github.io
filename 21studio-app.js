"use strict";
(() => {
  // src/scripts/brain-cluster.js
  var REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BrainCluster = class {
    constructor(canvas, { radius = 90, particleCount = 110, hue = "red" } = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.radius = radius;
      this.hue = hue;
      this.particles = [];
      for (let i = 0; i < particleCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.55) * radius;
        this.particles.push({
          baseAngle: a,
          baseR: r,
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.35,
          size: 1 + Math.random() * (r < radius * 0.35 ? 3.2 : 1.8),
          warmth: Math.random()
        });
      }
      this._resize();
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(canvas.parentElement);
      if (!REDUCE_MOTION) {
        const loop = (t) => {
          this._paint(t / 1e3);
          this._raf = requestAnimationFrame(loop);
        };
        this._raf = requestAnimationFrame(loop);
      } else {
        this._paint(0);
      }
    }
    _resize() {
      const parent = this.canvas.parentElement;
      const size = Math.min(parent.clientWidth, parent.clientHeight || parent.clientWidth);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = parent.clientWidth;
      this.h = parent.clientHeight || parent.clientWidth;
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.cx = this.w / 2;
      this.cy = this.h / 2;
    }
    _paint(t) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const breathe = REDUCE_MOTION ? 1 : 0.72 + 0.28 * Math.sin(t * 0.45);
      const glow = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.radius * 1.9);
      glow.addColorStop(0, `rgba(214,85,63,${(0.22 * breathe).toFixed(3)})`);
      glow.addColorStop(1, "rgba(214,85,63,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.radius * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(183,193,126,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      for (const p of this.particles) {
        const drift = REDUCE_MOTION ? 0 : Math.sin(t * p.speed + p.phase) * 3.5;
        const angle = p.baseAngle + (REDUCE_MOTION ? 0 : Math.sin(t * 0.05 + p.phase) * 0.02);
        const r = p.baseR + drift;
        const x = this.cx + Math.cos(angle) * r;
        const y = this.cy + Math.sin(angle) * r;
        const warm = p.warmth;
        const rr = Math.round(214 - warm * 20);
        const gg = Math.round(85 + warm * 90);
        const bb = Math.round(63 + warm * 20);
        const alpha = 0.35 + (1 - r / this.radius) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha.toFixed(2)})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      const core = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.radius * 0.35);
      core.addColorStop(0, "rgba(243,241,236,0.85)");
      core.addColorStop(1, "rgba(243,241,236,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }
  };

  // src/scripts/department-data.js
  var ICONS = {
    maps: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`,
    trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>`,
    notion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
    slack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="3" width="6" height="8" rx="2"/><rect x="9" y="13" width="6" height="8" rx="2"/><rect x="3" y="9" width="8" height="6" rx="2"/><rect x="13" y="9" width="8" height="6" rx="2"/></svg>`,
    sheets: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 9h16M4 15h16M10 9v12"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20l1.4-4.2A8 8 0 1 1 9 19L4 20Z"/><path d="M9 10.5c0 3 2.5 5.5 5.5 5.5"/></svg>`,
    stripe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10c0-1 1-1.5 2.5-1.5S12 9 12 10s-1 1.4-2.5 1.4S7 12 7 13s1 1.5 2.5 1.5S12 14 12 13"/></svg>`,
    invoice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4.5c0-1.4 1-2.5 2.3-2.5S17 11 17 12.8V17M12 12.5V17"/></svg>`
  };
  var DEPARTMENTS = [
    {
      id: "marketing",
      order: "01",
      label: "Marketing",
      role: "CMO \u2014 Lead Marketing & Growth",
      color: "gold",
      var: "--gold",
      hub: "Agente Marketing",
      task: "Ricerca trend e monitoraggio competitor",
      tools: [
        { name: "Instagram", icon: "instagram", agent: "Content Repurposer", desc: "Ritaglia e ripubblica i contenuti migliori ogni settimana" },
        { name: "Google Trends", icon: "trend", agent: "Trend Scanner", desc: "Segnala i trend rilevanti per il tuo settore" },
        { name: "Notion", icon: "notion", agent: "Content Calendar", desc: "Tiene il calendario editoriale sempre aggiornato" }
      ]
    },
    {
      id: "vendite",
      order: "02",
      label: "Vendite",
      role: "General \u2014 Lead Vendite",
      color: "red",
      var: "--red",
      hub: "Agente Vendite",
      task: "Onboard new clients \xB7 Segue ogni preventivo",
      tools: [
        { name: "Google Maps", icon: "maps", agent: "Lead Scraper", desc: "Trova nuovi lead locali ogni settimana" },
        { name: "Gmail", icon: "mail", agent: "Follow-up Preventivi", desc: "Segue ogni preventivo finch\xE9 non risponde" },
        { name: "Calendario", icon: "calendar", agent: "Company Briefing", desc: "Prepara un briefing prima di ogni call" }
      ]
    },
    {
      id: "operations",
      order: "03",
      label: "Operations",
      role: "General \u2014 Lead Operations",
      color: "purple",
      var: "--purple",
      hub: "Agente Operations",
      task: "Report operativi quotidiani",
      tools: [
        { name: "Slack", icon: "slack", agent: "Task Router", desc: "Smista i task in arrivo al reparto giusto" },
        { name: "Google Sheets", icon: "sheets", agent: "Daily Report", desc: "Compila il report operativo ogni mattina" },
        { name: "Notion", icon: "notion", agent: "Process Watch", desc: "Segnala i colli di bottiglia nei processi" }
      ]
    },
    {
      id: "assistenza",
      order: "04",
      label: "Assistenza clienti",
      role: "General \u2014 Lead Assistenza",
      color: "teal",
      var: "--teal",
      hub: "Agente Assistenza",
      task: "Onboarding e follow-up 24/7",
      tools: [
        { name: "Gmail", icon: "mail", agent: "Reply Agent", desc: "Risponde alle richieste ricorrenti in autonomia" },
        { name: "WhatsApp", icon: "whatsapp", agent: "Onboarding Agent", desc: "Accompagna ogni nuovo cliente nei primi giorni" },
        { name: "Notion", icon: "notion", agent: "Follow-up Agent", desc: "Richiama i clienti silenti dopo N giorni" }
      ]
    },
    {
      id: "finance",
      order: "05",
      label: "Finance",
      role: "CFO \u2014 Lead Finance",
      color: "green",
      var: "--green",
      hub: "Agente Finance",
      task: "Cassa, fatturazione, numeri pronti",
      tools: [
        { name: "Stripe", icon: "stripe", agent: "Cash Monitor", desc: "Tiene sotto controllo incassi e cassa in tempo reale" },
        { name: "Fatture in Cloud", icon: "invoice", agent: "Invoice Agent", desc: "Prepara ed emette le fatture ricorrenti" },
        { name: "Google Sheets", icon: "sheets", agent: "Expense Tracker", desc: "Traccia le spese e segnala anomalie" }
      ]
    },
    {
      id: "ricerca",
      order: "06",
      label: "Ricerca & strategia",
      role: "General \u2014 Lead Ricerca",
      color: "blue",
      var: "--blue",
      hub: "Agente Ricerca",
      task: "Monitoraggio mercato e prossime mosse",
      tools: [
        { name: "Google Alerts", icon: "alert", agent: "Market Scanner", desc: "Monitora il mercato e i movimenti dei competitor" },
        { name: "LinkedIn", icon: "linkedin", agent: "Competitor Tracker", desc: "Segue le mosse pubbliche dei competitor" },
        { name: "Notion", icon: "notion", agent: "Strategy Briefing", desc: "Smista le mosse consigliate a chi deve agire" }
      ]
    }
  ];
  function icon(name) {
    return ICONS[name] || "";
  }
  function departmentById(id) {
    return DEPARTMENTS.find((d) => d.id === id) || DEPARTMENTS[0];
  }

  // src/scripts/department-drilldown.js
  var DepartmentDrilldown = class {
    constructor(root, { startId = DEPARTMENTS[0].id, onChange = null } = {}) {
      this.root = root;
      this.onChange = onChange;
      this.index = Math.max(0, DEPARTMENTS.findIndex((d) => d.id === startId));
      this._build();
      this._render(false);
    }
    _build() {
      this.root.classList.add("dd-root");
      this.root.innerHTML = `
      <div class="dd-badges">
        <span class="badge dd-badge-dep"><i class="badge-dot"></i><span class="dd-dep-name"></span></span>
        <span class="badge">${DEPARTMENTS[0].tools.length} SUB-AGENTI</span>
      </div>
      <div class="dd-tree"></div>
      <button type="button" class="pill dd-crumb" aria-label="Cambia reparto">
        <span class="dd-crumb-prev" aria-hidden="true">\u2039</span>
        <span class="dd-crumb-label"></span>
        <span class="dd-crumb-next" aria-hidden="true">\u203A</span>
      </button>
    `;
      this.treeEl = this.root.querySelector(".dd-tree");
      this.depNameEl = this.root.querySelector(".dd-dep-name");
      this.crumbLabelEl = this.root.querySelector(".dd-crumb-label");
      this.crumbEl = this.root.querySelector(".dd-crumb");
      this.badgeDot = this.root.querySelector(".dd-badge-dep .badge-dot");
      this.crumbEl.addEventListener("click", (e) => {
        const rect = this.crumbEl.getBoundingClientRect();
        const clickedLeftHalf = e.clientX - rect.left < rect.width / 2;
        this.go(clickedLeftHalf ? -1 : 1);
      });
    }
    go(dir) {
      this.index = (this.index + dir + DEPARTMENTS.length) % DEPARTMENTS.length;
      this._render(true);
    }
    goTo(id) {
      const i = DEPARTMENTS.findIndex((d) => d.id === id);
      if (i === -1 || i === this.index) return;
      this.index = i;
      this._render(true);
    }
    get current() {
      return DEPARTMENTS[this.index];
    }
    _render(animate) {
      const dep = this.current;
      const doRender = () => {
        this.depNameEl.textContent = dep.label;
        this.crumbLabelEl.textContent = dep.label;
        this.badgeDot.style.background = `var(${dep.var})`;
        this.root.style.setProperty("--dep-color", `var(${dep.var})`);
        this.treeEl.innerHTML = `
        <div class="dd-cols">
          ${dep.tools.map(
          (tool) => `
            <div class="dd-col">
              <div class="dd-tool" style="--dep-color:var(${dep.var})">
                <span class="dd-tool-icon">${icon(tool.icon)}</span>
              </div>
              <span class="dd-tool-name">${tool.name}</span>
              <span class="dd-connector"></span>
              <span class="dd-agent-name">${tool.agent}</span>
              <span class="dd-agent-desc">${tool.desc}</span>
              <span class="dd-connector dd-connector-long"></span>
            </div>`
        ).join("")}
        </div>
        <div class="dd-hub">
          <span class="dd-hub-label" style="color:var(${dep.var})">${dep.hub}</span>
          <div class="dd-hub-cluster"><canvas></canvas></div>
        </div>
      `;
        if (this._mini) this._mini.destroy();
        this._mini = new BrainCluster(this.treeEl.querySelector(".dd-hub-cluster canvas"), {
          radius: 46,
          particleCount: 50
        });
      };
      if (!animate || !window.gsap) {
        doRender();
        if (this.onChange) this.onChange(dep.id);
        return;
      }
      window.gsap.to(this.treeEl, {
        opacity: 0,
        y: 8,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          doRender();
          window.gsap.fromTo(this.treeEl, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" });
        }
      });
      if (this.onChange) this.onChange(dep.id);
    }
  };

  // src/scripts/dashboard-mock.js
  function countUp(el, target, { duration = 1.4, suffix = "" } = {}) {
    const obj = { v: 0 };
    window.gsap.to(obj, {
      v: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.v) + suffix;
      }
    });
  }
  function initStatsPanel(root) {
    const stats = root.querySelectorAll("[data-count]");
    const rows = root.querySelectorAll(".panel-row");
    const logLines = root.querySelectorAll(".panel-log li");
    if (!window.gsap || !window.ScrollTrigger) {
      stats.forEach((el) => el.textContent = el.dataset.count + (el.dataset.suffix || ""));
      rows.forEach((el) => el.style.opacity = 1);
      logLines.forEach((el) => el.style.opacity = 1);
      return null;
    }
    const tl = window.ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      once: true,
      onEnter: () => {
        stats.forEach((el) => countUp(el, Number(el.dataset.count), { suffix: el.dataset.suffix || "" }));
        window.gsap.fromTo(rows, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.15 });
        window.gsap.fromTo(
          logLines,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "power2.out", delay: 0.5 }
        );
      }
    });
    root.querySelectorAll(".status-dot.live").forEach((dot, i) => {
      window.gsap.to(dot, { opacity: 0.4, duration: 1.1 + i * 0.15, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    return tl;
  }
  function initSidebarPulse(root) {
    if (!window.gsap || !window.ScrollTrigger) {
      root.querySelectorAll(".os-agent-row").forEach((el) => el.style.opacity = 1);
      return;
    }
    root.querySelectorAll(".os-live-dot").forEach((dot) => {
      window.gsap.to(dot, { opacity: 0.35, scale: 0.85, duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 50%" });
    });
    const rows = root.querySelectorAll(".os-agent-row");
    window.ScrollTrigger.create({
      trigger: root,
      start: "top 78%",
      once: true,
      onEnter: () => {
        window.gsap.fromTo(rows, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" });
      }
    });
  }
  function initJarvisTyping(root, prompts) {
    const input = root.querySelector("[data-jarvis-input]");
    const orb = root.querySelector(".jarvis-orb");
    if (orb && window.gsap) {
      window.gsap.to(orb, { rotate: 360, duration: 18, repeat: -1, ease: "none" });
    }
    if (!input || !(prompts == null ? void 0 : prompts.length)) return;
    if (!window.gsap) {
      input.textContent = prompts[0];
      return;
    }
    let i = 0;
    const type = () => {
      const text = prompts[i % prompts.length];
      const chars = { n: 0 };
      window.gsap.to(chars, {
        n: text.length,
        duration: text.length * 0.045,
        ease: "none",
        onUpdate: () => input.textContent = text.slice(0, Math.round(chars.n)),
        onComplete: () => {
          window.gsap.delayedCall(1.6, erase);
        }
      });
    };
    const erase = () => {
      const from = { n: input.textContent.length };
      window.gsap.to(from, {
        n: 0,
        duration: 0.5,
        ease: "none",
        onUpdate: () => input.textContent = input.textContent.slice(0, Math.round(from.n)),
        onComplete: () => {
          i++;
          window.gsap.delayedCall(0.4, type);
        }
      });
    };
    type();
  }

  // src/scripts/site-entry.js
  window.Site = {
    BrainCluster,
    DepartmentDrilldown,
    DEPARTMENTS,
    icon,
    departmentById,
    initStatsPanel,
    initSidebarPulse,
    initJarvisTyping
  };
})();
