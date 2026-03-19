export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string; // Lucide icon name
  keywords: string[];
  equipmentTypes: string[];
  relatedSlugs: string[];
}

export const services: Service[] = [
  {
    slug: "machinery-packing",
    title: "Machinery Dismantling & Container Packing",
    shortTitle: "Machinery Packing",
    description:
      "Professional dismantling, labeling, and secure container packing for heavy machinery. Every component is tagged, photographed, and documented for reassembly.",
    longDescription:
      "Our technicians fully or partially disassemble your equipment, then tag, photograph, and catalog every component. All hardware is bagged and labeled with matching assembly points so your team can reassemble on the other end. Inside the container, we use professional blocking, bracing, and tie-downs to prevent any movement during ocean transit.",
    icon: "Package",
    keywords: ["machinery container packing services", "heavy equipment dismantling for export", "machinery disassembly for shipping", "equipment crating services USA", "40ft container packing"],
    equipmentTypes: ["Combines", "Tractors", "Excavators", "Bulldozers", "Loaders", "Cranes"],
    relatedSlugs: ["container-loading", "agricultural"],
  },
  {
    slug: "container-loading",
    title: "Container Loading & Export Shipping",
    shortTitle: "Container Loading",
    description:
      "Expert container loading and international shipping coordination. We maximize space utilization in 20ft, 40ft, and high-cube containers.",
    longDescription:
      "We pack every cubic foot strategically — minimizing your shipping cost while keeping the load secure. Our teams use cranes, forklifts, and custom blocking for heavy lifts and precise positioning. We negotiate directly with Maersk, Hapag-Lloyd, and CMA CGM for the best rates and routes to your destination.",
    icon: "Truck",
    keywords: ["heavy equipment container loading", "machinery export shipping worldwide", "40ft container loading services USA", "international freight shipping machinery", "container space optimization"],
    equipmentTypes: ["Standard 20ft", "Standard 40ft", "40ft High-Cube", "Flat Rack", "Open Top"],
    relatedSlugs: ["machinery-packing", "documentation"],
  },
  {
    slug: "agricultural",
    title: "Agricultural Equipment Services",
    shortTitle: "Agricultural Equipment",
    description:
      "Specialized handling for agricultural machinery including combines, tractors, planters, sprayers, and tillage equipment.",
    longDescription:
      "Agriculture is our core business. We know how GPS-equipped combines come apart, which precision planter components need separate crating, and what phytosanitary standards your destination country requires. We wash, fumigate (where needed), and pack to pass inspection on the other end.",
    icon: "Wheat",
    keywords: ["agricultural equipment export services", "farm machinery shipping overseas", "combine harvester export USA", "tractor export international", "John Deere export shipping"],
    equipmentTypes: ["Combines", "Tractors", "Planters", "Sprayers", "Headers", "Tillage Equipment"],
    relatedSlugs: ["machinery-packing", "equipment-sales"],
  },
  {
    slug: "equipment-sales",
    title: "Equipment Sourcing & Procurement",
    shortTitle: "Equipment Sourcing",
    description:
      "We help international buyers find and inspect quality used machinery from dealers, auctions, and private sellers across the USA and Canada.",
    longDescription:
      "Need a specific machine? Tell us the make, model, and year — we search our network of dealers, auctions, and private sellers across the USA and Canada. Every piece is inspected on-site and documented with photos and a condition report before you commit. All equipment is sold as-is, but you get full transparency to make an informed decision. Once you buy, we handle the complete export.",
    icon: "Search",
    keywords: ["used farm equipment sourcing USA Canada", "equipment procurement services", "buy machinery for export", "international equipment sourcing agent"],
    equipmentTypes: ["Any agricultural equipment", "Construction machinery", "Industrial equipment"],
    relatedSlugs: ["agricultural", "documentation"],
  },
  {
    slug: "documentation",
    title: "Export Documentation & Compliance",
    shortTitle: "Export Documentation",
    description:
      "Complete export documentation services including bills of lading, customs forms, phytosanitary certificates, and compliance paperwork.",
    longDescription:
      "Missing or incorrect paperwork is the number one cause of port delays. We prepare all export documents — commercial invoices, packing lists, bills of lading, certificates of origin, phytosanitary certificates — and handle any country-specific requirements so your shipment clears customs the first time.",
    icon: "FileText",
    keywords: ["export documentation services USA", "machinery shipping paperwork", "customs documentation heavy equipment", "bill of lading machinery", "phytosanitary certificate farm equipment"],
    equipmentTypes: [],
    relatedSlugs: ["container-loading", "warehousing"],
  },
  {
    slug: "warehousing",
    title: "Equipment Storage & Warehousing",
    shortTitle: "Warehouse & Storage",
    description:
      "Secure storage facilities across the USA and Canada for dismantled equipment, components, and machinery awaiting shipment.",
    longDescription:
      "Sometimes shipping schedules don't align with equipment availability. Our warehouse network in California, Georgia, Illinois, North Dakota, Texas, and Alberta gives you flexibility — stage equipment before loading, or store it long-term while you wait for the right vessel. Everything stays secure, covered, and documented.",
    icon: "Warehouse",
    keywords: ["equipment storage warehousing USA Canada", "machinery storage for export", "heavy equipment warehouse Iowa", "equipment staging before shipping"],
    equipmentTypes: [],
    relatedSlugs: ["machinery-packing", "documentation"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return service.relatedSlugs
    .map((rs) => getServiceBySlug(rs))
    .filter((s): s is Service => s !== undefined);
}
