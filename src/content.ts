// All copy lives here, in both languages. Edit this file to update the site.
// The English object is typed against the Spanish one, so a missing key is a
// compile error instead of a blank spot on the page.

export type Lang = 'es' | 'en'

export type ProjectId = 'caelum' | 'stratum'

const links = {
  email: 'merazw8@gmail.com',
  github: 'https://github.com/wame21',
  caelumLive: 'https://caelumjewerly.vercel.app',
  stratumRepo: 'https://github.com/wame21/stratum-pos',
}

export const site = {
  name: 'Wilver Meraz',
  fullName: 'Wilver Adrian Meraz Estrada',
  links,
  // Guasave, Sinaloa — used for the hero coordinates and the footer clock.
  timeZone: 'America/Mazatlan',
}

const tech = {
  caelum: ['React 19', 'TanStack Start', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'PostgreSQL · RLS', 'jsPDF'],
  stratum: ['ESP32', 'MicroPython', 'Flutter', 'Supabase', 'MQTT / TLS', 'BLE', 'HiveMQ Cloud'],
}

const es = {
  meta: {
    title: 'Wilver Meraz — Ingeniero de Software',
    skip: 'Saltar al contenido',
  },
  loader: {
    constellation: 'Casiopea',
    caption: 'La constelación con forma de W',
    loading: 'Alineando el cielo',
    skip: 'Toca o pulsa una tecla para entrar',
    stars: ['Segin', 'Ruchbah', 'Navi', 'Schedar', 'Caph'],
  },
  nav: {
    work: 'Proyectos',
    journey: 'Trayectoria',
    skills: 'Habilidades',
    contact: 'Contacto',
    cta: 'Hablemos',
    menu: 'Menú',
    close: 'Cerrar',
    language: 'Idioma',
  },
  hero: {
    eyebrow: 'Ingeniería de Software · Backend & IoT',
    greeting: 'Hola, soy',
    name: 'Wilver.',
    lede: 'Construyo sistemas que siguen funcionando cuando la red se cae — del firmware de un ESP32 hasta la nube.',
    primary: 'Ver proyectos',
    secondary: 'GitHub',
    coords: '25.57° N · 108.47° O',
    place: 'Guasave, Sinaloa',
    scroll: 'Desliza',
    sunHint: 'Tu cursor es el sol',
  },
  about: {
    kicker: 'Sobre mí',
    statement:
      'Soy estudiante de Ingeniería de Software y desarrollador práctico. Diseño sistemas *en capas, seguros y resilientes:* backends en FastAPI, apps en Flutter, firmware para ESP32 y datos en la nube. Mi rumbo apunta a la *ciberseguridad* y a la *ingeniería de software con IA.*',
    facts: [
      { label: 'Base', value: 'Guasave, Sinaloa, MX' },
      { label: 'Enfoque', value: 'Ciberseguridad · IA aplicada' },
      { label: 'Ahora', value: 'LLMs y pipelines RAG' },
      { label: 'Idiomas', value: 'Español · Inglés B1' },
    ],
  },
  projects: {
    kicker: 'Trabajo seleccionado',
    title: ['Sistemas que', 'resisten', 'el mundo real.'],
    repo: 'Código',
    live: 'Sitio en vivo',
    private: 'Repositorio privado',
    items: [
      {
        id: 'caelum' as ProjectId,
        index: '01',
        title: 'CAELUM',
        kind: 'ERP · E‑commerce',
        role: 'Fundador · Full Stack',
        tagline: 'El negocio completo de mi marca de joyería de plata .925, en un solo sistema.',
        description:
          'Tienda pública y ERP interno para mi propia marca. Costos históricos por gramo, lotes de compra con costos congelados, inventario trazable, un motor de precios por márgenes de categoría y tejido, flujo de caja, catálogos PDF y un módulo de consignaciones con comisiones y liquidaciones.',
        highlights: [
          'Operaciones financieras mediante RPC transaccionales en Supabase',
          'Row Level Security: el ERP exige sesión y rol de administrador',
          'Costos históricos inmutables para garantizar integridad contable',
        ],
        tech: tech.caelum,
        repo: '',
        repoPrivate: true,
        live: links.caelumLive,
      },
      {
        id: 'stratum' as ProjectId,
        index: '02',
        title: 'Stratum',
        kind: 'POS IoT · Fog‑to‑Cloud',
        role: 'Arquitectura · Firmware · App',
        tagline: 'Un punto de venta que no se detiene cuando se va el internet.',
        description:
          'Ecosistema POS distribuido para negocios agrícolas. Las ventas persisten en la memoria flash de microcontroladores ESP32 y se sincronizan con la nube de forma asíncrona cuando vuelve la conexión.',
        highlights: [
          'Tres capas: app en Flutter, nodos fog ESP32 y mensajería MQTT',
          'Cliente MQTT propio con TLS y last‑will sobre HiveMQ Cloud',
          'Optimización de memoria para dispositivos con RAM limitada',
        ],
        tech: tech.stratum,
        repo: links.stratumRepo,
        repoPrivate: false,
        live: '',
      },
    ],
  },
  demos: {
    caelum: {
      title: 'Motor de precios',
      sample: 'Ejemplo · Cadena de plata .925',
      weight: 'Peso',
      costPerGram: 'Costo histórico / g',
      packaging: 'Empaque',
      margin: 'Margen objetivo',
      suggested: 'Precio sugerido',
      floor: 'Piso global',
      belowFloor: 'Por debajo del piso por gramo',
      ok: 'Dentro de la regla de margen',
      formula: '(costo + empaque) ÷ (1 − margen)',
    },
    stratum: {
      cloud: 'Nube',
      cloudSub: 'Supabase · HiveMQ',
      fog: 'Nodo fog',
      fogSub: 'ESP32 · flash',
      pos: 'Caja',
      link: 'MQTT · TLS :8883',
      queued: 'en cola',
      synced: 'sincronizadas',
      cut: 'Cortar internet',
      restore: 'Restaurar conexión',
      online: 'En línea',
      offline: 'Sin conexión — y se sigue vendiendo',
    },
  },
  journey: {
    kicker: 'Trayectoria',
    title: ['Educación y', 'experiencia'],
    items: [
      {
        type: 'Experiencia',
        title: 'Fundador y Full Stack Developer',
        org: 'CAELUM — ERP & E‑Commerce',
        period: 'Actual',
        text: 'Diseñé y construí el sistema de gestión de mi marca de joyería: tienda en línea, ERP, precios, inventario y consignaciones sobre Supabase.',
      },
      {
        type: 'Educación',
        title: 'Ingeniería de Software',
        org: 'Universidad Autónoma de Occidente — Unidad Regional Guasave',
        period: 'En curso',
        text: 'Formación en diseño, arquitectura y desarrollo de software.',
      },
      {
        type: 'Certificación',
        title: 'Inglés Competente III‑B',
        org: 'Universidad Autónoma de Occidente',
        period: 'Completado',
        text: 'Nivel de inglés B1.',
      },
      {
        type: 'Educación',
        title: 'Técnico en Programación',
        org: 'CETIS No. 108',
        period: 'Egresado',
        text: 'Donde empezó todo: mis bases en programación.',
      },
    ],
  },
  skills: {
    kicker: 'Habilidades',
    title: ['Un sistema', 'orbital', 'de herramientas.'],
    hint: 'Elige un planeta',
    languages: 'Lenguajes',
    languageList: ['Python', 'TypeScript', 'Dart', 'SQL', 'MicroPython'],
    tools: 'Día a día',
    toolList: ['Git / GitHub', 'Linux', 'Docker'],
    groups: [
      { id: 'backend', name: 'Backend', items: ['FastAPI', 'Diseño de APIs REST', 'Pydantic', 'Arquitectura en capas', 'Inyección de dependencias', 'Stripe PaymentIntents'] },
      { id: 'iot', name: 'IoT & Embebidos', items: ['ESP32', 'MicroPython', 'BLE / GATT', 'MQTT sobre TLS', 'Fog / Edge computing', 'Sincronización offline‑first'] },
      { id: 'apps', name: 'Frontend & Móvil', items: ['React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Provider', 'Material Design'] },
      { id: 'data', name: 'Datos & Nube', items: ['PostgreSQL', 'Supabase (RLS · RPC)', 'HiveMQ Cloud', 'Diseño de esquemas', 'Índices'] },
      { id: 'security', name: 'Seguridad', items: ['Cifrado TLS en transporte', 'Aislamiento de credenciales', 'Mensajería IoT cifrada', 'Row Level Security'] },
      { id: 'ai', name: 'IA', items: ['LLMs', 'Pipelines RAG', 'Prompt engineering', 'Integración de IA aplicada'] },
    ],
  },
  contact: {
    kicker: 'Contacto',
    title: ['¿Construimos algo', 'juntos?'],
    text: 'Escríbeme para prácticas, colaboraciones o para platicar de sistemas distribuidos, IoT o IA.',
    copy: 'Copiar correo',
    copied: 'Copiado',
  },
  footer: {
    madeIn: 'Hecho en Guasave, Sinaloa — bajo el mismo cielo.',
    localTime: 'Hora local',
    moon: 'Luna hoy',
    top: 'Volver arriba',
    phases: ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante'],
  },
}

