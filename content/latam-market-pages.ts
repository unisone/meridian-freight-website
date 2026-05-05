import type { FaqEntry } from "@/content/faq";

export type LatamMarketSlug = "paraguay" | "uruguay" | "bolivia";

type LinkItem = {
  label: string;
  href: string;
  description?: string;
};

type TextBlock = {
  eyebrow: string;
  title: string;
  intro: string;
};

export interface LatamMarketPageContent {
  slug: LatamMarketSlug;
  country: string;
  locale: string;
  path: `/es/destinations/${LatamMarketSlug}`;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  labels: {
    breadcrumbsDestinations: string;
    scopeCaption: string;
    meridianHandles: string;
    localSideConfirms: string;
    sourceLinks: string;
    routeSection: string;
    complianceSection: string;
    equipmentSection: string;
    sendUsThisSection: string;
    processSection: string;
    credibilitySection: string;
    faqSection: string;
    openResource: string;
    blockLabel: string;
    stepLabel: string;
    exportsLabel: string;
    yearsLabel: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    image: {
      src: string;
      alt: string;
      caption: string;
    };
    highlights: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    whatsappMessage: string;
    scopeIncluded: string[];
    scopeExcluded: string[];
    scopeFootnote: string;
  };
  route: TextBlock & {
    steps: Array<{
      title: string;
      description: string;
    }>;
    note: string;
  };
  compliance: TextBlock & {
    required: string[];
    brokerConfirmed: string[];
    avoid: string[];
  };
  equipmentFocus: TextBlock & {
    items: Array<{
      title: string;
      summary: string;
      reason: string;
      href: string;
      linkLabel: string;
    }>;
  };
  sendUsThis: TextBlock & {
    items: string[];
  };
  processSteps: TextBlock & {
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  credibility: TextBlock & {
    pillars: Array<{
      title: string;
      description: string;
    }>;
    noteTitle: string;
    note: string;
    projectGalleryLabel: string;
    projectGalleryDescription: string;
    projectGalleryHref: string;
  };
  faq: TextBlock & {
    entries: FaqEntry[];
  };
  officialSources: LinkItem[];
  resourceLinks: LinkItem[];
  cta: {
    heading: string;
    description: string;
    whatsappLabel: string;
    calculatorLabel: string;
  };
  tracking: {
    heroWhatsapp: string;
    heroCalculator: string;
    midWhatsapp: string;
    midCalculator: string;
    finalWhatsapp: string;
    finalCalculator: string;
    projectLibrary: string;
  };
  schema: {
    serviceType: string;
    areaServed: string;
    mentions: string[];
    datePublished: string;
    dateModified: string;
  };
}

const sharedLabels: LatamMarketPageContent["labels"] = {
  breadcrumbsDestinations: "Destinos",
  scopeCaption: "Antes de comprar, separe alcance logistico y validacion local",
  meridianHandles: "Meridian coordina",
  localSideConfirms: "El importador o broker confirma",
  sourceLinks: "Fuentes oficiales y referencias",
  routeSection: "Ruta logistica",
  complianceSection: "Cumplimiento local",
  equipmentSection: "Seleccion de equipo",
  sendUsThisSection: "Para revisar una maquina",
  processSection: "Flujo de trabajo",
  credibilitySection: "Credibilidad operativa",
  faqSection: "Preguntas frecuentes",
  openResource: "Abrir recurso",
  blockLabel: "Bloque",
  stepLabel: "Paso",
  exportsLabel: "exportaciones ejecutadas",
  yearsLabel: "anos en operacion",
};

export const latamMarketPages: LatamMarketPageContent[] = [
  {
    slug: "paraguay",
    country: "Paraguay",
    locale: "es-PY",
    path: "/es/destinations/paraguay",
    seo: {
      title: "Importar maquinaria agricola usada de EE.UU. a Paraguay",
      description:
        "Guia para compradores paraguayos: maquinaria usada de EE.UU., Ley 7565/2025, limpieza, certificados y ruta por Hidrovia hacia Asuncion o Villeta.",
      keywords: [
        "importar maquinaria agricola usada de estados unidos a paraguay",
        "importar cosechadora usada estados unidos paraguay",
        "importar tractor usado desde usa a paraguay",
        "ley 7565 maquinaria agricola usada paraguay",
        "senave maquinaria agricola usada limpieza certificado",
        "envio maquinaria agricola asuncion villeta",
        "hidrovia paraguay parana maquinaria agricola",
      ],
    },
    labels: sharedLabels,
    hero: {
      eyebrow: "Guia para compradores paraguayos",
      heading: "Importar maquinaria agricola usada de EE.UU. a Paraguay",
      description:
        "Meridian ayuda a revisar la maquina, coordinar retiro, preparacion, documentacion de exportacion y flete hacia Paraguay antes de que el comprador cierre una operacion en Estados Unidos. La pagina separa el tramo que controlamos del trabajo que debe confirmar el importador local bajo Ley 7565/2025.",
      image: {
        src: "/images/project-jd-9650sts-transport.jpg",
        alt: "Cosechadora John Deere usada preparada para transporte internacional",
        caption: "Revision de unidad, retiro y preparacion antes de exportar.",
      },
      highlights: [
        "Pensada para compradores de cosechadoras, tractores, sembradoras, pulverizadoras y cabezales.",
        "Enfocada en edad de la maquina, limpieza, certificado, inspeccion y ruta multimodal.",
        "WhatsApp para revisar la maquina antes de comprar; calculadora como referencia logistica cuando el equipo y la ruta estan soportados.",
      ],
      primaryCtaLabel: "Revisar mi maquina para Paraguay",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage:
        "Hola. Estoy evaluando importar maquinaria agricola usada desde EE.UU. a Paraguay. Quiero revisar ruta, edad, limpieza y documentacion antes de comprar.",
      scopeIncluded: [
        "Revision inicial de la maquina, vendedor, ubicacion y ruta de exportacion desde EE.UU. o Canada.",
        "Coordinacion de retiro, desmontaje, embalaje, fotos de referencia y carga.",
        "Documentacion de exportacion, reserva maritima y coordinacion hasta puerto o punto de transito acordado.",
      ],
      scopeExcluded: [
        "Registro de importador, licencia previa y requisitos locales que confirma el importador paraguayo.",
        "DNIT, SENAVE, tributos, tasas, despacho local y costos de inspeccion en Paraguay.",
        "Entrega a campo o taller si no fue aprobada y cotizada como alcance adicional.",
      ],
      scopeFootnote:
        "La cotizacion correcta empieza antes de comprar: si la maquina no cumple edad, limpieza o documentacion, el problema aparece tarde y cuesta mas corregirlo.",
    },
    route: {
      eyebrow: "Paraguay es un destino multimodal",
      title: "La compra no termina en el puerto oceanico",
      intro:
        "Paraguay depende de corredores fluviales y de transbordo. Por eso el comprador necesita una ruta clara desde el vendedor en EE.UU. hasta Asuncion, Villeta u otro punto definido por su importador.",
      steps: [
        {
          title: "Retiro en origen",
          description:
            "Se valida la ubicacion de la maquina, dimensiones, accesorios, estado visible y distancia hasta el punto de embalaje o puerto.",
        },
        {
          title: "Preparacion para exportacion",
          description:
            "La maquina se desmonta y prepara para contenedor, flat rack u otra solucion aprobada por dimensiones y condicion.",
        },
        {
          title: "Tramo maritimo",
          description:
            "El embarque se reserva hacia el puerto oceanico que mejor conecte con la ruta Paraguay-Parana definida para la operacion.",
        },
        {
          title: "Hidrovia y handoff local",
          description:
            "El tramo fluvial y el despacho local se coordinan con el importador o broker paraguayo para evitar prometer alcance no confirmado.",
        },
      ],
      note:
        "La Hidrovia Paraguay-Parana es parte central del comercio paraguayo. La ruta final depende de naviera, temporada, punto de llegada y broker local.",
    },
    compliance: {
      eyebrow: "Ley 7565/2025",
      title: "La edad, limpieza y certificacion deben revisarse antes del pago",
      intro:
        "La Ley 7565/2025 establece requisitos para maquinaria, equipos e implementos agricolas usados. Meridian no reemplaza al importador local, pero si puede ayudar a filtrar la maquina y preparar el tramo de exportacion con esos riesgos a la vista.",
      required: [
        "Confirmar que la maquina usada entra dentro de la antiguedad maxima aplicable.",
        "Preparar limpieza y sanitizacion para reducir riesgo de suelo, restos vegetales o plagas.",
        "Reunir datos de modelo, ano, horas, condicion, accesorios y vendedor antes de reservar flete.",
      ],
      brokerConfirmed: [
        "Registro de importador y licencia previa ante autoridades paraguayas.",
        "Certificado de tratamiento, certificado fitosanitario, inspeccion tecnica e inspeccion fitosanitaria.",
        "DNIT, SENAVE, tributos, tasas, canon, despacho local y cualquier costo por medidas fitosanitarias.",
      ],
      avoid: [
        "Comprar una maquina sin revisar edad de fabricacion y documentacion disponible.",
        "Asumir que una cotizacion de flete equivale a costo final nacionalizado.",
        "Enviar equipo con tierra, restos vegetales o modificaciones no documentadas.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Donde EE.UU. puede tener sentido",
      title: "Equipos que justifican una revision seria desde Paraguay",
      intro:
        "La oportunidad no esta en traer cualquier maquina. Esta en encontrar unidades con configuracion, horas, estado y documentacion que justifiquen el costo logistico y el proceso local.",
      items: [
        {
          title: "Cosechadoras usadas",
          summary:
            "Categoria de alto valor cuando el comprador busca capacidad, horas razonables y configuracion dificil de encontrar localmente.",
          reason:
            "Antes de comprar conviene revisar ano, horas, plataforma, dimensiones, limpieza y ruta disponible.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Tractores de alta potencia",
          summary:
            "Tractores de mayor potencia pueden ser candidatos cuando la oferta regional no tiene la configuracion buscada.",
          reason:
            "La revision debe separar valor de compra, preparacion, flete y validacion del importador.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Sembradoras y plantadoras",
          summary:
            "Equipos row-crop pueden encajar con compradores que buscan capacidad y precision para agricultura extensiva.",
          reason:
            "La clave es confirmar ancho, accesorios, desmontaje, embalaje y documentacion antes del retiro.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Cabezales y paquetes completos",
          summary:
            "Muchas operaciones dependen del paquete correcto: cosechadora, draper, cabezal o accesorios compatibles.",
          reason:
            "Meridian puede ayudar a coordinar vendedor, fotos, retiro y carga del paquete completo.",
          href: "/services/equipment-sales",
          linkLabel: "Ver compra asistida",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Mejor informacion, mejor filtro",
      title: "Que enviar por WhatsApp para revisar una maquina",
      intro:
        "El objetivo del primer mensaje no es cerrar una venta. Es saber si la maquina merece avanzar antes de comprometer dinero con el vendedor.",
      items: [
        "Link del dealer, subasta o vendedor privado.",
        "Marca, modelo, ano de fabricacion y horas.",
        "Ubicacion en EE.UU. o Canada, idealmente con ZIP.",
        "Fotos de limpieza, tren de rodaje, plataforma, accesorios y numero de serie si esta disponible.",
        "Destino previsto en Paraguay: Asuncion, Villeta u otro punto.",
        "Nombre del importador, broker o despachante si ya esta definido.",
        "Fecha objetivo de embarque y si la compra incluye cabezales o accesorios.",
      ],
    },
    processSteps: {
      eyebrow: "Trabajo antes de mover la maquina",
      title: "Como convertimos un link de venta en un plan de exportacion",
      intro:
        "La secuencia evita cotizar a ciegas. Primero se filtra la maquina, luego se arma ruta y alcance.",
      steps: [
        {
          title: "Revisar la unidad",
          description:
            "Miramos modelo, ano, horas, ubicacion, vendedor, dimensiones y condicion visible.",
        },
        {
          title: "Separar riesgos locales",
          description:
            "Marcamos lo que debe confirmar el importador paraguayo: edad, licencia, SENAVE, DNIT y despacho.",
        },
        {
          title: "Armar tramo EE.UU.",
          description:
            "Coordinamos retiro, preparacion, embalaje, carga y reserva maritima segun el equipo.",
        },
        {
          title: "Cotizar con alcance claro",
          description:
            "La propuesta muestra que cubre Meridian y que queda para broker/importador antes de nacionalizar.",
        },
      ],
    },
    credibility: {
      eyebrow: "Sin inventar historial local",
      title: "Confianza basada en operacion real, no en promesas",
      intro:
        "Para Paraguay usamos pruebas de capacidad global de Meridian y fuentes oficiales. No presentamos casos paraguayos si no hay prueba interna lista para publicar.",
      pillars: [
        {
          title: "Compra y exportacion en un solo flujo",
          description:
            "El mismo equipo puede coordinar vendedor, retiro, preparacion, documentos y reserva internacional.",
        },
        {
          title: "Fuentes visibles",
          description:
            "La pagina enlaza la ley y referencias de ruta para que el comprador y su broker puedan revisar el marco.",
        },
        {
          title: "Alcance separado",
          description:
            "La propuesta no mezcla flete internacional con tributos, despacho y costos locales no confirmados.",
        },
      ],
      noteTitle: "Capacidad Meridian",
      note:
        "Meridian comunica experiencia global de exportacion. La pagina evita sugerir volumen especifico en Paraguay sin evidencia publicada.",
      projectGalleryLabel: "Ver proyectos y capacidades",
      projectGalleryDescription:
        "La galeria muestra tipos de maquinaria y operaciones internacionales; no debe leerse como prueba especifica de Paraguay.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Objeciones reales",
      title: "Preguntas que conviene resolver antes de comprar",
      intro:
        "Estas respuestas ayudan a ordenar la conversacion con Meridian y con el importador local.",
      entries: [
        {
          question: "Puedo importar a Paraguay una maquina agricola usada de mas de cinco anos?",
          answer:
            "La Ley 7565/2025 establece una antiguedad maxima para maquinaria agricola usada. Antes de comprar, el importador o broker paraguayo debe confirmar si la unidad especifica cumple por ano de fabricacion y categoria.",
          category: "Paraguay",
        },
        {
          question: "Que parte puede manejar Meridian?",
          answer:
            "Meridian puede revisar la unidad, coordinar vendedor, retiro, preparacion, embalaje, documentacion de exportacion y flete internacional. El importador local confirma licencia, SENAVE, DNIT, despacho, tributos y costos locales.",
          category: "Paraguay",
        },
        {
          question: "Que pasa si la maquina tiene tierra o restos vegetales?",
          answer:
            "Ese es un riesgo serio. La maquinaria usada debe prepararse limpia y con documentacion adecuada. Si hay residuos, plagas o limpieza insuficiente, el importador puede enfrentar inspecciones, costos o rechazo.",
          category: "Paraguay",
        },
        {
          question: "Meridian puede cotizar hasta Asuncion o Villeta?",
          answer:
            "Podemos revisar la ruta y el alcance disponible para la operacion. Si se requiere tramo fluvial o entrega posterior, debe confirmarse con naviera, agente y broker antes de prometer precio final.",
          category: "Paraguay",
        },
        {
          question: "Conviene comprar en EE.UU. frente a Brasil o Argentina?",
          answer:
            "Depende de configuracion, ano, horas, disponibilidad y documentacion. EE.UU. puede tener sentido cuando el comprador busca una unidad especifica y acepta revisar el costo logistico completo antes de comprar.",
          category: "Paraguay",
        },
      ],
    },
    officialSources: [
      {
        label: "Ley 7565/2025 - BACN",
        href: "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados",
        description:
          "Texto legal sobre maquinaria, equipos e implementos agricolas usados.",
      },
      {
        label: "Paraguay-Parana Waterway - Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/paraguay-paraguay-parana-waterway-system",
        description:
          "Referencia sobre la importancia del sistema fluvial para el comercio paraguayo.",
      },
      {
        label: "Paraguay soybean summary - USDA IPAD",
        href: "https://ipad.fas.usda.gov/countrysummary/default.aspx?id=PA",
        description:
          "Contexto agricola para dimensionar demanda, no prueba de clientes Meridian.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para compradores que necesitan validar vendedor, maquina y paquete antes de exportar.",
      },
      {
        label: "Maquinaria agricola",
        href: "/services/agricultural",
        description:
          "Alcance de embalaje, desmontaje y exportacion para equipos agricolas.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Referencia inicial para rutas soportadas; no reemplaza confirmacion local paraguaya.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Ejemplos globales de capacidad operativa y tipos de equipos manejados.",
      },
    ],
    cta: {
      heading: "Antes de pagar una maquina en EE.UU., revise si sirve para Paraguay",
      description:
        "Envieme el link, ano, horas, ubicacion y destino. Le diremos que podemos cotizar y que debe validar su broker/importador.",
      whatsappLabel: "Revisar por WhatsApp",
      calculatorLabel: "Ver calculadora",
    },
    tracking: {
      heroWhatsapp: "paraguay_hero_whatsapp",
      heroCalculator: "paraguay_hero_calculator",
      midWhatsapp: "paraguay_mid_whatsapp",
      midCalculator: "paraguay_mid_calculator",
      finalWhatsapp: "paraguay_final_whatsapp",
      finalCalculator: "paraguay_final_calculator",
      projectLibrary: "paraguay_project_library",
    },
    schema: {
      serviceType: "Exportacion de maquinaria agricola usada de EE.UU. a Paraguay",
      areaServed: "Paraguay",
      mentions: ["Asuncion", "Villeta", "Alto Parana", "Itapua", "Ley 7565/2025", "SENAVE"],
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
    },
  },
  {
    slug: "uruguay",
    country: "Uruguay",
    locale: "es-UY",
    path: "/es/destinations/uruguay",
    seo: {
      title: "Importar maquinaria agricola usada de EE.UU. a Uruguay",
      description:
        "Guia para compradores uruguayos: maquinaria usada de EE.UU. hacia Montevideo, DGSA Resolucion 98/016, limpieza, certificado fitosanitario e inspeccion.",
      keywords: [
        "importar maquinaria agricola usada de estados unidos a uruguay",
        "importar tractor usado desde usa a uruguay",
        "importar cosechadora usada estados unidos uruguay",
        "dgsa resolucion 98/016 maquinaria agricola usada",
        "certificado fitosanitario maquinaria usada uruguay",
        "envio maquinaria agricola puerto de montevideo",
      ],
    },
    labels: sharedLabels,
    hero: {
      eyebrow: "Guia para compradores uruguayos",
      heading: "Maquinaria agricola usada de EE.UU. a Uruguay, preparada para inspeccion",
      description:
        "Uruguay puede ser una ruta ordenada para maquinaria usada de Estados Unidos, pero la maquina debe llegar limpia, documentada y lista para revision DGSA. Meridian coordina el tramo de compra, retiro, preparacion, exportacion y flete hasta el alcance acordado.",
      image: {
        src: "/images/project-jd-s670-port.jpg",
        alt: "Cosechadora John Deere en operacion portuaria para exportacion",
        caption: "Preparacion y documentacion antes de entrada por Montevideo.",
      },
      highlights: [
        "Enfocada en Montevideo, limpieza, certificado fitosanitario y control documental.",
        "Pensada para compradores que comparan maquinaria de EE.UU. con oferta de Brasil o Argentina.",
        "WhatsApp para revisar una unidad especifica antes de moverla; calculadora como apoyo logistico.",
      ],
      primaryCtaLabel: "Revisar envio a Montevideo",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage:
        "Hola. Estoy evaluando importar maquinaria agricola usada desde EE.UU. a Uruguay. Quiero revisar limpieza, documentacion, ruta a Montevideo y cotizacion.",
      scopeIncluded: [
        "Revision de vendedor, maquina, ubicacion y requisitos visibles antes de comprar.",
        "Coordinacion de retiro, desmontaje, limpieza/preparacion operativa, embalaje y carga.",
        "Documentacion de exportacion y reserva maritima hacia Montevideo u otro alcance aprobado.",
      ],
      scopeExcluded: [
        "Clasificacion NCM, tributos, tasas y decisiones de despacho local.",
        "Despachante uruguayo, permisos locales y tramites ante autoridad de ingreso.",
        "Costos posteriores a puerto si no fueron cotizados como parte del alcance.",
      ],
      scopeFootnote:
        "La ventaja no es prometer despacho automatico. Es evitar que una maquina mal limpia o mal documentada llegue a inspeccion con problemas evitables.",
    },
    route: {
      eyebrow: "Montevideo como punto de entrada",
      title: "La ruta es mas directa; el control esta en la preparacion",
      intro:
        "A diferencia de destinos sin litoral, Uruguay concentra el riesgo en documentacion, limpieza y coordinacion con el despachante. El tramo oceanico debe planificarse junto con la condicion real de la maquina.",
      steps: [
        {
          title: "Revisar condicion",
          description:
            "Se piden fotos y datos de la maquina para detectar tierra, residuos, accesorios y dimensiones antes de cotizar.",
        },
        {
          title: "Preparar salida en EE.UU.",
          description:
            "Se coordina retiro, desmontaje, embalaje y carga con la documentacion de exportacion correspondiente.",
        },
        {
          title: "Reservar hacia Montevideo",
          description:
            "La ruta maritima se arma segun origen, equipo, contenedor o flat rack, y fecha objetivo.",
        },
        {
          title: "Handoff al despachante",
          description:
            "El comprador y su despachante confirman NCM, tributos, certificado, inspeccion y retiro local.",
        },
      ],
      note:
        "Montevideo puede ser un punto de entrada claro, pero la inspeccion DGSA exige tomar en serio limpieza y documentacion antes del embarque.",
    },
    compliance: {
      eyebrow: "DGSA Resolucion 98/016",
      title: "La maquina usada debe llegar limpia y documentada",
      intro:
        "DGSA exige que la maquinaria agricola usada llegue sin suelo, restos vegetales ni plagas, con certificado y sujeta a inspeccion. El comprador debe tratar esto como parte central de la decision, no como detalle de ultimo minuto.",
      required: [
        "Revisar limpieza interna y externa antes de coordinar retiro o carga.",
        "Preparar documentacion de exportacion y datos necesarios para certificado fitosanitario cuando aplique.",
        "Coordinar con el despachante uruguayo antes de asumir costo final.",
      ],
      brokerConfirmed: [
        "NCM, aranceles, IVA, tasas y tratamiento tributario aplicable.",
        "Certificado fitosanitario, tratamiento en origen y requisitos de inspeccion.",
        "Retiro del puerto, costos locales y cualquier accion requerida por DGSA tras inspeccion.",
      ],
      avoid: [
        "Comprar solo por precio publicado sin revisar limpieza y documentacion.",
        "Asumir que la maquinaria de EE.UU. siempre es mas conveniente que Brasil o Argentina.",
        "Publicar un porcentaje de arancel sin validar NCM y regla vigente con el despachante.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Categorias con mejor ajuste",
      title: "Cuando mirar Estados Unidos desde Uruguay",
      intro:
        "Uruguay ya tiene alternativas regionales. EE.UU. cobra sentido cuando la configuracion, condicion, horas, tecnologia o documentacion justifican traer una unidad especifica.",
      items: [
        {
          title: "Cosechadoras",
          summary:
            "Unidades usadas o reacondicionadas pueden interesar cuando la configuracion no aparece en la oferta regional.",
          reason:
            "La revision debe incluir limpieza, plataforma, dimensiones y compatibilidad antes de reservar.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Tractores",
          summary:
            "Tractores usados de EE.UU. pueden competir cuando el comprador prioriza potencia, estado y equipamiento.",
          reason:
            "El pais tiene demanda de maquinaria usada/reacondicionada, pero el caso debe analizarse maquina por maquina.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Sembradoras y equipos de suelo",
          summary:
            "Equipos de preparacion, siembra y tecnologia agricola pueden justificar una busqueda fuera de la region.",
          reason:
            "La coordinacion temprana evita sorpresas por dimensiones, desmontaje y limpieza.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Pulverizadoras y precision",
          summary:
            "Equipos con tecnologia o configuracion especifica pueden valer mas por disponibilidad que por precio base.",
          reason:
            "El comprador necesita revisar condicion, documentacion y servicio local antes de cerrar.",
          href: "/equipment/sprayers",
          linkLabel: "Ver pulverizadoras",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Datos para cotizar sin adivinar",
      title: "Que enviar si la maquina va a Uruguay",
      intro:
        "Con una ficha completa podemos decir si tiene sentido avanzar y que debe revisar su despachante antes de nacionalizar.",
      items: [
        "Link de la maquina o datos del vendedor.",
        "Modelo, ano, horas y numero de serie si esta disponible.",
        "Fotos de limpieza, interior, ruedas/orugas, plataforma y accesorios.",
        "Ubicacion de retiro en EE.UU. o Canada.",
        "Destino previsto: Montevideo o punto interior.",
        "Despachante asignado o nombre del importador en Uruguay.",
        "Fecha objetivo y si hay urgencia por campana agricola.",
      ],
    },
    processSteps: {
      eyebrow: "Del link al embarque",
      title: "Como reducimos riesgo antes de mover la unidad",
      intro:
        "La preparacion correcta empieza cuando se revisa la maquina, no cuando ya esta en puerto.",
      steps: [
        {
          title: "Filtrar la unidad",
          description:
            "Revisamos fotos, dimensiones, ano, horas, accesorios, vendedor y ubicacion.",
        },
        {
          title: "Marcar riesgos DGSA",
          description:
            "Identificamos puntos de limpieza, certificado, tratamiento o inspeccion que debe confirmar el despachante.",
        },
        {
          title: "Preparar exportacion",
          description:
            "Coordinamos retiro, desmontaje, embalaje, carga y documentos de exportacion.",
        },
        {
          title: "Cotizar el alcance correcto",
          description:
            "La propuesta separa tramo Meridian de costos y decisiones locales en Uruguay.",
        },
      ],
    },
    credibility: {
      eyebrow: "Precision antes que promesa",
      title: "Uruguay requiere una pagina sobria y verificable",
      intro:
        "La confianza se gana mostrando fuentes, alcance y limites. No necesitamos inflar la pagina con historial no probado.",
      pillars: [
        {
          title: "Preparacion visible",
          description:
            "Fotos, desmontaje, embalaje y documentacion ayudan al comprador y al despachante a revisar la operacion.",
        },
        {
          title: "Fuentes oficiales",
          description:
            "La pagina cita DGSA y Trade.gov para separar hechos de opinion comercial.",
        },
        {
          title: "Comparacion honesta",
          description:
            "EE.UU. no se presenta como siempre mas barato; se presenta como opcion fuerte cuando la unidad correcta existe.",
        },
      ],
      noteTitle: "Capacidad Meridian",
      note:
        "Meridian muestra experiencia global de exportacion y mantiene el costo uruguayo final del lado del importador y su despachante.",
      projectGalleryLabel: "Ver capacidades",
      projectGalleryDescription:
        "La galeria ayuda a entender tipos de maquinaria y embalaje; no se usa como prueba de envios especificos a Uruguay.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Preguntas de compradores y despachantes",
      title: "Antes de embarcar a Uruguay",
      intro:
        "Las respuestas estan escritas para ordenar el primer intercambio, no para reemplazar asesoramiento del despachante.",
      entries: [
        {
          question: "Que exige DGSA para maquinaria agricola usada?",
          answer:
            "La Resolucion 98/016 exige maquinaria limpia interna y externamente, libre de suelo, restos vegetales y plagas, con certificado y sujeta a inspeccion al ingreso.",
          category: "Uruguay",
        },
        {
          question: "Que pasa si DGSA encuentra tierra o residuos?",
          answer:
            "Puede requerir acciones adicionales y, en casos de incumplimiento, rechazo o reexportacion. Por eso la limpieza y la evidencia antes de embarcar importan.",
          category: "Uruguay",
        },
        {
          question: "Meridian puede encargarse del certificado fitosanitario?",
          answer:
            "Podemos coordinar el tramo de exportacion y la documentacion disponible en origen. El despachante/importador uruguayo debe confirmar exactamente que certificado, tratamiento y tramite aplica.",
          category: "Uruguay",
        },
        {
          question: "Conviene comprar en EE.UU. en vez de Brasil?",
          answer:
            "Depende de la unidad. EE.UU. puede ser atractivo por disponibilidad, configuracion, horas, marca o documentacion, pero Brasil y Argentina siguen siendo alternativas regionales fuertes.",
          category: "Uruguay",
        },
        {
          question: "La cotizacion incluye impuestos y despacho en Uruguay?",
          answer:
            "No por defecto. Meridian cotiza el alcance internacional acordado; NCM, tributos, tasas, despacho y retiro local se confirman con el despachante uruguayo.",
          category: "Uruguay",
        },
      ],
    },
    officialSources: [
      {
        label: "Uruguay Agricultural Equipment - Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/uruguay-agricultural-equipment",
        description:
          "Datos de mercado, importaciones 2024, proveedores y demanda por maquinaria usada/reacondicionada.",
      },
      {
        label: "DGSA Resolucion 98/016",
        href: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais",
        description:
          "Requisitos fitosanitarios para introduccion de maquinaria usada.",
      },
      {
        label: "USDA IPAD Uruguay Soybean",
        href: "https://ipad.fas.usda.gov/countrysummary/Default.aspx?crop=Soybean&id=UY",
        description:
          "Contexto agricola general para el mercado uruguayo.",
      },
    ],
    resourceLinks: [
      {
        label: "Servicio agricola",
        href: "/services/agricultural",
        description:
          "Alcance de preparacion y exportacion de maquinaria agricola.",
      },
      {
        label: "Embalaje de maquinaria",
        href: "/services/machinery-packing",
        description:
          "Referencia para desmontaje, proteccion y carga de equipos.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Estimacion inicial del tramo logistico cuando la ruta esta disponible.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Muestras globales de maquinaria manejada por Meridian.",
      },
    ],
    cta: {
      heading: "Tiene una maquina vista en EE.UU. para Uruguay?",
      description:
        "Envie el link, fotos, ano, horas, ubicacion y destino. Revisamos el tramo internacional y marcamos que debe confirmar su despachante.",
      whatsappLabel: "Revisar envio por WhatsApp",
      calculatorLabel: "Calcular flete",
    },
    tracking: {
      heroWhatsapp: "uruguay_hero_whatsapp",
      heroCalculator: "uruguay_hero_calculator",
      midWhatsapp: "uruguay_mid_whatsapp",
      midCalculator: "uruguay_mid_calculator",
      finalWhatsapp: "uruguay_final_whatsapp",
      finalCalculator: "uruguay_final_calculator",
      projectLibrary: "uruguay_project_library",
    },
    schema: {
      serviceType: "Exportacion de maquinaria agricola usada de EE.UU. a Uruguay",
      areaServed: "Uruguay",
      mentions: ["Montevideo", "DGSA", "Resolucion 98/016", "maquinaria usada", "certificado fitosanitario"],
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
    },
  },
  {
    slug: "bolivia",
    country: "Bolivia",
    locale: "es-BO",
    path: "/es/destinations/bolivia",
    seo: {
      title: "Importar maquinaria agricola usada de EE.UU. a Bolivia",
      description:
        "Guia para compradores bolivianos: maquinaria agricola usada de EE.UU., ruta hacia Santa Cruz, transito por puerto, SENASAG y validacion con broker/importador.",
      keywords: [
        "importar maquinaria agricola usada de estados unidos a bolivia",
        "importar tractor usado desde usa a bolivia",
        "importar cosechadora usada estados unidos bolivia",
        "maquinaria agricola usada santa cruz bolivia",
        "senasag permiso fitosanitario importacion maquinaria",
        "arica chile transito bolivia maquinaria",
      ],
    },
    labels: sharedLabels,
    hero: {
      eyebrow: "Guia para compradores bolivianos",
      heading: "Maquinaria agricola usada de EE.UU. a Bolivia con ruta y validacion local",
      description:
        "Para Bolivia, la oportunidad esta en revisar la unidad correcta y no subestimar el tramo terrestre, el broker/importador y la documentacion. Meridian coordina el lado EE.UU. y ayuda a ordenar la informacion antes de que el comprador avance.",
      image: {
        src: "/images/project-jd-sprayer-port-crane.jpg",
        alt: "Pulverizadora agricola cargada con grua para exportacion internacional",
        caption: "Ruta internacional y handoff local definidos antes de mover la maquina.",
      },
      highlights: [
        "Enfocada en Santa Cruz y compradores que buscan tractores, cosechadoras, sembradoras y equipos de precision.",
        "Trata SENASAG y documentacion como puntos a confirmar, no como promesa cerrada.",
        "Evita presentar beneficios tributarios o antiguedad como regla universal sin validacion local.",
      ],
      primaryCtaLabel: "Revisar ruta y elegibilidad",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage:
        "Hola. Estoy evaluando importar maquinaria agricola usada desde EE.UU. a Bolivia. Quiero revisar ruta, ano, documentacion, destino y que debe confirmar mi broker/importador.",
      scopeIncluded: [
        "Revision de maquina, vendedor, ano, horas, ubicacion y dimensiones.",
        "Coordinacion de retiro, preparacion, embalaje, documentacion de exportacion y reserva internacional.",
        "Separacion clara entre alcance Meridian y validaciones del broker/importador boliviano.",
      ],
      scopeExcluded: [
        "Confirmacion final de SENASAG, Aduana Nacional, tributos, incentivos y despacho local.",
        "Entrega interior en Bolivia si no fue aprobada como parte del alcance cotizado.",
        "Garantia de que un beneficio tributario o requisito de antiguedad aplica a la unidad.",
      ],
      scopeFootnote:
        "Para Bolivia, una respuesta honesta vale mas que una promesa rapida: primero se revisa la maquina, luego la ruta y despues lo que confirma el broker/importador.",
    },
    route: {
      eyebrow: "Destino sin litoral",
      title: "Bolivia requiere pensar en puerto de transito y destino interior",
      intro:
        "La conversacion no debe quedarse en el flete oceanico. El comprador necesita saber como se movera la unidad hacia Bolivia y que parte del alcance queda confirmada localmente.",
      steps: [
        {
          title: "Origen en EE.UU.",
          description:
            "Se revisa ubicacion, dimensiones, tipo de carga, accesorios y si la maquina necesita desmontaje.",
        },
        {
          title: "Puerto y reserva",
          description:
            "Se define una ruta internacional viable segun origen, equipo y disponibilidad de naviera.",
        },
        {
          title: "Puerto de transito",
          description:
            "El uso de puerto de transito y el tramo posterior deben coordinarse con agentes y broker antes de prometer costo final.",
        },
        {
          title: "Destino boliviano",
          description:
            "Santa Cruz, Cochabamba, La Paz u otro destino cambian el alcance y deben informarse desde el primer mensaje.",
        },
      ],
      note:
        "Trade.gov identifica Santa Cruz como el centro principal de agricultura comercial en Bolivia. Eso vuelve clave preguntar destino interior desde el inicio.",
    },
    compliance: {
      eyebrow: "Broker/importador confirmado",
      title: "La documentacion boliviana no debe asumirse desde una pagina web",
      intro:
        "Bolivia tiene oportunidad comercial, pero las reglas practicas deben confirmarse por unidad, importador, clasificacion y tramite. La pagina usa fuentes oficiales para orientar la conversacion sin reemplazar al broker local.",
      required: [
        "Revisar ano, horas, condicion, documentos y destino antes de comprar.",
        "Confirmar si la carga necesita documentacion fitosanitaria o sanitaria segun producto y autoridad aplicable.",
        "Definir si el comprador busca solo llegada a puerto de transito o apoyo para analizar tramo interior.",
      ],
      brokerConfirmed: [
        "SENASAG, Aduana Nacional, permisos, clasificacion, tributos y despacho.",
        "Si aplica algun incentivo tributario y que antiguedad exige ese beneficio para la unidad concreta.",
        "Costos y responsabilidades del tramo desde puerto de transito hasta destino boliviano.",
      ],
      avoid: [
        "Convertir una condicion de beneficio tributario en regla general de importacion.",
        "Prometer exencion de IVA o incentivo vigente sin confirmacion 2026.",
        "Comprar una unidad sin validar importador, ruta y destino interior.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Santa Cruz como senal comercial",
      title: "Equipos que pueden justificar busqueda en EE.UU.",
      intro:
        "Bolivia importa maquinaria agricola y concentra mucha agricultura comercial en Santa Cruz. La oportunidad esta en traer la unidad correcta con una ruta realista.",
      items: [
        {
          title: "Tractores",
          summary:
            "Categoria amplia para compradores que buscan potencia, disponibilidad y estado verificable.",
          reason:
            "El ano y la documentacion deben revisarse temprano porque pueden afectar elegibilidad o beneficios locales.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Cosechadoras",
          summary:
            "Equipos de alto valor pueden tener sentido si la configuracion y el estado justifican la ruta.",
          reason:
            "Antes de moverlas se deben revisar dimensiones, accesorios, limpieza, ano y destino final.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Sembradoras y equipos de suelo",
          summary:
            "Maquinaria para preparacion, siembra y produccion extensiva puede encajar con compradores de Santa Cruz.",
          reason:
            "La revision debe incluir ancho, desmontaje, accesorios, embalaje y ruta interior.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Pulverizadoras y tecnologia agricola",
          summary:
            "Equipos de aplicacion, precision o riego pueden ser relevantes cuando no hay equivalente disponible localmente.",
          reason:
            "El caso se decide por condicion, soporte, repuestos y capacidad de importar correctamente.",
          href: "/equipment/sprayers",
          linkLabel: "Ver pulverizadoras",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Informacion minima para no cotizar a ciegas",
      title: "Que enviar si la maquina va a Bolivia",
      intro:
        "La primera revision debe permitir separar oportunidad comercial, ruta posible y validaciones del broker/importador.",
      items: [
        "Link de dealer, subasta o vendedor.",
        "Marca, modelo, ano, horas y condicion visible.",
        "Ubicacion de retiro en EE.UU. o Canada.",
        "Destino en Bolivia: Santa Cruz, Cochabamba, La Paz u otro.",
        "Si el comprador ya tiene broker/importador registrado.",
        "Si necesita analizar solo puerto de transito o tambien tramo interior.",
        "Fotos y datos de accesorios, dimensiones y posibles modificaciones.",
      ],
    },
    processSteps: {
      eyebrow: "Primero elegibilidad, despues flete",
      title: "Como ordenar una compra para Bolivia",
      intro:
        "La ruta boliviana requiere filtrar antes de comprometerse con el vendedor.",
      steps: [
        {
          title: "Revisar maquina",
          description:
            "Validamos ano, horas, estado, dimensiones, accesorios, ubicacion y vendedor.",
        },
        {
          title: "Identificar validaciones locales",
          description:
            "Marcamos que debe confirmar el broker/importador: SENASAG, Aduana, tributos, incentivo y destino interior.",
        },
        {
          title: "Armar ruta internacional",
          description:
            "Cotizamos retiro, preparacion, embalaje, documentos y reserva segun alcance aprobado.",
        },
        {
          title: "Separar el handoff boliviano",
          description:
            "La propuesta deja claro donde termina Meridian y que queda pendiente de confirmacion local.",
        },
      ],
    },
    credibility: {
      eyebrow: "Criterio comercial",
      title: "Bolivia necesita una pagina cuidadosa, no sobrepromesas",
      intro:
        "La pagina debe atraer compradores serios, pero tambien filtrar operaciones que no estan listas para cotizar.",
      pillars: [
        {
          title: "Santa Cruz en el centro",
          description:
            "El contenido habla al comprador agricola donde se concentra gran parte de la demanda comercial.",
        },
        {
          title: "Validacion local explicita",
          description:
            "La pagina reconoce que el broker/importador confirma permisos, tributos e incentivos.",
        },
        {
          title: "Operacion Meridian acotada",
          description:
            "Meridian se presenta como socio del lado EE.UU. y exportacion, con handoff claro para Bolivia.",
        },
      ],
      noteTitle: "Capacidad Meridian",
      note:
        "Meridian puede coordinar compra, retiro, preparacion y exportacion internacional. La pagina no afirma historial especifico en Bolivia sin evidencia publicada.",
      projectGalleryLabel: "Ver proyectos y servicios",
      projectGalleryDescription:
        "Use la galeria para entender tipos de equipos manejados, no como prueba especifica de envios a Bolivia.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Preguntas para ordenar la operacion",
      title: "Antes de comprar maquinaria para Bolivia",
      intro:
        "Las respuestas ayudan a saber que enviar a Meridian y que debe confirmar el broker/importador.",
      entries: [
        {
          question: "Que ruta se usa para maquinaria hacia Bolivia?",
          answer:
            "Depende del origen, equipo, naviera y destino final. Normalmente hay que pensar en un puerto de transito y un tramo posterior hacia Bolivia, que debe coordinarse con agentes y broker.",
          category: "Bolivia",
        },
        {
          question: "La antiguedad de la maquinaria afecta beneficios o permisos?",
          answer:
            "Puede afectar la evaluacion local. Algunas referencias oficiales han vinculado antiguedad con beneficios tributarios para bienes de capital, pero su broker/importador debe confirmar si aplica al equipo y al ano actual.",
          category: "Bolivia",
        },
        {
          question: "SENASAG aplica a toda maquinaria agricola usada?",
          answer:
            "SENASAG es autoridad relevante en sanidad vegetal y documentacion fitosanitaria, pero el tramite especifico debe confirmarse segun producto, condicion y operacion. No conviene asumirlo desde una pagina web.",
          category: "Bolivia",
        },
        {
          question: "Meridian puede cotizar hasta Santa Cruz?",
          answer:
            "Podemos revisar destino, ruta y alcance. El tramo interior en Bolivia debe confirmarse antes de prometer precio final, porque depende de agentes, documentos y responsabilidades locales.",
          category: "Bolivia",
        },
        {
          question: "Que equipos conviene buscar en EE.UU.?",
          answer:
            "Tractores, cosechadoras, sembradoras, equipos de suelo, pulverizadoras y tecnologia agricola pueden tener sentido si la unidad esta bien documentada y la ruta local es viable.",
          category: "Bolivia",
        },
      ],
    },
    officialSources: [
      {
        label: "Bolivia Agricultural Sectors - Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/bolivia-agricultural-sectors",
        description:
          "Referencia comercial sobre produccion local, importaciones y mejores perspectivas para maquinaria agricola.",
      },
      {
        label: "SENASAG - Cuarentena Vegetal",
        href: "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal",
        description:
          "Referencia institucional para autoridad fitosanitaria y cuarentena vegetal.",
      },
      {
        label: "Aduana Nacional - incentivos bienes de capital",
        href: "https://www.aduana.gob.bo/node/1377518",
        description:
          "Referencia sobre beneficios vinculados a bienes de capital; requiere confirmacion vigente por broker/importador.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para revisar vendedor, maquina y documentos antes de comprometer fondos.",
      },
      {
        label: "Maquinaria agricola",
        href: "/services/agricultural",
        description:
          "Alcance de exportacion para equipos agricolas desde EE.UU. y Canada.",
      },
      {
        label: "Calculadora",
        href: "/pricing/calculator",
        description:
          "Referencia de flete cuando la ruta esta soportada y los datos son suficientes.",
      },
      {
        label: "Contacto",
        href: "/contact",
        description:
          "Para enviar una consulta con datos de maquina, origen y destino.",
      },
    ],
    cta: {
      heading: "Tiene una maquina vista para Bolivia?",
      description:
        "Envie el link, ano, horas, ubicacion y destino. Revisamos ruta y marcamos que debe confirmar su broker/importador.",
      whatsappLabel: "Revisar por WhatsApp",
      calculatorLabel: "Calcular flete",
    },
    tracking: {
      heroWhatsapp: "bolivia_hero_whatsapp",
      heroCalculator: "bolivia_hero_calculator",
      midWhatsapp: "bolivia_mid_whatsapp",
      midCalculator: "bolivia_mid_calculator",
      finalWhatsapp: "bolivia_final_whatsapp",
      finalCalculator: "bolivia_final_calculator",
      projectLibrary: "bolivia_project_library",
    },
    schema: {
      serviceType: "Exportacion de maquinaria agricola usada de EE.UU. a Bolivia",
      areaServed: "Bolivia",
      mentions: ["Santa Cruz", "SENASAG", "Aduana Nacional", "maquinaria agricola usada", "puerto de transito"],
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
    },
  },
];

export const latamMarketSlugs = latamMarketPages.map((page) => page.slug);

export function isLatamMarketSlug(slug: string): slug is LatamMarketSlug {
  return latamMarketPages.some((page) => page.slug === slug);
}

export function getLatamMarketPage(slug: string): LatamMarketPageContent | undefined {
  return latamMarketPages.find((page) => page.slug === slug);
}
