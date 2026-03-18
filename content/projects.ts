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
    description: "End-to-end export of a John Deere 9650STS combine — loaded on a UASC flat rack with tires secured alongside, ready for ocean transit.",
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
    description: "End-to-end export of a John Deere W260 self-propelled windrower — loaded onto a Hapag-Lloyd flat rack with custom bracing and tie-downs at port.",
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
    description: "End-to-end export of a Case IH 9120 combine with tires — secured on a Hapag-Lloyd flat rack with custom wood blocking and strapping for overseas shipping.",
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
    description: "Two John Deere combines packed into side-by-side 40ft containers — dismantled and loaded rear-first with professional strapping for maximum space utilization.",
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
    description: "End-to-end export of Shelbourne stripper headers — forklift-loaded into a shipping container at our packing facility with custom protective bracing.",
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
    description: "End-to-end export of a John Deere self-propelled sprayer — crane-lifted onto a Maersk flat rack with boom sections secured and crated separately.",
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
