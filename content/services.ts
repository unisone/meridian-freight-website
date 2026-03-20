import type { FaqEntry } from "@/content/faq";

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
  faqs?: FaqEntry[];
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
    faqs: [
      { question: "How do you disassemble machinery without damaging it?", answer: "Every component is labeled, photographed, and cataloged before removal. Hardware is bagged with matching assembly-point tags so your team can reassemble on the other end. We follow manufacturer service manuals for disassembly sequence.", category: "Machinery Packing" },
      { question: "What packing materials do you use inside the container?", answer: "We use ISPM-15 compliant timber blocking, heavy-duty ratchet straps, chain binders for machines over 10,000 lbs, foam padding for painted surfaces, and custom-built wooden cradles for irregularly shaped components.", category: "Machinery Packing" },
      { question: "Can you pack multiple machines in one container?", answer: "Yes — we regularly fit 2-3 smaller machines or a large machine plus loose components in a single 40ft high-cube container. Strategic loading minimizes your per-unit shipping cost.", category: "Machinery Packing" },
      { question: "Do you provide a packing report with photos?", answer: "Absolutely. Every shipment includes a detailed loading report with timestamped photos showing each step: before disassembly, during packing, blocking and bracing, and the sealed container. This documentation is also useful for insurance claims.", category: "Machinery Packing" },
    ],
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
    faqs: [
      { question: "What container sizes are available for heavy equipment?", answer: "We use 20ft standard, 40ft standard, 40ft high-cube, flat racks, and open-top containers. The right choice depends on your equipment dimensions and weight. Most agricultural machines fit in a 40ft high-cube; oversized equipment goes on flat racks.", category: "Container Loading" },
      { question: "How do you maximize container space to reduce shipping costs?", answer: "Our loading teams measure every machine and plan the layout digitally before loading day. We fit loose parts, attachments, and smaller items around the main machine to use every cubic foot — reducing the number of containers you need.", category: "Container Loading" },
      { question: "Which shipping lines do you work with?", answer: "We negotiate rates directly with Maersk, Hapag-Lloyd, CMA CGM, MSC, ZIM, and Evergreen. We compare routes and pricing for each shipment and book the carrier that offers the best rate and transit time to your destination.", category: "Container Loading" },
      { question: "How long does ocean shipping take?", answer: "Transit times vary by destination: 10-15 days to Mexico, 12-18 days to Colombia, 18-25 days to Turkey, 25-30 days to Brazil, and 30-38 days to the Middle East. We provide exact timelines with every quote.", category: "Container Loading" },
    ],
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
    faqs: [
      { question: "Do you handle phytosanitary certificates for farm equipment?", answer: "Yes. Many countries require USDA phytosanitary certificates for agricultural equipment to confirm it is free of soil, seeds, and pests. We coordinate washing, fumigation (when required), and certificate issuance before shipping.", category: "Agricultural" },
      { question: "Can you export GPS-equipped combines and precision planters?", answer: "Absolutely. We carefully remove GPS domes, yield monitors, and precision-ag components, then pack them separately in padded crates. All wiring harnesses are labeled for easy reinstallation.", category: "Agricultural" },
      { question: "What brands of agricultural equipment do you export most?", answer: "John Deere, Case IH, Kinze, Kubota, New Holland, AGCO, and Claas are our most commonly exported brands. We know the disassembly specs for each and carry the right rigging equipment for their weight classes.", category: "Agricultural" },
      { question: "Do you export tillage equipment like discs and cultivators?", answer: "Yes. Tillage equipment like disc harrows, chisel plows, and field cultivators fold down and fit inside 40ft containers or on flat racks. We remove wings and hydraulic cylinders when needed to meet container dimensions.", category: "Agricultural" },
    ],
  },
  {
    slug: "equipment-sales",
    title: "Equipment Sourcing & Procurement",
    shortTitle: "Equipment Sourcing",
    description:
      "We help international buyers find quality used machinery, OEM parts, and aftermarket components from dealers, auctions, and sellers across the USA and Canada.",
    longDescription:
      "Need a specific machine or part? Tell us the make, model, and year — we search our network of dealers, auctions, and private sellers across the USA and Canada. We source complete machines, OEM John Deere parts from authorized dealers, and aftermarket replacement components at competitive prices. Every piece is inspected and documented with photos and a condition report before you commit. We consolidate multiple parts orders into single shipments to reduce your per-item freight cost — most buyers save 30-50% versus shipping items individually. Once you buy, we handle the complete export via air or ocean freight.",
    icon: "Search",
    keywords: ["used farm equipment sourcing USA Canada", "equipment procurement services", "buy machinery for export", "international equipment sourcing agent", "John Deere parts export", "aftermarket parts international shipping"],
    equipmentTypes: ["Any agricultural equipment", "Construction machinery", "Industrial equipment", "OEM & aftermarket parts", "John Deere components"],
    relatedSlugs: ["agricultural", "documentation"],
    faqs: [
      { question: "Can you find a specific make and model of equipment?", answer: "Yes. Tell us the make, model, year range, and condition you need — we search our network of dealers, auction houses, and private sellers across the USA and Canada. Most requests get matched within 1-2 weeks.", category: "Equipment Sourcing" },
      { question: "Do you inspect equipment before purchase?", answer: "Every machine is inspected on-site by our team. You receive a detailed condition report with photos, hour meter readings, and notes on any issues. All equipment is sold as-is, but you get full transparency before committing.", category: "Equipment Sourcing" },
      { question: "Can you attend auctions like Ritchie Bros on my behalf?", answer: "Yes. We regularly attend Ritchie Bros, Purple Wave, BigIron, and AuctionTime sales. We inspect lots before the auction, bid on your behalf, and handle all post-sale logistics from pickup to export.", category: "Equipment Sourcing" },
      { question: "Do you source and ship John Deere parts internationally?", answer: "Yes. We source OEM John Deere parts from authorized US and European dealers, plus aftermarket replacement components at lower prices. We consolidate multiple parts into single shipments to reduce freight costs — most buyers save 30-50% per item. Parts ship via air freight (7-14 days) or ocean freight for larger orders. Contact us at parts@meridianexport.com for a quote within 1 hour.", category: "Equipment Sourcing" },
    ],
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
    faqs: [
      { question: "What export documents do I need to ship machinery overseas?", answer: "Typically you need a Commercial Invoice, Packing List, Bill of Lading, Certificate of Title, AES/EEI filing with US Customs, and a Shipper's Letter of Instruction. Agricultural equipment may also require a USDA Phytosanitary Certificate.", category: "Documentation" },
      { question: "Do you handle customs paperwork for the destination country?", answer: "We prepare all US/Canada export documentation and coordinate with customs brokers at the destination port. Country-specific requirements like Brazil's import licenses, Turkey's TAREKS, or Saudi Arabia's SABER certificates are all handled.", category: "Documentation" },
      { question: "What happens if documentation is incorrect or missing?", answer: "Incorrect paperwork causes port delays and storage fees — sometimes thousands of dollars. That is why we handle every document in-house and triple-check before shipment. In 500+ exports, we have a near-perfect first-time clearance rate.", category: "Documentation" },
      { question: "Do I need an export license for used machinery?", answer: "Most used commercial and agricultural equipment does not require an export license under US EAR regulations. However, certain dual-use items may need Bureau of Industry and Security review. We verify every shipment against the Commerce Control List.", category: "Documentation" },
    ],
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
    faqs: [
      { question: "Where are your warehouse facilities located?", answer: "Our main packing and loading facility is in Albion, Iowa. We also have partner warehouses in California, Georgia, Illinois, North Dakota, Texas, and Alberta (Canada) for nationwide coverage.", category: "Warehousing" },
      { question: "How long can I store equipment before shipping?", answer: "There is no fixed limit. Some clients store equipment for days while waiting for a vessel, others for months while purchasing additional machines. Storage rates are competitive and quoted per month based on the equipment size.", category: "Warehousing" },
      { question: "Is my equipment insured while in your warehouse?", answer: "Our facilities carry general liability and property coverage. We recommend maintaining your own equipment insurance during the storage period for full protection. We can provide warehouse receipts for your insurer.", category: "Warehousing" },
    ],
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
