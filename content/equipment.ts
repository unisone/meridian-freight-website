import type { FaqEntry } from "@/content/faq";

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
  faqs?: FaqEntry[];
  typicalPriceRange?: string;
}

const equipmentTypesEn: EquipmentType[] = [
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
      "Combines require partial dismantling before export. We remove the header, unloading auger, and GPS dome, then secure the main body inside a 40ft high-cube container or on a flat rack depending on dimensions. All components are blocked with #2 grade kiln-dried lumber and secured with grade-43 chain binders rated for the machine's weight. Every removed part is tagged, photographed, and packed with a reassembly guide for the buyer's team.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "container-loading"],
    faqs: [
      { question: "How much does it cost to ship a combine overseas?", answer: "Total export cost for a combine typically ranges from $12,000 to $25,000 depending on pickup location, destination port, and whether it ships in a 40ft high-cube container or on a flat rack. We provide itemized quotes within 24 hours.", category: "Combines" },
      { question: "Do you remove the header before shipping a combine?", answer: "Yes. The header, unloading auger, GPS dome, and other protruding components are removed, labeled, and packed separately. The main body is then positioned inside a 40ft high-cube container or secured on a flat rack.", category: "Combines" },
      { question: "Can a combine fit inside a standard 40ft container?", answer: "Most combines require a 40ft high-cube container after partial dismantling, or a flat rack for larger models. We measure your specific model and recommend the most cost-effective container option.", category: "Combines" },
      { question: "What combine brands do you export most frequently?", answer: "John Deere S-Series, Case IH Axial-Flow, Claas Lexion, and AGCO Gleaner are our most commonly shipped combines. We know the disassembly specs for each brand and carry the right rigging equipment.", category: "Combines" },
    ],
    typicalPriceRange: "$12K – $25K",
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
      "Tractors are loaded into 40ft high-cube containers with custom wood blocking and heavy-duty ratchet straps. Dual wheels and cab mirrors are removed to fit container dimensions, and all fluids are drained to meet shipping regulations. We use 4x6 hardwood timbers for wheel chocking and minimum 5,000 lb-rated winch straps at four tie-down points. Hydraulic lines are capped and protected with anti-contamination covers to ensure the tractor arrives ready to work.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Standard 40ft"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "equipment-sales"],
    faqs: [
      { question: "How are tractors loaded into shipping containers?", answer: "Dual wheels and cab mirrors are removed to fit container width. The tractor is driven or winched into a 40ft high-cube container, then blocked with timber and secured with heavy-duty ratchet straps. All fluids are drained per shipping regulations.", category: "Tractors" },
      { question: "Can you ship a tractor with attachments?", answer: "Yes. Loaders, three-point implements, and other attachments are removed and packed alongside or on top of the tractor inside the container. This maximizes space and keeps your shipping cost down.", category: "Tractors" },
      { question: "What is the cheapest way to ship a tractor internationally?", answer: "A 40ft high-cube container is usually the most cost-effective option. If you are buying multiple smaller tractors, we can fit 2-3 compact or utility models in a single container to significantly reduce per-unit cost.", category: "Tractors" },
      { question: "Do you ship both row-crop and utility tractors?", answer: "We ship everything from compact Kubota utility tractors to John Deere 9R four-wheel-drive row-crop machines. Each size class has different container and blocking requirements, and we handle them all.", category: "Tractors" },
    ],
    typicalPriceRange: "$8K – $18K",
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
      "Excavators typically ship on flat racks due to their height and weight. The boom is lowered and pinned, the bucket is removed and secured separately, and the tracks are chocked with heavy timber blocking to prevent movement during ocean transit. We use grade-70 transport chains with load binders at all four corners, and position the machine to distribute weight evenly across the flat rack. All hydraulic lines are capped, batteries disconnected, and fluids drained per IMDG code requirements.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "How do you ship an excavator that is too tall for a container?", answer: "Excavators ship on flat racks or in open-top containers. The boom is lowered and pinned, the bucket is removed and secured separately, and the tracks are chocked with heavy timber blocking to prevent movement during ocean transit.", category: "Excavators" },
      { question: "What is the weight limit for shipping an excavator?", answer: "A standard flat rack supports up to 40 metric tons. Most mid-size excavators (20-35 ton class) fit within this limit. For larger machines, we use specialized heavy-lift services or breakbulk shipping.", category: "Excavators" },
      { question: "Do you drain all fluids before shipping an excavator?", answer: "Yes. Hydraulic oil, engine oil, coolant, and diesel are drained to meet international shipping regulations and prevent environmental hazards. We also disconnect the battery and secure all hydraulic lines.", category: "Excavators" },
    ],
    typicalPriceRange: "$10K – $22K",
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
      "Planters are folded and the row units are individually protected with closed-cell foam wrap to prevent seed tube and closing wheel damage. Seed meters, precision-ag controllers, and hydraulic components are removed and crated separately in anti-static packaging. The toolbar is secured inside a 40ft high-cube container with 4x6 hardwood blocking to prevent lateral movement. All wiring harnesses are labeled with matching assembly point tags for straightforward reassembly.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "How do you protect precision planter components during shipping?", answer: "Seed meters, row-unit electronics, and GPS components are removed, wrapped in anti-static foam, and packed in separate wooden crates. All wiring harnesses are labeled for easy reinstallation at the destination.", category: "Planters" },
      { question: "Can a 24-row planter fit in a container?", answer: "Yes. Large planters are folded into transport position and the row-unit wings are secured. A 24-row planter typically fits in a 40ft high-cube container or on a flat rack, depending on toolbar width and frame height.", category: "Planters" },
      { question: "Do you ship precision planters with variable-rate technology?", answer: "Absolutely. We handle Kinze, John Deere ExactEmerge, and Case IH Early Riser planters with variable-rate drives, hydraulic down-force systems, and precision-ag controllers. All electronics are removed and packed separately.", category: "Planters" },
    ],
    typicalPriceRange: "$5K – $14K",
  },
  {
    slug: "sprayers",
    title: "Sprayer Export & Shipping",
    pluralName: "Sprayers",
    singularName: "Sprayer",
    metaTitle: "Sprayer Export & Shipping | Meridian Export",
    metaDescription:
      "Export self-propelled and pull-type sprayers worldwide. Boom folding, tank cleaning, and secure shipping for John Deere, Case IH, and Apache sprayers.",
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
      "Sprayer booms are folded and additionally secured with 2-inch polyester strapping rated to 6,000 lbs to prevent deployment during transit. Chemical tanks are drained, triple-rinsed with neutralizing solution, and certified clean per IMO and destination country customs regulations. The high-clearance chassis often requires flat rack loading due to overall height. Nozzle tips and boom ends are individually wrapped in protective foam, and all electronics are removed and packed in moisture-sealed crates.",
    containerTypes: ["Flat Rack", "40ft High-Cube"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "documentation"],
    faqs: [
      { question: "Do you clean sprayer tanks before export?", answer: "Yes. All chemical tanks are drained and triple-rinsed to meet international shipping regulations and destination country customs requirements. We provide a tank-cleaning certificate with every sprayer shipment.", category: "Sprayers" },
      { question: "How are sprayer booms secured for ocean shipping?", answer: "Booms are folded into transport position and additionally secured with heavy-duty strapping to prevent accidental deployment during transit. Nozzle tips and boom ends are protected with foam wrapping.", category: "Sprayers" },
      { question: "Can a self-propelled sprayer fit in a container?", answer: "Smaller self-propelled sprayers can fit in a 40ft high-cube container after boom folding and mirror removal. Larger high-clearance models like the John Deere R4045 typically require flat rack shipping due to their height.", category: "Sprayers" },
    ],
    typicalPriceRange: "$8K – $20K",
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
      "Headers are placed on custom-welded transport stands or wooden cradles inside 40ft high-cube containers. Knife sections are covered with heavy-gauge steel protective guards, and draper belts are tensioned and pinned to prevent sagging during transit. Multiple headers can sometimes be stacked in a single container using tiered cradle systems to reduce per-unit shipping costs. All auger fingers and reel tines are individually protected with foam sleeves and secured with cable ties.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "Can you ship multiple headers in one container?", answer: "Yes. Depending on width and type, we can often stack 2-3 headers in a single 40ft high-cube container using custom-built transport stands. This significantly reduces per-unit shipping cost.", category: "Headers" },
      { question: "How do you protect knife sections during shipping?", answer: "Knife sections are covered with heavy-duty protective guards, and sickle bars are pinned in the retracted position. Draper belts are secured and tensioned to prevent sagging or damage during ocean transit.", category: "Headers" },
      { question: "Do you ship stripper headers and corn heads?", answer: "We ship all header types: draper platforms, flex headers, rigid cutterbar headers, stripper headers, and corn heads. Each type has specific crating requirements that we handle based on the manufacturer specs.", category: "Headers" },
    ],
    typicalPriceRange: "$3K – $8K",
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
      "Bulldozers almost always ship on flat racks due to their weight and dimensions. The blade is lowered flat, ripper is pinned in transport position, and the tracks are chocked with heavy timber and grade-70 chain binders rated for loads up to 47,700 lbs. We calculate center of gravity for each machine to ensure the load meets flat rack corner-post weight limits and prevent shifting in heavy seas. All fluids are drained per IMDG code, and batteries are disconnected and terminals capped.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "How do you secure a bulldozer on a flat rack for ocean shipping?", answer: "The blade is lowered flat, the ripper is pinned in transport position, and the tracks are chocked with heavy timber. Chain binders rated for the machine's weight secure it to the flat rack tie-down points. We calculate center of gravity to ensure safe transit.", category: "Bulldozers" },
      { question: "What size bulldozers can you ship?", answer: "We ship everything from small D3/D4 class dozers that fit in containers to large D8/D9 class machines that require flat rack or breakbulk shipping. Weight limits for flat racks are approximately 40 metric tons.", category: "Bulldozers" },
      { question: "How long does it take to export a bulldozer?", answer: "From equipment pickup to port departure typically takes 7-14 days, including transport to our facility, securing on a flat rack, and documentation. Add 18-40 days of ocean transit depending on destination.", category: "Bulldozers" },
    ],
    typicalPriceRange: "$10K – $25K",
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
      "Smaller loaders and skid steers fit inside 40ft high-cube containers with the bucket removed and secured alongside. Larger wheel loaders ship on flat racks with the bucket detached and loaded separately on the deck. Articulation joints are locked, steering cylinders are pinned, and all hydraulic quick-coupler lines are capped to prevent contamination during ocean transit. We use 4x6 hardwood blocking at all four wheels and minimum grade-43 chain binders to secure the machine.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Standard 40ft"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "equipment-sales"],
    faqs: [
      { question: "Can a wheel loader fit inside a shipping container?", answer: "Smaller loaders and skid steers fit inside 40ft high-cube containers with the bucket removed and secured alongside. Larger wheel loaders (5+ ton class) typically require flat rack shipping due to their height and weight.", category: "Loaders" },
      { question: "Do you export skid steer loaders?", answer: "Yes. Compact skid steers like the CAT 262D or John Deere 332G are among the easiest machines to containerize. We can often fit 2 skid steers in a single 40ft container, reducing your per-unit cost.", category: "Loaders" },
      { question: "How are loader buckets packed for shipping?", answer: "Buckets and attachments are removed, cleaned, and secured alongside the main machine inside the container or on the flat rack. Hydraulic quick-coupler lines are capped and protected from contamination.", category: "Loaders" },
    ],
    typicalPriceRange: "$6K – $16K",
  },
];

