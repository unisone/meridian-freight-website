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
  },
] as const;

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
