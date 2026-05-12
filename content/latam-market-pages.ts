import type { FaqEntry } from "@/content/faq";

export type LatamMarketSlug = "paraguay" | "uruguay" | "bolivia" | "chile";

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
    finalWhatsapp: string;
    finalCalculator: string;
    equipmentLink: string;
    resourceLink: string;
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
  scopeCaption: "Antes de comprar: ruta, documentos y alcance",
  meridianHandles: "Meridian coordina",
  localSideConfirms: "Su despachante confirma en destino",
  sourceLinks: "Documentos para revisar con su despachante",
  routeSection: "Ruta logística",
  complianceSection: "Cumplimiento local",
  equipmentSection: "Selección de equipo",
  sendUsThisSection: "Para revisar una máquina",
  processSection: "Flujo de trabajo",
  credibilitySection: "Credibilidad operativa",
  faqSection: "Preguntas frecuentes",
  openResource: "Ver recurso",
  blockLabel: "Equipo",
  stepLabel: "Paso",
  exportsLabel: "exportaciones",
  yearsLabel: "años en operación",
};

function buildQualifiedWhatsappMessage(country: string) {
  return [
    `Hola. Estoy evaluando importar maquinaria agrícola usada o repuestos desde EE.UU. a ${country}.`,
    "",
    "Necesito cotizar:",
    "Equipo o parte:",
    "Año/modelo:",
    "Ubicación en origen:",
    "Destino final:",
    "Cantidad/configuración:",
    "Link del anuncio:",
  ].join("\n");
}

