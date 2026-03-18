export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  equipmentType: string;
  destination: string;
  containerType: string;
  weight: string;
  transitTime: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "John Deere S670 Combine to South America",
    description: "Complete dismantling and container packing of a John Deere S670 combine with stripper header for export to Brazil.",
    image: "/images/john-deere-s670.jpg",
    equipmentType: "Combine Harvester",
    destination: "Santos, Brazil",
    containerType: "2x 40ft HC",
    weight: "15,000 kg",
    transitTime: "28 days",
    category: "Harvesting",
  },
  {
    id: 2,
    title: "CAT Excavator Fleet to Middle East",
    description: "Six CAT excavators prepared, loaded, and shipped to a construction project in the UAE.",
    image: "/images/excavator-cat.jpg",
    equipmentType: "Excavators",
    destination: "Jebel Ali, UAE",
    containerType: "6x 40ft Flat Rack",
    weight: "120,000 kg total",
    transitTime: "35 days",
    category: "Construction",
  },
  {
    id: 3,
    title: "Case IH Grain Headers to Eastern Europe",
    description: "Precision packing of Case IH grain headers with custom cradles for safe ocean transit.",
    image: "/images/grain-headers-case.jpg",
    equipmentType: "Grain Headers",
    destination: "Odesa, Ukraine",
    containerType: "3x 40ft HC",
    weight: "8,400 kg",
    transitTime: "22 days",
    category: "Harvesting",
  },
  {
    id: 4,
    title: "John Deere & Wil-Rich Tillage Equipment",
    description: "Complete tillage package including disc harrows and field cultivators, dismantled and container-packed.",
    image: "/images/john-deere-wil-rich.jpg",
    equipmentType: "Tillage Equipment",
    destination: "Novorossiysk, Russia",
    containerType: "4x 40ft HC",
    weight: "22,000 kg",
    transitTime: "30 days",
    category: "Tillage",
  },
  {
    id: 5,
    title: "Kinze 3700 Planter Export",
    description: "24-row Kinze 3700 planter carefully dismantled, documented, and shipped for precision agriculture overseas.",
    image: "/images/kinze-3700.jpg",
    equipmentType: "Planter",
    destination: "Busan, South Korea",
    containerType: "2x 40ft HC",
    weight: "9,500 kg",
    transitTime: "18 days",
    category: "Planting",
  },
  {
    id: 6,
    title: "Shelbourne Stripper Headers",
    description: "Specialized stripper headers packed with custom protection for long-distance ocean shipping.",
    image: "/images/stripper-headers-shelbourne.jpg",
    equipmentType: "Stripper Headers",
    destination: "Constanta, Romania",
    containerType: "2x 40ft HC",
    weight: "5,200 kg",
    transitTime: "25 days",
    category: "Harvesting",
  },
  {
    id: 7,
    title: "John Deere Self-Propelled Sprayer",
    description: "High-clearance sprayer dismantled with boom sections carefully crated for reassembly at destination.",
    image: "/images/self-propelled-sprayer-john-deere.jpg",
    equipmentType: "Self-Propelled Sprayer",
    destination: "Mersin, Turkey",
    containerType: "3x 40ft HC",
    weight: "14,000 kg",
    transitTime: "20 days",
    category: "Spraying",
  },
];

export const projectCategories = [
  "All",
  "Harvesting",
  "Tillage",
  "Planting",
  "Spraying",
  "Construction",
];