const equipmentTypesEs: EquipmentType[] = [
  {
    slug: "combines",
    title: "Exportación y Envío de Cosechadoras",
    pluralName: "Cosechadoras",
    singularName: "Cosechadora",
    metaTitle: "Exportación y Envío de Cosechadoras | Meridian Export",
    metaDescription:
      "Exporte su cosechadora a todo el mundo. Desmontaje profesional, embalaje en contenedor y flete marítimo para cosechadoras John Deere, Case IH, Claas y AGCO.",
    keywords: [
      "exportación de cosechadora",
      "enviar cosechadora al exterior",
      "envío de cosechadora John Deere",
      "exportación de cosechadora Case IH",
      "envío internacional de cosechadora usada",
      "embalaje de cosechadora en contenedor",
      "exportar cosechadora desde USA",
    ],
    heroDescription:
      "Su cosechadora representa una inversión importante, y enviarla al exterior requiere manejo especializado. Exportamos cosechadoras John Deere, Case IH, Claas y AGCO a compradores en África, Sudamérica, Asia Central y Medio Oriente con desmontaje completo, embalaje y documentación.",
    brands: ["John Deere", "Case IH", "Claas", "AGCO"],
    commonModels: [
      "John Deere S780",
      "Case IH 9250 Axial-Flow",
      "Claas Lexion 8700",
      "AGCO Gleaner S98",
    ],
    packingNotes:
      "Las cosechadoras requieren desmontaje parcial antes de la exportación. Retiramos el cabezal, la descarga y el domo GPS, luego aseguramos el cuerpo principal dentro de un contenedor 40ft high-cube o en un flat rack según las dimensiones. Todos los componentes se bloquean con madera de grado #2 secada en horno y se aseguran con tensores de cadena grado 43 clasificados para el peso de la máquina. Cada parte retirada se etiqueta, fotografía y empaca con una guía de reensamblaje.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "container-loading"],
    faqs: [
      { question: "¿Cuánto cuesta enviar una cosechadora al exterior?", answer: "El costo total de exportación de una cosechadora típicamente varía entre $12,000 y $25,000 dependiendo de la ubicación de recolección, puerto de destino y si se envía en un contenedor 40ft high-cube o en un flat rack. Proporcionamos cotizaciones detalladas en 24 horas.", category: "Cosechadoras" },
      { question: "¿Retiran el cabezal antes de enviar una cosechadora?", answer: "Sí. El cabezal, la descarga, el domo GPS y otros componentes salientes se retiran, etiquetan y empacan por separado. El cuerpo principal se posiciona dentro de un contenedor 40ft high-cube o se asegura en un flat rack.", category: "Cosechadoras" },
      { question: "¿Cabe una cosechadora en un contenedor estándar de 40ft?", answer: "La mayoría de las cosechadoras requieren un contenedor 40ft high-cube después del desmontaje parcial, o un flat rack para modelos más grandes. Medimos su modelo específico y recomendamos la opción de contenedor más económica.", category: "Cosechadoras" },
      { question: "¿Qué marcas de cosechadoras exportan con más frecuencia?", answer: "John Deere Serie S, Case IH Axial-Flow, Claas Lexion y AGCO Gleaner son nuestras cosechadoras más enviadas. Conocemos las especificaciones de desmontaje de cada marca y contamos con el equipo de maniobra adecuado.", category: "Cosechadoras" },
    ],
    typicalPriceRange: "$12K – $25K",
  },
  {
    slug: "tractors",
    title: "Exportación y Envío de Tractores",
    pluralName: "Tractores",
    singularName: "Tractor",
    metaTitle: "Exportación y Envío de Tractores | Meridian Export",
    metaDescription:
      "Envíe tractores desde USA a todo el mundo. Manejamos la exportación de tractores John Deere, Case IH, Kubota y New Holland con embalaje profesional y flete marítimo.",
    keywords: [
      "exportación de tractor USA",
      "enviar tractor al exterior",
      "envío de tractor John Deere",
      "exportación internacional de tractor usado",
      "carga de tractor en contenedor",
      "flete marítimo de tractor agrícola",
      "exportar tractor a Latinoamérica",
    ],
    heroDescription:
      "Ya sea que compre un solo tractor utilitario o una flota de máquinas para cultivos en hilera, llevamos su equipo desde cualquier ubicación en USA o Canadá a su campo en el exterior. Manejamos tractores John Deere, Case IH, Kubota y New Holland de todos los tamaños y configuraciones.",
    brands: ["John Deere", "Case IH", "Kubota", "New Holland"],
    commonModels: [
      "John Deere 8R 410",
      "Case IH Magnum 340",
      "Kubota M7-172",
      "New Holland T7.315",
    ],
    packingNotes:
      "Los tractores se cargan en contenedores 40ft high-cube con bloqueo de madera a medida y cinchas de trinquete de servicio pesado. Las ruedas duales y los espejos de cabina se retiran para cumplir con las dimensiones del contenedor, y todos los fluidos se drenan según las regulaciones de envío. Usamos vigas de madera dura de 4x6 para calzar las ruedas y cinchas de malacate con clasificación mínima de 2,270 kg en cuatro puntos de amarre. Las líneas hidráulicas se tapan y protegen con cubiertas anticontaminación.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Estándar 40ft"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "equipment-sales"],
    faqs: [
      { question: "¿Cómo se cargan los tractores en contenedores de envío?", answer: "Las ruedas duales y los espejos de cabina se retiran para ajustar al ancho del contenedor. El tractor se conduce o se jala con malacate dentro del contenedor 40ft high-cube, luego se bloquea con madera y se asegura con cinchas de trinquete de servicio pesado. Todos los fluidos se drenan según las regulaciones de envío.", category: "Tractores" },
      { question: "¿Pueden enviar un tractor con implementos?", answer: "Sí. Cargadores frontales, implementos de tres puntos y otros accesorios se retiran y empacan junto al tractor o encima de él dentro del contenedor. Esto maximiza el espacio y mantiene bajo su costo de envío.", category: "Tractores" },
      { question: "¿Cuál es la forma más económica de enviar un tractor internacionalmente?", answer: "Un contenedor 40ft high-cube es generalmente la opción más económica. Si va a comprar varios tractores más pequeños, podemos acomodar 2-3 modelos compactos o utilitarios en un solo contenedor para reducir significativamente el costo por unidad.", category: "Tractores" },
      { question: "¿Envían tractores para cultivo en hilera y utilitarios?", answer: "Enviamos de todo, desde tractores utilitarios compactos Kubota hasta máquinas John Deere 9R de tracción integral para cultivos en hilera. Cada clase de tamaño tiene diferentes requisitos de contenedor y bloqueo, y los manejamos todos.", category: "Tractores" },
    ],
    typicalPriceRange: "$8K – $18K",
  },
  {
    slug: "excavators",
    title: "Exportación y Envío de Excavadoras",
    pluralName: "Excavadoras",
    singularName: "Excavadora",
    metaTitle: "Exportación y Envío de Excavadoras | Meridian Export",
    metaDescription:
      "Exporte excavadoras desde USA. Enviamos excavadoras CAT, Komatsu, Hitachi y Volvo a todo el mundo con carga en flat rack, amarre y documentación completa.",
    keywords: [
      "exportación y envío de excavadora",
      "enviar excavadora al exterior",
      "envío internacional de excavadora CAT",
      "exportación de excavadora Komatsu",
      "flete marítimo de excavadora usada",
      "exportación de equipo pesado USA",
      "envío de excavadora en flat rack",
    ],
    heroDescription:
      "Las excavadoras están entre las máquinas pesadas más exportadas, y asegurarlas para el tránsito marítimo requiere experiencia. Enviamos excavadoras CAT, Komatsu, Hitachi y Volvo en flat racks y contenedores open-top a obras de construcción en todo el mundo.",
    brands: ["CAT", "Komatsu", "Hitachi", "Volvo"],
    commonModels: [
      "CAT 330 GC",
      "Komatsu PC210LC",
      "Hitachi ZX350LC-6",
      "Volvo EC300E",
    ],
    packingNotes:
      "Las excavadoras normalmente se envían en flat racks debido a su altura y peso. El brazo se baja y se fija, el cucharón se retira y asegura por separado, y las orugas se calzan con bloqueo pesado de madera para evitar movimiento durante el tránsito marítimo. Usamos cadenas de transporte grado 70 con tensores en las cuatro esquinas, y posicionamos la máquina para distribuir el peso uniformemente. Todas las líneas hidráulicas se tapan, las baterías se desconectan y los fluidos se drenan según los requisitos del código IMDG.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "¿Cómo envían una excavadora que es demasiado alta para un contenedor?", answer: "Las excavadoras se envían en flat racks o en contenedores open-top. El brazo se baja y se fija, el cucharón se retira y asegura por separado, y las orugas se calzan con bloqueo pesado de madera para evitar movimiento durante el tránsito marítimo.", category: "Excavadoras" },
      { question: "¿Cuál es el límite de peso para enviar una excavadora?", answer: "Un flat rack estándar soporta hasta 40 toneladas métricas. La mayoría de las excavadoras medianas (clase 20-35 toneladas) están dentro de este límite. Para máquinas más grandes, utilizamos servicios especializados de elevación pesada o envío breakbulk.", category: "Excavadoras" },
      { question: "¿Drenan todos los fluidos antes de enviar una excavadora?", answer: "Sí. El aceite hidráulico, aceite de motor, refrigerante y diésel se drenan para cumplir con las regulaciones internacionales de envío y prevenir riesgos ambientales. También desconectamos la batería y aseguramos todas las líneas hidráulicas.", category: "Excavadoras" },
    ],
    typicalPriceRange: "$10K – $22K",
  },
  {
    slug: "planters",
    title: "Exportación y Envío de Sembradoras",
    pluralName: "Sembradoras",
    singularName: "Sembradora",
    metaTitle: "Exportación y Envío de Sembradoras | Meridian Export",
    metaDescription:
      "Exporte sembradoras y equipo de siembra a todo el mundo. Enviamos sembradoras Kinze, John Deere, Case IH y Great Plains con protección cuidadosa de unidades de hilera.",
    keywords: [
      "exportación y envío de sembradora",
      "enviar sembradora al exterior",
      "exportación de sembradora John Deere",
      "envío internacional de sembradora Kinze",
      "flete marítimo de sembradora de precisión",
      "exportación de sembradora desde USA",
      "embalaje de sembradora en contenedor",
    ],
    heroDescription:
      "Las sembradoras de precisión tienen unidades de hilera delicadas, dosificadores de semilla y componentes GPS que necesitan manejo cuidadoso durante la exportación. Enviamos sembradoras Kinze, John Deere, Case IH y Great Plains a campos en todo el mundo, protegiendo cada componente desde tubos de semilla hasta ruedas cerradoras.",
    brands: ["Kinze", "John Deere", "Case IH", "Great Plains"],
    commonModels: [
      "Kinze 3660",
      "John Deere 1775NT",
      "Case IH 2150 Early Riser",
      "Great Plains YP-2425A",
    ],
    packingNotes:
      "Las sembradoras se pliegan y las unidades de hilera se protegen individualmente con espuma de celda cerrada para prevenir daño a tubos de semilla y ruedas cerradoras. Los dosificadores de semilla, controladores de agricultura de precisión y componentes hidráulicos se retiran y embalan por separado en embalaje antiestático. La barra portaherramientas se asegura dentro de un contenedor 40ft high-cube con bloqueo de madera dura de 4x6 para evitar movimiento lateral. Todos los arneses de cableado se etiquetan con marcas de punto de ensamblaje correspondientes.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "¿Cómo protegen los componentes de las sembradoras de precisión durante el envío?", answer: "Los dosificadores de semilla, la electrónica de unidades de hilera y los componentes GPS se retiran, envuelven en espuma antiestática y empacan en cajas de madera separadas. Todos los arneses de cableado se etiquetan para fácil reinstalación en destino.", category: "Sembradoras" },
      { question: "¿Cabe una sembradora de 24 hileras en un contenedor?", answer: "Sí. Las sembradoras grandes se pliegan en posición de transporte y las alas de las unidades de hilera se aseguran. Una sembradora de 24 hileras típicamente cabe en un contenedor 40ft high-cube o en un flat rack, dependiendo del ancho de la barra y la altura del bastidor.", category: "Sembradoras" },
      { question: "¿Envían sembradoras de precisión con tecnología de dosis variable?", answer: "Por supuesto. Manejamos sembradoras Kinze, John Deere ExactEmerge y Case IH Early Riser con accionamientos de dosis variable, sistemas hidráulicos de presión descendente y controladores de agricultura de precisión. Toda la electrónica se retira y empaca por separado.", category: "Sembradoras" },
    ],
    typicalPriceRange: "$5K – $14K",
  },
  {
    slug: "sprayers",
    title: "Exportación y Envío de Pulverizadoras",
    pluralName: "Pulverizadoras",
    singularName: "Pulverizadora",
    metaTitle: "Exportación y Envío de Pulverizadoras | Meridian Export",
    metaDescription:
      "Exporte pulverizadoras autopropulsadas y de arrastre a todo el mundo. Plegado de barras, limpieza de tanques y envío seguro para pulverizadoras John Deere, Case IH y Apache.",
    keywords: [
      "exportación y envío de pulverizadora",
      "exportación de pulverizadora autopropulsada",
      "envío de pulverizadora John Deere",
      "exportación de Case IH Patriot",
      "flete marítimo de pulverizadora agrícola",
      "embalaje de barra de pulverización en contenedor",
      "envío internacional de pulverizadora Apache",
    ],
    heroDescription:
      "Las pulverizadoras autopropulsadas tienen barras anchas, alta despeje y requisitos de residuos químicos que hacen compleja la logística de exportación. Enviamos pulverizadoras John Deere, Case IH, Apache y Hagie con plegado adecuado de barras, limpieza de tanques y carga segura en contenedor.",
    brands: ["John Deere", "Case IH", "Apache", "Hagie"],
    commonModels: [
      "John Deere R4045",
      "Case IH Patriot 4440",
      "Apache AS1250",
      "Hagie STS16",
    ],
    packingNotes:
      "Las barras de la pulverizadora se pliegan y se aseguran adicionalmente con cintas de poliéster de 2 pulgadas con clasificación de 2,720 kg para evitar el despliegue durante el tránsito. Los tanques de químicos se drenan, se enjuagan tres veces con solución neutralizante y se certifican limpios según las regulaciones de la OMI y la aduana del país de destino. El chasis de alto despeje frecuentemente requiere carga en flat rack debido a la altura total. Las boquillas y extremos de las barras se envuelven individualmente en espuma protectora.",
    containerTypes: ["Flat Rack", "40ft High-Cube"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "documentation"],
    faqs: [
      { question: "¿Limpian los tanques de las pulverizadoras antes de la exportación?", answer: "Sí. Todos los tanques de químicos se drenan y enjuagan tres veces para cumplir con las regulaciones internacionales de envío y los requisitos aduaneros del país de destino. Proporcionamos un certificado de limpieza de tanque con cada envío de pulverizadora.", category: "Pulverizadoras" },
      { question: "¿Cómo se aseguran las barras de la pulverizadora para el envío marítimo?", answer: "Las barras se pliegan en posición de transporte y se aseguran adicionalmente con cintas de servicio pesado para evitar el despliegue accidental durante el tránsito. Las boquillas y extremos de las barras se protegen con envoltura de espuma.", category: "Pulverizadoras" },
      { question: "¿Cabe una pulverizadora autopropulsada en un contenedor?", answer: "Las pulverizadoras autopropulsadas más pequeñas caben en un contenedor 40ft high-cube después del plegado de barras y remoción de espejos. Los modelos más grandes de alto despeje como la John Deere R4045 típicamente requieren envío en flat rack debido a su altura.", category: "Pulverizadoras" },
    ],
    typicalPriceRange: "$8K – $20K",
  },
  {
    slug: "headers",
    title: "Exportación y Envío de Cabezales",
    pluralName: "Cabezales",
    singularName: "Cabezal",
    metaTitle: "Exportación y Envío de Cabezales | Meridian Export",
    metaDescription:
      "Exporte cabezales de cosechadora y plataformas draper a todo el mundo. Enviamos cabezales Shelbourne, MacDon, John Deere y Draper con embalaje personalizado.",
    keywords: [
      "exportación de cabezal de cosechadora",
      "envío de cabezal draper",
      "envío internacional de cabezal MacDon",
      "exportación de cabezal Shelbourne USA",
      "flete marítimo de cabezal de grano",
      "embalaje de cabezal de maíz en contenedor",
      "exportación de cabezal flexible",
    ],
    heroDescription:
      "Los cabezales son anchos, difíciles de manejar y fáciles de dañar durante el envío si no se empacan correctamente. Exportamos cabezales Shelbourne, MacDon, Draper y John Deere con embalaje a medida que protege las secciones de cuchilla, dedos de sin-fin y bandas draper durante todo el tránsito marítimo.",
    brands: ["Shelbourne", "MacDon", "Draper", "John Deere"],
    commonModels: [
      "Shelbourne Reynolds CVS32",
      "MacDon FD2 Series",
      "John Deere 745FD",
      "MacDon D145",
    ],
    packingNotes:
      "Los cabezales se colocan en soportes de transporte soldados a medida o cunas de madera dentro de contenedores 40ft high-cube. Las secciones de cuchilla se cubren con protectores de acero de calibre pesado, y las bandas draper se tensionan y fijan para evitar el pandeo durante el tránsito. Múltiples cabezales pueden apilarse a veces en un solo contenedor usando sistemas de cunas escalonadas para reducir el costo de envío por unidad.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "¿Pueden enviar múltiples cabezales en un contenedor?", answer: "Sí. Dependiendo del ancho y tipo, frecuentemente podemos apilar 2-3 cabezales en un solo contenedor 40ft high-cube usando soportes de transporte a medida. Esto reduce significativamente el costo de envío por unidad.", category: "Cabezales" },
      { question: "¿Cómo protegen las secciones de cuchilla durante el envío?", answer: "Las secciones de cuchilla se cubren con protectores de servicio pesado, y las barras de hoz se fijan en posición retraída. Las bandas draper se aseguran y tensionan para evitar pandeo o daño durante el tránsito marítimo.", category: "Cabezales" },
      { question: "¿Envían cabezales stripper y cabezales de maíz?", answer: "Enviamos todos los tipos de cabezales: plataformas draper, cabezales flexibles, cabezales de barra de corte rígida, cabezales stripper y cabezales de maíz. Cada tipo tiene requisitos específicos de embalaje que manejamos según las especificaciones del fabricante.", category: "Cabezales" },
    ],
    typicalPriceRange: "$3K – $8K",
  },
  {
    slug: "bulldozers",
    title: "Exportación y Envío de Bulldozers",
    pluralName: "Bulldozers",
    singularName: "Bulldozer",
    metaTitle: "Exportación y Envío de Bulldozers | Meridian Export",
    metaDescription:
      "Exporte bulldozers desde USA a todo el mundo. Enviamos bulldozers CAT, Komatsu, John Deere y Case en flat racks con aseguramiento profesional y documentación.",
    keywords: [
      "exportación y envío de bulldozer",
      "enviar bulldozer al exterior",
      "envío internacional de bulldozer CAT",
      "exportación de dozer Komatsu",
      "flete marítimo de bulldozer usado",
      "envío de dozer pesado en flat rack",
      "exportación de bulldozer desde USA",
    ],
    heroDescription:
      "Los bulldozers son algunas de las máquinas más pesadas que enviamos, y su peso exige una planificación cuidadosa de la carga y aseguramiento en flat rack. Exportamos bulldozers CAT, Komatsu, John Deere y Case a operaciones de minería y construcción en todos los continentes.",
    brands: ["CAT", "Komatsu", "John Deere", "Case"],
    commonModels: [
      "CAT D6T",
      "Komatsu D65PX",
      "John Deere 850L",
      "Case 2050M",
    ],
    packingNotes:
      "Los bulldozers casi siempre se envían en flat racks debido a su peso y dimensiones. La hoja se baja completamente, el ripper se fija en posición de transporte y las orugas se calzan con madera pesada y tensores de cadena grado 70 clasificados para cargas de hasta 21,600 kg. Calculamos el centro de gravedad de cada máquina para asegurar que la carga cumpla con los límites de peso de los postes esquineros del flat rack.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "¿Cómo aseguran un bulldozer en un flat rack para envío marítimo?", answer: "La hoja se baja completamente, el ripper se fija en posición de transporte y las orugas se calzan con madera pesada. Tensores de cadena clasificados para el peso de la máquina la aseguran a los puntos de amarre del flat rack. Calculamos el centro de gravedad para garantizar un tránsito seguro.", category: "Bulldozers" },
      { question: "¿Qué tamaño de bulldozers pueden enviar?", answer: "Enviamos de todo, desde dozers pequeños clase D3/D4 que caben en contenedores hasta máquinas grandes clase D8/D9 que requieren flat rack o envío breakbulk. Los límites de peso para flat racks son aproximadamente 40 toneladas métricas.", category: "Bulldozers" },
      { question: "¿Cuánto tiempo toma exportar un bulldozer?", answer: "Desde la recolección del equipo hasta la salida del puerto típicamente toma 7-14 días, incluyendo transporte a nuestra instalación, aseguramiento en flat rack y documentación. Agregue 18-40 días de tránsito marítimo dependiendo del destino.", category: "Bulldozers" },
    ],
    typicalPriceRange: "$10K – $25K",
  },
  {
    slug: "loaders",
    title: "Exportación y Envío de Cargadores",
    pluralName: "Cargadores",
    singularName: "Cargador",
    metaTitle: "Exportación y Envío de Cargadores | Meridian Export",
    metaDescription:
      "Exporte cargadores frontales y minicargadores a todo el mundo. Enviamos cargadores CAT, John Deere, Volvo y Komatsu en contenedores y flat racks con soporte de exportación completo.",
    keywords: [
      "exportación y envío de cargador",
      "envío internacional de cargador frontal",
      "exportación de cargador CAT USA",
      "exportación de minicargador al exterior",
      "flete marítimo de cargador John Deere",
      "embalaje de cargador frontal en contenedor",
      "exportación de cargador Volvo",
    ],
    heroDescription:
      "Desde minicargadores compactos que caben dentro de un contenedor hasta grandes cargadores frontales que requieren envío en flat rack, manejamos todos los tamaños. Exportamos cargadores CAT, John Deere, Volvo y Komatsu a operaciones de construcción y agricultura en todo el mundo.",
    brands: ["CAT", "John Deere", "Volvo", "Komatsu"],
    commonModels: [
      "CAT 950 GC",
      "John Deere 644L",
      "Volvo L120H",
      "Komatsu WA380-8",
    ],
    packingNotes:
      "Los cargadores y minicargadores más pequeños caben dentro de contenedores 40ft high-cube con el cucharón retirado y asegurado al lado. Los cargadores frontales más grandes se envían en flat racks con el cucharón separado y cargado por separado en la plataforma. Las articulaciones se bloquean, los cilindros de dirección se fijan y todas las líneas de acoplamiento rápido hidráulico se tapan para evitar contaminación durante el tránsito marítimo.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Estándar 40ft"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "equipment-sales"],
    faqs: [
      { question: "¿Cabe un cargador frontal dentro de un contenedor de envío?", answer: "Los cargadores y minicargadores más pequeños caben dentro de contenedores 40ft high-cube con el cucharón retirado y asegurado al lado. Los cargadores frontales más grandes (clase 5+ toneladas) típicamente requieren envío en flat rack debido a su altura y peso.", category: "Cargadores" },
      { question: "¿Exportan minicargadores?", answer: "Sí. Los minicargadores compactos como el CAT 262D o el John Deere 332G son de las máquinas más fáciles de contenedorizar. Frecuentemente podemos acomodar 2 minicargadores en un solo contenedor de 40ft, reduciendo su costo por unidad.", category: "Cargadores" },
      { question: "¿Cómo se empacan los cucharones de cargador para el envío?", answer: "Los cucharones y accesorios se retiran, limpian y aseguran junto a la máquina principal dentro del contenedor o en el flat rack. Las líneas de acoplamiento rápido hidráulico se tapan y protegen contra contaminación.", category: "Cargadores" },
    ],
    typicalPriceRange: "$6K – $16K",
  },
];

