// Dati progetti — portfolio 21STUDIO
// Per aggiungere uno screenshot reale: metti il file in img/projects/ e imposta "shot" col percorso.
// Se "shot" è null, la card mostra un placeholder pulito.

const WA_LINK = 'https://wa.me/393924311252?text=Ciao%2C%20ho%20visto%20il%20tuo%20portfolio%20e%20vorrei%20un%20sito%20per%20la%20mia%20attivit%C3%A0';

const PROJECTS = [
  {
    slug: 'ikiventi',
    name: 'IKIVENTI',
    category: 'Arredamento · Sito + Ads',
    url: 'ikiventi.it',
    private: false,
    liveUrl: 'https://ikiventi.it',
    shot: null, // img/projects/ikiventi.jpg
    facts: [
      { k: 'Settore', v: 'Arredamento su misura' },
      { k: 'Stack', v: 'WordPress · Meta Ads' },
      { k: 'Anno', v: '2024' }
    ],
    overview: "IKIVENTI è un brand premium di arredamento modulare partito senza alcun canale online. Ho costruito da zero l'intera presenza digitale — sito, tracking, campagne Meta e flussi email — trasformando zero lead in un sistema di acquisizione prevedibile, con il costo per contatto ridotto del 75%.",
    services: ['Sito WordPress custom', 'Campagne Meta Ads', 'CRO landing page', 'Email marketing & automazioni', 'Tracking & attribuzione'],
    metrics: [
      { v: '−75%', l: 'Costo per lead' },
      { v: '€15K/mo', l: 'Revenue attribuita' },
      { v: '300+', l: 'Lead al mese' }
    ]
  },
  {
    slug: 'zenda',
    name: 'Zenda Eyewear',
    category: 'Eyewear DTC · Shopify',
    url: 'zendaeyewear.com',
    private: false,
    liveUrl: 'https://zendaeyewear.com',
    shot: null, // img/projects/zenda.jpg
    facts: [
      { k: 'Settore', v: 'Eyewear / Occhiali DTC' },
      { k: 'Stack', v: 'Shopify Custom' },
      { k: 'Anno', v: '2024' }
    ],
    overview: 'Zenda Eyewear è nato da un foglio bianco. Ho definito naming, posizionamento e identità visiva, sviluppato uno store Shopify su misura e costruito l’infrastruttura di acquisizione Meta — dal concept al lancio in 60 giorni, con un ROAS medio di 3.2x.',
    services: ['Naming & brand strategy', 'Identità visiva', 'Store Shopify custom', 'Acquisizione Meta Ads', 'Funnel & CRO'],
    metrics: [
      { v: '0→Live', l: 'Brand da zero' },
      { v: '3.2x', l: 'ROAS medio' },
      { v: '60gg', l: 'Da brief a lancio' }
    ]
  },
  {
    slug: 'skincare',
    name: 'Brand Skincare',
    category: 'Skincare DTC · Shopify',
    url: 'skincare-store.com',
    private: true,
    liveUrl: '',
    shot: null,
    facts: [
      { k: 'Settore', v: 'Beauty / Skincare DTC' },
      { k: 'Stack', v: 'Shopify · Klaviyo' },
      { k: 'Anno', v: '2024' }
    ],
    overview: "Migrazione e-commerce e setup completo di email marketing per un brand skincare. Ho ricostruito la base dati con segmentazione comportamentale e implementato quattro flussi automatici — benvenuto, abbandono carrello, post-acquisto e win-back — portando l'email al 28% della revenue.",
    services: ['Migrazione Shopify', 'Setup Klaviyo', 'Segmentazione comportamentale', '4 flussi automatici', 'Reportistica revenue'],
    metrics: [
      { v: '28%', l: 'Revenue da email' },
      { v: '42%', l: 'Open rate medio' },
      { v: '4', l: 'Flussi automatici' }
    ]
  },
  {
    slug: 'finance',
    name: 'Consulente Finanziario',
    category: 'Finanza · Lead Gen AI',
    url: 'consulente-finanziario.it',
    private: true,
    liveUrl: '',
    shot: null,
    facts: [
      { k: 'Settore', v: 'Consulenza finanziaria' },
      { k: 'Stack', v: 'Meta Ads · Python / AI' },
      { k: 'Anno', v: '2025' }
    ],
    overview: "Per un consulente finanziario ho costruito un sistema di lead generation con qualificazione automatica via AI. Un agente pre-qualifica ogni contatto tramite un form intelligente prima del passaggio commerciale, alzando la qualità dei lead e liberando il 40% del tempo di vendita.",
    services: ['Landing page dedicata', 'Campagne Meta Ads', 'Form intelligente', 'Agente AI di qualificazione', 'Integrazione CRM'],
    metrics: [
      { v: '€8→€4', l: 'CPL qualificato' },
      { v: '68%', l: 'Lead qualificati' },
      { v: '−40%', l: 'Tempo commerciale' }
    ]
  },
  {
    slug: 'studio-dentistico',
    name: 'Studio Dentistico',
    category: 'Studio professionale · Progetto esempio',
    url: 'studio-dentistico.it',
    private: true,
    liveUrl: '',
    shot: null,
    facts: [
      { k: 'Settore', v: 'Studio professionale' },
      { k: 'Stack', v: 'Sito custom · Booking' },
      { k: 'Anno', v: 'Esempio' }
    ],
    overview: "Esempio di sito per uno studio professionale locale senza presenza online. Sito chiaro e veloce con prenotazione appuntamenti integrata, pagine servizi e modulo contatti — pensato per trasformare le telefonate perse in richieste gestite online.",
    services: ['Sito custom mobile-first', 'Prenotazione appuntamenti', 'Pagine servizi', 'Modulo contatti smart', 'SEO locale base'],
    metrics: [
      { v: '+60%', l: 'Contatti qualificati' },
      { v: '24/7', l: 'Prenotazioni online' },
      { v: '0→online', l: 'Presenza digitale' }
    ]
  },
  {
    slug: 'ristorante',
    name: 'Ristorante Locale',
    category: 'Ristorazione · Progetto esempio',
    url: 'ristorante-esempio.it',
    private: true,
    liveUrl: '',
    shot: null,
    facts: [
      { k: 'Settore', v: 'Ristorazione' },
      { k: 'Stack', v: 'Sito custom · Menu QR' },
      { k: 'Anno', v: 'Esempio' }
    ],
    overview: "Esempio di sito per un ristorante locale con menu digitale e prenotazione tavoli. Sito curato con menu sempre aggiornabile, QR code al tavolo e prenotazione online — pensato per ridurre le chiamate in orario di servizio e portare più prenotazioni digitali.",
    services: ['Sito custom con gallery', 'Menu digitale aggiornabile', 'QR code al tavolo', 'Prenotazione tavoli online', 'Google Business & mappe'],
    metrics: [
      { v: '+45%', l: 'Prenotazioni online' },
      { v: 'QR', l: 'Menu digitale' },
      { v: '1.2k/mo', l: 'Visite al sito' }
    ]
  }
];
