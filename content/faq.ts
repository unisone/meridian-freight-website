export interface FaqEntry {
  question: string;
  answer: string;
  category: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "What types of machinery do you handle?",
    answer: "We specialize in agricultural and heavy-duty machinery: combines, tractors, excavators, bulldozers, planters, sprayers, mining equipment, and more. We handle all major brands — John Deere, Case IH, CAT, Kinze, Kubota — and know the disassembly specs for each.",
    category: "General",
  },
  {
    question: "What areas do you serve?",
    answer: "We pick up equipment anywhere in the USA and Canada. Our main facility is in Iowa, with partner warehouses in California, Georgia, Illinois, North Dakota, Texas, and Alberta. We ship to any port worldwide — Latin America, Middle East, Africa, Central Asia, and beyond.",
    category: "General",
  },
  {
    question: "How long does the entire process take?",
    answer: "Equipment pickup to container loading typically takes 5–14 days depending on complexity. Ocean transit is 18–35 days for most routes. For urgent parts or time-sensitive shipments, air freight delivers in 7–14 days. Every quote includes a detailed timeline so you know exactly when to expect delivery.",
    category: "Shipping",
  },
  {
    question: "What container sizes do you work with?",
    answer: "We work with 20ft, 40ft, and 40ft high-cube containers, plus flat racks and open tops for oversized equipment. Our team optimizes every cubic foot of space to keep your shipping costs as low as possible.",
    category: "Shipping",
  },
  {
    question: "Do you handle customs documentation?",
    answer: "Yes — we handle all export paperwork: commercial invoices, packing lists, bills of lading, certificates of origin, and phytosanitary certificates. We coordinate directly with customs brokers to prevent delays at port.",
    category: "Documentation",
  },
  {
    question: "How do you calculate pricing?",
    answer: "Pricing depends on equipment type, dismantling complexity, pickup distance, and destination. Every quote is transparent and itemized — no hidden fees. Check our pricing page for reference rates, or use our freight calculator for an instant estimate.",
    category: "Pricing",
  },
  {
    question: "Do you provide transportation insurance?",
    answer: "Yes — our transportation and storage services are fully insured. Coverage details are outlined in our service agreement. We can also arrange marine cargo insurance for the ocean shipping leg.",
    category: "General",
  },
  {
    question: "How do you ensure parts aren't lost during dismantling?",
    answer: "Every component is tagged, photographed, and cataloged. Hardware gets bagged and labeled with matching assembly points. You receive a complete documentation package so your team can reassemble everything on the other end.",
    category: "General",
  },
  {
    question: "Can you source and purchase equipment for me?",
    answer: "Yes — our sourcing team helps international buyers find specific machinery from dealers, auctions, and private sellers across the USA and Canada. Every piece is inspected and documented with photos before we ship it.",
    category: "General",
  },
  {
    question: "Do you offer storage services?",
    answer: "Yes — we offer secure storage at our Iowa facility and partner warehouses across the USA and Canada. Short-term staging before loading or long-term storage while awaiting shipping schedules — your equipment stays protected.",
    category: "General",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept wire transfers and ACH payments. For larger projects, we can arrange milestone-based payment schedules. Every service comes with a detailed, itemized invoice.",
    category: "Pricing",
  },
  {
    question: "Is there a minimum order requirement?",
    answer: "No minimum order. We handle everything from a single piece of equipment to full fleet operations. Every project gets the same level of professional service regardless of size.",
    category: "Pricing",
  },
  {
    question: "What happens if my equipment is damaged in transit?",
    answer: "All transportation and storage is fully insured. We photograph and document every component before packing, establishing a clear condition baseline. If damage occurs during transit, we file claims with the carrier and insurance provider on your behalf. We also offer marine cargo insurance for the ocean shipping leg — ask us about coverage options when you request a quote.",
    category: "General",
  },
  {
    question: "Can you handle equipment I've never exported before?",
    answer: "Absolutely — we handle first-time exports regularly. Our team manages everything: figuring out the best way to disassemble your equipment, preparing all documentation, and clearing customs. No prior export experience needed on your end.",
    category: "General",
  },
  {
    question: "What countries have you shipped to?",
    answer: "Anywhere with a seaport or airport. Our most active markets are Latin America (Brazil, Colombia, Mexico), the Middle East (UAE, Turkey, Saudi Arabia), Africa, Central Asia, and Eastern Europe. We work with Maersk, Hapag-Lloyd, and CMA CGM for reliable transit.",
    category: "Shipping",
  },
  {
    question: "Why can't I use FedEx or DHL for heavy machinery?",
    answer: "Parcel carriers like FedEx, UPS, and DHL have strict weight and dimension limits — typically under 150 lbs per package. Heavy machinery weighing thousands of pounds requires specialized freight logistics: flatbed trucking for inland transport, professional dismantling and container packing, and ocean freight on cargo vessels. That is exactly what we do — full-service export logistics for equipment that parcel carriers cannot handle.",
    category: "Shipping",
  },
  {
    question: "What about import duties and tariffs at the destination?",
    answer: "Import duties vary by country and equipment type — they can range from 0% (free-zone ports like Jebel Ali, UAE) to 20%+ in some markets. We provide duty estimates for your specific destination as part of your quote so there are no surprises. Some countries offer duty exemptions for agricultural equipment under trade agreements like USMCA for Mexico.",
    category: "Pricing",
  },
  {
    question: "Do you ship parts and components, not just whole machines?",
    answer: "Yes. We source and ship OEM John Deere parts, aftermarket replacement components, and used parts worldwide. We consolidate multiple items into single shipments so you save 30-50% on per-item freight. Parts can ship via air freight (7-14 days) or ocean for larger orders. No minimum order — contact parts@meridianexport.com for a quote within 1 hour.",
    category: "Shipping",
  },
  {
    question: "Can you ship by air instead of ocean?",
    answer: "Yes. We offer air freight for time-sensitive shipments — parts typically arrive in 7-14 days via air. Air freight is ideal for urgently needed components, seasonal farming deadlines, or smaller items where speed matters more than cost. Most complete machines ship by ocean, but we arrange air transport when the timeline demands it.",
    category: "Shipping",
  },
  {
    question: "Do I need an export license to ship machinery from the USA?",
    answer: "Most commercial and agricultural machinery does not require a specific export license from the USA. However, certain equipment with dual-use technology or controlled components may need a Bureau of Industry and Security (BIS) license. We check your equipment against the Export Administration Regulations (EAR) and handle all required filings as part of our documentation service.",
    category: "Documentation",
  },
];

// Top 6 for homepage
export const homepageFaq = faqEntries.slice(0, 6);