const equipmentTypesRu: EquipmentType[] = [
  {
    slug: "combines",
    title: "Экспорт и доставка комбайнов",
    pluralName: "Комбайны",
    singularName: "Комбайн",
    metaTitle: "Экспорт и доставка комбайнов | Meridian Export",
    metaDescription:
      "Экспортируйте ваш зерноуборочный комбайн по всему миру. Профессиональный демонтаж, упаковка в контейнер и морской фрахт для комбайнов John Deere, Case IH, Claas и AGCO.",
    keywords: [
      "экспорт зерноуборочного комбайна",
      "доставка комбайна за рубеж",
      "доставка комбайна John Deere",
      "экспорт комбайна Case IH",
      "международная доставка б/у комбайна",
      "упаковка комбайна в контейнер",
      "экспорт комбайна из США",
    ],
    heroDescription:
      "Ваш комбайн — серьёзная инвестиция, и его отправка за рубеж требует специализированного обращения. Мы экспортируем комбайны John Deere, Case IH, Claas и AGCO покупателям в Африку, Южную Америку, Центральную Азию и на Ближний Восток с полным демонтажем, упаковкой и документацией.",
    brands: ["John Deere", "Case IH", "Claas", "AGCO"],
    commonModels: [
      "John Deere S780",
      "Case IH 9250 Axial-Flow",
      "Claas Lexion 8700",
      "AGCO Gleaner S98",
    ],
    packingNotes:
      "Комбайны требуют частичного демонтажа перед экспортом. Мы снимаем жатку, выгрузной шнек и GPS-антенну, затем закрепляем основной корпус внутри 40-футового контейнера high-cube или на flat rack в зависимости от габаритов. Все компоненты блокируются сортовой высушенной древесиной и крепятся цепными стяжками класса 43, рассчитанными на вес машины. Каждая снятая деталь маркируется, фотографируется и упаковывается с инструкцией по сборке.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "container-loading"],
    faqs: [
      { question: "Сколько стоит отправить комбайн за рубеж?", answer: "Общая стоимость экспорта комбайна обычно составляет от $12,000 до $25,000 в зависимости от места забора, порта назначения и способа перевозки — в 40-футовом контейнере high-cube или на flat rack. Мы предоставляем детализированные котировки в течение 24 часов.", category: "Комбайны" },
      { question: "Вы снимаете жатку перед отправкой комбайна?", answer: "Да. Жатка, выгрузной шнек, GPS-антенна и другие выступающие компоненты снимаются, маркируются и упаковываются отдельно. Основной корпус затем размещается внутри 40-футового контейнера high-cube или закрепляется на flat rack.", category: "Комбайны" },
      { question: "Помещается ли комбайн в стандартный 40-футовый контейнер?", answer: "Большинство комбайнов требуют 40-футовый контейнер high-cube после частичного демонтажа, или flat rack для более крупных моделей. Мы измеряем вашу конкретную модель и рекомендуем наиболее экономичный вариант контейнера.", category: "Комбайны" },
      { question: "Какие марки комбайнов вы экспортируете чаще всего?", answer: "John Deere S-Series, Case IH Axial-Flow, Claas Lexion и AGCO Gleaner — наши наиболее часто отправляемые комбайны. Мы знаем спецификации разборки каждой марки и располагаем подходящим грузоподъёмным оборудованием.", category: "Комбайны" },
    ],
    typicalPriceRange: "$12K – $25K",
  },
  {
    slug: "tractors",
    title: "Экспорт и доставка тракторов",
    pluralName: "Тракторы",
    singularName: "Трактор",
    metaTitle: "Экспорт и доставка тракторов | Meridian Export",
    metaDescription:
      "Отправляйте тракторы из США по всему миру. Мы занимаемся экспортом тракторов John Deere, Case IH, Kubota и New Holland с профессиональной упаковкой и морским фрахтом.",
    keywords: [
      "экспорт трактора из США",
      "доставка трактора за рубеж",
      "доставка трактора John Deere",
      "международный экспорт б/у трактора",
      "загрузка трактора в контейнер",
      "морской фрахт сельхозтрактора",
      "экспорт трактора в Казахстан",
    ],
    heroDescription:
      "Покупаете ли вы один утилитарный трактор или парк пропашных машин — мы доставим вашу технику из любой точки США или Канады на ваше хозяйство за рубежом. Мы работаем с тракторами John Deere, Case IH, Kubota и New Holland всех размеров и конфигураций.",
    brands: ["John Deere", "Case IH", "Kubota", "New Holland"],
    commonModels: [
      "John Deere 8R 410",
      "Case IH Magnum 340",
      "Kubota M7-172",
      "New Holland T7.315",
    ],
    packingNotes:
      "Тракторы загружаются в 40-футовые контейнеры high-cube с деревянным блокированием и храповыми стяжками повышенной прочности. Спаренные колёса и зеркала кабины снимаются для соответствия габаритам контейнера, все жидкости сливаются согласно правилам перевозки. Мы используем брус твёрдых пород 100x150 мм для фиксации колёс и стяжные ленты грузоподъёмностью не менее 2 270 кг в четырёх точках крепления. Гидравлические линии заглушаются и защищаются антиконтаминационными крышками.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Стандарт 40 футов"],
    relatedServiceSlugs: ["machinery-packing", "agricultural", "equipment-sales"],
    faqs: [
      { question: "Как тракторы загружаются в контейнеры?", answer: "Спаренные колёса и зеркала кабины снимаются для соответствия ширине контейнера. Трактор заезжает или затягивается лебёдкой в 40-футовый контейнер high-cube, затем блокируется брусом и закрепляется храповыми стяжками повышенной прочности. Все жидкости сливаются согласно правилам перевозки.", category: "Тракторы" },
      { question: "Можно ли отправить трактор с навесным оборудованием?", answer: "Да. Фронтальные погрузчики, навесное оборудование трёхточечной сцепки и другие приспособления снимаются и упаковываются рядом с трактором или сверху него внутри контейнера. Это максимизирует пространство и снижает стоимость доставки.", category: "Тракторы" },
      { question: "Какой самый экономичный способ отправить трактор за рубеж?", answer: "40-футовый контейнер high-cube обычно самый экономичный вариант. Если вы покупаете несколько небольших тракторов, мы можем разместить 2-3 компактные или утилитарные модели в одном контейнере, значительно снизив стоимость за единицу.", category: "Тракторы" },
      { question: "Вы отправляете и пропашные, и утилитарные тракторы?", answer: "Мы отправляем всё — от компактных утилитарных тракторов Kubota до полноприводных пропашных машин John Deere 9R. Каждый класс размера имеет свои требования к контейнеру и блокированию, и мы справляемся со всеми.", category: "Тракторы" },
    ],
    typicalPriceRange: "$8K – $18K",
  },
  {
    slug: "excavators",
    title: "Экспорт и доставка экскаваторов",
    pluralName: "Экскаваторы",
    singularName: "Экскаватор",
    metaTitle: "Экспорт и доставка экскаваторов | Meridian Export",
    metaDescription:
      "Экспортируйте экскаваторы из США. Мы доставляем экскаваторы CAT, Komatsu, Hitachi и Volvo по всему миру с погрузкой на flat rack, креплением и полной документацией.",
    keywords: [
      "экспорт и доставка экскаватора",
      "доставка экскаватора за рубеж",
      "международная доставка экскаватора CAT",
      "экспорт экскаватора Komatsu",
      "морской фрахт б/у экскаватора",
      "экспорт тяжёлой техники из США",
      "доставка экскаватора на flat rack",
    ],
    heroDescription:
      "Экскаваторы — одни из наиболее часто экспортируемых тяжёлых машин, и их крепление для морского транзита требует опыта. Мы доставляем экскаваторы CAT, Komatsu, Hitachi и Volvo на flat racks и в open-top контейнерах на строительные площадки по всему миру.",
    brands: ["CAT", "Komatsu", "Hitachi", "Volvo"],
    commonModels: [
      "CAT 330 GC",
      "Komatsu PC210LC",
      "Hitachi ZX350LC-6",
      "Volvo EC300E",
    ],
    packingNotes:
      "Экскаваторы обычно перевозятся на flat racks из-за их высоты и веса. Стрела опускается и фиксируется, ковш снимается и крепится отдельно, гусеницы блокируются тяжёлым деревянным брусом для предотвращения перемещения во время морского транзита. Мы используем транспортные цепи класса 70 с натяжителями во всех четырёх углах и позиционируем машину для равномерного распределения веса по flat rack. Все гидравлические линии заглушаются, аккумуляторы отключаются, жидкости сливаются согласно требованиям кода IMDG.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "Как вы отправляете экскаватор, который слишком высок для контейнера?", answer: "Экскаваторы перевозятся на flat racks или в open-top контейнерах. Стрела опускается и фиксируется, ковш снимается и крепится отдельно, гусеницы блокируются тяжёлым деревянным брусом для предотвращения перемещения во время морского транзита.", category: "Экскаваторы" },
      { question: "Каков предельный вес для отправки экскаватора?", answer: "Стандартный flat rack выдерживает до 40 метрических тонн. Большинство средних экскаваторов (класс 20-35 тонн) укладываются в этот лимит. Для более крупных машин мы используем специализированные тяжеловесные услуги или балковые перевозки.", category: "Экскаваторы" },
      { question: "Вы сливаете все жидкости перед отправкой экскаватора?", answer: "Да. Гидравлическое масло, моторное масло, антифриз и дизель сливаются для соответствия международным правилам перевозки и предотвращения экологических рисков. Мы также отключаем аккумулятор и фиксируем все гидравлические линии.", category: "Экскаваторы" },
    ],
    typicalPriceRange: "$10K – $22K",
  },
  {
    slug: "planters",
    title: "Экспорт и доставка сеялок",
    pluralName: "Сеялки",
    singularName: "Сеялка",
    metaTitle: "Экспорт и доставка сеялок | Meridian Export",
    metaDescription:
      "Экспортируйте сеялки и посевную технику по всему миру. Мы доставляем сеялки Kinze, John Deere, Case IH и Great Plains с тщательной защитой высевающих секций.",
    keywords: [
      "экспорт и доставка сеялки",
      "доставка сеялки за рубеж",
      "экспорт сеялки John Deere",
      "международная доставка сеялки Kinze",
      "морской фрахт сеялки точного высева",
      "экспорт сеялки из США",
      "упаковка сеялки в контейнер",
    ],
    heroDescription:
      "Сеялки точного высева имеют деликатные высевающие секции, дозаторы семян и GPS-компоненты, требующие аккуратного обращения при экспорте. Мы доставляем сеялки Kinze, John Deere, Case IH и Great Plains на фермы по всему миру, защищая каждый компонент от семяпроводов до прикатывающих колёс.",
    brands: ["Kinze", "John Deere", "Case IH", "Great Plains"],
    commonModels: [
      "Kinze 3660",
      "John Deere 1775NT",
      "Case IH 2150 Early Riser",
      "Great Plains YP-2425A",
    ],
    packingNotes:
      "Сеялки складываются, и высевающие секции индивидуально защищаются пеной с закрытыми порами для предотвращения повреждения семяпроводов и прикатывающих колёс. Дозаторы семян, контроллеры точного земледелия и гидравлические компоненты снимаются и упаковываются отдельно в антистатическую упаковку. Рама крепится внутри 40-футового контейнера high-cube брусом из твёрдых пород 100x150 мм для предотвращения бокового смещения. Все жгуты проводов маркируются метками точек сборки.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "Как вы защищаете компоненты сеялки точного высева при доставке?", answer: "Дозаторы семян, электроника высевающих секций и GPS-компоненты снимаются, оборачиваются антистатической пеной и упаковываются в отдельные деревянные ящики. Все жгуты проводов маркируются для лёгкой повторной установки в месте назначения.", category: "Сеялки" },
      { question: "Помещается ли 24-рядная сеялка в контейнер?", answer: "Да. Большие сеялки складываются в транспортное положение, и крылья высевающих секций фиксируются. 24-рядная сеялка обычно помещается в 40-футовый контейнер high-cube или на flat rack в зависимости от ширины рамы.", category: "Сеялки" },
      { question: "Вы отправляете сеялки точного высева с технологией переменной нормы?", answer: "Безусловно. Мы работаем с сеялками Kinze, John Deere ExactEmerge и Case IH Early Riser с приводами переменной нормы, гидравлическими системами прижима и контроллерами точного земледелия. Вся электроника снимается и упаковывается отдельно.", category: "Сеялки" },
    ],
    typicalPriceRange: "$5K – $14K",
  },
  {
    slug: "sprayers",
    title: "Экспорт и доставка опрыскивателей",
    pluralName: "Опрыскиватели",
    singularName: "Опрыскиватель",
    metaTitle: "Экспорт и доставка опрыскивателей | Meridian Export",
    metaDescription:
      "Экспортируйте самоходные и прицепные опрыскиватели по всему миру. Складывание штанг, очистка баков и безопасная доставка опрыскивателей John Deere, Case IH и Apache.",
    keywords: [
      "экспорт и доставка опрыскивателя",
      "экспорт самоходного опрыскивателя",
      "доставка опрыскивателя John Deere",
      "экспорт Case IH Patriot",
      "морской фрахт сельскохозяйственного опрыскивателя",
      "упаковка штанги опрыскивателя в контейнер",
      "международная доставка опрыскивателя Apache",
    ],
    heroDescription:
      "Самоходные опрыскиватели имеют широкие штанги, высокий клиренс и требования по остаткам химикатов, что усложняет экспортную логистику. Мы доставляем опрыскиватели John Deere, Case IH, Apache и Hagie с правильным складыванием штанг, очисткой баков и надёжной загрузкой в контейнер.",
    brands: ["John Deere", "Case IH", "Apache", "Hagie"],
    commonModels: [
      "John Deere R4045",
      "Case IH Patriot 4440",
      "Apache AS1250",
      "Hagie STS16",
    ],
    packingNotes:
      "Штанги опрыскивателя складываются и дополнительно закрепляются полиэстеровыми стяжками шириной 50 мм, рассчитанными на 2 720 кг, для предотвращения раскрытия при транзите. Химические баки сливаются, трижды промываются нейтрализующим раствором и сертифицируются как чистые согласно правилам ИМО и таможенным требованиям страны назначения. Шасси с высоким клиренсом часто требует погрузки на flat rack из-за общей высоты. Все форсунки и концы штанг индивидуально оборачиваются защитной пеной.",
    containerTypes: ["Flat Rack", "40ft High-Cube"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "documentation"],
    faqs: [
      { question: "Вы промываете баки опрыскивателя перед экспортом?", answer: "Да. Все химические баки сливаются и трижды промываются для соответствия международным правилам перевозки и таможенным требованиям страны назначения. Мы предоставляем сертификат промывки бака с каждой отправкой опрыскивателя.", category: "Опрыскиватели" },
      { question: "Как закрепляются штанги опрыскивателя для морской перевозки?", answer: "Штанги складываются в транспортное положение и дополнительно закрепляются стяжками повышенной прочности для предотвращения случайного раскрытия при транзите. Форсунки и концы штанг защищаются пенной обёрткой.", category: "Опрыскиватели" },
      { question: "Помещается ли самоходный опрыскиватель в контейнер?", answer: "Небольшие самоходные опрыскиватели могут поместиться в 40-футовый контейнер high-cube после складывания штанг и снятия зеркал. Более крупные модели с высоким клиренсом, такие как John Deere R4045, обычно требуют перевозки на flat rack из-за высоты.", category: "Опрыскиватели" },
    ],
    typicalPriceRange: "$8K – $20K",
  },
  {
    slug: "headers",
    title: "Экспорт и доставка жаток",
    pluralName: "Жатки",
    singularName: "Жатка",
    metaTitle: "Экспорт и доставка жаток | Meridian Export",
    metaDescription:
      "Экспортируйте жатки комбайнов и платформы draper по всему миру. Мы доставляем жатки Shelbourne, MacDon, John Deere и Draper с изготовлением упаковки на заказ.",
    keywords: [
      "экспорт жатки комбайна",
      "доставка жатки draper",
      "международная доставка жатки MacDon",
      "экспорт жатки Shelbourne из США",
      "морской фрахт зерновой жатки",
      "упаковка кукурузной жатки в контейнер",
      "экспорт флексовой жатки",
    ],
    heroDescription:
      "Жатки широкие, неудобные в обращении и легко повреждаются при доставке без правильной упаковки. Мы экспортируем жатки Shelbourne, MacDon, Draper и John Deere с изготовлением упаковки на заказ, которая защищает ножевые секции, пальцы шнека и ленты draper на протяжении всего морского транзита.",
    brands: ["Shelbourne", "MacDon", "Draper", "John Deere"],
    commonModels: [
      "Shelbourne Reynolds CVS32",
      "MacDon FD2 Series",
      "John Deere 745FD",
      "MacDon D145",
    ],
    packingNotes:
      "Жатки размещаются на сварных транспортных стойках или деревянных ложементах внутри 40-футовых контейнеров high-cube. Ножевые секции закрываются стальными защитными кожухами тяжёлого класса, ленты draper натягиваются и фиксируются для предотвращения провисания при транзите. Несколько жаток иногда можно установить ярусно в одном контейнере для снижения стоимости доставки за единицу. Все пальцы шнека и зубья мотовила индивидуально защищаются пенными втулками.",
    containerTypes: ["40ft High-Cube", "Flat Rack"],
    relatedServiceSlugs: ["agricultural", "machinery-packing", "container-loading"],
    faqs: [
      { question: "Можно ли отправить несколько жаток в одном контейнере?", answer: "Да. В зависимости от ширины и типа мы часто можем разместить 2-3 жатки в одном 40-футовом контейнере high-cube, используя транспортные стойки, изготовленные на заказ. Это значительно снижает стоимость доставки за единицу.", category: "Жатки" },
      { question: "Как вы защищаете ножевые секции при доставке?", answer: "Ножевые секции закрываются защитными кожухами повышенной прочности, а серповидные ножи фиксируются в убранном положении. Ленты draper закрепляются и натягиваются для предотвращения провисания или повреждения при морском транзите.", category: "Жатки" },
      { question: "Вы отправляете очёсывающие жатки и кукурузные приставки?", answer: "Мы отправляем все типы жаток: платформы draper, флексовые жатки, жёсткие режущие жатки, очёсывающие жатки и кукурузные приставки. Каждый тип имеет специфические требования к упаковке, которые мы выполняем согласно спецификациям производителя.", category: "Жатки" },
    ],
    typicalPriceRange: "$3K – $8K",
  },
  {
    slug: "bulldozers",
    title: "Экспорт и доставка бульдозеров",
    pluralName: "Бульдозеры",
    singularName: "Бульдозер",
    metaTitle: "Экспорт и доставка бульдозеров | Meridian Export",
    metaDescription:
      "Экспортируйте бульдозеры из США по всему миру. Мы доставляем бульдозеры CAT, Komatsu, John Deere и Case на flat racks с профессиональным креплением и документацией.",
    keywords: [
      "экспорт и доставка бульдозера",
      "доставка бульдозера за рубеж",
      "международная доставка бульдозера CAT",
      "экспорт бульдозера Komatsu",
      "морской фрахт б/у бульдозера",
      "доставка тяжёлого бульдозера на flat rack",
      "экспорт бульдозера из США",
    ],
    heroDescription:
      "Бульдозеры — одни из самых тяжёлых машин, которые мы отправляем, и их вес требует тщательного планирования загрузки и крепления на flat rack. Мы экспортируем бульдозеры CAT, Komatsu, John Deere и Case на горнодобывающие и строительные объекты на всех континентах.",
    brands: ["CAT", "Komatsu", "John Deere", "Case"],
    commonModels: [
      "CAT D6T",
      "Komatsu D65PX",
      "John Deere 850L",
      "Case 2050M",
    ],
    packingNotes:
      "Бульдозеры почти всегда перевозятся на flat racks из-за веса и габаритов. Отвал опускается полностью, рыхлитель фиксируется в транспортном положении, гусеницы блокируются тяжёлым брусом и цепными стяжками класса 70, рассчитанными на нагрузку до 21 600 кг. Мы рассчитываем центр тяжести каждой машины для обеспечения соответствия нагрузки пределам угловых стоек flat rack. Все жидкости сливаются согласно коду IMDG, аккумуляторы отключаются и клеммы заглушаются.",
    containerTypes: ["Flat Rack", "Open Top"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "documentation"],
    faqs: [
      { question: "Как вы крепите бульдозер на flat rack для морской перевозки?", answer: "Отвал опускается полностью, рыхлитель фиксируется в транспортном положении, гусеницы блокируются тяжёлым брусом. Цепные стяжки, рассчитанные на вес машины, крепят её к точкам привязки flat rack. Мы рассчитываем центр тяжести для обеспечения безопасного транзита.", category: "Бульдозеры" },
      { question: "Бульдозеры какого размера вы можете отправить?", answer: "Мы отправляем всё — от малых бульдозеров класса D3/D4, помещающихся в контейнеры, до крупных машин класса D8/D9, требующих flat rack или балковой перевозки. Предельный вес для flat racks — примерно 40 метрических тонн.", category: "Бульдозеры" },
      { question: "Сколько времени занимает экспорт бульдозера?", answer: "От забора техники до отхода судна обычно проходит 7-14 дней, включая транспортировку на наше предприятие, крепление на flat rack и оформление документации. Прибавьте 18-40 дней морского транзита в зависимости от направления.", category: "Бульдозеры" },
    ],
    typicalPriceRange: "$10K – $25K",
  },
  {
    slug: "loaders",
    title: "Экспорт и доставка погрузчиков",
    pluralName: "Погрузчики",
    singularName: "Погрузчик",
    metaTitle: "Экспорт и доставка погрузчиков | Meridian Export",
    metaDescription:
      "Экспортируйте фронтальные погрузчики и мини-погрузчики по всему миру. Мы доставляем погрузчики CAT, John Deere, Volvo и Komatsu в контейнерах и на flat racks с полной экспортной поддержкой.",
    keywords: [
      "экспорт и доставка погрузчика",
      "международная доставка фронтального погрузчика",
      "экспорт погрузчика CAT из США",
      "экспорт мини-погрузчика за рубеж",
      "морской фрахт погрузчика John Deere",
      "упаковка фронтального погрузчика в контейнер",
      "экспорт погрузчика Volvo",
    ],
    heroDescription:
      "От компактных мини-погрузчиков, помещающихся в контейнер, до крупных фронтальных погрузчиков, требующих перевозки на flat rack, мы работаем с любым размером. Мы экспортируем погрузчики CAT, John Deere, Volvo и Komatsu на строительные и сельскохозяйственные объекты по всему миру.",
    brands: ["CAT", "John Deere", "Volvo", "Komatsu"],
    commonModels: [
      "CAT 950 GC",
      "John Deere 644L",
      "Volvo L120H",
      "Komatsu WA380-8",
    ],
    packingNotes:
      "Погрузчики и мини-погрузчики меньшего размера помещаются в 40-футовые контейнеры high-cube с ковшом, снятым и закреплённым рядом. Крупные фронтальные погрузчики перевозятся на flat racks с ковшом, снятым и загруженным отдельно на платформу. Шарниры сочленения блокируются, рулевые цилиндры фиксируются, все быстроразъёмные гидравлические линии заглушаются для предотвращения загрязнения при морском транзите. Мы используем брус из твёрдых пород 100x150 мм у всех четырёх колёс и цепные стяжки минимум класса 43.",
    containerTypes: ["40ft High-Cube", "Flat Rack", "Стандарт 40 футов"],
    relatedServiceSlugs: ["container-loading", "machinery-packing", "equipment-sales"],
    faqs: [
      { question: "Помещается ли фронтальный погрузчик в контейнер?", answer: "Погрузчики и мини-погрузчики меньшего размера помещаются в 40-футовые контейнеры high-cube с ковшом, снятым и закреплённым рядом. Крупные фронтальные погрузчики (класс 5+ тонн) обычно требуют перевозки на flat rack из-за высоты и веса.", category: "Погрузчики" },
      { question: "Вы экспортируете мини-погрузчики?", answer: "Да. Компактные мини-погрузчики, такие как CAT 262D или John Deere 332G, одни из самых простых машин для контейнеризации. Мы часто можем разместить 2 мини-погрузчика в одном 40-футовом контейнере, снизив стоимость за единицу.", category: "Погрузчики" },
      { question: "Как упаковываются ковши погрузчиков для отправки?", answer: "Ковши и навесное оборудование снимаются, очищаются и крепятся рядом с основной машиной внутри контейнера или на flat rack. Быстроразъёмные гидравлические линии заглушаются и защищаются от загрязнения.", category: "Погрузчики" },
    ],
    typicalPriceRange: "$6K – $16K",
  },
];

export const equipmentTypes: Record<string, EquipmentType[]> = {
  en: equipmentTypesEn,
  es: equipmentTypesEs,
  ru: equipmentTypesRu,
};

export function getEquipmentBySlug(slug: string, locale: string = 'en'): EquipmentType | undefined {
  const localeEquipment = equipmentTypes[locale] ?? equipmentTypes.en;
  return localeEquipment.find((e) => e.slug === slug);
}

export function getAllEquipmentSlugs(): string[] {
  return equipmentTypesEn.map((e) => e.slug);
}

export function getAllEquipmentTypes(locale: string = 'en'): EquipmentType[] {
  return equipmentTypes[locale] ?? equipmentTypes.en;
}
