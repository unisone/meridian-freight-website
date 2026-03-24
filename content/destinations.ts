import type { FaqEntry } from "@/content/faq";

export interface Destination {
  slug: string;
  country: string;
  port: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroDescription: string;
  transitDays: string;
  carriers: string[];
  commonEquipment: string[];
  shippingNotes: string;
  containerOptions: string[];
  faqs?: FaqEntry[];
}

const destinationsEn: Destination[] = [
  {
    slug: "brazil",
    country: "Brazil",
    port: "Santos",
    region: "Latin America",
    metaTitle: "Ship Machinery to Brazil — Santos Port | Meridian Export",
    metaDescription:
      "Export heavy machinery to Santos, Brazil in 25-30 days. Door-to-port packing, ocean freight, and documentation. Get a free quote today.",
    keywords: [
      "ship equipment to brazil",
      "machinery export brazil",
      "heavy equipment shipping santos",
      "farm machinery to brazil",
      "export machinery south america",
      "container shipping brazil",
    ],
    heroDescription:
      "We ship machinery from the USA and Canada to Santos — Brazil's largest port and the gateway to South America's biggest economy. Transit times average 25-30 days with weekly sailings from US East and Gulf Coast ports.",
    transitDays: "25-30",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Combines",
      "Tractors",
      "Excavators",
      "Planters",
      "Sprayers",
      "Tillage Equipment",
    ],
    shippingNotes:
      "Brazil requires fumigation certificates for all wood packaging materials (ISPM-15 compliant). Import licenses may be required for certain equipment categories — we handle the documentation so your shipment clears Santos customs without delays. Budget an additional $800–$1,200 for fumigation and phytosanitary certification. Allow 35–45 days total door-to-port including pickup, packing, documentation, and 25–30 days of ocean transit. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "20ft Standard"],
    faqs: [
      { question: "What documents do I need to import machinery into Brazil?", answer: "You need a Commercial Invoice, Packing List, Bill of Lading, ISPM-15 fumigation certificate for wood packaging, and potentially an import license depending on equipment category. We prepare all US export documents and coordinate with Brazilian customs brokers.", category: "Brazil" },
      { question: "How long does shipping to Brazil take?", answer: "Ocean transit from US East and Gulf Coast ports to Santos averages 25-30 days. Total door-to-port timeline including pickup, packing, and documentation is typically 35-45 days.", category: "Brazil" },
      { question: "Is farm equipment in high demand in Brazil?", answer: "Yes. Brazil is one of the world's largest agricultural producers. Used US equipment — especially John Deere and Case IH combines, tractors, and planters — is in strong demand because of quality, availability, and competitive pricing compared to new equipment.", category: "Brazil" },
    ],
  },
  {
    slug: "uae",
    country: "UAE",
    port: "Jebel Ali",
    region: "Middle East",
    metaTitle: "Ship Machinery to UAE — Jebel Ali Port | Meridian Export",
    metaDescription:
      "Export machinery to Jebel Ali, UAE in 30-38 days. Full-service packing, freight, and customs documentation. Request your free quote.",
    keywords: [
      "ship equipment to uae",
      "machinery export dubai",
      "heavy equipment shipping jebel ali",
      "construction equipment to uae",
      "export machinery middle east",
      "container shipping dubai",
    ],
    heroDescription:
      "We deliver machinery from the USA and Canada to Jebel Ali — the Middle East's premier transshipment hub serving the UAE and the wider Gulf region. Transit times run 30-38 days via major carriers with regular departures.",
    transitDays: "30-38",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Excavators",
      "Loaders",
      "Bulldozers",
      "Cranes",
      "Generators",
      "Compressors",
    ],
    shippingNotes:
      "Jebel Ali is a free-zone port with streamlined customs procedures. Equipment must be clean and free of soil or organic residue — expect a $300–$500 pre-shipment cleaning fee for earth-moving machinery. We coordinate pre-shipment inspections to meet UAE import standards. No import duty applies to most used machinery entering the Jebel Ali Free Zone, making the UAE one of the most cost-effective Middle East destinations. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "20ft Standard"],
    faqs: [
      { question: "What types of equipment are commonly shipped to the UAE?", answer: "Construction equipment dominates UAE imports — excavators, loaders, bulldozers, cranes, and generators. The UAE's booming infrastructure and real estate sectors drive strong demand for quality used US machinery.", category: "UAE" },
      { question: "Does the UAE have special import requirements for used equipment?", answer: "Equipment must be clean and free of soil or organic residue. Pre-shipment inspections are coordinated to meet UAE import standards. Jebel Ali is a free-zone port with relatively streamlined customs procedures.", category: "UAE" },
      { question: "Can you ship equipment from the UAE to other Gulf countries?", answer: "Yes. Jebel Ali serves as a major transshipment hub for the entire Gulf region. Equipment arriving in Jebel Ali can be forwarded to Oman, Bahrain, Qatar, and Kuwait. We coordinate the full logistics chain.", category: "UAE" },
    ],
  },
  {
    slug: "turkey",
    country: "Turkey",
    port: "Mersin",
    region: "Middle East",
    metaTitle: "Ship Machinery to Turkey — Mersin Port | Meridian Export",
    metaDescription:
      "Export machinery to Mersin, Turkey in 18-25 days. Professional packing, ocean freight, and export docs included. Get a free quote.",
    keywords: [
      "ship equipment to turkey",
      "machinery export turkey",
      "heavy equipment shipping mersin",
      "farm machinery to turkey",
      "export equipment istanbul",
      "container shipping turkey",
    ],
    heroDescription:
      "We ship machinery from the USA and Canada to Mersin — Turkey's busiest Mediterranean port with excellent road and rail connections inland. Transit times average 18-25 days, making it one of the faster routes from North America.",
    transitDays: "18-25",
    carriers: ["Hapag-Lloyd", "CMA CGM", "Maersk", "ZIM"],
    commonEquipment: [
      "Tractors",
      "Combines",
      "Excavators",
      "Loaders",
      "Planters",
      "Headers",
    ],
    shippingNotes:
      "Turkey requires a conformity assessment (TAREKS) for certain machinery imports, which adds 5–10 business days and approximately $500–$800 to the documentation process. All wood packaging must meet ISPM-15 standards. We prepare the full documentation package so your shipment clears Mersin without hold-ups. Turkey is one of our fastest routes at 18–25 days ocean transit from the US East Coast. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard"],
    faqs: [
      { question: "What is the TAREKS conformity assessment for Turkey?", answer: "TAREKS is Turkey's electronic tracking system for certain imported goods. Some machinery categories require a conformity assessment before import. We identify whether your equipment needs TAREKS clearance and prepare the documentation.", category: "Turkey" },
      { question: "Why is Turkey one of the faster shipping routes?", answer: "Mersin port is accessible via the Mediterranean with shorter transit distances than Gulf or Asian ports. At 18-25 days from US East Coast, it is one of our fastest international routes with weekly sailings.", category: "Turkey" },
      { question: "What farm equipment is most in demand in Turkey?", answer: "Turkey imports tractors, combines, planters, headers, and tillage equipment for its large agricultural sector. John Deere and Case IH are popular brands, and Turkish farmers value the quality and durability of US-made equipment.", category: "Turkey" },
    ],
  },
  {
    slug: "saudi-arabia",
    country: "Saudi Arabia",
    port: "Jeddah",
    region: "Middle East",
    metaTitle: "Ship Machinery to Saudi Arabia — Jeddah | Meridian Export",
    metaDescription:
      "Export machinery to Jeddah, Saudi Arabia in 28-35 days. Complete packing, freight, and documentation services. Free quote available.",
    keywords: [
      "ship equipment to saudi arabia",
      "machinery export saudi",
      "heavy equipment shipping jeddah",
      "construction equipment to saudi arabia",
      "export machinery to riyadh",
      "container shipping saudi arabia",
    ],
    heroDescription:
      "We deliver machinery from the USA and Canada to Jeddah Islamic Port — Saudi Arabia's primary western gateway and a key entry point for construction and agricultural equipment. Transit times run 28-35 days with consistent carrier schedules.",
    transitDays: "28-35",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Excavators",
      "Bulldozers",
      "Cranes",
      "Generators",
      "Loaders",
      "Compressors",
    ],
    shippingNotes:
      "Saudi Arabia requires SABER conformity certificates for many equipment categories, adding $600–$1,000 and 7–14 days to the documentation timeline. All invoices and packing lists must be legalized through the Saudi Embassy or Fasah electronic system. We handle the full compliance process to ensure smooth clearance at Jeddah port. Plan for 40–50 days total from equipment pickup to port arrival. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "20ft Standard"],
    faqs: [
      { question: "What is the SABER conformity certificate for Saudi Arabia?", answer: "SABER is Saudi Arabia's online platform for product conformity certification. Many equipment categories require a SABER certificate and a shipment-specific certificate of conformity before clearing Jeddah port customs. We handle the full process.", category: "Saudi Arabia" },
      { question: "Do invoices need to be legalized for Saudi imports?", answer: "Yes. Commercial invoices and packing lists for Saudi Arabia must be legalized through the Saudi Embassy or via the Fasah electronic system. We prepare all documentation in the required format for smooth customs clearance.", category: "Saudi Arabia" },
      { question: "What construction equipment is in demand in Saudi Arabia?", answer: "Saudi Vision 2030 infrastructure projects drive strong demand for excavators, bulldozers, cranes, generators, loaders, and compressors. US-manufactured CAT and Komatsu equipment is especially popular.", category: "Saudi Arabia" },
    ],
  },
  {
    slug: "colombia",
    country: "Colombia",
    port: "Cartagena",
    region: "Latin America",
    metaTitle: "Ship Machinery to Colombia — Cartagena | Meridian Export",
    metaDescription:
      "Export machinery to Cartagena, Colombia in 12-18 days. Door-to-port service with packing, freight, and docs. Get your free quote.",
    keywords: [
      "ship equipment to colombia",
      "machinery export colombia",
      "heavy equipment shipping cartagena",
      "farm machinery to colombia",
      "export equipment bogota",
      "container shipping colombia",
    ],
    heroDescription:
      "We ship machinery from the USA and Canada to Cartagena — Colombia's top Caribbean port with direct connections to Bogota and the interior. At just 12-18 days transit, it is one of our fastest Latin American routes.",
    transitDays: "12-18",
    carriers: ["Maersk", "CMA CGM", "Hapag-Lloyd", "Evergreen"],
    commonEquipment: [
      "Tractors",
      "Excavators",
      "Combines",
      "Loaders",
      "Sprayers",
      "Tillage Equipment",
    ],
    shippingNotes:
      "Colombia requires a pre-shipment inspection for used equipment imports. Fumigation certificates are mandatory for wood packaging. We coordinate all inspections and documentation before departure to prevent port delays. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard"],
    faqs: [
      { question: "Does Colombia require a pre-shipment inspection?", answer: "Yes. Colombia requires a pre-shipment inspection for used equipment imports. We coordinate the inspection before departure and include the inspection certificate with your shipping documents to prevent port delays.", category: "Colombia" },
      { question: "How fast can you ship to Colombia?", answer: "Cartagena is one of our fastest Latin American destinations at just 12-18 days ocean transit from US Gulf and East Coast ports. Total door-to-port timeline is typically 22-30 days including pickup and packing.", category: "Colombia" },
      { question: "What equipment is commonly shipped to Colombia?", answer: "Tractors, excavators, combines, loaders, and sprayers are the most common exports to Colombia. The country's growing agricultural and construction sectors drive steady demand for quality used US machinery.", category: "Colombia" },
    ],
  },
  {
    slug: "mexico",
    country: "Mexico",
    port: "Veracruz",
    region: "Latin America",
    metaTitle: "Ship Machinery to Mexico — Veracruz Port | Meridian Export",
    metaDescription:
      "Export machinery to Veracruz, Mexico in 10-15 days. Fast transit, professional packing, and full documentation. Request a free quote.",
    keywords: [
      "ship equipment to mexico",
      "machinery export mexico",
      "heavy equipment shipping veracruz",
      "farm machinery to mexico",
      "export equipment mexico city",
      "container shipping mexico",
    ],
    heroDescription:
      "We deliver machinery from the USA and Canada to Veracruz — Mexico's largest Gulf Coast port and the fastest ocean route from the US Midwest. Transit times of just 10-15 days make this our quickest international destination.",
    transitDays: "10-15",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "ONE"],
    commonEquipment: [
      "Tractors",
      "Combines",
      "Planters",
      "Sprayers",
      "Excavators",
      "Headers",
    ],
    shippingNotes:
      "Mexico allows duty-free import of certain agricultural equipment under USMCA provisions. All shipments require a pedimento (customs declaration). We prepare bilingual documentation and coordinate with Mexican customs brokers for seamless clearance. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard", "Open Top"],
    faqs: [
      { question: "Can agricultural equipment enter Mexico duty-free under USMCA?", answer: "Certain agricultural equipment qualifies for duty-free import under USMCA (formerly NAFTA) provisions. We identify whether your specific equipment qualifies and prepare the required USMCA certificate of origin.", category: "Mexico" },
      { question: "How quickly can you ship to Mexico?", answer: "Veracruz is our fastest international destination at just 10-15 days ocean transit from US Gulf ports. Total door-to-port timeline is typically 20-25 days. For urgent shipments, we can also arrange overland trucking.", category: "Mexico" },
      { question: "Do you provide bilingual documentation for Mexico shipments?", answer: "Yes. All customs documentation is prepared in both English and Spanish. We coordinate directly with Mexican customs brokers (agentes aduanales) to ensure your pedimento and import clearance go smoothly.", category: "Mexico" },
    ],
  },
  {
    slug: "romania",
    country: "Romania",
    port: "Constanta",
    region: "Eastern Europe",
    metaTitle: "Ship Machinery to Romania — Constanta | Meridian Export",
    metaDescription:
      "Export machinery to Constanta, Romania in 22-28 days. Full packing, ocean freight, and EU-compliant documentation. Get a free quote.",
    keywords: [
      "ship equipment to romania",
      "machinery export romania",
      "heavy equipment shipping constanta",
      "farm machinery to romania",
      "export equipment eastern europe",
      "container shipping romania",
    ],
    heroDescription:
      "We ship machinery from the USA and Canada to Constanta — Romania's Black Sea port and a major gateway to Eastern Europe and the Balkans. Transit times average 22-28 days with transshipment through Mediterranean hub ports.",
    transitDays: "22-28",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Tractors",
      "Combines",
      "Planters",
      "Tillage Equipment",
      "Headers",
      "Sprayers",
    ],
    shippingNotes:
      "Romania is an EU member, so imports must comply with EU machinery directives and CE marking requirements. Phytosanitary certificates are required for wood packaging. We ensure all documentation meets EU customs standards. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard"],
    faqs: [
      { question: "Does Romania follow EU import regulations for machinery?", answer: "Yes. As an EU member, Romania requires compliance with EU machinery directives. CE marking requirements may apply to certain equipment categories. All wood packaging must meet ISPM-15 standards for EU entry.", category: "Romania" },
      { question: "What route do shipments to Romania take?", answer: "Shipments route through Mediterranean transshipment ports (typically Piraeus or Gioia Tauro) before final delivery to Constanta on the Black Sea. Total transit is 22-28 days from US East Coast ports.", category: "Romania" },
      { question: "What agricultural equipment is popular in Romania?", answer: "Romania's large farming sector imports tractors, combines, planters, tillage equipment, headers, and sprayers. The country's fertile plains are ideal for large-scale agriculture, driving demand for US-made precision equipment.", category: "Romania" },
    ],
  },
  {
    slug: "kazakhstan",
    country: "Kazakhstan",
    port: "Aktau",
    region: "Central Asia",
    metaTitle: "Ship Machinery to Kazakhstan — Aktau | Meridian Export",
    metaDescription:
      "Export machinery to Aktau, Kazakhstan in 40-50 days. Multimodal logistics with packing, ocean, and overland transport. Free quote.",
    keywords: [
      "ship equipment to kazakhstan",
      "machinery export kazakhstan",
      "heavy equipment shipping aktau",
      "farm machinery to central asia",
      "export equipment kazakhstan",
      "container shipping caspian sea",
    ],
    heroDescription:
      "We deliver machinery from the USA and Canada to Aktau — Kazakhstan's Caspian Sea port and the primary entry point for heavy equipment into Central Asia. This multimodal route takes 40-50 days including ocean and overland segments.",
    transitDays: "40-50",
    carriers: ["Maersk", "CMA CGM", "MSC", "Hapag-Lloyd"],
    commonEquipment: [
      "Combines",
      "Tractors",
      "Excavators",
      "Bulldozers",
      "Planters",
      "Headers",
    ],
    shippingNotes:
      "Kazakhstan shipments route through a transshipment port (typically Poti, Georgia or Mersin, Turkey) before Caspian Sea feeder to Aktau. GOST certification may be required for certain equipment. We coordinate the full multimodal chain from your door to Aktau. For urgent parts or time-sensitive shipments, air freight is available with typical delivery in 7–14 days.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard"],
    faqs: [
      { question: "Why does shipping to Kazakhstan take 40-50 days?", answer: "Kazakhstan is landlocked. Shipments travel by ocean to a transshipment port (typically Poti, Georgia or Mersin, Turkey), then transfer to a Caspian Sea feeder vessel to Aktau port. The multimodal routing adds transit time.", category: "Kazakhstan" },
      { question: "Is GOST certification required for equipment imports to Kazakhstan?", answer: "GOST certification may be required for certain equipment categories under the Eurasian Economic Union (EAEU) technical regulations. We verify requirements for your specific equipment and coordinate certification when needed.", category: "Kazakhstan" },
      { question: "What equipment is commonly exported to Kazakhstan?", answer: "Combines, tractors, excavators, bulldozers, planters, and headers are all in demand for Kazakhstan's agricultural and mining sectors. The country's vast farmland and mineral resources drive consistent equipment imports.", category: "Kazakhstan" },
    ],
  },
];

