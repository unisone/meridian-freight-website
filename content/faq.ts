export interface FaqEntry {
  question: string;
  answer: string;
  category: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "What types of machinery do you handle?",
    answer: "We specialize in agricultural and heavy-duty machinery including combines, tractors, excavators, bulldozers, planters, sprayers, industrial equipment, mining machinery, and forestry equipment. Our team has expertise in handling all major brands — John Deere, Case IH, CAT, Kinze, and more.",
    category: "General",
  },
  {
    question: "What areas do you serve?",
    answer: "We provide pickup services across the entire USA and Canada. Our warehouse facilities are located in California, Georgia, Illinois, North Dakota, Texas, and Alberta (Canada). We ship to any port worldwide.",
    category: "General",
  },
  {
    question: "How long does the entire process take?",
    answer: "Typical timeline from equipment pickup to container loading is 5-14 days depending on complexity. Ocean transit times vary by destination — 18-35 days for most routes. We provide a detailed timeline with every quote.",
    category: "Shipping",
  },
  {
    question: "What container sizes do you work with?",
    answer: "We work with standard 20ft, 40ft, and 40ft high-cube containers, as well as flat racks and open tops for oversized equipment. Our team optimizes space utilization to minimize shipping costs.",
    category: "Shipping",
  },
  {
    question: "Do you handle customs documentation?",
    answer: "Yes, we provide complete export documentation services including commercial invoices, packing lists, bills of lading, certificates of origin, and phytosanitary certificates. We coordinate with customs brokers to ensure smooth clearance.",
    category: "Documentation",
  },
  {
    question: "How do you calculate pricing?",
    answer: "Pricing depends on equipment type, dismantling complexity, pickup distance, storage needs, and shipping destination. We provide transparent, itemized quotes. Visit our pricing page for reference rates, or use our freight calculator for instant estimates.",
    category: "Pricing",
  },
  {
    question: "Do you provide transportation insurance?",
    answer: "Yes, all transportation and storage services are fully insured. We carry comprehensive coverage for equipment damage, theft, and liability. We can also arrange marine cargo insurance for the ocean transit portion.",
    category: "General",
  },
  {
    question: "How do you ensure parts aren't lost during dismantling?",
    answer: "We use a comprehensive labeling and documentation system. Each component is tagged, photographed, and cataloged. All hardware is bagged and labeled with corresponding assembly points. You receive a full documentation package for reassembly.",
    category: "General",
  },
  {
    question: "Can you source and purchase equipment for me?",
    answer: "Yes, our Equipment Sales & Procurement service helps international buyers find specific machinery from dealers, auctions, and private sellers across North America. Every piece is inspected and documented before shipping.",
    category: "General",
  },
  {
    question: "Do you offer storage services?",
    answer: "Yes, we provide secure storage at our facilities across the USA and Canada. Whether you need short-term staging or long-term storage while awaiting shipping schedules, we keep your equipment protected.",
    category: "General",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept wire transfers, ACH payments, and can arrange milestone-based payment schedules for larger projects. We provide detailed invoices for every service.",
    category: "Pricing",
  },
  {
    question: "Is there a minimum order requirement?",
    answer: "No minimum. We handle everything from single pieces of equipment to fleet-scale operations with dozens of machines. Every project receives the same level of professional service.",
    category: "Pricing",
  },
];

// Top 6 for homepage
export const homepageFaq = faqEntries.slice(0, 6);