export type Content = typeof es

const en: Content = {
  meta: {
    title: 'Wilver Meraz — Software Engineer',
    skip: 'Skip to content',
  },
  loader: {
    constellation: 'Cassiopeia',
    caption: 'The W‑shaped constellation',
    loading: 'Aligning the sky',
    skip: 'Tap or press any key to enter',
    stars: ['Segin', 'Ruchbah', 'Navi', 'Schedar', 'Caph'],
  },
  nav: {
    work: 'Work',
    journey: 'Journey',
    skills: 'Skills',
    contact: 'Contact',
    cta: "Let's talk",
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
  },
  hero: {
    eyebrow: 'Software Engineering · Backend & IoT',
    greeting: "Hi, I'm",
    name: 'Wilver.',
    lede: 'I build systems that keep working when the network drops — from ESP32 firmware all the way to the cloud.',
    primary: 'See my work',
    secondary: 'GitHub',
    coords: '25.57° N · 108.47° W',
    place: 'Guasave, Sinaloa',
    scroll: 'Scroll',
    sunHint: 'Your cursor is the sun',
  },
  about: {
    kicker: 'About',
    statement:
      'I’m a Software Engineering student and hands‑on developer. I design *layered, secure and resilient* systems: FastAPI backends, Flutter apps, ESP32 firmware and cloud data layers. My path points toward *cybersecurity* and *AI software engineering.*',
    facts: [
      { label: 'Based in', value: 'Guasave, Sinaloa, MX' },
      { label: 'Focus', value: 'Cybersecurity · Applied AI' },
      { label: 'Now', value: 'LLMs and RAG pipelines' },
      { label: 'Languages', value: 'Spanish · English B1' },
    ],
  },
  projects: {
    kicker: 'Selected work',
    title: ['Systems that', 'withstand', 'the real world.'],
    repo: 'Code',
    live: 'Live site',
    private: 'Private repository',
    items: [
      {
        id: 'caelum',
        index: '01',
        title: 'CAELUM',
        kind: 'ERP · E‑commerce',
        role: 'Founder · Full Stack',
        tagline: 'The whole business behind my .925 silver jewelry brand, in a single system.',
        description:
          'Public storefront and internal ERP for my own brand. Historical per‑gram costs, purchase batches with frozen costs, traceable inventory, a pricing engine driven by category and weave margins, cash flow, PDF catalogs and a vendor consignment module with commissions and settlements.',
        highlights: [
          'Financial operations run through transactional RPCs on Supabase',
          'Row Level Security: the ERP requires a session and an admin role',
          'Immutable historical costs to guarantee accounting integrity',
        ],
        tech: tech.caelum,
        repo: '',
        repoPrivate: true,
        live: links.caelumLive,
      },
      {
        id: 'stratum',
        index: '02',
        title: 'Stratum',
        kind: 'IoT POS · Fog‑to‑Cloud',
        role: 'Architecture · Firmware · App',
        tagline: 'A point of sale that never stops when the internet goes down.',
        description:
          'A distributed POS ecosystem for agricultural businesses. Sales persist to the flash memory of ESP32 microcontrollers and sync to the cloud asynchronously once connectivity returns.',
        highlights: [
          'Three tiers: a Flutter app, ESP32 fog nodes and MQTT messaging',
          'Custom MQTT client with TLS and last‑will on HiveMQ Cloud',
          'Memory optimization for RAM‑constrained devices',
        ],
        tech: tech.stratum,
        repo: links.stratumRepo,
        repoPrivate: false,
        live: '',
      },
    ],
  },
  demos: {
    caelum: {
      title: 'Pricing engine',
      sample: 'Example · .925 silver chain',
      weight: 'Weight',
      costPerGram: 'Historical cost / g',
      packaging: 'Packaging',
      margin: 'Target margin',
      suggested: 'Suggested price',
      floor: 'Global floor',
      belowFloor: 'Below the per‑gram floor',
      ok: 'Within the margin rule',
      formula: '(cost + packaging) ÷ (1 − margin)',
    },
    stratum: {
      cloud: 'Cloud',
      cloudSub: 'Supabase · HiveMQ',
      fog: 'Fog node',
      fogSub: 'ESP32 · flash',
      pos: 'Till',
      link: 'MQTT · TLS :8883',
      queued: 'queued',
      synced: 'synced',
      cut: 'Cut the internet',
      restore: 'Restore connection',
      online: 'Online',
      offline: 'Offline — and still selling',
    },
  },
  journey: {
    kicker: 'Journey',
    title: ['Education and', 'experience'],
    items: [
      {
        type: 'Experience',
        title: 'Founder & Full Stack Developer',
        org: 'CAELUM — ERP & E‑Commerce',
        period: 'Present',
        text: 'Designed and built the management system for my jewelry brand: storefront, ERP, pricing, inventory and consignments on Supabase.',
      },
      {
        type: 'Education',
        title: 'B.S. in Software Engineering',
        org: 'Universidad Autónoma de Occidente — Guasave Campus',
        period: 'In progress',
        text: 'Training in software design, architecture and development.',
      },
      {
        type: 'Certification',
        title: 'Inglés Competente III‑B',
        org: 'Universidad Autónoma de Occidente',
        period: 'Completed',
        text: 'B1 English proficiency.',
      },
      {
        type: 'Education',
        title: 'Programming Technician',
        org: 'CETIS No. 108',
        period: 'Graduated',
        text: 'Where it all started: my programming foundations.',
      },
    ],
  },
  skills: {
    kicker: 'Skills',
    title: ['An orbital', 'system', 'of tools.'],
    hint: 'Pick a planet',
    languages: 'Languages',
    languageList: ['Python', 'TypeScript', 'Dart', 'SQL', 'MicroPython'],
    tools: 'Daily drivers',
    toolList: ['Git / GitHub', 'Linux', 'Docker'],
    groups: [
      { id: 'backend', name: 'Backend', items: ['FastAPI', 'REST API design', 'Pydantic', 'Layered architecture', 'Dependency injection', 'Stripe PaymentIntents'] },
      { id: 'iot', name: 'IoT & Embedded', items: ['ESP32', 'MicroPython', 'BLE / GATT', 'MQTT over TLS', 'Fog / Edge computing', 'Offline‑first sync'] },
      { id: 'apps', name: 'Frontend & Mobile', items: ['React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Provider', 'Material Design'] },
      { id: 'data', name: 'Data & Cloud', items: ['PostgreSQL', 'Supabase (RLS · RPC)', 'HiveMQ Cloud', 'Schema design', 'Indexing'] },
      { id: 'security', name: 'Security', items: ['TLS transport encryption', 'Credential isolation', 'Encrypted IoT messaging', 'Row Level Security'] },
      { id: 'ai', name: 'AI', items: ['LLMs', 'RAG pipelines', 'Prompt engineering', 'Applied AI integration'] },
    ],
  },
  contact: {
    kicker: 'Contact',
    title: ['Shall we build', 'something?'],
    text: 'Write to me about internships, collaborations, or just to talk distributed systems, IoT or AI.',
    copy: 'Copy email',
    copied: 'Copied',
  },
  footer: {
    madeIn: 'Made in Guasave, Sinaloa — under the same sky.',
    localTime: 'Local time',
    moon: 'Moon tonight',
    top: 'Back to top',
    phases: ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
  },
}

export const content: Record<Lang, Content> = { es, en }

// Per-project accent colours. Muted on purpose: they tint the night sky
// rather than light it up.
export const accents: Record<ProjectId, string> = {
  caelum: '#c9cedb',
  stratum: '#7cc4ae',
}