export const latamMarketPages: LatamMarketPageContent[] = [
  {
    slug: "paraguay",
    country: "Paraguay",
    locale: "es-PY",
    path: "/es/destinations/paraguay",
    seo: {
      title: "Importar maquinaria agrícola usada de EE.UU. a Paraguay",
      description:
        "Ley 7565/2025 fija 5 años para maquinaria agrícola usada en Paraguay. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. y Canadá.",
      keywords: [
        "importar maquinaria agrícola usada de estados unidos a paraguay",
        "importar cosechadora usada estados unidos paraguay",
        "importar tractor usado desde usa a paraguay",
        "ley 7565 2025 maquinaria agrícola usada paraguay",
        "antigüedad máxima cinco años maquinaria agrícola paraguay",
        "registro importadores maquinaria usada MIC paraguay",
        "senave certificado fitosanitario maquinaria usada",
        "hidrovía paraná paraguay tránsito barcaza asunción villeta",
        "tasa biodiversidad maquinaria agrícola paraguay",
      ],
    },
    labels: sharedLabels,
    hero: {
      eyebrow: "Guía para compradores paraguayos",
      heading: "Importar maquinaria agrícola usada de EE.UU. a Paraguay",
      description:
        "Desde el 13 de noviembre de 2025, la Ley 7565/2025 establece que la maquinaria agrícola usada que ingresa a Paraguay no puede superar los cinco años desde su año de fabricación. Meridian coordina compra asistida, retiro, desmontaje, embalaje y flete internacional para unidades que cumplen ese filtro, y deja explícito desde el primer mensaje qué confirma su despachante en destino.",
      image: {
        src: "/images/project-jd-9650sts-transport.jpg",
        alt: "Cosechadora John Deere usada preparada para transporte internacional",
        caption: "Revisión de unidad, retiro y preparación antes de exportar.",
      },
      highlights: [
        "Filtro de antigüedad de cinco años (Ley 7565/2025) aplicado antes de coordinar compra o flete.",
        "Retiro, desmontaje, embalaje, certificado fitosanitario de origen y reserva marítima desde EE.UU. y Canadá.",
        "Tránsito por la Hidrovía Paraná-Paraguay con calendario confirmado por naviera y operador fluvial.",
      ],
      primaryCtaLabel: "Cotizar por WhatsApp",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage: buildQualifiedWhatsappMessage("Paraguay"),
      scopeIncluded: [
        "Compra asistida y coordinación con vendedor en EE.UU. o Canadá (subasta, concesionario o privado).",
        "Retiro en origen, desmontaje técnico, etiquetado, embalaje y carga.",
        "Documentación de exportación, certificado fitosanitario USDA APHIS o CFIA y reserva marítima.",
      ],
      scopeExcluded: [
        "Registro de Importadores de Maquinarias Usadas y Licencia Previa de Importación ante el MIC.",
        "DNIT, SENAVE, Tasa de Conservación de la Biodiversidad, IVA, tasas portuarias y despacho local.",
        "Entrega interior a campo o taller si no fue aprobada y cotizada como alcance adicional.",
      ],
      scopeFootnote:
        "Una unidad que parece bien en subasta no entra a Paraguay si supera los cinco años o si la documentación no cumple con la Ley 7565/2025. Esos puntos se revisan antes de transferir fondos.",
    },
    route: {
      eyebrow: "Hidrovía Paraná-Paraguay",
      title: "La operación termina en Asunción o Villeta, no en el puerto oceánico",
      intro:
        "Paraguay es destino sin litoral. Toda unidad que sale de EE.UU. cruza el océano hasta Buenos Aires, hace transbordo y llega a Asunción o Villeta por la Hidrovía. Cada tramo cambia el calendario y el costo, así que la ruta se planifica desde el primer mensaje.",
      steps: [
        {
          title: "Costa Este de EE.UU. → Buenos Aires",
          description:
            "Tránsito marítimo de 23 a 32 días con servicios regulares de Maersk, Hapag-Lloyd, CMA CGM y MSC. Houston suma 5 a 7 días adicionales.",
        },
        {
          title: "Transbordo en Buenos Aires",
          description:
            "El contenedor se descarga del buque oceánico y se reposiciona para flete fluvial. De 3 a 7 días según naviera y coordinación local.",
        },
        {
          title: "Hidrovía hasta Asunción o Villeta",
          description:
            "Tramo fluvial de 10 a 15 días en operación normal. En temporada seca o con restricciones de calado informadas por resolución, naviera u operador fluvial, se planifican días adicionales según el corredor.",
        },
        {
          title: "Llegada a terminal y despacho",
          description:
            "Villeta y Asunción concentran operaciones fluviales relevantes; el punto exacto depende de naviera, operador, tipo de carga y coordinación del despachante.",
        },
      ],
      note:
        "Las restricciones de calado en la Hidrovía cambian por resolución y por condiciones hidrométricas. Antes de cotizar, Meridian confirma el calendario con la naviera y el operador fluvial.",
    },
    compliance: {
      eyebrow: "Ley 7565/2025",
      title: "Antigüedad, limpieza, certificación e inspección antes de pagar la unidad",
      intro:
        "La Ley 7565/2025, promulgada el 13 de noviembre de 2025, regula la importación de maquinaria, equipos e implementos agrícolas usados a Paraguay. Su reglamentación específica está en desarrollo a mayo de 2026, pero el filtro de antigüedad y los requisitos de la ley aplican desde la promulgación.",
      required: [
        "Antigüedad máxima de cinco años contados desde el año de fabricación (Artículo 4).",
        "Certificado fitosanitario de origen emitido por la autoridad acreditada (USDA APHIS para EE.UU., CFIA para Canadá).",
        "Inspección técnica certificada por una empresa independiente y autorizada en origen sobre el estado de la máquina, motor y odómetro, con declaración obligatoria de horas de uso.",
        "Limpieza interna y externa libre de suelo, plagas y restos vegetales, con métodos aceptados (hidrolavado, vapor, aire forzado, aspirado, desmontaje cuando corresponde).",
        "Cumplimiento de los límites de emisiones contaminantes que fija el Ministerio del Ambiente y Desarrollo Sostenible.",
      ],
      brokerConfirmed: [
        "Inscripción en el Registro de Importadores de Maquinarias Usadas ante la Subsecretaría de Estado de Comercio del MIC.",
        "Licencia Previa de Importación tramitada antes del embarque (Artículo 5).",
        "Tasa para la Conservación de la Biodiversidad escalada por antigüedad, motor, horas, emisiones y otros elementos potencialmente contaminantes.",
        "DNIT, IVA, tasas portuarias, honorarios del despachante e inspección fitosanitaria final por SENAVE en destino, con desmontaje y pruebas si lo requiere.",
      ],
      avoid: [
        "Comprar una unidad fabricada antes del año límite vigente sin verificarlo con su despachante.",
        "Adquirir maquinaria con manipulación de motor u odómetro: el Artículo 7 prohíbe explícitamente el ingreso.",
        "Embarcar equipo que sufrió volcadura o daño estructural: la ley impide el ingreso, no solo lo restringe.",
        "Asumir que la cotización puerta a puerto incluye DNIT, SENAVE o la Tasa de Biodiversidad: son responsabilidad del despachante en destino.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Categorías que califican dentro del filtro de cinco años",
      title: "Equipos donde EE.UU. tiene oferta sólida bajo la antigüedad máxima",
      intro:
        "Con la Ley 7565/2025 vigente, la búsqueda se concentra en unidades modelo 2021 en adelante. EE.UU. mantiene profundidad de inventario en cuatro categorías que las cooperativas paraguayas y las comunidades menonitas piden con frecuencia.",
      items: [
        {
          title: "Cosechadoras",
          summary:
            "Modelos 2021 o más nuevos, capacidad de 250 a 500 hp, configuración para cultivos extensivos.",
          reason:
            "El cabezal draper compatible y los paquetes con plataforma completa son donde EE.UU. supera la oferta regional.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Tractores de alta potencia",
          summary:
            "Tractores 200-400 hp, doble tracción, cabina con tecnología de precisión y configuraciones específicas.",
          reason:
            "Cuando la unidad existe modelo 2021 o más nuevo, la disponibilidad de configuración supera al usado regional.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Sembradoras y plantadoras",
          summary:
            "Sembradoras de precisión con control por sección, monitoreo electrónico y compatibilidad con tecnología de aplicación variable.",
          reason:
            "El equipamiento electrónico de fábrica es difícil de igualar en mercados secundarios brasileño o argentino.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Cabezales draper y paquetes completos",
          summary:
            "Cabezales draper, paquetes cosechadora + plataforma + accesorios compatibles para una sola operación de embarque.",
          reason:
            "Las cooperativas y las comunidades menonitas frecuentemente compran paquetes en lugar de unidades aisladas.",
          href: "/services/equipment-sales",
          linkLabel: "Ver compra asistida",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Información mínima para no cotizar a ciegas",
      title: "Qué enviar por WhatsApp para revisar una unidad para Paraguay",
      intro:
        "Con una ficha completa podemos confirmar si la unidad cumple la Ley 7565/2025 y armar el alcance de exportación antes de comprometer fondos.",
      items: [
        "Link de subasta, concesionario o vendedor privado.",
        "Marca, modelo, año de fabricación y horas de motor.",
        "Ubicación de retiro en EE.UU. o Canadá con código postal.",
        "Fotos de limpieza interior, tren de rodaje, plataforma, accesorios y placa con número de serie.",
        "Destino previsto en Paraguay: Asunción, Villeta, Itapúa, Alto Paraná u otro punto.",
        "Nombre del importador o despachante si ya está definido.",
        "Fecha objetivo de embarque y si la operación incluye cabezales o accesorios.",
      ],
    },
    processSteps: {
      eyebrow: "Cuatro decisiones antes de mover la unidad",
      title: "Cómo convertimos un link de venta en un plan de exportación",
      intro:
        "El orden importa. Primero filtramos por la ley, después armamos ruta y alcance.",
      steps: [
        {
          title: "Filtrar por antigüedad y origen",
          description:
            "Validamos año de fabricación, dimensiones, condición visible, vendedor y ubicación. Si la unidad supera los cinco años, lo decimos antes de avanzar.",
        },
        {
          title: "Marcar responsabilidades locales",
          description:
            "Listamos lo que confirma su despachante: Registro de Importadores ante MIC, Licencia Previa, DNIT, SENAVE y Tasa de Conservación de la Biodiversidad.",
        },
        {
          title: "Coordinar tramo EE.UU. y Canadá",
          description:
            "Retiro, desmontaje, embalaje, certificado fitosanitario USDA APHIS o CFIA y reserva marítima hacia Buenos Aires.",
        },
        {
          title: "Cotizar con alcance separado",
          description:
            "El presupuesto separa el tramo Meridian del costo de despacho local. Sin esa separación no hay comparación honesta entre opciones.",
        },
      ],
    },
    credibility: {
      eyebrow: "Operación verificable",
      title: "Una propuesta que se sostiene con la unidad y la ruta concretas",
      intro:
        "Antes de transferir fondos, conviene tener un mapa simple: año y estado de la máquina, costo de retiro y embalaje, certificación de origen, reserva marítima y responsabilidades del despachante en Paraguay.",
      pillars: [
        {
          title: "Una sola contraparte en EE.UU. y Canadá",
          description:
            "Un equipo coordina vendedor, retiro, desmontaje, embalaje, documentos de exportación y reserva internacional.",
        },
        {
          title: "Disciplina regulatoria sobre Ley 7565/2025",
          description:
            "Antigüedad, limpieza, certificación e inspección se filtran antes de mover fondos, no después.",
        },
        {
          title: "Cotización por alcance, no por suposición",
          description:
            "El flete internacional se separa de tributos, despacho y costos locales que define su despachante.",
        },
      ],
      noteTitle: "Experiencia aplicada al caso",
      note:
        "Meridian ha coordinado más de 1.000 exportaciones a más de 40 países. Para Paraguay, la propuesta se arma con datos de la unidad y la Ley 7565/2025 como filtro inicial, no con una tarifa genérica.",
      projectGalleryLabel: "Ver proyectos y capacidades",
      projectGalleryDescription:
        "Tipos de equipos, embalajes y operaciones internacionales similares a las que se preparan para compradores agrícolas.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Objeciones reales antes del pago",
      title: "Preguntas que conviene cerrar antes de comprar",
      intro:
        "Estas respuestas ordenan la conversación con Meridian y con su despachante en Paraguay.",
      entries: [
        {
          question: "¿Puedo importar una cosechadora con más de cinco años de antigüedad?",
          answer:
            "No bajo la Ley 7565/2025. El Artículo 4 fija una antigüedad máxima de cinco años contados desde el año de fabricación. La ley fue promulgada el 13 de noviembre de 2025; su reglamentación específica sigue en desarrollo, pero la edad límite aplica desde la promulgación.",
          category: "Paraguay",
        },
        {
          question: "¿Cómo funciona el tránsito por la Hidrovía Paraná-Paraguay?",
          answer:
            "La ruta normal es Costa Este o Houston de EE.UU. → Buenos Aires → Hidrovía → Asunción o Villeta, con un tránsito típico de 36 a 54 días. Las restricciones de calado cambian por resolución y por condiciones hidrométricas; antes de cotizar, Meridian confirma el calendario con la naviera y el operador fluvial.",
          category: "Paraguay",
        },
        {
          question: "¿Qué cubre Meridian y qué queda para mi despachante?",
          answer:
            "Meridian coordina compra asistida, retiro, desmontaje, embalaje, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva marítima hacia Buenos Aires. Su despachante o importador maneja el Registro de Importadores ante MIC, la Licencia Previa, la inspección final de SENAVE, DNIT, IVA, la Tasa de Conservación de la Biodiversidad y el despacho local.",
          category: "Paraguay",
        },
        {
          question: "¿Qué pasa si la unidad llega con tierra, restos vegetales o un odómetro manipulado?",
          answer:
            "El Artículo 7 de la Ley 7565/2025 obliga a que la unidad llegue limpia y certificada, con métodos como hidrolavado, vapor, aire forzado o aspirado, desmontando partes cuando sea necesario. SENAVE inspecciona en destino y puede exigir desmontaje y pruebas. La manipulación de motor u odómetro y las maquinarias con volcadura están prohibidas: no se trata de un sobrecosto, sino de un rechazo.",
          category: "Paraguay",
        },
        {
          question: "¿Conviene comprar en EE.UU. o en Brasil/Argentina?",
          answer:
            "Depende de la unidad. EE.UU. tiene profundidad en cosechadoras con cabezal draper, tractores de alta potencia con tecnología de precisión y paquetes completos. Brasil y Argentina son competitivos en precio cuando la configuración existe localmente. Con el filtro de cinco años, EE.UU. mantiene oferta de modelos 2021 en adelante.",
          category: "Paraguay",
        },
        {
          question: "¿Hay nuevos tributos asociados a la Ley 7565/2025?",
          answer:
            "Sí. La ley creó la Tasa para la Conservación de la Biodiversidad, escalada según antigüedad, tipo de motor, horas de uso, emisiones contaminantes y otros elementos potencialmente contaminantes. La determina SENAVE en cooperación con DNIT y la confirma su despachante para la unidad concreta.",
          category: "Paraguay",
        },
        {
          question: "¿Qué documentos necesita mi despachante antes de emitir la Licencia Previa?",
          answer:
            "Normalmente necesita datos completos de la unidad: marca, modelo, año de fabricación, número de serie, horas, país de origen, vendedor, factura o proforma, fotos, dimensiones, peso, accesorios incluidos, certificado fitosanitario de origen e inspección técnica cuando corresponda. Meridian prepara el paquete del lado de origen; su despachante confirma el formato final ante MIC, DNIT y SENAVE.",
          category: "Paraguay",
        },
        {
          question: "¿Qué pasa si la unidad tiene accesorios, cabezal o draper?",
          answer:
            "Se revisan como parte de la misma operación, pero no se tratan como un detalle menor. Cabezal, draper, neumáticos dobles, monitor, GPS, kits o repuestos cambian dimensiones, embalaje, documentación, fotos requeridas y, a veces, clasificación o tasas locales. Envíe la lista completa antes de cotizar.",
          category: "Paraguay",
        },
        {
          question: "¿También cotizan repuestos John Deere por separado?",
          answer:
            "Sí. Para repuestos, envíe número de parte, cantidad, fotos, urgencia, ubicación de origen y destino final. Meridian puede separar una cotización de repuestos de la maquinaria principal y comparar envío aéreo, consolidado o marítimo según peso, volumen y calendario.",
          category: "Paraguay",
        },
        {
          question: "¿La calculadora incluye DNIT, SENAVE o la Tasa de Biodiversidad?",
          answer:
            "No. La calculadora sirve como referencia del tramo logístico que Meridian puede coordinar. DNIT, SENAVE, Tasa de Conservación de la Biodiversidad, IVA, tasas portuarias, honorarios de despachante y despacho local se confirman en Paraguay con su despachante para la unidad concreta.",
          category: "Paraguay",
        },
      ],
    },
    officialSources: [
      {
        label: "Ley Nº 7565/2025 — BACN",
        href: "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados",
        description:
          "Texto oficial: cinco años máximo, registro de importadores, licencia previa, certificación, inspección y Tasa de Biodiversidad.",
      },
      {
        label: "DNIT — Dirección Nacional de Ingresos Tributarios",
        href: "https://www.dnit.gov.py/",
        description:
          "Autoridad aduanera y tributaria. Sucesora de la antigua ANA por Ley 7143/2023.",
      },
      {
        label: "SENAVE — Servicio Nacional de Calidad y Sanidad Vegetal",
        href: "https://www.senave.gov.py/",
        description:
          "Autoridad fitosanitaria. Verifica certificación, limpieza e inspección de la maquinaria importada.",
      },
      {
        label: "MIC — Ministerio de Industria y Comercio",
        href: "https://www.mic.gov.py/",
        description:
          "Administra el Registro de Importadores de Maquinarias Usadas y la Licencia Previa de Importación.",
      },
      {
        label: "Hidrovía Paraná-Paraguay — Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/paraguay-paraguay-parana-waterway-system",
        description:
          "Referencia comercial sobre el sistema fluvial paraguayo y su importancia para el transporte de carga.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para validar vendedor, máquina y paquete antes de comprometer fondos.",
      },
      {
        label: "Maquinaria agrícola",
        href: "/services/agricultural",
        description:
          "Alcance de embalaje, desmontaje y exportación para equipos agrícolas.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Referencia para el tramo internacional cuando la ruta está soportada.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Ejemplos de capacidad operativa y tipos de equipos manejados.",
      },
    ],
    cta: {
      heading: "¿Tiene una máquina vista en EE.UU. para Paraguay?",
      description:
        "Envíenos el link, año de fabricación, horas, ubicación y destino. Confirmamos si entra dentro de la Ley 7565/2025 y separamos el tramo Meridian del costo que confirma su despachante.",
      whatsappLabel: "Cotizar por WhatsApp",
      calculatorLabel: "Ver calculadora",
    },
    tracking: {
      heroWhatsapp: "paraguay_hero_whatsapp",
      heroCalculator: "paraguay_hero_calculator",
      finalWhatsapp: "paraguay_final_whatsapp",
      finalCalculator: "paraguay_final_calculator",
      equipmentLink: "paraguay_equipment_link",
      resourceLink: "paraguay_resource_link",
    },
    schema: {
      serviceType: "Exportación de maquinaria agrícola usada de EE.UU. a Paraguay",
      areaServed: "Paraguay",
      mentions: [
        "Asunción",
        "Villeta",
        "Alto Paraná",
        "Itapúa",
        "Ley 7565/2025",
        "Hidrovía Paraná-Paraguay",
        "SENAVE",
        "DNIT",
        "MIC",
      ],
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
      title: "Importar maquinaria agrícola usada de EE.UU. a Uruguay",
      description:
        "DGSA 98/016 exige limpieza y certificado fitosanitario. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. a Montevideo.",
      keywords: [
        "importar maquinaria agrícola usada de estados unidos a uruguay",
        "importar tractor usado desde usa a uruguay",
        "importar cosechadora usada estados unidos uruguay",
        "dgsa resolución 98/016 maquinaria agrícola usada uruguay",
        "tasa global arancelaria tga maquinaria agrícola uruguay",
        "decreto 426/011 bienes de capital uruguay",
        "certificado fitosanitario maquinaria usada montevideo",
        "envío maquinaria agrícola puerto de montevideo",
      ],
    },
    labels: sharedLabels,
    hero: {
      eyebrow: "Guía para compradores uruguayos",
      heading: "Importar maquinaria agrícola usada de EE.UU. a Uruguay",
      description:
        "Uruguay tiene una ruta marítima directa hacia Montevideo, pero la operación se gana antes del embarque: limpieza, desmontaje, certificado fitosanitario, documentación y coordinación clara con su despachante.",
      image: {
        src: "/images/project-jd-s670-port.jpg",
        alt: "Cosechadora John Deere en operación portuaria para exportación",
        caption: "Preparación y documentación antes del ingreso por Montevideo.",
      },
      highlights: [
        "Acceso oceánico directo a Montevideo: 14 a 18 días desde la Costa Este de EE.UU.",
        "Limpieza, certificado fitosanitario USDA APHIS o CFIA y reserva marítima coordinados desde EE.UU. y Canadá.",
        "Comparación honesta frente a la oferta brasileña y argentina: EE.UU. compite por configuración, no por norma.",
      ],
      primaryCtaLabel: "Cotizar por WhatsApp",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage: buildQualifiedWhatsappMessage("Uruguay"),
      scopeIncluded: [
        "Compra asistida y coordinación con vendedor en EE.UU. o Canadá (subasta, concesionario o privado).",
        "Retiro en origen, desmontaje técnico, etiquetado, embalaje y carga.",
        "Documentación de exportación, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Montevideo.",
      ],
      scopeExcluded: [
        "Despachante uruguayo (ADAU), DUA, clasificación NCM y trámites locales ante Aduana.",
        "TGA, IVA, recargo único cuando aplique, tasas portuarias y costos de inspección DGSA.",
        "Entrega interior desde Montevideo a campo o taller si no fue cotizada como alcance adicional.",
      ],
      scopeFootnote:
        "El control en Uruguay no está en la ruta marítima sino en la limpieza y la documentación. Esos puntos se cierran antes de que la unidad salga del vendedor.",
    },
    route: {
      eyebrow: "Acceso oceánico directo",
      title: "La ruta es simple; el control está en la preparación",
      intro:
        "A diferencia de Paraguay o Bolivia, Uruguay tiene un solo tramo internacional: del puerto de origen en EE.UU. al Puerto de Montevideo. Eso simplifica el calendario y la coordinación de naviera, pero traslada el riesgo a la preparación de la unidad y a la inspección DGSA al ingreso.",
      steps: [
        {
          title: "Costa Este de EE.UU. → Montevideo",
          description:
            "Tránsito marítimo de 14 a 18 días con servicios semanales o quincenales de Maersk, Hapag-Lloyd, CMA CGM, MSC y ZIM.",
        },
        {
          title: "Houston → Montevideo",
          description:
            "Ruta del Golfo: 20 a 25 días. Preferida cuando la unidad sale de Iowa o el Sur de las Llanuras.",
        },
        {
          title: "Preparación y certificación en origen",
          description:
            "Lavado interno y externo, certificado fitosanitario USDA APHIS o CFIA con declaración adicional sobre limpieza, embalaje de madera ISPM-15.",
        },
        {
          title: "Llegada a Puerto de Montevideo y despacho local",
          description:
            "Su despachante coordina DUA, NCM, TGA, IVA, inspección DGSA y retiro hacia Soriano, Colonia, Paysandú u otro destino interior.",
        },
      ],
      note:
        "Evite la ruta US West Coast → Montevideo (45 a 60 días) cuando la Costa Este o Houston están disponibles. La diferencia de tránsito y costo no compensa salvo casos puntuales.",
    },
    compliance: {
      eyebrow: "DGSA Resolución 98/016",
      title: "Limpieza, certificado e inspección antes de embarcar",
      intro:
        "La Resolución 98/016 de DGSA exige que la maquinaria agrícola, forestal o de jardinería usada que ingrese a Uruguay llegue limpia interna y externamente, libre de suelo, plagas y restos vegetales, con certificado fitosanitario de origen y sujeta a inspección. Aplica independientemente del régimen aduanero (importación, admisión temporaria, tránsito a zona franca o a depósitos fiscales).",
      required: [
        "Limpieza interna y externa por hidrolavado, vapor, aire forzado, aspirado u otro método aceptado, desmontando partes cuando corresponda.",
        "Certificado fitosanitario de origen (USDA APHIS para EE.UU., CFIA para Canadá) con declaración adicional sobre limpieza.",
        "Tratamiento fitosanitario en origen cuando aplique, con especificaciones en la sección correspondiente del certificado.",
        "Embalaje de madera ISPM-15 cuando se utilice.",
        "Datos completos de modelo, año, horas, condición, accesorios y vendedor antes de reservar flete.",
      ],
      brokerConfirmed: [
        "DUA (Documento Único Aduanero) ante DNA y clasificación NCM (BK Bienes de Capital cuando aplica).",
        "TGA 2% por Decreto 426/011 sobre bienes de capital BK con AEC mayor a 0%; IVA 22% estándar (reducido o exento para ciertos bienes agrícolas).",
        "Recargo único sobre tractores armados y maquinaria agrícola cuando aplique, confirmado por el despachante para la NCM concreta.",
        "Retiro del puerto, costos locales y cualquier acción adicional requerida por DGSA tras inspección.",
      ],
      avoid: [
        "Embarcar una unidad sin documentar la limpieza: si DGSA detecta suelo, restos o plagas en inspección, exige reexportación dentro de 30 días con la unidad bajo custodia.",
        "Asumir que la maquinaria de Mercosur (Brasil, Argentina, Paraguay) y la de EE.UU. tienen el mismo tratamiento arancelario: el origen EE.UU. no goza de preferencias Mercosur.",
        "Publicar un porcentaje de arancel sin validar NCM y régimen vigente con su despachante para la unidad concreta.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Categorías donde EE.UU. compite con Brasil y Argentina",
      title: "Cuándo conviene mirar Estados Unidos desde Uruguay",
      intro:
        "Brasil concentra cerca del 43% de las importaciones de maquinaria agrícola del Uruguay y EE.UU. el 18,4%. La oferta brasileña y argentina es competitiva en precio cuando la configuración existe localmente. EE.UU. cobra sentido cuando la configuración, la tecnología o la documentación justifican el flete adicional.",
      items: [
        {
          title: "Cosechadoras de alta capacidad",
          summary:
            "Cosechadoras 250-500 hp con cabezal draper, configuración de cultivos extensivos, tecnología de precisión.",
          reason:
            "El usado regional brasileño y argentino tiene profundidad de inventario, pero EE.UU. domina cuando se busca un cabezal draper específico o un paquete completo.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Tractores 200-400 hp",
          summary:
            "Tractores con doble tracción, cabina con tecnología de precisión, hidráulica de alta capacidad.",
          reason:
            "El comprador uruguayo ya está acostumbrado al usado brasileño; EE.UU. compite cuando la unidad tiene horas verificables y configuración exacta.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Sembradoras de precisión",
          summary:
            "Sembradoras con control por sección, monitoreo electrónico, dosificación variable, compatibilidad con tecnología de aplicación variable.",
          reason:
            "El equipamiento electrónico de fábrica es donde EE.UU. supera al usado regional; el flete se justifica cuando la siembra de soja u otros cultivos lo requiere.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Pulverizadoras autopropulsadas",
          summary:
            "Pulverizadoras con tecnología GPS, control automático de boquillas, configuración para campos grandes.",
          reason:
            "La oferta uruguaya local está creciendo, pero EE.UU. ofrece configuraciones específicas no siempre disponibles en mercados regionales.",
          href: "/equipment/sprayers",
          linkLabel: "Ver pulverizadoras",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Información mínima para no cotizar a ciegas",
      title: "Qué enviar por WhatsApp para revisar una unidad para Uruguay",
      intro:
        "Con una ficha completa podemos confirmar la limpieza, la documentación de origen y armar el alcance de exportación antes de comprometer fondos.",
      items: [
        "Link de subasta, concesionario o vendedor privado.",
        "Marca, modelo, año, horas de motor y número de serie si está disponible.",
        "Ubicación de retiro en EE.UU. o Canadá con código postal.",
        "Fotos de limpieza interior, ruedas u orugas, plataforma, accesorios y placa de identificación.",
        "Destino previsto: Montevideo o destino interior (Soriano, Colonia, Paysandú u otro departamento).",
        "Despachante asignado o nombre del importador en Uruguay.",
        "Fecha objetivo de embarque y si la operación responde a una campaña agrícola específica.",
      ],
    },
    processSteps: {
      eyebrow: "Cuatro decisiones antes de mover la unidad",
      title: "Cómo reducimos riesgo antes de embarcar a Montevideo",
      intro:
        "La preparación correcta empieza cuando se revisa la unidad, no cuando ya está en puerto.",
      steps: [
        {
          title: "Filtrar la unidad",
          description:
            "Validamos año, horas, condición, dimensiones, accesorios, vendedor y ubicación. Si la unidad presenta riesgo claro de inspección, lo marcamos antes de avanzar.",
        },
        {
          title: "Marcar requisitos DGSA",
          description:
            "Identificamos puntos concretos de limpieza, certificado, tratamiento o desmontaje que su despachante debe confirmar para la unidad.",
        },
        {
          title: "Coordinar tramo EE.UU. y Canadá",
          description:
            "Retiro, desmontaje, embalaje, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Montevideo.",
        },
        {
          title: "Cotizar con alcance separado",
          description:
            "El presupuesto separa el tramo Meridian del costo de despacho local. Sin esa separación, comparar con el usado brasileño o argentino se vuelve trampa.",
        },
      ],
    },
    credibility: {
      eyebrow: "Comparación honesta",
      title: "EE.UU. compite cuando la unidad correcta existe",
      intro:
        "Uruguay tiene alternativas regionales fuertes: Brasil con cerca del 43% de las importaciones agrícolas, Argentina próxima detrás. La búsqueda en EE.UU. funciona cuando la configuración, la tecnología, las horas o la documentación justifican el flete adicional. No se presenta como solución universal.",
      pillars: [
        {
          title: "Una sola contraparte en EE.UU. y Canadá",
          description:
            "Un equipo coordina vendedor, retiro, desmontaje, embalaje, certificado fitosanitario y reserva internacional.",
        },
        {
          title: "Disciplina sobre Resolución 98/016",
          description:
            "Limpieza, certificado, tratamiento e inspección se tratan como parte central de la compra, no como trámite posterior.",
        },
        {
          title: "Cotización por alcance, no por suposición",
          description:
            "El flete internacional se separa de TGA, IVA, despacho ADAU y costos locales que define su despachante.",
        },
      ],
      noteTitle: "Experiencia aplicada al caso",
      note:
        "Meridian ha coordinado más de 1.000 exportaciones a más de 40 países. Para Uruguay, la propuesta se arma con datos de la unidad, requisitos DGSA y ruta concreta a Montevideo, no con una tarifa genérica.",
      projectGalleryLabel: "Ver proyectos y capacidades",
      projectGalleryDescription:
        "Tipos de equipos, embalajes y operaciones internacionales similares a las que se preparan para compradores agrícolas.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Preguntas reales antes del embarque",
      title: "Cuestiones que conviene cerrar antes de comprar",
      intro:
        "Estas respuestas ordenan la conversación con Meridian y con su despachante en Uruguay.",
      entries: [
        {
          question: "¿Qué exige la Resolución DGSA 98/016?",
          answer:
            "La Resolución 98/016 exige que la unidad llegue limpia interna y externamente, libre de suelo, plagas y restos vegetales, con certificado fitosanitario de origen que incluya declaración adicional sobre limpieza. La inspección se realiza al ingreso, independientemente del régimen aduanero (importación, admisión temporaria, tránsito a zona franca o depósito fiscal).",
          category: "Uruguay",
        },
        {
          question: "¿Qué pasa si la máquina llega con tierra, restos vegetales o plagas?",
          answer:
            "DGSA puede exigir tratamiento fitosanitario adicional o, en casos de incumplimiento, reexportación dentro de 30 días con la unidad bajo condiciones de custodia. Por eso la limpieza, las fotos y la documentación se cierran antes de embarcar, no después.",
          category: "Uruguay",
        },
        {
          question: "¿Cuál es la diferencia entre cotización a Montevideo y costo nacionalizado?",
          answer:
            "La cotización a Montevideo cubre el tramo que Meridian coordina: compra asistida, retiro, desmontaje, embalaje, documentación de exportación, certificado fitosanitario y reserva marítima. El costo nacionalizado suma DUA, NCM, TGA, IVA, recargos, inspección DGSA, puerto, despachante y retiro local, y debe confirmarlo su despachante uruguayo.",
          category: "Uruguay",
        },
        {
          question: "¿Meridian entrega la maquinaria nacionalizada en Uruguay?",
          answer:
            "No como alcance estándar. Meridian coordina compra asistida, retiro, desmontaje, embalaje, documentación de exportación, certificado fitosanitario de origen y flete a Montevideo. La nacionalización, DUA, NCM, tributos, inspección DGSA, costos portuarios y entrega interior los confirma su despachante uruguayo.",
          category: "Uruguay",
        },
        {
          question: "¿Pueden coordinar limpieza/desmontaje antes del certificado fitosanitario?",
          answer:
            "Sí. La limpieza y el desmontaje se coordinan antes del certificado fitosanitario de origen para reducir el riesgo de observaciones en Uruguay. Si la unidad necesita hidrolavado, aire forzado, desmontaje de plataformas o tratamiento, se define antes de reservar flete.",
          category: "Uruguay",
        },
        {
          question: "¿Cuánto demora un envío puerta a Montevideo?",
          answer:
            "Costa Este de EE.UU. a Montevideo toma entre 14 y 18 días en operación normal con servicios semanales o quincenales de Maersk, Hapag-Lloyd, CMA CGM, MSC y ZIM. Houston suma 5 a 7 días adicionales. La Costa Oeste de EE.UU. (45 a 60 días) se evita salvo casos puntuales.",
          category: "Uruguay",
        },
        {
          question: "¿Por qué EE.UU. aparece como proveedor relevante para Uruguay?",
          answer:
            "En 2024, Brasil concentró cerca del 43% de las importaciones uruguayas de maquinaria agrícola y EE.UU. el 18,4%, en recuperación frente al año anterior. El dato sirve como señal de mercado, pero la decisión se toma por unidad concreta, configuración, horas, documentación y costo nacionalizado.",
          category: "Uruguay",
        },
        {
          question: "¿Cuándo conviene comprar en EE.UU. frente a Brasil o Argentina?",
          answer:
            "Conviene mirar EE.UU. cuando busca una configuración específica, horas verificables, tecnología de precisión, cabezal draper o paquete completo que no aparece en el usado regional. Brasil o Argentina pueden ser mejores si la unidad equivalente existe cerca y el costo nacionalizado total es menor.",
          category: "Uruguay",
        },
        {
          question: "¿Qué cubre Meridian y qué queda para mi despachante?",
          answer:
            "Meridian coordina compra asistida, retiro, desmontaje, embalaje, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Montevideo. Su despachante o importador maneja DUA, clasificación NCM, TGA 2% sobre bienes de capital BK por Decreto 426/011, IVA, recargo único cuando aplique, inspección DGSA y retiro local.",
          category: "Uruguay",
        },
        {
          question: "¿Qué arancel, TGA o impuestos aplican a maquinaria agrícola usada?",
          answer:
            "El origen EE.UU. no goza de preferencias Mercosur, así que paga el AEC. Para bienes de capital (BK) con AEC mayor a 0%, aplica TGA del 2% por Decreto 426/011. IVA estándar es 22%, con régimen reducido o exento para ciertos bienes agrícolas según NCM. La regla concreta para una unidad la confirma su despachante (ADAU).",
          category: "Uruguay",
        },
        {
          question: "¿También manejan repuestos John Deere?",
          answer:
            "Sí. Para repuestos John Deere, envíe número de parte, cantidad, fotos, urgencia, ubicación de origen y destino final. Meridian puede cotizar envío aéreo, consolidado o marítimo según peso, volumen y calendario.",
          category: "Uruguay",
        },
        {
          question: "¿Qué datos necesitan para cotizar una cosechadora o tractor?",
          answer:
            "Envíe link del anuncio, marca, modelo, año, horas, número de serie si está disponible, ubicación en EE.UU. o Canadá, fotos, accesorios incluidos, destino en Uruguay y datos del despachante si ya está definido. Con eso se revisan dimensiones, limpieza, documentación y ruta a Montevideo.",
          category: "Uruguay",
        },
      ],
    },
    officialSources: [
      {
        label: "Resolución Nº 98/016 (DGSA, MGAP)",
        href: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais",
        description:
          "Requisitos fitosanitarios para maquinaria, equipos e implementos agrícolas, forestales y de jardinería usados.",
      },
      {
        label: "DNA — Tasa Global Arancelaria (TGA)",
        href: "https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html",
        description:
          "Documento oficial de Aduanas sobre la TGA aplicada a bienes de capital BK con AEC mayor a 0%.",
      },
      {
        label: "DNA — Decreto 426/011",
        href: "https://www.aduanas.gub.uy/innovaportal/v/8915/3/innova.front/decreto-n%C2%B0-426_011.html",
        description:
          "Decreto que fija la TGA en 2% para bienes de capital y bienes de informática y telecomunicaciones.",
      },
      {
        label: "DGSA institucional (MGAP)",
        href: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/dgsa",
        description:
          "Dirección General de Servicios Agrícolas: autoridad fitosanitaria del Uruguay.",
      },
      {
        label: "Uruguay Agricultural Equipment — Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/uruguay-agricultural-equipment",
        description:
          "Guía comercial con datos de importaciones 2024, ranking de proveedores y demanda por maquinaria usada y reacondicionada.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para validar vendedor, máquina y paquete antes de comprometer fondos.",
      },
      {
        label: "Servicio agrícola",
        href: "/services/agricultural",
        description:
          "Alcance de preparación y exportación de maquinaria agrícola desde EE.UU. y Canadá.",
      },
      {
        label: "Embalaje de maquinaria",
        href: "/services/machinery-packing",
        description:
          "Referencia para desmontaje, protección y carga de equipos.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Referencia para el tramo internacional cuando la ruta está soportada.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Ejemplos de capacidad operativa y tipos de equipos manejados.",
      },
    ],
    cta: {
      heading: "¿Tiene una máquina vista en EE.UU. para Uruguay?",
      description:
        "Envíenos el link, año de fabricación, horas, ubicación y destino. Confirmamos limpieza y documentación, y separamos el tramo Meridian del costo que confirma su despachante.",
      whatsappLabel: "Cotizar por WhatsApp",
      calculatorLabel: "Calcular flete",
    },
    tracking: {
      heroWhatsapp: "uruguay_hero_whatsapp",
      heroCalculator: "uruguay_hero_calculator",
      finalWhatsapp: "uruguay_final_whatsapp",
      finalCalculator: "uruguay_final_calculator",
      equipmentLink: "uruguay_equipment_link",
      resourceLink: "uruguay_resource_link",
    },
    schema: {
      serviceType: "Exportación de maquinaria agrícola usada de EE.UU. a Uruguay",
      areaServed: "Uruguay",
      mentions: [
        "Montevideo",
        "Soriano",
        "Colonia",
        "Paysandú",
        "DGSA",
        "Resolución 98/016",
        "DNA",
        "MGAP",
        "ADAU",
        "Decreto 426/011",
        "TGA",
        "Mercosur",
      ],
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
      title: "Importar maquinaria agrícola usada de EE.UU. a Bolivia",
      description:
        "Broker boliviano confirma antigüedad, SENASAG y tributos. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. vía Arica.",
      keywords: [
        "importar maquinaria agrícola usada de estados unidos a bolivia",
        "importar tractor usado desde usa a bolivia",
        "importar cosechadora usada estados unidos bolivia",
        "antigüedad bienes de capital bolivia",
        "ley 1613 decreto supremo 5302 bienes de capital bolivia",
        "senasag permiso fitosanitario importación maquinaria",
        "arica iquique antofagasta tránsito bolivia maquinaria",
        "tratado 1904 chile bolivia tránsito mercancía",
        "aduana nacional padrón importadores bolivia",
      ],
    },
    labels: {
      ...sharedLabels,
      localSideConfirms: "Su broker/importador confirma en Bolivia",
      sourceLinks: "Documentos para revisar con su broker/importador",
    },
    hero: {
      eyebrow: "Guía para compradores bolivianos",
      heading: "Importar maquinaria agrícola usada de EE.UU. a Bolivia",
      description:
        "Para bienes de capital incluidos en regímenes de incentivo fiscal, la antigüedad puede ser determinante. Meridian coordina compra asistida, retiro, desmontaje, embalaje y flete internacional vía Arica, dejando explícito desde el primer mensaje qué confirma su broker o importador con SENASAG, Aduana Nacional y ASPB.",
      image: {
        src: "/images/project-jd-sprayer-port-crane.jpg",
        alt: "Pulverizadora agrícola cargada con grúa para exportación internacional",
        caption: "Ruta internacional, puerto de tránsito y destino interior definidos antes de mover la máquina.",
      },
      highlights: [
        "Antigüedad, año de fabricación y documentación revisados antes de coordinar compra o flete.",
        "Tránsito por Arica bajo el Tratado de 1904: 365 días de almacenaje libre, ASPB como agente de Bolivia en puerto chileno.",
        "Ruta Costa Oeste de EE.UU. → Arica en 12 a 16 días cuando el origen lo permite; Costa Este suma 22 a 28 días.",
      ],
      primaryCtaLabel: "Cotizar por WhatsApp",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage: buildQualifiedWhatsappMessage("Bolivia"),
      scopeIncluded: [
        "Compra asistida y coordinación con vendedor en EE.UU. o Canadá (subasta, concesionario o privado).",
        "Retiro en origen, desmontaje técnico, etiquetado, embalaje y carga.",
        "Documentación de exportación, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Arica, Iquique o Antofagasta.",
      ],
      scopeExcluded: [
        "Padrón de Importadores de la Aduana Nacional, permiso fitosanitario ante SENASAG cuando aplique y trámites locales en Bolivia.",
        "Tributos, aranceles NANDINA, IVA cuando aplique, costos de tránsito ASPB y despacho final.",
        "Tramo overland Arica → Santa Cruz, Cochabamba o La Paz si no fue cotizado como alcance adicional.",
      ],
      scopeFootnote:
        "Para Bolivia, el flete oceánico es solo una parte del costo. El destino interior, la antigüedad de la unidad y el broker o importador deben estar en la conversación desde el primer mensaje.",
    },
    route: {
      eyebrow: "Tránsito por Arica bajo el Tratado de 1904",
      title: "Bolivia es destino sin litoral: planee puerto de tránsito y tramo interior",
      intro:
        "El Tratado de 1904 entre Bolivia y Chile garantiza el libre tránsito de carga boliviana por Arica, Iquique y Antofagasta. ASPB (Administradora de Servicios Portuarios Bolivia) actúa como agente de Bolivia en territorio chileno y procesa la carga. Cada tramo cambia el calendario y el costo, así que la ruta se planifica desde el primer mensaje.",
      steps: [
        {
          title: "Costa Oeste de EE.UU. → Arica",
          description:
            "Tránsito marítimo de 12 a 16 días desde Los Ángeles, Long Beach u Oakland. Es la ruta más rápida cuando la unidad sale de la Costa Oeste.",
        },
        {
          title: "Costa Este o Houston → Arica",
          description:
            "Costa Este: 22 a 28 días con servicios Maersk, Hapag-Lloyd, CMA CGM y MSC. Houston suma hasta 30 días según naviera.",
        },
        {
          title: "Llegada a Arica + tránsito ASPB",
          description:
            "ASPB procesa la carga boliviana en territorio chileno: despacho de tránsito de 3 a 5 días. El Tratado de 1904 otorga 365 días de almacenaje libre para carga de importación.",
        },
        {
          title: "Arica → Santa Cruz overland",
          description:
            "Tramo terrestre de aproximadamente 1.650 km vía Tambo Quemado-Patacamaya-Cochabamba-Santa Cruz: 3 a 7 días. Su broker coordina transporte y despacho final.",
        },
      ],
      note:
        "Tránsito típico puerta a Santa Cruz: 30 a 40 días por Costa Este, 20 a 30 días por Costa Oeste. La ruta exacta depende del origen de la unidad, naviera disponible y agentes que coordina su importador en Bolivia.",
    },
    compliance: {
      eyebrow: "Incentivo 2025 + SENASAG",
      title: "Broker confirma antigüedad, IVA y permisos",
      intro:
        "Para bienes de capital incluidos en regímenes de incentivo fiscal, la antigüedad puede ser determinante. Su broker o importador debe confirmar si la unidad califica, qué documentación respalda el año de fabricación y qué tributos aplican si no entra en el régimen vigente. El Permiso Fitosanitario de Importación (PFI) de SENASAG debe revisarse por subpartida, producto, origen y condición de artículo reglamentado.",
      required: [
        "Año de fabricación, modelo, horas y documentos que permitan revisar si la unidad califica para el régimen aplicable.",
        "Documentación que respalde la antigüedad (factura, certificación) o, si no se cuenta con ella, declaración jurada del importador en formato Aduana Nacional.",
        "Certificado fitosanitario de origen (USDA APHIS para EE.UU., CFIA para Canadá).",
        "Permiso Fitosanitario de Importación (PFI) de SENASAG antes del embarque cuando aplique a la subpartida, producto, origen o condición de artículo reglamentado.",
        "Limpieza y datos completos de modelo, año, horas y condición antes de reservar flete.",
      ],
      brokerConfirmed: [
        "Inscripción en el Padrón de Importadores de la Aduana Nacional (registro online, sin trámite presencial).",
        "Clasificación NANDINA y aranceles aplicables a la unidad concreta (Capítulo 84 para maquinaria agrícola).",
        "Régimen tributario vigente: la exoneración de IVA por Ley 1613/2025 art. 8 cubrió enero a diciembre de 2025; para 2026, confirmar con su broker si fue prorrogada o si aplica un régimen distinto.",
        "Costos y responsabilidades del tramo Arica → destino boliviano (Santa Cruz, Cochabamba, La Paz u otro).",
      ],
      avoid: [
        "Comprar una unidad sin validar año de fabricación, documentación y régimen aplicable con su broker.",
        "Asumir que la exoneración de IVA por Ley 1613/2025 sigue vigente en 2026: cubrió únicamente el ejercicio 2025 y debe confirmarse para el año en curso.",
        "Convertir un beneficio tributario condicionado o una regla de incentivo fiscal en regla general de importación.",
        "Comprometer tramo overland Arica → Santa Cruz sin cotización confirmada por agentes y transportistas autorizados.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Demanda agrícola en Santa Cruz",
      title: "Equipos donde EE.UU. compite cuando la unidad califica",
      intro:
        "Santa Cruz concentra alrededor de 1,3 millones de hectáreas de soja sembrada en la campaña verano 2025/26 (datos ANAPO). La oferta de maquinaria agrícola en Bolivia se importa: EE.UU., China, Argentina y Brasil son los proveedores principales. La búsqueda se concentra en unidades con año, condición y documentación que su broker pueda respaldar.",
      items: [
        {
          title: "Tractores 200-400 hp",
          summary:
            "Tractores con doble tracción, cabina con tecnología de precisión, configuración para cultivos extensivos.",
          reason:
            "El comprador boliviano valida horas, configuración, año de fabricación y soporte de repuestos antes del flete; EE.UU. ofrece profundidad de inventario para comparar unidades concretas.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Cosechadoras de alta capacidad",
          summary:
            "Cosechadoras 250-500 hp con cabezal compatible con soja, maíz, sorgo o girasol; tecnología de precisión.",
          reason:
            "ANAPO coordina alrededor de 14.000 productores en Santa Cruz; el comprador frecuentemente busca configuraciones específicas no disponibles en el secundario regional.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras",
        },
        {
          title: "Sembradoras de precisión",
          summary:
            "Sembradoras con control por sección, monitoreo electrónico, dosificación variable y compatibilidad con tecnología de aplicación variable.",
          reason:
            "La rotación soja-maíz-sorgo-girasol exige flexibilidad de equipo; el equipamiento electrónico de fábrica de EE.UU. es difícil de igualar localmente.",
          href: "/equipment/planters",
          linkLabel: "Ver sembradoras",
        },
        {
          title: "Repuestos y componentes John Deere",
          summary:
            "Componentes de cosechadora, repuestos OEM y paquetes de piezas que pueden consolidarse aparte de la máquina principal.",
          reason:
            "Cuando la máquina ya está en Bolivia o el tiempo de campaña no permite esperar una unidad completa, una cotización separada de repuestos puede ser más útil que forzar una operación mayor.",
          href: "/projects",
          linkLabel: "Ver proyectos con repuestos",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Información mínima para no cotizar a ciegas",
      title: "Qué enviar por WhatsApp para revisar una unidad para Bolivia",
      intro:
        "Con una ficha completa podemos revisar año, documentación, ruta vía Arica y lo que su broker debe confirmar para SENASAG, Aduana y régimen tributario.",
      items: [
        "Link de subasta, concesionario o vendedor privado.",
        "Marca, modelo, año de fabricación y horas de motor.",
        "Ubicación de retiro en EE.UU. o Canadá con código postal.",
        "Fotos de limpieza interior, tren de rodaje, plataforma, accesorios y placa de identificación.",
        "Destino en Bolivia: Santa Cruz, Cochabamba, La Paz u otro punto.",
        "Si su broker o importador ya está registrado en el Padrón de Importadores de la Aduana Nacional.",
        "Si la operación incluye tramo overland Arica → destino boliviano o sólo termina en puerto de tránsito chileno.",
      ],
    },
    processSteps: {
      eyebrow: "Cuatro decisiones antes de mover la unidad",
      title: "Cómo ordenamos una compra para Bolivia",
      intro:
        "El orden importa. Primero filtramos por la regla, después armamos ruta y alcance.",
      steps: [
        {
          title: "Filtrar por antigüedad y origen",
          description:
            "Validamos año, horas, condición, dimensiones, accesorios, vendedor y ubicación. Si la antigüedad o la documentación puede impedir el régimen previsto, lo marcamos antes de avanzar.",
        },
        {
          title: "Marcar responsabilidades locales",
          description:
            "Listamos lo que confirma su broker o importador: Padrón de Importadores, permiso fitosanitario ante SENASAG cuando aplique, clasificación NANDINA, régimen tributario vigente y tramo Arica → destino.",
        },
        {
          title: "Coordinar tramo EE.UU. y Canadá",
          description:
            "Retiro, desmontaje, embalaje, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Arica, Iquique o Antofagasta.",
        },
        {
          title: "Cotizar con alcance separado",
          description:
            "El presupuesto separa el tramo Meridian del costo de despacho local y del tramo overland en Bolivia. Sin esa separación no hay comparación honesta.",
        },
      ],
    },
    credibility: {
      eyebrow: "Operación verificable",
      title: "Una propuesta que se sostiene con la unidad y la ruta concretas",
      intro:
        "Antes de transferir fondos, conviene tener un mapa simple: año y estado de la máquina, costo de retiro y embalaje, certificación de origen, reserva marítima a Arica y responsabilidades del broker o importador en Bolivia.",
      pillars: [
        {
          title: "Una sola contraparte en EE.UU. y Canadá",
          description:
            "Un equipo coordina vendedor, retiro, desmontaje, embalaje, documentos de exportación y reserva internacional a Arica.",
        },
        {
          title: "Disciplina sobre clasificación y antigüedad",
          description:
            "Año, clasificación NANDINA, documentación y régimen tributario se tratan como filtro de selección, no como sorpresa al final del proceso.",
        },
        {
          title: "Cotización por alcance, no por suposición",
          description:
            "El flete internacional se separa de SENASAG, Aduana, NANDINA, IVA y costos overland que define su broker.",
        },
      ],
      noteTitle: "Experiencia aplicada al caso",
      note:
        "Meridian ha coordinado más de 1.000 exportaciones a más de 40 países. Para Bolivia, la propuesta se arma con datos de la unidad, ruta vía Arica y validación concreta del broker, no con una tarifa genérica.",
      projectGalleryLabel: "Ver proyectos y capacidades",
      projectGalleryDescription:
        "Tipos de equipos, embalajes y operaciones internacionales similares a las que se preparan para compradores agrícolas.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Preguntas reales antes del embarque",
      title: "Cuestiones que conviene cerrar antes de comprar",
      intro:
        "Estas respuestas ordenan la conversación con Meridian y con su broker o importador en Bolivia.",
      entries: [
        {
          question: "¿Por qué Bolivia necesita una ruta especial?",
          answer:
            "Bolivia no tiene litoral marítimo. La maquinaria llega por un puerto de tránsito como Arica, Iquique o Antofagasta y luego continúa por tramo terrestre hacia Santa Cruz, Cochabamba, La Paz u otro destino. Esa combinación exige coordinar naviera, ASPB o agente de tránsito, broker/importador boliviano, SENASAG cuando aplique y transportista interior antes de comprar.",
          category: "Bolivia",
        },
        {
          question: "¿Qué debe confirmar mi broker antes de comprar?",
          answer:
            "Debe confirmar clasificación NANDINA, régimen tributario vigente, permiso SENASAG, Padrón de Importadores, documentación que respalda el año de fabricación y si la unidad califica para algún régimen de incentivo fiscal. Para bienes de capital incluidos en esos regímenes, la antigüedad puede ser determinante; si no califica, debe confirmar qué tributos aplican.",
          category: "Bolivia",
        },
        {
          question: "¿La regla de 10 años aplica a toda maquinaria agrícola usada?",
          answer:
            "No debe presentarse como límite universal de importación. La antigüedad de 10 años aparece en el marco de incentivos de 2025 para bienes de capital y plantas industriales: si una unidad no cumplía esa condición, no accedía a la exención y pagaba los tributos correspondientes. Para 2026, su broker debe confirmar el régimen aplicable y la documentación antes de comprar.",
          category: "Bolivia",
        },
        {
          question: "¿Cómo funciona el tránsito por Arica bajo el Tratado de 1904?",
          answer:
            "El Tratado de 1904 entre Bolivia y Chile garantiza el libre tránsito de carga boliviana por los puertos chilenos de Arica, Iquique y Antofagasta. ASPB (Administradora de Servicios Portuarios Bolivia) actúa como agente de Bolivia en territorio chileno y procesa la carga. La carga de importación tiene 365 días de almacenaje libre. El despacho de tránsito típico es de 3 a 5 días.",
          category: "Bolivia",
        },
        {
          question: "¿Qué pasó con la tasa cero/IVA de 2025?",
          answer:
            "La exoneración del Artículo 8 de la Ley 1613/2025 cubrió la importación y venta interna de bienes de capital y plantas industriales para los sectores agropecuario, industrial, construcción y minería del 1 de enero al 31 de diciembre de 2025. Para 2026, su broker o importador debe confirmar si fue prorrogada o si aplica un régimen tributario distinto antes del embarque.",
          category: "Bolivia",
        },
        {
          question: "¿Qué rol tiene SENASAG?",
          answer:
            "Debe confirmar si la subpartida, producto, origen o condición de artículo reglamentado requiere Permiso Fitosanitario de Importación (PFI) de SENASAG antes del embarque. El certificado fitosanitario de origen (USDA APHIS para EE.UU., CFIA para Canadá) acompaña el embarque cuando corresponde, y SENASAG puede verificar requisitos al ingreso.",
          category: "Bolivia",
        },
        {
          question: "¿Cuánto tarda una operación?",
          answer:
            "Costa Este de EE.UU. a Santa Cruz toma típicamente 30 a 40 días: 22 a 28 días Costa Este → Arica, 3 a 5 días tránsito ASPB en Arica, 3 a 7 días overland Arica → Santa Cruz por aproximadamente 1.650 km vía Tambo Quemado-Patacamaya-Cochabamba. La Costa Oeste de EE.UU. reduce el total a 20 a 30 días cuando el origen lo permite.",
          category: "Bolivia",
        },
        {
          question: "¿Qué cambia si el destino es Santa Cruz versus La Paz o Cochabamba?",
          answer:
            "Cambia el tramo terrestre, el transportista, el calendario y el costo local. Santa Cruz suele ser el destino agrícola principal; La Paz y Cochabamba pueden requerir otra planificación por ruta, altura, permisos, dimensiones y coordinación del broker. Por eso el destino final debe enviarse desde el primer mensaje.",
          category: "Bolivia",
        },
        {
          question: "¿Qué documentos ayudan a respaldar antigüedad y condición?",
          answer:
            "Factura o proforma, placa con número de serie, año/modelo, horas, fotos de la unidad, historial de mantenimiento si existe, ficha técnica, lista de accesorios y cualquier certificación del vendedor ayudan al broker a respaldar antigüedad, condición y clasificación antes de comprar.",
          category: "Bolivia",
        },
        {
          question: "¿Qué cubre Meridian y qué queda para mi broker o importador?",
          answer:
            "Meridian coordina compra asistida, retiro, desmontaje, embalaje, certificado fitosanitario USDA APHIS o CFIA y reserva marítima a Arica, Iquique o Antofagasta. Su broker o importador maneja el Padrón de Importadores ante Aduana Nacional, el permiso fitosanitario ante SENASAG cuando aplique, la clasificación NANDINA y régimen tributario vigente, el tránsito ASPB y el tramo overland al destino boliviano.",
          category: "Bolivia",
        },
        {
          question: "¿Meridian nacionaliza la maquinaria en Bolivia?",
          answer:
            "No como alcance estándar. Meridian coordina el tramo de origen y exportación: compra asistida, retiro, desmontaje, embalaje, documentación de exportación, certificado fitosanitario de origen cuando corresponde y reserva internacional. La nacionalización, tributos, SENASAG, Aduana Nacional, ASPB y tramo interior los confirma su broker o importador.",
          category: "Bolivia",
        },
        {
          question: "¿También manejan repuestos John Deere?",
          answer:
            "Sí. Para repuestos John Deere, envíe número de parte, cantidad, fotos, urgencia, ubicación de origen y destino final. Meridian puede separar la cotización de repuestos de la maquinaria principal y comparar envío aéreo, consolidado o marítimo según peso, volumen y calendario.",
          category: "Bolivia",
        },
      ],
    },
    officialSources: [
      {
        label: "Aduana Nacional de Bolivia",
        href: "https://www.aduana.gob.bo/",
        description:
          "Autoridad aduanera nacional. Mantiene el Padrón de Importadores y valida las declaraciones de importación.",
      },
      {
        label: "SENASAG",
        href: "https://www.senasag.gob.bo/",
        description:
          "Servicio Nacional de Sanidad Agropecuaria e Inocuidad Alimentaria. Emite el Permiso de Importación Fitosanitaria.",
      },
      {
        label: "Aduana Nacional — Ley 1613 y DS 5302",
        href: "https://www.aduana.gob.bo/node/1377518",
        description:
          "Referencia oficial del incentivo 2025 para bienes de capital y plantas industriales, con vigencia hasta el 31 de diciembre de 2025 y condición documental de antigüedad.",
      },
      {
        label: "SENASAG — Cuarentena Vegetal",
        href: "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal",
        description:
          "Área que establece control cuarentenario y emisión/seguimiento de Permisos Fitosanitarios para la Importación (PFI).",
      },
      {
        label: "Bolivia Agricultural Sectors — Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/bolivia-agricultural-sectors",
        description:
          "Guía comercial con datos sobre la producción agrícola, importaciones de maquinaria y proveedores principales.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para validar vendedor, máquina y documentos antes de comprometer fondos.",
      },
      {
        label: "Maquinaria agrícola",
        href: "/services/agricultural",
        description:
          "Alcance de exportación para equipos agrícolas desde EE.UU. y Canadá.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Referencia para el tramo internacional cuando la ruta está soportada.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Ejemplos de capacidad operativa, embalaje y componentes manejados.",
      },
      {
        label: "Contacto",
        href: "/contact",
        description:
          "Para enviar una consulta con datos de máquina, origen y destino.",
      },
    ],
    cta: {
      heading: "¿Tiene una máquina vista en EE.UU. para Bolivia?",
      description:
        "Envíenos el link, año de fabricación, horas, ubicación y destino. Revisamos el tramo Meridian, marcamos la ruta vía Arica y dejamos claro qué debe confirmar su broker antes de comprar.",
      whatsappLabel: "Cotizar por WhatsApp",
      calculatorLabel: "Calcular flete",
    },
    tracking: {
      heroWhatsapp: "bolivia_hero_whatsapp",
      heroCalculator: "bolivia_hero_calculator",
      finalWhatsapp: "bolivia_final_whatsapp",
      finalCalculator: "bolivia_final_calculator",
      equipmentLink: "bolivia_equipment_link",
      resourceLink: "bolivia_resource_link",
    },
    schema: {
      serviceType: "Exportación de maquinaria agrícola usada de EE.UU. a Bolivia",
      areaServed: "Bolivia",
      mentions: [
        "Santa Cruz",
        "Cochabamba",
        "La Paz",
        "Arica",
        "Iquique",
        "Antofagasta",
        "Ley 1613/2025",
        "Decreto Supremo 5302/2025",
        "Tratado de 1904",
        "SENASAG",
        "Aduana Nacional",
        "ASPB",
        "ANAPO",
        "Permiso Fitosanitario de Importación",
      ],
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
    },
  },
  {
    slug: "chile",
    country: "Chile",
    locale: "es-CL",
    path: "/es/destinations/chile",
    seo: {
      title: "Importar maquinaria agrícola usada de EE.UU. a Chile",
      description:
        "SAG exige maquinaria usada limpia y libre de suelo. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. a San Antonio.",
      keywords: [
        "importar maquinaria agrícola usada de estados unidos a chile",
        "importar tractor usado desde usa a chile",
        "importar cosechadora usada estados unidos chile",
        "sag maquinaria usada chile resolución 3103",
        "maquinaria agrícola usada san antonio chile",
        "certificado fitosanitario maquinaria usada chile",
        "despachante aduana maquinaria agrícola chile",
        "repuestos john deere chile desde estados unidos",
      ],
    },
    labels: {
      ...sharedLabels,
      localSideConfirms: "Su despachante confirma en Chile",
      sourceLinks: "Documentos para revisar con su despachante",
    },
    hero: {
      eyebrow: "Guía para compradores chilenos",
      heading: "Importar maquinaria agrícola usada de EE.UU. a Chile",
      description:
        "Chile tiene acceso marítimo directo por San Antonio y Valparaíso, pero la operación se define antes del embarque: limpieza SAG, revisión de documentación, dimensiones, embalaje y alcance claro con su despachante chileno.",
      image: {
        src: "/images/project-jd-hydraflex-header.jpg",
        alt: "Cabezal John Deere HydraFlex preparado para exportación a Chile",
        caption: "Cabezal HydraFlex enviado a Santiago, Chile, en flat rack por la ruta del Canal de Panamá.",
      },
      highlights: [
        "Ruta marítima a San Antonio o Valparaíso con puerto final confirmado por naviera, dimensiones y destino interior.",
        "SAG exige maquinaria usada limpia, sin suelo, restos vegetales ni plagas reglamentadas antes de ingresar.",
        "Alcance separado: Meridian coordina origen y exportación; su despachante confirma Aduana, SAG, tributos y retiro local.",
      ],
      primaryCtaLabel: "Cotizar por WhatsApp",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage: buildQualifiedWhatsappMessage("Chile"),
      scopeIncluded: [
        "Compra asistida y coordinación con vendedor en EE.UU. o Canadá (subasta, concesionario o privado).",
        "Retiro en origen, desmontaje técnico, etiquetado, embalaje, fotos de condición y carga.",
        "Documentación de exportación, soporte para revisión SAG y reserva marítima hacia San Antonio o Valparaíso.",
      ],
      scopeExcluded: [
        "Declaración de ingreso, clasificación arancelaria, tributos, IVA, acuerdos comerciales y honorarios del despachante.",
        "Inspección SAG en punto de ingreso, tratamientos, limpieza adicional o reembarque si la autoridad lo exige.",
        "Entrega interior desde puerto a Santiago, O'Higgins, Maule, Ñuble, Biobío, La Araucanía u otro destino si no fue cotizada.",
      ],
      scopeFootnote:
        "La cotización de Meridian ordena el tramo de origen y exportación. Los costos de nacionalización, inspección y retiro local se confirman en Chile con su despachante para la unidad concreta.",
    },
    route: {
      eyebrow: "San Antonio, Valparaíso y zona central",
      title: "La ruta es directa, pero el puerto se define por carga y destino",
      intro:
        "San Antonio concentra una parte clave del movimiento de contenedores de la macrozona central y sirve a Santiago y a los valles agrícolas del centro-sur. Valparaíso también puede ser opción según naviera, tipo de carga, calendario y destino interior. La decisión se toma por unidad, no por costumbre.",
      steps: [
        {
          title: "Origen en EE.UU. o Canadá → puerto de salida",
          description:
            "Validamos ubicación, dimensiones, peso, necesidad de desmontaje y si conviene 40HC, flat rack o carga consolidada antes de mover la unidad.",
        },
        {
          title: "Ruta marítima por Canal de Panamá",
          description:
            "Para salidas desde Costa Este o Golfo, el tránsito a San Antonio o Valparaíso suele planificarse por Panamá; el calendario final lo confirma la naviera.",
        },
        {
          title: "Ingreso por San Antonio o Valparaíso",
          description:
            "El puerto final depende de servicio disponible, terminal, tipo de contenedor, sobredimensión, costos locales y destino interior.",
        },
        {
          title: "SAG, Aduana y retiro interior",
          description:
            "Su despachante coordina vistos buenos, declaración, inspección SAG, pagos locales y retiro hacia la zona agrícola o taller.",
        },
      ],
      note:
        "La experiencia de Meridian incluye un cabezal John Deere HydraFlex enviado a Santiago, Chile, en flat rack en 32 días. Ese antecedente ayuda a dimensionar operaciones similares, pero cada unidad se cotiza con ruta y naviera confirmadas.",
    },
    compliance: {
      eyebrow: "SAG Resolución 3.103/2016",
      title: "Limpieza, inspección y responsabilidad local antes de embarcar",
      intro:
        "La Resolución 3.103/2016 de SAG regula la importación, admisión temporal y tránsito de maquinaria usada. La unidad debe llegar limpia, libre de suelo, restos vegetales y plagas reglamentadas; si no cumple, SAG puede aplicar medidas fitosanitarias y el importador asume costos o reembarque.",
      required: [
        "Limpieza interna y externa en origen por hidrolavado, vapor, aire forzado, aspirado u otro método adecuado, desmontando partes si es necesario.",
        "Maquinaria libre de suelo, restos vegetales y plagas reglamentadas antes de llegar al punto de ingreso.",
        "Embalaje de madera y material de acomodación alineado con regulaciones fitosanitarias aplicables.",
        "Fotos y datos de condición suficientes para revisar tren de rodaje, plataformas, tolvas, ruedas, orugas y puntos donde se acumula tierra.",
        "Inspección al arribo por inspectores SAG en el punto de ingreso.",
      ],
      brokerConfirmed: [
        "Declaración de ingreso ante Aduana y si corresponde usar despachante por el valor y carácter comercial de la operación.",
        "Clasificación arancelaria, derechos, IVA, acuerdos comerciales, recargos o exenciones aplicables a la unidad concreta.",
        "Vistos buenos sectoriales, coordinación SAG, costos portuarios y retiro local desde San Antonio o Valparaíso.",
        "Si la máquina requiere tratamiento, limpieza adicional, custodia o acción correctiva después de la inspección.",
      ],
      avoid: [
        "Embarcar una unidad con suelo, paja, semillas o restos vegetales visibles en ruedas, orugas, plataformas o tolvas.",
        "Asumir que un acuerdo comercial elimina todos los costos locales: Aduana, SAG, puerto y despachante se calculan por partida y operación.",
        "Cotizar entrega interior sin revisar permisos, dimensiones, sobreancho y transportista local.",
        "Comprar antes de validar si la unidad puede limpiarse y documentarse bien en origen.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Categorías donde EE.UU. puede competir",
      title: "Chile compra por configuración, tecnología y preparación",
      intro:
        "El mercado chileno es competitivo y no siempre favorece maquinaria grande. EE.UU. cobra sentido cuando el comprador busca configuración específica, tecnología de precisión, repuestos o un paquete que no aparece igual en proveedores regionales, europeos o chinos.",
      items: [
        {
          title: "Cabezales draper y plataformas",
          summary:
            "Cabezales John Deere, MacDon y plataformas que requieren embalaje rígido, cunas, protección de molinete y control de medidas.",
          reason:
            "Meridian ya preparó un cabezal HydraFlex hacia Santiago; este tipo de carga exige más cuidado de embalaje que una tarifa genérica.",
          href: "/equipment/combines",
          linkLabel: "Ver cosechadoras y cabezales",
        },
        {
          title: "Tractores con tecnología de precisión",
          summary:
            "Tractores 150-350 hp con autoguiado, hidráulica específica, cabina y compatibilidad con implementos.",
          reason:
            "Chile valora eficiencia, trazabilidad y reducción de costos; la unidad correcta debe justificar flete y nacionalización.",
          href: "/equipment/tractors",
          linkLabel: "Ver tractores",
        },
        {
          title: "Pulverizadoras y equipos de aplicación",
          summary:
            "Pulverizadoras autopropulsadas o equipos de aplicación con control de secciones, GPS y documentación clara.",
          reason:
            "La demanda por automatización y uso eficiente de insumos hace relevante revisar tecnología, estado y soporte antes de comprar.",
          href: "/equipment/sprayers",
          linkLabel: "Ver pulverizadoras",
        },
        {
          title: "Repuestos y componentes John Deere",
          summary:
            "Partes OEM, componentes de cabezal, tren de alimentación, electrónica y paquetes consolidados para taller.",
          reason:
            "Cuando la máquina ya está en Chile, una cotización de repuestos puede resolver la urgencia sin mover una unidad completa.",
          href: "/projects",
          linkLabel: "Ver proyectos y componentes",
        },
      ],
    },
    sendUsThis: {
      eyebrow: "Información mínima para no cotizar a ciegas",
      title: "Qué enviar por WhatsApp para revisar una unidad para Chile",
      intro:
        "Con una ficha completa podemos revisar ruta, limpieza, dimensiones y lo que su despachante debe confirmar con SAG y Aduana antes de comprar.",
      items: [
        "Link de subasta, concesionario o vendedor privado.",
        "Marca, modelo, año, horas y número de serie si está disponible.",
        "Ubicación de retiro en EE.UU. o Canadá con código postal.",
        "Fotos de ruedas, orugas, tolvas, cabezal, plataforma, interior, tren de rodaje y zonas con posible acumulación de suelo.",
        "Destino en Chile: Santiago, O'Higgins, Maule, Ñuble, Biobío, La Araucanía, Los Lagos u otro punto.",
        "Si ya tiene despachante chileno y puerto preferido (San Antonio o Valparaíso).",
        "Lista de accesorios, cabezales, repuestos o componentes que viajan junto con la unidad.",
      ],
    },
    processSteps: {
      eyebrow: "Cuatro decisiones antes de mover la unidad",
      title: "Cómo ordenamos una compra hacia Chile",
      intro:
        "La secuencia correcta reduce riesgo: primero unidad y limpieza, después puerto, documentación y alcance local.",
      steps: [
        {
          title: "Validar unidad y limpieza posible",
          description:
            "Revisamos condición, dimensiones, accesorios y zonas de acumulación de suelo. Si la unidad no puede limpiarse bien en origen, lo marcamos antes de reservar flete.",
        },
        {
          title: "Definir puerto y contenedor",
          description:
            "Comparamos San Antonio, Valparaíso, 40HC, flat rack o consolidado según medidas, peso, calendario y destino interior.",
        },
        {
          title: "Separar responsabilidades",
          description:
            "Meridian toma el tramo de origen y exportación; su despachante confirma Aduana, SAG, tributos, vistos buenos y retiro local.",
        },
        {
          title: "Cotizar con alcance cerrado",
          description:
            "El presupuesto separa compra asistida, retiro, desmontaje, embalaje, documentación y flete internacional de los costos que se pagan en Chile.",
        },
      ],
    },
    credibility: {
      eyebrow: "Operación verificable",
      title: "Chile necesita preparación, no una promesa de precio",
      intro:
        "Antes de transferir fondos, conviene tener un mapa simple: estado de la máquina, limpieza posible, dimensiones, costo de retiro y embalaje, puerto confirmado y responsabilidades del despachante chileno.",
      pillars: [
        {
          title: "Experiencia real hacia Chile",
          description:
            "Meridian preparó y movió un cabezal John Deere HydraFlex hacia Santiago en flat rack, con cunas de madera y bloqueo de componentes.",
        },
        {
          title: "Disciplina sobre SAG",
          description:
            "La limpieza se trata como parte central de la compra. Suelo o restos vegetales no son un detalle operativo: pueden cambiar el resultado al ingreso.",
        },
        {
          title: "Cotización por alcance, no por suposición",
          description:
            "El flete internacional se separa de Aduana, SAG, puerto, despachante y retiro interior definidos en Chile.",
        },
      ],
      noteTitle: "Experiencia aplicada al caso",
      note:
        "Meridian ha coordinado más de 1.000 exportaciones a más de 40 países. Para Chile, la propuesta se arma con datos de la unidad, ruta San Antonio o Valparaíso y revisión SAG, no con una tarifa genérica.",
      projectGalleryLabel: "Ver proyectos y capacidades",
      projectGalleryDescription:
        "Incluye el caso del cabezal HydraFlex enviado a Santiago y otros ejemplos de embalaje, flat rack, contenedores y repuestos.",
      projectGalleryHref: "/projects",
    },
    faq: {
      eyebrow: "Preguntas reales antes del embarque",
      title: "Cuestiones que conviene cerrar antes de comprar",
      intro:
        "Estas respuestas ordenan la conversación con Meridian y con su despachante en Chile.",
      entries: [
        {
          question: "¿Qué exige SAG para maquinaria usada que entra a Chile?",
          answer:
            "SAG exige que la maquinaria usada llegue limpia, libre de suelo, restos vegetales y plagas reglamentadas. La limpieza debe hacerse en origen con hidrolavado, vapor, aire forzado, aspirado u otro método adecuado, desmontando partes si es necesario. La unidad queda sujeta a inspección en el punto de ingreso.",
          category: "Chile",
        },
        {
          question: "¿Qué pasa si SAG encuentra suelo, restos vegetales o plagas?",
          answer:
            "SAG puede aplicar medidas fitosanitarias según el riesgo detectado. La normativa indica que el importador asume los costos por medidas exigidas y el reembarque si la maquinaria usada es rechazada. Por eso se revisan fotos, limpieza y puntos de acumulación antes de embarcar.",
          category: "Chile",
        },
        {
          question: "¿La cotización incluye nacionalización en Chile?",
          answer:
            "No como alcance estándar. Meridian coordina compra asistida, retiro, desmontaje, embalaje, documentación de exportación y flete internacional. Su despachante chileno confirma declaración de ingreso, clasificación, derechos, IVA, SAG, costos portuarios y retiro local.",
          category: "Chile",
        },
        {
          question: "¿San Antonio es siempre el puerto correcto?",
          answer:
            "No siempre. San Antonio es el puerto principal para mucha carga de la macrozona central, pero Valparaíso puede ser mejor según naviera, terminal, tipo de contenedor, medidas, calendario y destino interior. La ruta se define después de revisar la unidad.",
          category: "Chile",
        },
        {
          question: "¿Cuánto demora un envío a San Antonio?",
          answer:
            "Depende del origen, puerto de salida, tipo de carga y naviera. Como referencia interna, Meridian envió un cabezal John Deere HydraFlex a Santiago en flat rack en 32 días por la ruta del Canal de Panamá. Para una unidad nueva se confirma el tránsito con la naviera antes de cotizar.",
          category: "Chile",
        },
        {
          question: "¿Qué debe confirmar mi despachante antes de comprar?",
          answer:
            "Debe confirmar clasificación arancelaria, documentos requeridos, derechos, IVA, posibles beneficios de origen, recargos o restricciones para maquinaria usada, coordinación SAG, costos portuarios y retiro desde San Antonio o Valparaíso. También debe revisar si hacen falta vistos buenos sectoriales adicionales.",
          category: "Chile",
        },
        {
          question: "¿El TLC EE.UU.-Chile elimina todos los costos?",
          answer:
            "No conviene asumirlo. Un acuerdo comercial puede afectar derechos para una partida y origen concretos, pero no elimina por sí solo IVA, costos portuarios, honorarios del despachante, inspección SAG, transporte interior ni eventuales medidas fitosanitarias. Eso se confirma por unidad.",
          category: "Chile",
        },
        {
          question: "¿Conviene comprar en EE.UU. frente a proveedores europeos o chinos?",
          answer:
            "Depende de la unidad. Trade.gov describe un mercado chileno competitivo donde EE.UU. no es el proveedor dominante por volumen, pero sí puede competir por tecnología, calidad, confiabilidad, precisión y configuración específica. La comparación real se hace contra una máquina concreta y su costo puesto en puerto.",
          category: "Chile",
        },
        {
          question: "¿También manejan repuestos John Deere?",
          answer:
            "Sí. Para repuestos John Deere, envíe número de parte, cantidad, fotos, urgencia, ubicación de origen y destino final. Meridian puede separar la cotización de repuestos de la maquinaria principal y comparar envío aéreo, consolidado o marítimo según peso, volumen y calendario.",
          category: "Chile",
        },
        {
          question: "¿Qué datos necesitan para revisar una unidad?",
          answer:
            "Envíe link del anuncio, marca, modelo, año, horas, número de serie si está disponible, ubicación en EE.UU. o Canadá, fotos de limpieza y tren de rodaje, accesorios incluidos, destino en Chile, puerto preferido y datos del despachante si ya está definido.",
          category: "Chile",
        },
      ],
    },
    officialSources: [
      {
        label: "SAG — Resolución 3.103/2016",
        href: "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725",
        description:
          "Requisitos fitosanitarios para importación, admisión temporal y tránsito de maquinaria usada.",
      },
      {
        label: "Servicio Nacional de Aduanas — importación e impuestos",
        href: "https://www.aduana.cl/viajeros-internacionales/aduana/2007-02-28/143620.html",
        description:
          "Referencia oficial sobre derechos, IVA, límites de declaración simplificada y uso de despachador de aduanas.",
      },
      {
        label: "Puerto San Antonio — operación portuaria",
        href: "https://www.puertosanantonio.com/operacion-portuaria",
        description:
          "Sistema portuario, terminales concesionados y participación en contenedores de la macrozona central.",
      },
      {
        label: "Chile Agricultural Equipment — Trade.gov",
        href: "https://www.trade.gov/country-commercial-guides/chile-agricultural-equipment",
        description:
          "Guía comercial sobre mercado chileno de maquinaria agrícola, proveedores y oportunidades de tecnología.",
      },
      {
        label: "SAG",
        href: "https://www.sag.gob.cl/",
        description:
          "Servicio Agrícola y Ganadero: autoridad fitosanitaria que inspecciona maquinaria usada al ingreso.",
      },
    ],
    resourceLinks: [
      {
        label: "Compra asistida",
        href: "/services/equipment-sales",
        description:
          "Para validar vendedor, máquina y documentación antes de comprometer fondos.",
      },
      {
        label: "Maquinaria agrícola",
        href: "/services/agricultural",
        description:
          "Alcance de preparación y exportación de equipos agrícolas desde EE.UU. y Canadá.",
      },
      {
        label: "Calculadora de flete",
        href: "/pricing/calculator",
        description:
          "Referencia para el tramo internacional cuando la ruta está soportada.",
      },
      {
        label: "Proyectos",
        href: "/projects",
        description:
          "Ejemplos de capacidad operativa, embalaje, flat rack, contenedores y repuestos.",
      },
    ],
    cta: {
      heading: "¿Tiene una máquina vista en EE.UU. para Chile?",
      description:
        "Envíenos el link, año, horas, ubicación, fotos de limpieza y destino. Revisamos ruta, SAG, embalaje y alcance antes de que comprometa fondos.",
      whatsappLabel: "Cotizar por WhatsApp",
      calculatorLabel: "Calcular flete",
    },
    tracking: {
      heroWhatsapp: "chile_hero_whatsapp",
      heroCalculator: "chile_hero_calculator",
      finalWhatsapp: "chile_final_whatsapp",
      finalCalculator: "chile_final_calculator",
      equipmentLink: "chile_equipment_link",
      resourceLink: "chile_resource_link",
    },
    schema: {
      serviceType: "Exportación de maquinaria agrícola usada de EE.UU. a Chile",
      areaServed: "Chile",
      mentions: [
        "San Antonio",
        "Valparaíso",
        "Santiago",
        "O'Higgins",
        "Maule",
        "Ñuble",
        "Biobío",
        "La Araucanía",
        "SAG",
        "Resolución 3.103/2016",
        "Servicio Nacional de Aduanas",
      ],
      datePublished: "2026-05-12",
      dateModified: "2026-05-12",
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
