export interface EquipmentType {
  slug: string;
  title: string;
  pluralName: string;
  singularName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroDescription: string;
  brands: string[];
  commonModels: string[];
  packingNotes: string;
  containerTypes: string[];
  relatedServiceSlugs: string[];
}

export const equipmentTypes: EquipmentType[] = [
  {
    slug: "combines",
    title: "Combine Harvester Export & Shipping",
    pluralName: "Combines",
    singularName: "Combine",
    metaTitle: "Combine Export & Shipping | Meridian Export",
    metaDescription:
      "Export your combine harvester worldwide. Professional dismantling, container packing, and ocean shipping for John Deere, Case IH, Claas, and AGCO combines.",
    keywords: [
      "combine harvester export",
      "ship combine overseas",
      "John Deere combine shipping",
      "Case IH combine export",
      "used combine international shipping",
      "combine harvester container packing",
      "export combine from USA",
    ],
    heroDescription:
      "Your combine represents a major investment, and shipping it overseas demands specialized handling. We export John Deere, Case IH, Claas, and AGCO combines to buyers across Africa, South America, Central Asia, and the Middle East with full dismantling, packing, and documentation.",
    brands: ["John Deere", "Case IH", "Claas", "AGCO"],
    commonModels: [
      "John Deere S780",
      "Case IH 9250 Axial-Flow",
      "Claas Lexion 8700",
      "AGCO Gleaner S98",
    ],
    packingNotes:
      "Combines require partial dismantling before export. We remove the header, unloading auger, and GPS dome, then secure the main body inside a 40ft high-cube container or on a flat rack depending on dimensions.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "container-loading"],
  },
  {
    slug: "tractors",
    title: "Tractor Export & Shipping",
    pluralName: "Tractors",
    singularName: "Tractor",
    metaTitle: "Tractor Export & Shipping | Meridian Export",
    metaDescription:
      "Ship tractors from the USA worldwide. We handle John Deere, Case IH, Kubota, and New Holland tractor export with professional packing and ocean freight.",
    keywords: [
      "tractor export USA",
      "ship tractor overseas",
      "John Deere tractor shipping",
      "used tractor international export",
      "tractor container loading",
      "farm tractor ocean freight",
      "export tractor to Africa",
    ],
    heroDescription:
      "Whether you are buying a single utility tractor or a fleet of row-crop machines, we get your equipment from any US or Canadian location to your farm overseas. We handle John Deere, Case IH, Kubota, and New Holland tractors of every size and configuration.",
    brands: ["John Deere", "Case IH", "Kubota", "New Holland"],
    commonModels: [
      "John Deere 8R 410",
      "Case IH Magnum 340",
      "Kubota M7-172",
      "New Holland T7.315",
    ],
    packingNotes:
      "Tractors are loaded into 40ft high-cube containers with custom wood blocking and heavy-duty ratchet straps. Dual wheels and cab mirrors are removed to fit container dimensions, and all fluids are drained to meet shipping regulations.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Standard 40ft"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "equipment-sales"],
  },
  {
    slug: "excavators",
    title: "Excavator Export & Shipping",
    pluralName: "Excavators",
    singularName: "Excavator",
    metaTitle: "Excavator Export & Shipping | Meridian Export",
    metaDescription:
      "Export excavators from the USA. We ship CAT, Komatsu, Hitachi, and Volvo excavators worldwide with flat rack loading, tie-down, and full documentation.",
    keywords: [
      "excavator export shipping",
      "ship excavator overseas",
      "CAT excavator international shipping",
      "Komatsu excavator export",
      "used excavator ocean freight",
      "heavy equipment export USA",
      "excavator flat rack shipping",
    ],
    heroDescription:
      "Excavators are among the most commonly exported heavy machines, and getting them secured for ocean transit takes experience. We ship CAT, Komatsu, Hitachi, and Volvo excavators on flat racks and in open-top containers to construction sites worldwide.",
    brands: ["CAT", "Komatsu", "Hitachi", "Volvo"],
    commonModels: [
      "CAT 330 GC",
      "Komatsu PC210LC",
      "Hitachi ZX350LC-6",
      "Volvo EC300E",
    ],
    packingNotes:
      "Excavators typically ship on flat racks due to their height and weight. The boom is lowered and pinned, the bucket is removed and secured separately, and the tracks are chocked with heavy timber blocking to prevent movement during ocean transit.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
  },
  {
    slug: "planters",
    title: "Planter Export & Shipping",
    pluralName: "Planters",
    singularName: "Planter",
    metaTitle: "Planter Export & Shipping | Meridian Export",
    metaDescription:
      "Export planters and seeding equipment worldwide. We ship Kinze, John Deere, Case IH, and Great Plains planters with careful row-unit protection and packing.",
    keywords: [
      "planter export shipping",
      "ship planter overseas",
      "John Deere planter export",
      "Kinze planter international shipping",
      "precision planter ocean freight",
      "seed drill export USA",
      "row planter container packing",
    ],
    heroDescription:
      "Precision planters have delicate row units, seed meters, and GPS components that need careful handling during export. We ship Kinze, John Deere, Case IH, and Great Plains planters to farms worldwide, protecting every component from seed tubes to closing wheels.",
    brands: ["Kinze", "John Deere", "Case IH", "Great Plains"],
    commonModels: [
      "Kinze 3660",
      "John Deere 1775NT",
      "Case IH 2150 Early Riser",
      "Great Plains YP-2425A",
    ],
    packingNotes:
      "Planters are folded and the row units are individually protected with foam wrap. Seed meters and precision components are removed and crated separately. The toolbar is secured inside a 40ft high-cube container with custom blocking to prevent lateral movement.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
  },
  {
    slug: "sprayers",
    title: "Sprayer Export & Shipping",
    pluralName: "Sprayers",
    singularName: "Sprayer",
    metaTitle: "Sprayer Export & Shipping | Meridian Export",
    metaDescription:
      "Export self-propelled and pull-type sprayers worldwide. Professional boom folding, tank cleaning, and secure shipping for John Deere, Case IH, and Apache sprayers.",
    keywords: [
      "sprayer export shipping",
      "self-propelled sprayer export",
      "John Deere sprayer shipping",
      "Case IH Patriot export",
      "agricultural sprayer ocean freight",
      "spray boom container packing",
      "Apache sprayer international shipping",
    ],
    heroDescription:
      "Self-propelled sprayers have wide booms, tall clearances, and chemical residue requirements that make export logistics complex. We ship John Deere, Case IH, Apache, and Hagie sprayers with proper boom folding, tank cleaning, and secure container loading.",
    brands: ["John Deere", "Case IH", "Apache", "Hagie"],
    commonModels: [
      "John Deere R4045",
      "Case IH Patriot 4440",
      "Apache AS1250",
      "Hagie STS16",
    ],
    packingNotes:
      "Sprayer booms are folded and additionally secured with strapping to prevent deployment during transit. Chemical tanks are drained and triple-rinsed to meet international shipping and customs regulations. The high-clearance chassis often requires flat rack loading.",
    containerTypes: ["Flat Rack", "40ft High-Cube"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "documentation"],
  },
  {
    slug: "headers",
    title: "Header Export & Shipping",
    pluralName: "Headers",
    singularName: "Header",
    metaTitle: "Header Export & Shipping | Meridian Export",
    metaDescription:
      "Export combine headers and draper platforms worldwide. We ship Shelbourne, MacDon, John Deere, and Draper headers with custom crating and container packing.",
    keywords: [
      "combine header export",
      "draper header shipping",
      "MacDon header international shipping",
      "Shelbourne header export USA",
      "grain header ocean freight",
      "corn header container packing",
      "flex header export shipping",
    ],
    heroDescription:
      "Headers are wide, awkward to handle, and easy to damage during shipping if not packed correctly. We export Shelbourne, MacDon, Draper, and John Deere headers with custom-built crating that protects knife sections, auger fingers, and draper belts throughout ocean transit.",
    brands: ["Shelbourne", "MacDon", "Draper", "John Deere"],
    commonModels: [
      "Shelbourne Reynolds CVS32",
      "MacDon FD2 Series",
      "John Deere 745FD",
      "MacDon D145",
    ],
    packingNotes:
      "Headers are placed on custom-welded transport stands or wooden cradles inside 40ft high-cube containers. Knife sections are covered with protective guards, and draper belts are secured to prevent sagging. Multiple headers can sometimes be stacked in a single container to reduce shipping costs.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
  },
  {
    slug: "bulldozers",
    title: "Bulldozer Export & Shipping",
    pluralName: "Bulldozers",
    singularName: "Bulldozer",
    metaTitle: "Bulldozer Export & Shipping | Meridian Export",
    metaDescription:
      "Export bulldozers from the USA worldwide. We ship CAT, Komatsu, John Deere, and Case bulldozers on flat racks with professional securing and documentation.",
    keywords: [
      "bulldozer export shipping",
      "ship bulldozer overseas",
      "CAT bulldozer international shipping",
      "Komatsu dozer export",
      "used bulldozer ocean freight",
      "heavy dozer flat rack shipping",
      "bulldozer export from USA",
    ],
    heroDescription:
      "Bulldozers are some of the heaviest machines we ship, and their weight demands careful load planning and flat rack securing. We export CAT, Komatsu, John Deere, and Case bulldozers to mining and construction operations on every continent.",
    brands: ["CAT", "Komatsu", "John Deere", "Case"],
    commonModels: [
      "CAT D6T",
      "Komatsu D65PX",
      "John Deere 850L",
      "Case 2050M",
    ],
    packingNotes:
      "Bulldozers almost always ship on flat racks due to their weight and dimensions. The blade is lowered flat, ripper is pinned in transport position, and the tracks are chocked with heavy timber and chain binders. We calculate center of gravity to ensure the load meets container weight limits.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
  },
  {
    slug: "loaders",
    title: "Loader Export & Shipping",
    pluralName: "Loaders",
    singularName: "Loader",
    metaTitle: "Loader Export & Shipping | Meridian Export",
    metaDescription:
      "Export wheel loaders and skid steers worldwide. We ship CAT, John Deere, Volvo, and Komatsu loaders in containers and on flat racks with full export support.",
    keywords: [
      "loader export shipping",
      "wheel loader international shipping",
      "CAT loader export USA",
      "skid steer export overseas",
      "John Deere loader ocean freight",
      "front loader container packing",
      "Volvo loader export shipping",
    ],
    heroDescription:
      "From compact skid steers that fit inside a container to large wheel loaders that require flat rack shipping, we handle every size. We export CAT, John Deere, Volvo, and Komatsu loaders to construction and agriculture operations worldwide.",
    brands: ["CAT", "John Deere", "Volvo", "Komatsu"],
    commonModels: [
      "CAT 950 GC",
      "John Deere 644L",
      "Volvo L120H",
      "Komatsu WA380-8",
    ],
    packingNotes:
      "Smaller loaders and skid steers fit inside 40ft high-cube containers with the bucket removed and secured alongside. Larger wheel loaders ship on flat racks with the bucket detached and loaded separately. Articulation joints are locked and steering cylinders are pinned for transit.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Standard 40ft"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "equipment-sales"],
  },
] as const;

export function getEquipmentBySlug(slug: string): EquipmentType | undefined {
  return equipmentTypes.find((e) => e.slug === slug);
}

export function getAllEquipmentSlugs(): string[] {
  return equipmentTypes.map((e) => e.slug);
}