// ES: LATAM destinations first (Mexico, Colombia, Brazil), then rest
const destinationsEs: Destination[] = [
  {
    slug: "mexico",
    country: "México",
    port: "Veracruz",
    region: "Latinoamérica",
    metaTitle: "Envío de Maquinaria a México — Puerto de Veracruz | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Veracruz, México en 10-15 días. Tránsito rápido, embalaje profesional y documentación completa. Solicite su cotización gratis.",
    keywords: [
      "enviar equipo a México",
      "exportación de maquinaria a México",
      "envío de equipo pesado a Veracruz",
      "maquinaria agrícola a México",
      "exportar equipo a Ciudad de México",
      "envío de contenedor a México",
    ],
    heroDescription:
      "Entregamos maquinaria desde USA y Canadá a Veracruz — el puerto más grande del Golfo de México y la ruta marítima más rápida desde el Medio Oeste de EE.UU. Tiempos de tránsito de solo 10-15 días lo convierten en nuestro destino internacional más rápido.",
    transitDays: "10-15",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "ONE"],
    commonEquipment: [
      "Tractores",
      "Cosechadoras",
      "Sembradoras",
      "Pulverizadoras",
      "Excavadoras",
      "Cabezales",
    ],
    shippingNotes:
      "México permite la importación libre de aranceles de cierto equipo agrícola bajo las disposiciones del T-MEC. Todos los envíos requieren un pedimento (declaración aduanera). Preparamos documentación bilingüe y coordinamos con agentes aduanales mexicanos para un despacho sin contratiempos. Para repuestos urgentes o envíos sensibles al tiempo, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Estándar 20ft", "Open Top"],
    faqs: [
      { question: "¿Puede el equipo agrícola entrar a México libre de aranceles bajo el T-MEC?", answer: "Cierto equipo agrícola califica para importación libre de aranceles bajo las disposiciones del T-MEC (antes TLCAN). Identificamos si su equipo específico califica y preparamos el certificado de origen T-MEC requerido.", category: "México" },
      { question: "¿Qué tan rápido pueden enviar a México?", answer: "Veracruz es nuestro destino internacional más rápido con solo 10-15 días de tránsito marítimo desde puertos del Golfo de EE.UU. El plazo total puerta a puerto es típicamente de 20-25 días. Para envíos urgentes, también podemos coordinar transporte terrestre.", category: "México" },
      { question: "¿Proporcionan documentación bilingüe para envíos a México?", answer: "Sí. Toda la documentación aduanera se prepara en inglés y español. Coordinamos directamente con agentes aduanales mexicanos para asegurar que su pedimento y despacho de importación sean fluidos.", category: "México" },
    ],
  },
  {
    slug: "colombia",
    country: "Colombia",
    port: "Cartagena",
    region: "Latinoamérica",
    metaTitle: "Envío de Maquinaria a Colombia — Cartagena | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Cartagena, Colombia en 12-18 días. Servicio puerta a puerto con embalaje, flete y documentos. Obtenga su cotización gratis.",
    keywords: [
      "enviar equipo a Colombia",
      "exportación de maquinaria a Colombia",
      "envío de equipo pesado a Cartagena",
      "maquinaria agrícola a Colombia",
      "exportar equipo a Bogotá",
      "envío de contenedor a Colombia",
    ],
    heroDescription:
      "Enviamos maquinaria desde USA y Canadá a Cartagena — el principal puerto caribeño de Colombia con conexiones directas a Bogotá y el interior. Con solo 12-18 días de tránsito, es una de nuestras rutas más rápidas a Latinoamérica.",
    transitDays: "12-18",
    carriers: ["Maersk", "CMA CGM", "Hapag-Lloyd", "Evergreen"],
    commonEquipment: [
      "Tractores",
      "Excavadoras",
      "Cosechadoras",
      "Cargadores",
      "Pulverizadoras",
      "Equipo de Labranza",
    ],
    shippingNotes:
      "Colombia requiere una inspección previa al embarque para importaciones de equipo usado. Los certificados de fumigación son obligatorios para embalaje de madera. Coordinamos todas las inspecciones y documentación antes de la partida para prevenir retrasos en puerto. Para repuestos urgentes o envíos sensibles al tiempo, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Estándar 20ft"],
    faqs: [
      { question: "¿Colombia requiere una inspección previa al embarque?", answer: "Sí. Colombia requiere una inspección previa al embarque para importaciones de equipo usado. Coordinamos la inspección antes de la partida e incluimos el certificado de inspección con sus documentos de envío para prevenir retrasos en puerto.", category: "Colombia" },
      { question: "¿Qué tan rápido pueden enviar a Colombia?", answer: "Cartagena es uno de nuestros destinos más rápidos en Latinoamérica con solo 12-18 días de tránsito marítimo desde puertos del Golfo y Costa Este de EE.UU. El plazo total puerta a puerto es típicamente de 22-30 días incluyendo recolección y embalaje.", category: "Colombia" },
      { question: "¿Qué equipo se envía comúnmente a Colombia?", answer: "Tractores, excavadoras, cosechadoras, cargadores y pulverizadoras son las exportaciones más comunes a Colombia. Los sectores agrícola y de construcción en crecimiento del país impulsan una demanda constante de maquinaria usada de calidad de EE.UU.", category: "Colombia" },
    ],
  },
  {
    slug: "brazil",
    country: "Brasil",
    port: "Santos",
    region: "Latinoamérica",
    metaTitle: "Envío de Maquinaria a Brasil — Puerto de Santos | Meridian Export",
    metaDescription:
      "Exporte maquinaria pesada a Santos, Brasil en 25-30 días. Embalaje puerta a puerto, flete marítimo y documentación. Obtenga una cotización gratis hoy.",
    keywords: [
      "enviar equipo a Brasil",
      "exportación de maquinaria a Brasil",
      "envío de equipo pesado a Santos",
      "maquinaria agrícola a Brasil",
      "exportar maquinaria a Sudamérica",
      "envío de contenedor a Brasil",
    ],
    heroDescription:
      "Enviamos maquinaria desde USA y Canadá a Santos — el puerto más grande de Brasil y la puerta de entrada a la economía más grande de Sudamérica. Los tiempos de tránsito promedian 25-30 días con salidas semanales desde puertos de la Costa Este y del Golfo de EE.UU.",
    transitDays: "25-30",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Cosechadoras",
      "Tractores",
      "Excavadoras",
      "Sembradoras",
      "Pulverizadoras",
      "Equipo de Labranza",
    ],
    shippingNotes:
      "Brasil requiere certificados de fumigación para todos los materiales de embalaje de madera (cumplimiento ISPM-15). Pueden requerirse licencias de importación para ciertas categorías de equipo — nosotros manejamos la documentación para que su envío pase la aduana de Santos sin retrasos. Presupueste $800–$1,200 adicionales para fumigación y certificación fitosanitaria. Permita 35-45 días totales puerta a puerto incluyendo recolección, embalaje, documentación y 25-30 días de tránsito marítimo. Para repuestos urgentes o envíos sensibles al tiempo, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Estándar 20ft"],
    faqs: [
      { question: "¿Qué documentos necesito para importar maquinaria a Brasil?", answer: "Necesita una Factura Comercial, Lista de Empaque, Conocimiento de Embarque, certificado de fumigación ISPM-15 para embalaje de madera y potencialmente una licencia de importación según la categoría del equipo. Preparamos todos los documentos de exportación de EE.UU. y coordinamos con agentes aduanales brasileños.", category: "Brasil" },
      { question: "¿Cuánto tarda el envío a Brasil?", answer: "El tránsito marítimo desde puertos de la Costa Este y del Golfo de EE.UU. a Santos promedia 25-30 días. El plazo total puerta a puerto incluyendo recolección, embalaje y documentación es típicamente de 35-45 días.", category: "Brasil" },
      { question: "¿Hay alta demanda de equipo agrícola en Brasil?", answer: "Sí. Brasil es uno de los mayores productores agrícolas del mundo. El equipo usado de EE.UU. — especialmente cosechadoras, tractores y sembradoras John Deere y Case IH — tiene fuerte demanda por su calidad, disponibilidad y precios competitivos comparados con equipo nuevo.", category: "Brasil" },
    ],
  },
  {
    slug: "uae",
    country: "EAU",
    port: "Jebel Ali",
    region: "Medio Oriente",
    metaTitle: "Envío de Maquinaria a EAU — Puerto Jebel Ali | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Jebel Ali, EAU en 30-38 días. Servicio completo de embalaje, flete y documentación aduanera. Solicite su cotización gratis.",
    keywords: [
      "enviar equipo a EAU",
      "exportación de maquinaria a Dubái",
      "envío de equipo pesado a Jebel Ali",
      "equipo de construcción a EAU",
      "exportar maquinaria a Medio Oriente",
      "envío de contenedor a Dubái",
    ],
    heroDescription:
      "Entregamos maquinaria desde USA y Canadá a Jebel Ali — el principal centro de transbordo del Medio Oriente que sirve a los EAU y la región del Golfo. Los tiempos de tránsito son de 30-38 días con salidas regulares por las principales navieras.",
    transitDays: "30-38",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Excavadoras",
      "Cargadores",
      "Bulldozers",
      "Grúas",
      "Generadores",
      "Compresores",
    ],
    shippingNotes:
      "Jebel Ali es un puerto de zona libre con procedimientos aduaneros simplificados. El equipo debe estar limpio y libre de tierra o residuos orgánicos — espere una tarifa de limpieza previa al embarque de $300–$500 para maquinaria de movimiento de tierras. Coordinamos inspecciones previas al embarque para cumplir con los estándares de importación de EAU. No aplican aranceles de importación para la mayoría de la maquinaria usada que ingresa a la Zona Libre de Jebel Ali, haciendo a los EAU uno de los destinos más económicos del Medio Oriente. Para repuestos urgentes, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Estándar 20ft"],
    faqs: [
      { question: "¿Qué tipos de equipo se envían comúnmente a los EAU?", answer: "El equipo de construcción domina las importaciones de los EAU — excavadoras, cargadores, bulldozers, grúas y generadores. Los sectores de infraestructura e inmobiliario en auge impulsan una fuerte demanda de maquinaria usada de calidad de EE.UU.", category: "EAU" },
      { question: "¿Los EAU tienen requisitos especiales de importación para equipo usado?", answer: "El equipo debe estar limpio y libre de tierra o residuos orgánicos. Se coordinan inspecciones previas al embarque para cumplir con los estándares de importación de EAU. Jebel Ali es un puerto de zona libre con procedimientos aduaneros relativamente simplificados.", category: "EAU" },
      { question: "¿Pueden enviar equipo desde los EAU a otros países del Golfo?", answer: "Sí. Jebel Ali sirve como un importante centro de transbordo para toda la región del Golfo. El equipo que llega a Jebel Ali puede reenviarse a Omán, Baréin, Catar y Kuwait. Coordinamos toda la cadena logística.", category: "EAU" },
    ],
  },
  {
    slug: "turkey",
    country: "Turquía",
    port: "Mersin",
    region: "Medio Oriente",
    metaTitle: "Envío de Maquinaria a Turquía — Puerto de Mersin | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Mersin, Turquía en 18-25 días. Embalaje profesional, flete marítimo y documentos de exportación incluidos. Obtenga una cotización gratis.",
    keywords: [
      "enviar equipo a Turquía",
      "exportación de maquinaria a Turquía",
      "envío de equipo pesado a Mersin",
      "maquinaria agrícola a Turquía",
      "exportar equipo a Estambul",
      "envío de contenedor a Turquía",
    ],
    heroDescription:
      "Enviamos maquinaria desde USA y Canadá a Mersin — el puerto mediterráneo más activo de Turquía con excelentes conexiones terrestres y ferroviarias al interior. Los tiempos de tránsito promedian 18-25 días, convirtiéndolo en una de las rutas más rápidas desde Norteamérica.",
    transitDays: "18-25",
    carriers: ["Hapag-Lloyd", "CMA CGM", "Maersk", "ZIM"],
    commonEquipment: [
      "Tractores",
      "Cosechadoras",
      "Excavadoras",
      "Cargadores",
      "Sembradoras",
      "Cabezales",
    ],
    shippingNotes:
      "Turquía requiere una evaluación de conformidad (TAREKS) para ciertas importaciones de maquinaria, lo que agrega 5-10 días hábiles y aproximadamente $500-$800 al proceso de documentación. Todo el embalaje de madera debe cumplir con los estándares ISPM-15. Preparamos el paquete completo de documentación para que su envío pase la aduana de Mersin sin contratiempos. Turquía es una de nuestras rutas más rápidas con 18-25 días de tránsito marítimo desde la Costa Este de EE.UU. Para repuestos urgentes, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Estándar 20ft"],
    faqs: [
      { question: "¿Qué es la evaluación de conformidad TAREKS para Turquía?", answer: "TAREKS es el sistema electrónico de seguimiento de Turquía para ciertos bienes importados. Algunas categorías de maquinaria requieren una evaluación de conformidad antes de la importación. Identificamos si su equipo necesita autorización TAREKS y preparamos la documentación.", category: "Turquía" },
      { question: "¿Por qué Turquía es una de las rutas de envío más rápidas?", answer: "El puerto de Mersin es accesible por el Mediterráneo con distancias de tránsito más cortas que los puertos del Golfo o Asia. Con 18-25 días desde la Costa Este de EE.UU., es una de nuestras rutas internacionales más rápidas con salidas semanales.", category: "Turquía" },
      { question: "¿Qué equipo agrícola tiene más demanda en Turquía?", answer: "Turquía importa tractores, cosechadoras, sembradoras, cabezales y equipo de labranza para su amplio sector agrícola. John Deere y Case IH son marcas populares, y los agricultores turcos valoran la calidad y durabilidad del equipo fabricado en EE.UU.", category: "Turquía" },
    ],
  },
  {
    slug: "saudi-arabia",
    country: "Arabia Saudita",
    port: "Jeddah",
    region: "Medio Oriente",
    metaTitle: "Envío de Maquinaria a Arabia Saudita — Jeddah | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Jeddah, Arabia Saudita en 28-35 días. Servicios completos de embalaje, flete y documentación. Cotización gratis disponible.",
    keywords: [
      "enviar equipo a Arabia Saudita",
      "exportación de maquinaria a Arabia Saudita",
      "envío de equipo pesado a Jeddah",
      "equipo de construcción a Arabia Saudita",
      "exportar maquinaria a Riad",
      "envío de contenedor a Arabia Saudita",
    ],
    heroDescription:
      "Entregamos maquinaria desde USA y Canadá al Puerto Islámico de Jeddah — la principal puerta de entrada occidental de Arabia Saudita y un punto clave de ingreso para equipo de construcción y agrícola. Los tiempos de tránsito son de 28-35 días con horarios consistentes de las navieras.",
    transitDays: "28-35",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Excavadoras",
      "Bulldozers",
      "Grúas",
      "Generadores",
      "Cargadores",
      "Compresores",
    ],
    shippingNotes:
      "Arabia Saudita requiere certificados de conformidad SABER para muchas categorías de equipo, añadiendo $600-$1,000 y 7-14 días al plazo de documentación. Todas las facturas y listas de empaque deben legalizarse a través de la Embajada Saudita o el sistema electrónico Fasah. Manejamos el proceso completo de cumplimiento para asegurar un despacho fluido en el puerto de Jeddah. Planifique 40-50 días totales desde la recolección del equipo hasta la llegada al puerto. Para repuestos urgentes, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Estándar 20ft"],
    faqs: [
      { question: "¿Qué es el certificado de conformidad SABER para Arabia Saudita?", answer: "SABER es la plataforma en línea de Arabia Saudita para la certificación de conformidad de productos. Muchas categorías de equipo requieren un certificado SABER y un certificado de conformidad específico por envío antes de pasar la aduana del puerto de Jeddah. Manejamos todo el proceso.", category: "Arabia Saudita" },
      { question: "¿Las facturas necesitan ser legalizadas para importaciones sauditas?", answer: "Sí. Las facturas comerciales y listas de empaque para Arabia Saudita deben legalizarse a través de la Embajada Saudita o mediante el sistema electrónico Fasah. Preparamos toda la documentación en el formato requerido para un despacho aduanero fluido.", category: "Arabia Saudita" },
      { question: "¿Qué equipo de construcción tiene demanda en Arabia Saudita?", answer: "Los proyectos de infraestructura de Visión Saudita 2030 impulsan una fuerte demanda de excavadoras, bulldozers, grúas, generadores, cargadores y compresores. El equipo fabricado en EE.UU. por CAT y Komatsu es especialmente popular.", category: "Arabia Saudita" },
    ],
  },
  {
    slug: "romania",
    country: "Rumania",
    port: "Constanta",
    region: "Europa del Este",
    metaTitle: "Envío de Maquinaria a Rumania — Constanta | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Constanta, Rumania en 22-28 días. Embalaje completo, flete marítimo y documentación conforme a la UE. Cotización gratis.",
    keywords: [
      "enviar equipo a Rumania",
      "exportación de maquinaria a Rumania",
      "envío de equipo pesado a Constanta",
      "maquinaria agrícola a Rumania",
      "exportar equipo a Europa del Este",
      "envío de contenedor a Rumania",
    ],
    heroDescription:
      "Enviamos maquinaria desde USA y Canadá a Constanta — el puerto del Mar Negro de Rumania y una importante puerta de entrada a Europa del Este y los Balcanes. Los tiempos de tránsito promedian 22-28 días con transbordo a través de puertos mediterráneos.",
    transitDays: "22-28",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Tractores",
      "Cosechadoras",
      "Sembradoras",
      "Equipo de Labranza",
      "Cabezales",
      "Pulverizadoras",
    ],
    shippingNotes:
      "Rumania es miembro de la UE, por lo que las importaciones deben cumplir con las directivas de maquinaria de la UE y los requisitos de marcado CE. Se requieren certificados fitosanitarios para embalaje de madera. Aseguramos que toda la documentación cumpla con los estándares aduaneros de la UE. Para repuestos urgentes o envíos sensibles al tiempo, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Estándar 20ft"],
    faqs: [
      { question: "¿Rumania sigue las regulaciones de importación de la UE para maquinaria?", answer: "Sí. Como miembro de la UE, Rumania requiere cumplimiento con las directivas de maquinaria de la UE. Los requisitos de marcado CE pueden aplicar a ciertas categorías de equipo. Todo el embalaje de madera debe cumplir con los estándares ISPM-15 para ingreso a la UE.", category: "Rumania" },
      { question: "¿Qué ruta toman los envíos a Rumania?", answer: "Los envíos pasan por puertos de transbordo mediterráneos (típicamente El Pireo o Gioia Tauro) antes de la entrega final a Constanta en el Mar Negro. El tránsito total es de 22-28 días desde puertos de la Costa Este de EE.UU.", category: "Rumania" },
      { question: "¿Qué equipo agrícola es popular en Rumania?", answer: "El amplio sector agrícola de Rumania importa tractores, cosechadoras, sembradoras, equipo de labranza, cabezales y pulverizadoras. Las fértiles llanuras del país son ideales para la agricultura a gran escala, impulsando la demanda de equipo de precisión fabricado en EE.UU.", category: "Rumania" },
    ],
  },
  {
    slug: "kazakhstan",
    country: "Kazajistán",
    port: "Aktau",
    region: "Asia Central",
    metaTitle: "Envío de Maquinaria a Kazajistán — Aktau | Meridian Export",
    metaDescription:
      "Exporte maquinaria a Aktau, Kazajistán en 40-50 días. Logística multimodal con embalaje, transporte marítimo y terrestre. Cotización gratis.",
    keywords: [
      "enviar equipo a Kazajistán",
      "exportación de maquinaria a Kazajistán",
      "envío de equipo pesado a Aktau",
      "maquinaria agrícola a Asia Central",
      "exportar equipo a Kazajistán",
      "envío de contenedor al Mar Caspio",
    ],
    heroDescription:
      "Entregamos maquinaria desde USA y Canadá a Aktau — el puerto del Mar Caspio de Kazajistán y el punto de entrada principal para equipo pesado a Asia Central. Esta ruta multimodal toma 40-50 días incluyendo segmentos marítimos y terrestres.",
    transitDays: "40-50",
    carriers: ["Maersk", "CMA CGM", "MSC", "Hapag-Lloyd"],
    commonEquipment: [
      "Cosechadoras",
      "Tractores",
      "Excavadoras",
      "Bulldozers",
      "Sembradoras",
      "Cabezales",
    ],
    shippingNotes:
      "Los envíos a Kazajistán pasan por un puerto de transbordo (típicamente Poti, Georgia o Mersin, Turquía) antes del alimentador del Mar Caspio a Aktau. La certificación GOST puede requerirse para cierto equipo. Coordinamos la cadena multimodal completa desde su puerta hasta Aktau. Para repuestos urgentes o envíos sensibles al tiempo, disponemos de flete aéreo con entrega típica en 7-14 días.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Estándar 20ft"],
    faqs: [
      { question: "¿Por qué el envío a Kazajistán toma 40-50 días?", answer: "Kazajistán no tiene salida al mar. Los envíos viajan por mar a un puerto de transbordo (típicamente Poti, Georgia o Mersin, Turquía), luego se transfieren a un buque alimentador del Mar Caspio al puerto de Aktau. El enrutamiento multimodal añade tiempo de tránsito.", category: "Kazajistán" },
      { question: "¿Se requiere certificación GOST para importar equipo a Kazajistán?", answer: "La certificación GOST puede requerirse para ciertas categorías de equipo bajo las regulaciones técnicas de la Unión Económica Euroasiática (UEEA). Verificamos los requisitos para su equipo específico y coordinamos la certificación cuando es necesario.", category: "Kazajistán" },
      { question: "¿Qué equipo se exporta comúnmente a Kazajistán?", answer: "Cosechadoras, tractores, excavadoras, bulldozers, sembradoras y cabezales tienen demanda en los sectores agrícola y minero de Kazajistán. Las vastas tierras de cultivo y los recursos minerales del país impulsan importaciones constantes de equipo.", category: "Kazajistán" },
    ],
  },
];

