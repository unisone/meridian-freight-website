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
    description: "End-to-end export of a John Deere S670 combine with stripper header to Brazil — pickup, dismantling, documentation, and secure packing into 2x 40ft HC containers.",
    image: "/images/project-jd-s670-combine.jpg",
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
    description: "End-to-end export of six CAT excavators for a UAE construction project — coordinated pickup, preparation, and loading onto 6x flat rack containers.",
    image: "/images/project-cat-challenger-flatrack.jpg",
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
    description: "Complete export of Case IH grain headers to Ukraine — custom cradle fabrication, secure packing into 3x 40ft HC containers, and full export documentation.",
    image: "/images/project-case-ih-combine.jpg",
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
    description: "End-to-end export of a full tillage package — disc harrows and field cultivators dismantled, documented, and packed into 4x 40ft HC containers for Russia.",
    image: "/images/project-jd-tillage-containers.jpg",
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
    description: "Complete export of a 24-row Kinze 3700 planter to South Korea — dismantling, photo documentation, and secure packing into 2x 40ft HC containers.",
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
    description: "End-to-end export of Shelbourne stripper headers to Romania — custom protective crating and packing into 2x 40ft HC containers with complete documentation.",
    image: "/images/project-shelbourne-loading.jpg",
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
    description: "End-to-end export of a John Deere self-propelled sprayer to Turkey — boom section dismantling, custom crating, and packing into 3x 40ft HC containers.",
    image: "/images/project-jd-sprayer-crane.jpg",
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
