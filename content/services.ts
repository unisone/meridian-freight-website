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

const servicesEn: Service[] = [
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
      { question: "What happens if documentation is incorrect or missing?", answer: "Incorrect paperwork causes port delays and storage fees — sometimes thousands of dollars. That is why we handle every document in-house and triple-check before shipment. In 1,000+ exports, we have a near-perfect first-time clearance rate.", category: "Documentation" },
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

const servicesEs: Service[] = [
  {
    slug: "machinery-packing",
    title: "Desmontaje de Maquinaria y Embalaje en Contenedor",
    shortTitle: "Embalaje de Maquinaria",
    description:
      "Desmontaje profesional, etiquetado y embalaje seguro en contenedor para maquinaria pesada. Cada componente se etiqueta, fotografía y documenta para su reensamblaje.",
    longDescription:
      "Nuestros técnicos desmontan total o parcialmente su equipo, luego etiquetan, fotografían y catalogan cada componente. Toda la tornillería se empaca en bolsas identificadas con puntos de ensamblaje correspondientes para que su equipo pueda reensamblar en destino. Dentro del contenedor, utilizamos bloqueo profesional con madera, arriostrado y amarres para evitar cualquier movimiento durante el tránsito marítimo.",
    icon: "Package",
    keywords: ["servicios de embalaje de maquinaria en contenedor", "desmontaje de equipo pesado para exportación", "desarmado de maquinaria para envío", "servicios de embalaje de equipo USA", "carga de contenedor 40ft", "exportación de maquinaria a Latinoamérica"],
    equipmentTypes: ["Cosechadoras", "Tractores", "Excavadoras", "Bulldozers", "Cargadores", "Grúas"],
    relatedSlugs: ["container-loading", "agricultural"],
    faqs: [
      { question: "¿Cómo desmontan la maquinaria sin dañarla?", answer: "Cada componente se etiqueta, fotografía y cataloga antes de retirarlo. La tornillería se empaca en bolsas con etiquetas de punto de ensamblaje para que su equipo pueda reensamblar en destino. Seguimos los manuales de servicio del fabricante para la secuencia de desmontaje.", category: "Embalaje de Maquinaria" },
      { question: "¿Qué materiales de embalaje utilizan dentro del contenedor?", answer: "Utilizamos bloqueo con madera certificada ISPM-15, cinchas de trinquete de servicio pesado, tensores de cadena para máquinas de más de 4,500 kg, acolchado de espuma para superficies pintadas y cunas de madera a medida para componentes de forma irregular.", category: "Embalaje de Maquinaria" },
      { question: "¿Pueden empacar varias máquinas en un solo contenedor?", answer: "Sí — regularmente acomodamos 2-3 máquinas pequeñas o una máquina grande más componentes sueltos en un solo contenedor 40ft high-cube. La carga estratégica minimiza su costo de envío por unidad.", category: "Embalaje de Maquinaria" },
      { question: "¿Proporcionan un reporte de embalaje con fotos?", answer: "Por supuesto. Cada envío incluye un reporte detallado de carga con fotos con marca de tiempo que muestran cada paso: antes del desmontaje, durante el embalaje, bloqueo y arriostrado, y el contenedor sellado. Esta documentación también es útil para reclamaciones de seguro.", category: "Embalaje de Maquinaria" },
    ],
  },
  {
    slug: "container-loading",
    title: "Carga de Contenedores y Envío de Exportación",
    shortTitle: "Carga de Contenedores",
    description:
      "Carga experta de contenedores y coordinación de envíos internacionales. Maximizamos la utilización de espacio en contenedores de 20ft, 40ft y high-cube.",
    longDescription:
      "Empacamos cada pie cúbico de forma estratégica — minimizando su costo de envío mientras mantenemos la carga segura. Nuestros equipos usan grúas, montacargas y bloqueo a medida para cargas pesadas y posicionamiento preciso. Negociamos directamente con Maersk, Hapag-Lloyd y CMA CGM para obtener las mejores tarifas y rutas a su destino.",
    icon: "Truck",
    keywords: ["carga de contenedor equipo pesado", "envío de exportación de maquinaria mundial", "servicios de carga de contenedor 40ft USA", "flete internacional de maquinaria", "optimización de espacio en contenedor"],
    equipmentTypes: ["Estándar 20ft", "Estándar 40ft", "40ft High-Cube", "Flat Rack", "Open Top"],
    relatedSlugs: ["machinery-packing", "documentation"],
    faqs: [
      { question: "¿Qué tamaños de contenedor están disponibles para equipo pesado?", answer: "Usamos contenedores estándar de 20ft, estándar de 40ft, 40ft high-cube, flat racks y open-top. La elección correcta depende de las dimensiones y peso de su equipo. La mayoría de las máquinas agrícolas caben en un 40ft high-cube; el equipo sobredimensionado va en flat racks.", category: "Carga de Contenedores" },
      { question: "¿Cómo maximizan el espacio del contenedor para reducir costos de envío?", answer: "Nuestros equipos de carga miden cada máquina y planifican la distribución digitalmente antes del día de carga. Acomodamos partes sueltas, accesorios y artículos más pequeños alrededor de la máquina principal para usar cada pie cúbico — reduciendo la cantidad de contenedores que necesita.", category: "Carga de Contenedores" },
      { question: "¿Con qué líneas navieras trabajan?", answer: "Negociamos tarifas directamente con Maersk, Hapag-Lloyd, CMA CGM, MSC, ZIM y Evergreen. Comparamos rutas y precios para cada envío y reservamos el transportista que ofrece la mejor tarifa y tiempo de tránsito a su destino.", category: "Carga de Contenedores" },
      { question: "¿Cuánto tarda el envío marítimo?", answer: "Los tiempos de tránsito varían por destino: 10-15 días a México, 12-18 días a Colombia, 18-25 días a Turquía, 25-30 días a Brasil y 30-38 días al Medio Oriente. Proporcionamos tiempos exactos con cada cotización.", category: "Carga de Contenedores" },
    ],
  },
  {
    slug: "agricultural",
    title: "Servicios de Equipo Agrícola",
    shortTitle: "Equipo Agrícola",
    description:
      "Manejo especializado de maquinaria agrícola incluyendo cosechadoras, tractores, sembradoras, pulverizadoras y equipo de labranza.",
    longDescription:
      "La agricultura es nuestro negocio principal. Sabemos cómo se desmontan las cosechadoras equipadas con GPS, qué componentes de sembradoras de precisión necesitan embalaje separado, y qué estándares fitosanitarios requiere el país de destino. Lavamos, fumigamos (cuando es necesario) y empacamos para pasar la inspección en destino.",
    icon: "Wheat",
    keywords: ["servicios de exportación de equipo agrícola", "envío de maquinaria agrícola al exterior", "exportación de cosechadora USA", "exportación internacional de tractores", "envío de exportación John Deere", "maquinaria agrícola para Latinoamérica"],
    equipmentTypes: ["Cosechadoras", "Tractores", "Sembradoras", "Pulverizadoras", "Cabezales", "Equipo de Labranza"],
    relatedSlugs: ["machinery-packing", "equipment-sales"],
    faqs: [
      { question: "¿Manejan certificados fitosanitarios para equipo agrícola?", answer: "Sí. Muchos países requieren certificados fitosanitarios del USDA para equipo agrícola que confirmen que está libre de tierra, semillas y plagas. Coordinamos el lavado, la fumigación (cuando se requiere) y la emisión del certificado antes del envío.", category: "Agrícola" },
      { question: "¿Pueden exportar cosechadoras con GPS y sembradoras de precisión?", answer: "Por supuesto. Retiramos cuidadosamente los domos GPS, monitores de rendimiento y componentes de agricultura de precisión, luego los empacamos por separado en cajas acolchadas. Todos los arneses de cableado se etiquetan para facilitar la reinstalación.", category: "Agrícola" },
      { question: "¿Qué marcas de equipo agrícola exportan más?", answer: "John Deere, Case IH, Kinze, Kubota, New Holland, AGCO y Claas son nuestras marcas más exportadas. Conocemos las especificaciones de desmontaje de cada una y contamos con el equipo de maniobra adecuado para sus clases de peso.", category: "Agrícola" },
      { question: "¿Exportan equipo de labranza como rastras y cultivadoras?", answer: "Sí. Equipo de labranza como rastras de discos, arados de cincel y cultivadoras de campo se pliegan y caben dentro de contenedores de 40ft o en flat racks. Retiramos las alas y cilindros hidráulicos cuando es necesario para cumplir con las dimensiones del contenedor.", category: "Agrícola" },
    ],
  },
  {
    slug: "equipment-sales",
    title: "Búsqueda y Adquisición de Equipos",
    shortTitle: "Búsqueda de Equipos",
    description:
      "Ayudamos a compradores internacionales a encontrar maquinaria usada de calidad, repuestos OEM y componentes aftermarket de distribuidores, subastas y vendedores en USA y Canadá.",
    longDescription:
      "¿Necesita una máquina o repuesto específico? Díganos la marca, modelo y año — buscamos en nuestra red de distribuidores, subastas y vendedores privados en USA y Canadá. Conseguimos máquinas completas, repuestos OEM de John Deere de distribuidores autorizados y componentes de reemplazo aftermarket a precios competitivos. Cada pieza se inspecciona y documenta con fotos y un reporte de condición antes de que usted se comprometa. Consolidamos múltiples pedidos de repuestos en envíos únicos para reducir su costo de flete por artículo — la mayoría de los compradores ahorra 30-50% comparado con enviar artículos individualmente. Una vez que compra, manejamos la exportación completa por flete aéreo o marítimo.",
    icon: "Search",
    keywords: ["búsqueda de equipo agrícola usado USA Canadá", "servicios de adquisición de equipos", "comprar maquinaria para exportación", "agente de búsqueda de equipos internacional", "exportación de repuestos John Deere", "envío internacional de repuestos aftermarket", "comprar maquinaria en Estados Unidos"],
    equipmentTypes: ["Cualquier equipo agrícola", "Maquinaria de construcción", "Equipo industrial", "Repuestos OEM y aftermarket", "Componentes John Deere"],
    relatedSlugs: ["agricultural", "documentation"],
    faqs: [
      { question: "¿Pueden encontrar una marca y modelo específico de equipo?", answer: "Sí. Díganos la marca, modelo, rango de año y condición que necesita — buscamos en nuestra red de distribuidores, casas de subastas y vendedores privados en USA y Canadá. La mayoría de las solicitudes se emparejan en 1-2 semanas.", category: "Búsqueda de Equipos" },
      { question: "¿Inspeccionan el equipo antes de la compra?", answer: "Cada máquina es inspeccionada en sitio por nuestro equipo. Usted recibe un reporte detallado de condición con fotos, lecturas del horómetro y notas sobre cualquier problema. Todo el equipo se vende en el estado en que se encuentra, pero obtiene total transparencia antes de comprometerse.", category: "Búsqueda de Equipos" },
      { question: "¿Pueden asistir a subastas como Ritchie Bros en mi nombre?", answer: "Sí. Asistimos regularmente a ventas de Ritchie Bros, Purple Wave, BigIron y AuctionTime. Inspeccionamos los lotes antes de la subasta, ofertamos en su nombre y manejamos toda la logística posterior desde la recolección hasta la exportación.", category: "Búsqueda de Equipos" },
      { question: "¿Consiguen y envían repuestos John Deere internacionalmente?", answer: "Sí. Conseguimos repuestos OEM de John Deere de distribuidores autorizados en USA y Europa, más componentes de reemplazo aftermarket a precios más bajos. Consolidamos múltiples repuestos en envíos únicos para reducir costos de flete — la mayoría de los compradores ahorra 30-50% por artículo. Los repuestos se envían por flete aéreo (7-14 días) o marítimo para pedidos más grandes. Contáctenos en parts@meridianexport.com para una cotización en 1 hora.", category: "Búsqueda de Equipos" },
    ],
  },
  {
    slug: "documentation",
    title: "Documentación de Exportación y Cumplimiento",
    shortTitle: "Documentación de Exportación",
    description:
      "Servicios completos de documentación de exportación incluyendo conocimientos de embarque, formularios aduaneros, certificados fitosanitarios y trámites de cumplimiento.",
    longDescription:
      "La documentación faltante o incorrecta es la causa número uno de retrasos en puerto. Preparamos todos los documentos de exportación — facturas comerciales, listas de empaque, conocimientos de embarque, certificados de origen, certificados fitosanitarios — y manejamos cualquier requisito específico del país para que su envío pase la aduana a la primera.",
    icon: "FileText",
    keywords: ["servicios de documentación de exportación USA", "trámites de envío de maquinaria", "documentación aduanera equipo pesado", "conocimiento de embarque maquinaria", "certificado fitosanitario equipo agrícola", "trámites de exportación para Latinoamérica"],
    equipmentTypes: [],
    relatedSlugs: ["container-loading", "warehousing"],
    faqs: [
      { question: "¿Qué documentos de exportación necesito para enviar maquinaria al exterior?", answer: "Típicamente necesita una Factura Comercial, Lista de Empaque, Conocimiento de Embarque, Certificado de Título, registro AES/EEI ante Aduanas de EE.UU. y una Carta de Instrucciones del Embarcador. El equipo agrícola también puede requerir un Certificado Fitosanitario del USDA.", category: "Documentación" },
      { question: "¿Manejan los trámites aduaneros del país de destino?", answer: "Preparamos toda la documentación de exportación de EE.UU./Canadá y coordinamos con agentes aduanales en el puerto de destino. Los requisitos específicos de cada país como las licencias de importación de Brasil, el TAREKS de Turquía o los certificados SABER de Arabia Saudita son todos manejados.", category: "Documentación" },
      { question: "¿Qué pasa si la documentación es incorrecta o falta?", answer: "La documentación incorrecta causa retrasos portuarios y cargos por almacenaje — a veces miles de dólares. Por eso manejamos cada documento internamente y lo verificamos tres veces antes del envío. En más de 1,000 exportaciones, tenemos una tasa de liberación a la primera casi perfecta.", category: "Documentación" },
      { question: "¿Necesito una licencia de exportación para maquinaria usada?", answer: "La mayoría de la maquinaria comercial y agrícola usada no requiere una licencia de exportación bajo las regulaciones EAR de EE.UU. Sin embargo, ciertos artículos de uso dual pueden necesitar revisión de la Oficina de Industria y Seguridad. Verificamos cada envío contra la Lista de Control de Comercio.", category: "Documentación" },
    ],
  },
  {
    slug: "warehousing",
    title: "Almacenamiento y Bodega de Equipos",
    shortTitle: "Bodega y Almacenamiento",
    description:
      "Instalaciones de almacenamiento seguro en USA y Canadá para equipo desmontado, componentes y maquinaria en espera de envío.",
    longDescription:
      "A veces los calendarios de envío no coinciden con la disponibilidad del equipo. Nuestra red de bodegas en California, Georgia, Illinois, North Dakota, Texas y Alberta le da flexibilidad — prepare equipos antes de la carga, o almacénelos a largo plazo mientras espera el barco adecuado. Todo se mantiene seguro, cubierto y documentado.",
    icon: "Warehouse",
    keywords: ["almacenamiento y bodega de equipo USA Canadá", "almacenamiento de maquinaria para exportación", "bodega de equipo pesado Iowa", "preparación de equipo antes del envío"],
    equipmentTypes: [],
    relatedSlugs: ["machinery-packing", "documentation"],
    faqs: [
      { question: "¿Dónde están ubicadas sus instalaciones de bodega?", answer: "Nuestra instalación principal de embalaje y carga está en Albion, Iowa. También tenemos bodegas asociadas en California, Georgia, Illinois, North Dakota, Texas y Alberta (Canadá) para cobertura a nivel nacional.", category: "Bodega" },
      { question: "¿Por cuánto tiempo puedo almacenar equipo antes del envío?", answer: "No hay límite fijo. Algunos clientes almacenan equipo por días mientras esperan un barco, otros por meses mientras compran máquinas adicionales. Las tarifas de almacenamiento son competitivas y se cotizan por mes según el tamaño del equipo.", category: "Bodega" },
      { question: "¿Mi equipo está asegurado mientras está en su bodega?", answer: "Nuestras instalaciones cuentan con cobertura de responsabilidad general y de propiedad. Recomendamos mantener su propio seguro de equipo durante el período de almacenamiento para protección completa. Podemos proporcionar recibos de bodega para su aseguradora.", category: "Bodega" },
    ],
  },
];

const servicesRu: Service[] = [
  {
    slug: "machinery-packing",
    title: "Демонтаж техники и упаковка в контейнер",
    shortTitle: "Упаковка техники",
    description:
      "Профессиональный демонтаж, маркировка и надёжная упаковка тяжёлой техники в контейнер. Каждый компонент маркируется, фотографируется и документируется для сборки на месте.",
    longDescription:
      "Наши техники полностью или частично разбирают вашу технику, затем маркируют, фотографируют и каталогизируют каждый компонент. Вся крепёжная фурнитура упаковывается в пакеты с соответствующими метками точек сборки, чтобы ваша команда могла собрать технику на месте. Внутри контейнера мы используем профессиональное блокирование, раскрепление и стяжки для предотвращения любого перемещения во время морской транспортировки.",
    icon: "Package",
    keywords: ["услуги упаковки техники в контейнер", "демонтаж тяжёлого оборудования для экспорта", "разборка техники для отправки", "услуги по упаковке оборудования США", "загрузка контейнера 40 футов", "экспорт техники в Казахстан"],
    equipmentTypes: ["Комбайны", "Тракторы", "Экскаваторы", "Бульдозеры", "Погрузчики", "Краны"],
    relatedSlugs: ["container-loading", "agricultural"],
    faqs: [
      { question: "Как вы разбираете технику без повреждений?", answer: "Каждый компонент маркируется, фотографируется и каталогизируется перед снятием. Крепёж упаковывается в пакеты с соответствующими метками точек сборки, чтобы ваша команда могла собрать технику на месте. Мы следуем сервисным мануалам производителя при разборке.", category: "Упаковка техники" },
      { question: "Какие упаковочные материалы вы используете внутри контейнера?", answer: "Мы используем деревянное блокирование, сертифицированное по ISPM-15, храповые стяжки повышенной прочности, цепные стяжки для машин свыше 4 500 кг, пенную защиту для окрашенных поверхностей и изготовленные на заказ деревянные ложементы для компонентов нестандартной формы.", category: "Упаковка техники" },
      { question: "Можно ли упаковать несколько машин в один контейнер?", answer: "Да — мы регулярно размещаем 2-3 небольшие машины или одну крупную машину плюс россыпные компоненты в одном 40-футовом контейнере high-cube. Стратегическая загрузка минимизирует стоимость доставки за единицу.", category: "Упаковка техники" },
      { question: "Вы предоставляете отчёт об упаковке с фотографиями?", answer: "Безусловно. Каждая отправка включает подробный отчёт о загрузке с фотографиями с временными метками, показывающими каждый этап: до разборки, во время упаковки, блокирование и раскрепление, и опечатанный контейнер. Эта документация также полезна при страховых претензиях.", category: "Упаковка техники" },
    ],
  },
  {
    slug: "container-loading",
    title: "Загрузка контейнеров и экспортная перевозка",
    shortTitle: "Загрузка контейнеров",
    description:
      "Профессиональная загрузка контейнеров и координация международных перевозок. Мы максимизируем использование пространства в контейнерах 20 футов, 40 футов и high-cube.",
    longDescription:
      "Мы упаковываем каждый кубический фут стратегически — минимизируя стоимость доставки при обеспечении безопасности груза. Наши команды используют краны, погрузчики и нестандартное блокирование для тяжёлых грузов и точного позиционирования. Мы договариваемся напрямую с Maersk, Hapag-Lloyd и CMA CGM о лучших тарифах и маршрутах до вашего пункта назначения.",
    icon: "Truck",
    keywords: ["загрузка контейнера тяжёлое оборудование", "экспортная доставка техники по всему миру", "услуги загрузки контейнера 40 футов США", "международный морской фрахт техники", "оптимизация пространства контейнера"],
    equipmentTypes: ["Стандарт 20 футов", "Стандарт 40 футов", "40 футов High-Cube", "Flat Rack", "Open Top"],
    relatedSlugs: ["machinery-packing", "documentation"],
    faqs: [
      { question: "Какие размеры контейнеров доступны для тяжёлого оборудования?", answer: "Мы используем стандартные 20-футовые, стандартные 40-футовые, 40-футовые high-cube контейнеры, flat racks и open-top контейнеры. Правильный выбор зависит от габаритов и веса вашего оборудования. Большинство сельскохозяйственных машин помещается в 40-футовый high-cube; негабаритное оборудование идёт на flat racks.", category: "Загрузка контейнеров" },
      { question: "Как вы максимизируете пространство контейнера для снижения стоимости доставки?", answer: "Наши загрузочные команды измеряют каждую машину и планируют размещение в цифровом виде до дня загрузки. Мы размещаем россыпные части, навесное оборудование и мелкие предметы вокруг основной машины, чтобы использовать каждый кубический фут — сокращая количество контейнеров.", category: "Загрузка контейнеров" },
      { question: "С какими судоходными линиями вы работаете?", answer: "Мы договариваемся о тарифах напрямую с Maersk, Hapag-Lloyd, CMA CGM, MSC, ZIM и Evergreen. Мы сравниваем маршруты и цены для каждой отправки и бронируем перевозчика с лучшим тарифом и временем транзита до вашего пункта назначения.", category: "Загрузка контейнеров" },
      { question: "Сколько времени занимает морская перевозка?", answer: "Сроки транзита зависят от направления: 10-15 дней до Мексики, 12-18 дней до Колумбии, 18-25 дней до Турции, 25-30 дней до Бразилии и 30-38 дней до Ближнего Востока. Мы предоставляем точные сроки с каждой котировкой.", category: "Загрузка контейнеров" },
    ],
  },
  {
    slug: "agricultural",
    title: "Услуги по сельскохозяйственной технике",
    shortTitle: "Сельскохозяйственная техника",
    description:
      "Специализированная обработка сельскохозяйственной техники: комбайны, тракторы, сеялки, опрыскиватели и почвообрабатывающая техника.",
    longDescription:
      "Сельское хозяйство — наш основной бизнес. Мы знаем, как разбираются комбайны с GPS, какие компоненты сеялок точного высева требуют отдельной упаковки и какие фитосанитарные стандарты требует страна назначения. Мы моем, фумигируем (при необходимости) и упаковываем так, чтобы пройти инспекцию на месте.",
    icon: "Wheat",
    keywords: ["услуги экспорта сельхозтехники", "доставка сельскохозяйственной техники за рубеж", "экспорт комбайна из США", "международный экспорт тракторов", "экспортная доставка John Deere", "сельхозтехника для Казахстана и СНГ"],
    equipmentTypes: ["Комбайны", "Тракторы", "Сеялки", "Опрыскиватели", "Жатки", "Почвообрабатывающая техника"],
    relatedSlugs: ["machinery-packing", "equipment-sales"],
    faqs: [
      { question: "Вы оформляете фитосанитарные сертификаты для сельхозтехники?", answer: "Да. Многие страны требуют фитосанитарные сертификаты USDA для сельскохозяйственной техники, подтверждающие отсутствие почвы, семян и вредителей. Мы координируем мойку, фумигацию (при необходимости) и выдачу сертификата перед отправкой.", category: "Сельхозтехника" },
      { question: "Можете ли вы экспортировать комбайны с GPS и сеялки точного высева?", answer: "Безусловно. Мы аккуратно снимаем GPS-антенны, мониторы урожайности и компоненты точного земледелия, затем упаковываем их отдельно в мягкие ящики. Все жгуты проводов маркируются для лёгкой повторной установки.", category: "Сельхозтехника" },
      { question: "Какие марки сельхозтехники вы экспортируете чаще всего?", answer: "John Deere, Case IH, Kinze, Kubota, New Holland, AGCO и Claas — наши наиболее часто экспортируемые марки. Мы знаем спецификации разборки каждой из них и имеем подходящее грузоподъёмное оборудование для их весовых классов.", category: "Сельхозтехника" },
      { question: "Вы экспортируете почвообрабатывающую технику — бороны и культиваторы?", answer: "Да. Почвообрабатывающая техника — дисковые бороны, чизельные плуги и полевые культиваторы — складывается и помещается в 40-футовые контейнеры или на flat racks. Мы снимаем крылья и гидравлические цилиндры при необходимости для соблюдения габаритов контейнера.", category: "Сельхозтехника" },
    ],
  },
  {
    slug: "equipment-sales",
    title: "Поиск и закупка техники",
    shortTitle: "Поиск техники",
    description:
      "Помогаем международным покупателям найти качественную б/у технику, оригинальные запчасти и аналоги от дилеров, аукционов и продавцов в США и Канаде.",
    longDescription:
      "Нужна конкретная машина или запчасть? Сообщите нам марку, модель и год — мы ищем по нашей сети дилеров, аукционов и частных продавцов в США и Канаде. Мы находим комплектные машины, оригинальные запчасти John Deere от авторизованных дилеров и аналоговые комплектующие по конкурентным ценам. Каждая единица осматривается и документируется фотографиями и отчётом о состоянии до вашего решения. Мы консолидируем несколько заказов запчастей в одну отправку для снижения стоимости фрахта за единицу — большинство покупателей экономят 30-50% по сравнению с индивидуальной отправкой. После покупки мы берём на себя полный экспорт по воздуху или морем.",
    icon: "Search",
    keywords: ["поиск б/у сельхозтехники США Канада", "услуги закупки оборудования", "купить технику для экспорта", "международный агент по поиску техники", "экспорт запчастей John Deere", "международная доставка запчастей", "купить сельхозтехнику в Америке"],
    equipmentTypes: ["Любая сельхозтехника", "Строительная техника", "Промышленное оборудование", "Оригинальные и аналоговые запчасти", "Комплектующие John Deere"],
    relatedSlugs: ["agricultural", "documentation"],
    faqs: [
      { question: "Можете ли вы найти конкретную марку и модель техники?", answer: "Да. Сообщите нам марку, модель, диапазон годов и нужное состояние — мы ищем по нашей сети дилеров, аукционных домов и частных продавцов в США и Канаде. Большинство запросов подбираются за 1-2 недели.", category: "Поиск техники" },
      { question: "Вы осматриваете технику перед покупкой?", answer: "Каждая машина осматривается нашей командой на месте. Вы получаете подробный отчёт о состоянии с фотографиями, показаниями моточасов и заметками о любых проблемах. Всё оборудование продаётся как есть, но вы получаете полную прозрачность до принятия решения.", category: "Поиск техники" },
      { question: "Можете ли вы участвовать в аукционах Ritchie Bros от моего имени?", answer: "Да. Мы регулярно посещаем продажи Ritchie Bros, Purple Wave, BigIron и AuctionTime. Мы осматриваем лоты перед аукционом, делаем ставки от вашего имени и берём на себя всю послепродажную логистику от забора до экспорта.", category: "Поиск техники" },
      { question: "Вы находите и отправляете запчасти John Deere за рубеж?", answer: "Да. Мы находим оригинальные запчасти John Deere от авторизованных дилеров США и Европы, плюс аналоговые комплектующие по более низким ценам. Мы консолидируем несколько запчастей в одну отправку для снижения стоимости фрахта — большинство покупателей экономят 30-50% за единицу. Запчасти отправляются авиафрахтом (7-14 дней) или морем для крупных заказов. Свяжитесь с нами по parts@meridianexport.com для котировки в течение 1 часа.", category: "Поиск техники" },
    ],
  },
  {
    slug: "documentation",
    title: "Экспортная документация и соответствие требованиям",
    shortTitle: "Экспортная документация",
    description:
      "Полный комплекс услуг по экспортной документации: коносаменты, таможенные формы, фитосанитарные сертификаты и документы соответствия.",
    longDescription:
      "Отсутствующие или некорректные документы — причина номер один задержек в порту. Мы подготавливаем все экспортные документы — коммерческие инвойсы, упаковочные листы, коносаменты, сертификаты происхождения, фитосанитарные сертификаты — и берём на себя любые специфические требования страны назначения, чтобы ваш груз прошёл таможню с первого раза.",
    icon: "FileText",
    keywords: ["услуги экспортной документации США", "оформление документов на отправку техники", "таможенная документация тяжёлое оборудование", "коносамент на технику", "фитосанитарный сертификат сельхозтехника", "документы для экспорта в Казахстан"],
    equipmentTypes: [],
    relatedSlugs: ["container-loading", "warehousing"],
    faqs: [
      { question: "Какие экспортные документы нужны для отправки техники за рубеж?", answer: "Обычно необходимы: Коммерческий инвойс, Упаковочный лист, Коносамент, Сертификат на право собственности, подача AES/EEI в таможню США и Письмо с инструкциями грузоотправителя. Для сельхозтехники также может потребоваться Фитосанитарный сертификат USDA.", category: "Документация" },
      { question: "Вы оформляете таможенные документы для страны назначения?", answer: "Мы подготавливаем всю экспортную документацию США/Канады и координируем работу с таможенными брокерами в порту назначения. Специфические требования стран — такие как импортные лицензии Бразилии, TAREKS Турции или сертификаты SABER Саудовской Аравии — всё берём на себя.", category: "Документация" },
      { question: "Что происходит при некорректной или отсутствующей документации?", answer: "Некорректные документы вызывают задержки в порту и плату за хранение — иногда тысячи долларов. Поэтому мы оформляем каждый документ внутри компании и перепроверяем трижды перед отправкой. В более чем 1 000 экспортных операциях мы имеем почти идеальный показатель прохождения таможни с первого раза.", category: "Документация" },
      { question: "Нужна ли мне экспортная лицензия на б/у технику?", answer: "Большая часть б/у коммерческой и сельскохозяйственной техники не требует экспортной лицензии по правилам EAR США. Однако некоторые товары двойного назначения могут потребовать проверки Бюро промышленности и безопасности. Мы проверяем каждую отправку по Списку контроля торговли.", category: "Документация" },
    ],
  },
  {
    slug: "warehousing",
    title: "Хранение и складирование техники",
    shortTitle: "Склад и хранение",
    description:
      "Защищённые складские помещения в США и Канаде для разобранной техники, комплектующих и оборудования, ожидающего отправки.",
    longDescription:
      "Иногда графики отправки не совпадают с готовностью техники. Наша складская сеть в Калифорнии, Джорджии, Иллинойсе, Северной Дакоте, Техасе и Альберте даёт вам гибкость — подготовьте технику перед загрузкой или храните её долгосрочно, пока ожидаете подходящее судно. Всё остаётся в безопасности, под крышей и задокументировано.",
    icon: "Warehouse",
    keywords: ["хранение и складирование техники США Канада", "хранение техники для экспорта", "склад тяжёлого оборудования Айова", "подготовка техники перед отправкой"],
    equipmentTypes: [],
    relatedSlugs: ["machinery-packing", "documentation"],
    faqs: [
      { question: "Где расположены ваши склады?", answer: "Наше основное предприятие по упаковке и загрузке находится в Олбионе, Айова. Мы также имеем партнёрские склады в Калифорнии, Джорджии, Иллинойсе, Северной Дакоте, Техасе и Альберте (Канада) для покрытия всей территории.", category: "Склад" },
      { question: "Как долго я могу хранить технику перед отправкой?", answer: "Фиксированного ограничения нет. Некоторые клиенты хранят технику несколько дней, ожидая судно, другие — месяцами, пока закупают дополнительные машины. Тарифы на хранение конкурентные и рассчитываются помесячно в зависимости от размера техники.", category: "Склад" },
      { question: "Застрахована ли моя техника на вашем складе?", answer: "Наши объекты имеют общее страхование ответственности и имущества. Мы рекомендуем поддерживать собственную страховку техники на период хранения для полной защиты. Мы можем предоставить складские расписки для вашей страховой компании.", category: "Склад" },
    ],
  },
];

export const services: Record<string, Service[]> = {
  en: servicesEn,
  es: servicesEs,
  ru: servicesRu,
};

export function getServiceBySlug(slug: string, locale: string = 'en'): Service | undefined {
  const localeServices = services[locale] ?? services.en;
  return localeServices.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string, locale: string = 'en'): Service[] {
  const service = getServiceBySlug(slug, locale);
  if (!service) return [];
  return service.relatedSlugs
    .map((rs) => getServiceBySlug(rs, locale))
    .filter((s): s is Service => s !== undefined);
}

export function getAllServices(locale: string = 'en'): Service[] {
  return services[locale] ?? services.en;
}