// RU: Kazakhstan first, then Turkey, UAE, Romania, then rest
const destinationsRu: Destination[] = [
  {
    slug: "kazakhstan",
    country: "Казахстан",
    port: "Актау",
    region: "Центральная Азия",
    metaTitle: "Доставка техники в Казахстан — Актау | Meridian Export",
    metaDescription:
      "Экспорт техники в Актау, Казахстан за 40-50 дней. Мультимодальная логистика с упаковкой, морским и наземным транспортом. Бесплатная котировка.",
    keywords: [
      "доставка техники в Казахстан",
      "экспорт техники в Казахстан",
      "доставка тяжёлого оборудования в Актау",
      "сельхозтехника в Центральную Азию",
      "экспорт оборудования в Казахстан",
      "контейнерная доставка Каспийское море",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Актау — порт Казахстана на Каспийском море и основную точку входа для тяжёлой техники в Центральную Азию. Этот мультимодальный маршрут занимает 40-50 дней, включая морские и наземные сегменты.",
    transitDays: "40-50",
    carriers: ["Maersk", "CMA CGM", "MSC", "Hapag-Lloyd"],
    commonEquipment: [
      "Комбайны",
      "Тракторы",
      "Экскаваторы",
      "Бульдозеры",
      "Сеялки",
      "Жатки",
    ],
    shippingNotes:
      "Грузы в Казахстан проходят через перевалочный порт (обычно Поти, Грузия или Мерсин, Турция), затем фидерным рейсом по Каспийскому морю до Актау. Для определённых видов техники может потребоваться сертификация ГОСТ. Мы координируем полную мультимодальную цепочку от вашей двери до Актау. Для срочных запчастей или чувствительных ко времени грузов доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Стандарт 20 футов"],
    faqs: [
      { question: "Почему доставка в Казахстан занимает 40-50 дней?", answer: "Казахстан не имеет выхода к морю. Грузы идут морем до перевалочного порта (обычно Поти, Грузия или Мерсин, Турция), затем пересаживаются на фидерное судно Каспийского моря до порта Актау. Мультимодальная маршрутизация добавляет время транзита.", category: "Казахстан" },
      { question: "Требуется ли сертификация ГОСТ для импорта техники в Казахстан?", answer: "Сертификация ГОСТ может потребоваться для определённых категорий техники согласно техническим регламентам Евразийского экономического союза (ЕАЭС). Мы проверяем требования для вашей конкретной техники и координируем сертификацию при необходимости.", category: "Казахстан" },
      { question: "Какую технику чаще всего экспортируют в Казахстан?", answer: "Комбайны, тракторы, экскаваторы, бульдозеры, сеялки и жатки востребованы в сельскохозяйственном и горнодобывающем секторах Казахстана. Обширные сельхозугодья и минеральные ресурсы страны обеспечивают стабильный импорт техники.", category: "Казахстан" },
      { question: "Какие льготы по импортным пошлинам действуют для техники в Казахстане?", answer: "В рамках ЕАЭС Казахстан предоставляет льготы по импортным пошлинам на определённые виды сельскохозяйственной техники, не производимой на территории союза. Мы уточняем актуальные ставки и льготы для вашей конкретной техники при подготовке котировки.", category: "Казахстан" },
    ],
  },
  {
    slug: "turkey",
    country: "Турция",
    port: "Мерсин",
    region: "Ближний Восток",
    metaTitle: "Доставка техники в Турцию — Порт Мерсин | Meridian Export",
    metaDescription:
      "Экспорт техники в Мерсин, Турция за 18-25 дней. Профессиональная упаковка, морской фрахт и экспортная документация. Бесплатная котировка.",
    keywords: [
      "доставка техники в Турцию",
      "экспорт техники в Турцию",
      "доставка тяжёлого оборудования в Мерсин",
      "сельхозтехника в Турцию",
      "экспорт оборудования в Стамбул",
      "контейнерная доставка в Турцию",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Мерсин — самый загруженный средиземноморский порт Турции с отличными автомобильными и железнодорожными связями вглубь страны. Время транзита в среднем 18-25 дней — один из самых быстрых маршрутов из Северной Америки.",
    transitDays: "18-25",
    carriers: ["Hapag-Lloyd", "CMA CGM", "Maersk", "ZIM"],
    commonEquipment: [
      "Тракторы",
      "Комбайны",
      "Экскаваторы",
      "Погрузчики",
      "Сеялки",
      "Жатки",
    ],
    shippingNotes:
      "Турция требует оценки соответствия (TAREKS) для определённых импортных категорий техники, что добавляет 5-10 рабочих дней и примерно $500-$800 к процессу документации. Весь деревянный упаковочный материал должен соответствовать стандарту ISPM-15. Мы готовим полный пакет документации для беспрепятственного прохождения таможни Мерсина. Турция — один из наших самых быстрых маршрутов: 18-25 дней морского транзита с Восточного побережья США. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Стандарт 20 футов"],
    faqs: [
      { question: "Что такое оценка соответствия TAREKS для Турции?", answer: "TAREKS — электронная система отслеживания Турции для определённых импортных товаров. Некоторые категории техники требуют оценки соответствия перед импортом. Мы определяем, требуется ли вашей технике разрешение TAREKS, и подготавливаем документацию.", category: "Турция" },
      { question: "Почему Турция — один из самых быстрых маршрутов?", answer: "Порт Мерсин доступен через Средиземное море с более короткими расстояниями транзита, чем порты Персидского залива или Азии. При 18-25 днях с Восточного побережья США это один из наших самых быстрых международных маршрутов с еженедельными рейсами.", category: "Турция" },
      { question: "Какая сельхозтехника наиболее востребована в Турции?", answer: "Турция импортирует тракторы, комбайны, сеялки, жатки и почвообрабатывающую технику для своего крупного сельскохозяйственного сектора. John Deere и Case IH — популярные марки, турецкие фермеры ценят качество и надёжность техники американского производства.", category: "Турция" },
    ],
  },
  {
    slug: "uae",
    country: "ОАЭ",
    port: "Джебель-Али",
    region: "Ближний Восток",
    metaTitle: "Доставка техники в ОАЭ — Порт Джебель-Али | Meridian Export",
    metaDescription:
      "Экспорт техники в Джебель-Али, ОАЭ за 30-38 дней. Полный сервис: упаковка, фрахт и таможенная документация. Бесплатная котировка.",
    keywords: [
      "доставка техники в ОАЭ",
      "экспорт техники в Дубай",
      "доставка тяжёлого оборудования в Джебель-Али",
      "строительная техника в ОАЭ",
      "экспорт техники на Ближний Восток",
      "контейнерная доставка в Дубай",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Джебель-Али — главный перевалочный хаб Ближнего Востока, обслуживающий ОАЭ и весь регион Персидского залива. Время транзита 30-38 дней через крупнейших перевозчиков с регулярными рейсами.",
    transitDays: "30-38",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Экскаваторы",
      "Погрузчики",
      "Бульдозеры",
      "Краны",
      "Генераторы",
      "Компрессоры",
    ],
    shippingNotes:
      "Джебель-Али — порт свободной зоны с упрощёнными таможенными процедурами. Техника должна быть чистой и свободной от почвы или органических остатков — ожидайте плату за предотгрузочную очистку $300-$500 для землеройной техники. Мы координируем предотгрузочные инспекции для соответствия импортным стандартам ОАЭ. Импортные пошлины не применяются к большинству б/у техники, ввозимой в Свободную зону Джебель-Али, что делает ОАЭ одним из самых экономичных направлений Ближнего Востока. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Стандарт 20 футов"],
    faqs: [
      { question: "Какие виды техники чаще всего отправляют в ОАЭ?", answer: "Строительная техника доминирует в импорте ОАЭ — экскаваторы, погрузчики, бульдозеры, краны и генераторы. Бурный рост инфраструктуры и сектора недвижимости ОАЭ создаёт устойчивый спрос на качественную б/у технику американского производства.", category: "ОАЭ" },
      { question: "Есть ли у ОАЭ особые требования к импорту б/у техники?", answer: "Техника должна быть чистой и свободной от почвы или органических остатков. Предотгрузочные инспекции координируются для соответствия импортным стандартам ОАЭ. Джебель-Али — порт свободной зоны с относительно упрощёнными таможенными процедурами.", category: "ОАЭ" },
      { question: "Можете ли вы доставить технику из ОАЭ в другие страны Залива?", answer: "Да. Джебель-Али является крупным перевалочным хабом для всего региона Персидского залива. Техника, прибывающая в Джебель-Али, может быть переотправлена в Оман, Бахрейн, Катар и Кувейт. Мы координируем полную логистическую цепочку.", category: "ОАЭ" },
    ],
  },
  {
    slug: "romania",
    country: "Румыния",
    port: "Констанца",
    region: "Восточная Европа",
    metaTitle: "Доставка техники в Румынию — Констанца | Meridian Export",
    metaDescription:
      "Экспорт техники в Констанцу, Румыния за 22-28 дней. Полная упаковка, морской фрахт и документация по стандартам ЕС. Бесплатная котировка.",
    keywords: [
      "доставка техники в Румынию",
      "экспорт техники в Румынию",
      "доставка тяжёлого оборудования в Констанцу",
      "сельхозтехника в Румынию",
      "экспорт оборудования в Восточную Европу",
      "контейнерная доставка в Румынию",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Констанцу — черноморский порт Румынии и важные ворота в Восточную Европу и Балканы. Время транзита в среднем 22-28 дней с перевалкой через средиземноморские хаб-порты.",
    transitDays: "22-28",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Тракторы",
      "Комбайны",
      "Сеялки",
      "Почвообрабатывающая техника",
      "Жатки",
      "Опрыскиватели",
    ],
    shippingNotes:
      "Румыния является членом ЕС, поэтому импорт должен соответствовать директивам ЕС по машиностроению и требованиям маркировки CE. Для деревянной упаковки требуются фитосанитарные сертификаты. Мы обеспечиваем соответствие всей документации стандартам таможни ЕС. Для срочных запчастей или чувствительных ко времени грузов доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Стандарт 20 футов"],
    faqs: [
      { question: "Румыния следует импортным правилам ЕС для техники?", answer: "Да. Как член ЕС, Румыния требует соответствия директивам ЕС по машиностроению. Требования маркировки CE могут применяться к определённым категориям техники. Весь деревянный упаковочный материал должен соответствовать стандарту ISPM-15 для ввоза в ЕС.", category: "Румыния" },
      { question: "Каким маршрутом идут грузы в Румынию?", answer: "Грузы проходят через средиземноморские перевалочные порты (обычно Пирей или Джоя-Тауро) перед финальной доставкой в Констанцу на Чёрном море. Общее время транзита 22-28 дней с Восточного побережья США.", category: "Румыния" },
      { question: "Какая сельхозтехника популярна в Румынии?", answer: "Крупный сельскохозяйственный сектор Румынии импортирует тракторы, комбайны, сеялки, почвообрабатывающую технику, жатки и опрыскиватели. Плодородные равнины страны идеальны для крупномасштабного земледелия, что создаёт спрос на американскую технику точного земледелия.", category: "Румыния" },
    ],
  },
  {
    slug: "brazil",
    country: "Бразилия",
    port: "Сантус",
    region: "Латинская Америка",
    metaTitle: "Доставка техники в Бразилию — Порт Сантус | Meridian Export",
    metaDescription:
      "Экспорт тяжёлой техники в Сантус, Бразилия за 25-30 дней. Упаковка, морской фрахт и документация «от двери до порта». Бесплатная котировка.",
    keywords: [
      "доставка техники в Бразилию",
      "экспорт техники в Бразилию",
      "доставка тяжёлого оборудования в Сантус",
      "сельхозтехника в Бразилию",
      "экспорт техники в Южную Америку",
      "контейнерная доставка в Бразилию",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Сантус — крупнейший порт Бразилии и ворота в крупнейшую экономику Южной Америки. Время транзита в среднем 25-30 дней с еженедельными рейсами из портов Восточного побережья и Мексиканского залива США.",
    transitDays: "25-30",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "MSC"],
    commonEquipment: [
      "Комбайны",
      "Тракторы",
      "Экскаваторы",
      "Сеялки",
      "Опрыскиватели",
      "Почвообрабатывающая техника",
    ],
    shippingNotes:
      "Бразилия требует сертификаты фумигации для всех деревянных упаковочных материалов (соответствие ISPM-15). Для определённых категорий техники могут потребоваться импортные лицензии — мы берём на себя документацию, чтобы ваш груз прошёл таможню Сантуса без задержек. Заложите дополнительно $800-$1 200 на фумигацию и фитосанитарную сертификацию. Рассчитывайте на 35-45 дней от двери до порта, включая забор, упаковку, документацию и 25-30 дней морского транзита. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Стандарт 20 футов"],
    faqs: [
      { question: "Какие документы нужны для импорта техники в Бразилию?", answer: "Необходимы: Коммерческий инвойс, Упаковочный лист, Коносамент, сертификат фумигации ISPM-15 для деревянной упаковки и, возможно, импортная лицензия в зависимости от категории техники. Мы подготавливаем все экспортные документы США и координируем работу с бразильскими таможенными брокерами.", category: "Бразилия" },
      { question: "Сколько времени занимает доставка в Бразилию?", answer: "Морской транзит из портов Восточного побережья и Мексиканского залива США до Сантуса в среднем 25-30 дней. Общий срок от двери до порта, включая забор, упаковку и документацию, обычно 35-45 дней.", category: "Бразилия" },
      { question: "Высок ли спрос на сельхозтехнику в Бразилии?", answer: "Да. Бразилия — один из крупнейших сельхозпроизводителей мира. Б/у техника из США — особенно комбайны, тракторы и сеялки John Deere и Case IH — пользуется высоким спросом благодаря качеству, доступности и конкурентным ценам по сравнению с новой техникой.", category: "Бразилия" },
    ],
  },
  {
    slug: "colombia",
    country: "Колумбия",
    port: "Картахена",
    region: "Латинская Америка",
    metaTitle: "Доставка техники в Колумбию — Картахена | Meridian Export",
    metaDescription:
      "Экспорт техники в Картахену, Колумбия за 12-18 дней. Сервис «от двери до порта»: упаковка, фрахт и документация. Бесплатная котировка.",
    keywords: [
      "доставка техники в Колумбию",
      "экспорт техники в Колумбию",
      "доставка тяжёлого оборудования в Картахену",
      "сельхозтехника в Колумбию",
      "экспорт оборудования в Боготу",
      "контейнерная доставка в Колумбию",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Картахену — главный карибский порт Колумбии с прямым сообщением с Боготой и внутренними районами. При транзите всего 12-18 дней это один из наших самых быстрых латиноамериканских маршрутов.",
    transitDays: "12-18",
    carriers: ["Maersk", "CMA CGM", "Hapag-Lloyd", "Evergreen"],
    commonEquipment: [
      "Тракторы",
      "Экскаваторы",
      "Комбайны",
      "Погрузчики",
      "Опрыскиватели",
      "Почвообрабатывающая техника",
    ],
    shippingNotes:
      "Колумбия требует предотгрузочную инспекцию для импорта б/у оборудования. Сертификаты фумигации обязательны для деревянной упаковки. Мы координируем все инспекции и документацию до отправки для предотвращения задержек в порту. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Стандарт 20 футов"],
    faqs: [
      { question: "Требует ли Колумбия предотгрузочную инспекцию?", answer: "Да. Колумбия требует предотгрузочную инспекцию для импорта б/у оборудования. Мы координируем инспекцию до отправки и включаем сертификат инспекции в ваши отгрузочные документы для предотвращения задержек в порту.", category: "Колумбия" },
      { question: "Как быстро вы можете доставить в Колумбию?", answer: "Картахена — одно из наших самых быстрых латиноамериканских направлений: всего 12-18 дней морского транзита из портов Мексиканского залива и Восточного побережья США. Общий срок от двери до порта обычно 22-30 дней с учётом забора и упаковки.", category: "Колумбия" },
      { question: "Какую технику чаще всего отправляют в Колумбию?", answer: "Тракторы, экскаваторы, комбайны, погрузчики и опрыскиватели — самые распространённые экспортные позиции в Колумбию. Растущие сельскохозяйственный и строительный секторы страны обеспечивают стабильный спрос на качественную б/у технику из США.", category: "Колумбия" },
    ],
  },
  {
    slug: "mexico",
    country: "Мексика",
    port: "Веракрус",
    region: "Латинская Америка",
    metaTitle: "Доставка техники в Мексику — Порт Веракрус | Meridian Export",
    metaDescription:
      "Экспорт техники в Веракрус, Мексика за 10-15 дней. Быстрый транзит, профессиональная упаковка и полная документация. Бесплатная котировка.",
    keywords: [
      "доставка техники в Мексику",
      "экспорт техники в Мексику",
      "доставка тяжёлого оборудования в Веракрус",
      "сельхозтехника в Мексику",
      "экспорт оборудования в Мехико",
      "контейнерная доставка в Мексику",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Веракрус — крупнейший порт Мексики на Мексиканском заливе и самый быстрый морской маршрут из Среднего Запада США. Время транзита всего 10-15 дней — наше самое быстрое международное направление.",
    transitDays: "10-15",
    carriers: ["Maersk", "Hapag-Lloyd", "CMA CGM", "ONE"],
    commonEquipment: [
      "Тракторы",
      "Комбайны",
      "Сеялки",
      "Опрыскиватели",
      "Экскаваторы",
      "Жатки",
    ],
    shippingNotes:
      "Мексика разрешает беспошлинный ввоз определённой сельскохозяйственной техники по положениям USMCA. Все грузы требуют педименто (таможенную декларацию). Мы подготавливаем двуязычную документацию и координируем работу с мексиканскими таможенными брокерами. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Стандарт 20 футов", "Open Top"],
    faqs: [
      { question: "Может ли сельхозтехника ввозиться в Мексику беспошлинно по USMCA?", answer: "Определённая сельхозтехника подпадает под беспошлинный импорт по положениям USMCA (ранее НАФТА). Мы определяем, подпадает ли ваша конкретная техника под льготу, и подготавливаем необходимый сертификат происхождения USMCA.", category: "Мексика" },
      { question: "Как быстро вы можете доставить в Мексику?", answer: "Веракрус — наше самое быстрое международное направление: всего 10-15 дней морского транзита из портов Мексиканского залива США. Общий срок от двери до порта обычно 20-25 дней. Для срочных грузов мы также можем организовать автомобильную доставку.", category: "Мексика" },
      { question: "Вы предоставляете двуязычную документацию для грузов в Мексику?", answer: "Да. Вся таможенная документация подготавливается на английском и испанском языках. Мы координируем работу напрямую с мексиканскими таможенными брокерами (agentes aduanales), чтобы ваш педименто и таможенное оформление прошли гладко.", category: "Мексика" },
    ],
  },
  {
    slug: "saudi-arabia",
    country: "Саудовская Аравия",
    port: "Джидда",
    region: "Ближний Восток",
    metaTitle: "Доставка техники в Саудовскую Аравию — Джидда | Meridian Export",
    metaDescription:
      "Экспорт техники в Джидду, Саудовская Аравия за 28-35 дней. Полный комплекс услуг: упаковка, фрахт и документация. Бесплатная котировка.",
    keywords: [
      "доставка техники в Саудовскую Аравию",
      "экспорт техники в Саудовскую Аравию",
      "доставка тяжёлого оборудования в Джидду",
      "строительная техника в Саудовскую Аравию",
      "экспорт техники в Эр-Рияд",
      "контейнерная доставка в Саудовскую Аравию",
    ],
    heroDescription:
      "Мы доставляем технику из США и Канады в Исламский порт Джидды — основные западные ворота Саудовской Аравии и ключевую точку входа для строительной и сельскохозяйственной техники. Время транзита 28-35 дней с регулярными рейсами перевозчиков.",
    transitDays: "28-35",
    carriers: ["Hapag-Lloyd", "Maersk", "CMA CGM", "MSC"],
    commonEquipment: [
      "Экскаваторы",
      "Бульдозеры",
      "Краны",
      "Генераторы",
      "Погрузчики",
      "Компрессоры",
    ],
    shippingNotes:
      "Саудовская Аравия требует сертификаты соответствия SABER для многих категорий техники, что добавляет $600-$1 000 и 7-14 дней к срокам документации. Все инвойсы и упаковочные листы должны быть легализованы через Посольство Саудовской Аравии или электронную систему Fasah. Мы берём на себя полный процесс соответствия для гладкого прохождения таможни в порту Джидды. Планируйте 40-50 дней от забора техники до прибытия в порт. Для срочных запчастей доступен авиафрахт с доставкой за 7-14 дней.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "Стандарт 20 футов"],
    faqs: [
      { question: "Что такое сертификат соответствия SABER для Саудовской Аравии?", answer: "SABER — онлайн-платформа Саудовской Аравии для сертификации соответствия продукции. Многие категории техники требуют сертификат SABER и сертификат соответствия на конкретную партию до прохождения таможни порта Джидды. Мы берём на себя весь процесс.", category: "Саудовская Аравия" },
      { question: "Нужна ли легализация инвойсов для саудовского импорта?", answer: "Да. Коммерческие инвойсы и упаковочные листы для Саудовской Аравии должны быть легализованы через Посольство Саудовской Аравии или электронную систему Fasah. Мы подготавливаем всю документацию в требуемом формате для гладкого таможенного оформления.", category: "Саудовская Аравия" },
      { question: "Какая строительная техника востребована в Саудовской Аравии?", answer: "Инфраструктурные проекты «Видение Саудовской Аравии 2030» создают высокий спрос на экскаваторы, бульдозеры, краны, генераторы, погрузчики и компрессоры. Техника американского производства CAT и Komatsu особенно популярна.", category: "Саудовская Аравия" },
    ],
  },
];

export const destinations: Record<string, Destination[]> = {
  en: destinationsEn,
  es: destinationsEs,
  ru: destinationsRu,
};

export function getDestinationBySlug(slug: string, locale: string = 'en'): Destination | undefined {
  const localeDests = destinations[locale] ?? destinations.en;
  return localeDests.find((d) => d.slug === slug);
}

export function getAllDestinations(locale: string = 'en'): Destination[] {
  return destinations[locale] ?? destinations.en;
}
