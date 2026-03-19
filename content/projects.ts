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
    title: "John Deere 9650STS Combine Export",
    description: "We loaded a John Deere 9650STS combine onto a UASC flat rack, securing the tires alongside for safe ocean transit to Santos, Brazil.",
    image: "/images/project-jd-9650sts-combine.jpg",
    equipmentType: "Combine Harvester",
    destination: "Santos, Brazil",
    containerType: "40ft Flat Rack",
    weight: "15,000 kg",
    transitTime: "28 days",
    category: "Harvesting",
  },
  {
    id: 2,
    title: "John Deere W260 Windrower Export",
    description: "We shipped a John Deere W260 windrower to the UAE on a Hapag-Lloyd flat rack with custom wood bracing and heavy-duty tie-downs at port.",
    image: "/images/project-jd-w260-windrower.jpg",
    equipmentType: "Windrower",
    destination: "Jebel Ali, UAE",
    containerType: "40ft Flat Rack",
    weight: "12,000 kg",
    transitTime: "35 days",
    category: "Harvesting",
  },
  {
    id: 3,
    title: "Case IH 9120 Combine to Middle East",
    description: "We secured a Case IH 9120 combine and tires on a Hapag-Lloyd flat rack using custom wood blocking and strapping for overseas shipping to Saudi Arabia.",
    image: "/images/project-case-ih-combine.jpg",
    equipmentType: "Combine Harvester",
    destination: "Jeddah, Saudi Arabia",
    containerType: "40ft Flat Rack",
    weight: "18,000 kg",
    transitTime: "30 days",
    category: "Harvesting",
  },
  {
    id: 4,
    title: "John Deere Combine Pair — Container Export",
    description: "We dismantled and packed two John Deere combines into side-by-side 40ft containers, loading rear-first with professional strapping to maximize space.",
    image: "/images/project-jd-tillage-containers.jpg",
    equipmentType: "Combine Harvesters",
    destination: "Novorossiysk, Russia",
    containerType: "2x 40ft Standard",
    weight: "22,000 kg",
    transitTime: "30 days",
    category: "Harvesting",
  },
  {
    id: 6,
    title: "Shelbourne Stripper Headers",
    description: "We forklift-loaded Shelbourne stripper headers into shipping containers at our packing facility, adding custom protective bracing for transit to Romania.",
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
    description: "We crane-lifted a John Deere self-propelled sprayer onto a Maersk flat rack, crating the boom sections separately for safe transit to Turkey.",
    image: "/images/project-jd-sprayer-crane.jpg",
    equipmentType: "Self-Propelled Sprayer",
    destination: "Mersin, Turkey",
    containerType: "40ft Flat Rack",
    weight: "14,000 kg",
    transitTime: "20 days",
    category: "Spraying",
  },
];

export const projectCategories = [
  "All",
  "Harvesting",
  "Spraying",
];
