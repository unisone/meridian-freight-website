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
    description: "We loaded a John Deere 9650STS combine onto a UASC flat rack, securing the detached tires alongside for safe ocean transit to Santos, Brazil. The header and unloading auger were removed, labeled, and strapped to the flat rack deck — total prep time was 3 days from arrival to port departure. The buyer had the combine field-ready within a week of clearing Santos customs.",
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
    description: "We shipped a John Deere W260 windrower to the UAE on a Hapag-Lloyd flat rack with custom wood bracing and heavy-duty tie-downs at port. The draper header was crated separately to protect the belt and knife sections during 35 days of ocean transit. The buyer in Jebel Ali reported zero damage on arrival — equipment was operational within 48 hours.",
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
    description: "We secured a Case IH 9120 combine and detached tires on a Hapag-Lloyd flat rack using custom wood blocking and grade-43 chain binders for overseas shipping to Saudi Arabia. At 18,000 kg, load distribution was critical — we calculated center of gravity and positioned the machine to stay within flat rack weight limits across all four corners. The shipment cleared Jeddah port in 30 days with all SABER documentation pre-approved.",
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
    description: "We dismantled and packed two John Deere combines into side-by-side 40ft containers, loading rear-first with professional strapping to maximize space. Headers, augers, and GPS domes were removed and crated separately — every bolt bag was labeled for reassembly. The dual-container shipment reached Novorossiysk in 30 days, saving the buyer over $8,000 compared to flat rack pricing.",
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
    description: "We forklift-loaded Shelbourne stripper headers into two 40ft high-cube containers at our packing facility, adding custom protective bracing for the knife sections and belt assemblies. Each header was secured on welded transport stands to prevent lateral movement during 25 days of ocean transit to Constanta, Romania. The buyer confirmed all four units arrived in working condition.",
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
    description: "We crane-lifted a John Deere self-propelled sprayer onto a Maersk flat rack, crating the 120-foot boom sections separately in custom wooden frames for safe transit to Turkey. The chemical tank was triple-rinsed and certified clean for customs compliance. The sprayer arrived at Mersin port in 20 days and was reassembled by the buyer's team using our labeled documentation package.",
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
