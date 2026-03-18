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
      "Professional dismantling, labeling, and secure container packing for heavy machinery of all types. Every component documented for reassembly.",
    longDescription:
      "Our team of certified technicians handles complete or partial disassembly of heavy machinery for export. Each component is tagged, photographed, and cataloged using our proprietary documentation system. Hardware is bagged and labeled with corresponding assembly points. We use professional blocking, bracing, and tie-down methods to ensure zero damage during transit.",
    icon: "Package",
    keywords: ["machinery container packing services", "heavy equipment dismantling", "machinery disassembly for export"],
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
      "We optimize every cubic foot of container space to minimize shipping costs while ensuring maximum security. Our loading teams use specialized equipment for heavy lifts and precise positioning. We coordinate with shipping lines for the most efficient routes and competitive rates to any destination worldwide.",
    icon: "Truck",
    keywords: ["heavy equipment container loading", "machinery export shipping", "40ft container loading services"],
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
      "Agriculture is our core expertise. We understand the unique requirements of farm equipment — from GPS-equipped combines to precision planters. Our team knows how to safely disassemble, wash, fumigate (where required), and pack agricultural machinery to meet international phytosanitary standards.",
    icon: "Wheat",
    keywords: ["agricultural equipment export services", "farm machinery shipping", "combine harvester export"],
    equipmentTypes: ["Combines", "Tractors", "Planters", "Sprayers", "Headers", "Tillage Equipment"],
    relatedSlugs: ["machinery-packing", "equipment-sales"],
  },
  {
    slug: "equipment-sales",
    title: "Equipment Sales & Procurement",
    shortTitle: "Equipment Sales",
    description:
      "We source, inspect, and procure quality used machinery from across North America for international buyers.",
    longDescription:
      "Need specific equipment for your operation? We leverage our network of dealers, auctions, and private sellers across the USA and Canada to find exactly what you need. Every piece is inspected, documented with photos and condition reports, and prepared for export. We handle the entire procurement chain from sourcing to delivery.",
    icon: "ShoppingCart",
    keywords: ["used farm equipment for export", "equipment procurement services", "machinery sales international"],
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
      "International shipping requires precise documentation. We handle all export paperwork including commercial invoices, packing lists, bills of lading, certificates of origin, phytosanitary certificates, and any country-specific requirements. Our documentation team ensures your shipment clears customs without delays.",
    icon: "FileText",
    keywords: ["export documentation services USA", "machinery shipping paperwork", "customs documentation heavy equipment"],
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
      "Our strategically located warehouses in California, Georgia, Illinois, North Dakota, Texas, and Alberta (Canada) provide flexible storage solutions. Whether you need short-term staging before a container is loaded or long-term storage while awaiting shipping schedules, we keep your equipment secure and protected.",
    icon: "Warehouse",
    keywords: ["equipment storage warehousing USA", "machinery storage for export", "heavy equipment warehouse"],
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
