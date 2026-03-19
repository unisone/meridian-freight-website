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

export const destinations: Destination[] = [
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
      "Brazil requires fumigation certificates for all wood packaging materials (ISPM-15 compliant). Import licenses may be required for certain equipment categories — we handle the documentation so your shipment clears Santos customs without delays.",
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
      "Jebel Ali is a free-zone port with streamlined customs procedures. Equipment must be clean and free of soil or organic residue. We coordinate pre-shipment inspections to meet UAE import standards.",
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
      "Turkey requires a conformity assessment (TAREKS) for certain machinery imports. All wood packaging must meet ISPM-15 standards. We prepare the full documentation package so your shipment clears Mersin without hold-ups.",
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
      "Saudi Arabia requires SABER conformity certificates for many equipment categories. All invoices and packing lists must be legalized. We handle the full compliance process to ensure smooth clearance at Jeddah port.",
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
      "Colombia requires a pre-shipment inspection for used equipment imports. Fumigation certificates are mandatory for wood packaging. We coordinate all inspections and documentation before departure to prevent port delays.",
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
      "Mexico allows duty-free import of certain agricultural equipment under USMCA provisions. All shipments require a pedimento (customs declaration). We prepare bilingual documentation and coordinate with Mexican customs brokers for seamless clearance.",
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
      "Romania is an EU member, so imports must comply with EU machinery directives and CE marking requirements. Phytosanitary certificates are required for wood packaging. We ensure all documentation meets EU customs standards.",
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
      "Kazakhstan shipments route through a transshipment port (typically Poti, Georgia or Mersin, Turkey) before Caspian Sea feeder to Aktau. GOST certification may be required for certain equipment. We coordinate the full multimodal chain from your door to Aktau.",
    containerOptions: ["40ft High-Cube", "Flat Rack", "20ft Standard"],
    faqs: [
      { question: "Why does shipping to Kazakhstan take 40-50 days?", answer: "Kazakhstan is landlocked. Shipments travel by ocean to a transshipment port (typically Poti, Georgia or Mersin, Turkey), then transfer to a Caspian Sea feeder vessel to Aktau port. The multimodal routing adds transit time.", category: "Kazakhstan" },
      { question: "Is GOST certification required for equipment imports to Kazakhstan?", answer: "GOST certification may be required for certain equipment categories under the Eurasian Economic Union (EAEU) technical regulations. We verify requirements for your specific equipment and coordinate certification when needed.", category: "Kazakhstan" },
      { question: "What equipment is commonly exported to Kazakhstan?", answer: "Combines, tractors, excavators, bulldozers, planters, and headers are all in demand for Kazakhstan's agricultural and mining sectors. The country's vast farmland and mineral resources drive consistent equipment imports.", category: "Kazakhstan" },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
