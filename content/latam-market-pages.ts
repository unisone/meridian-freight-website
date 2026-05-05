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

export const latamMarketPages: LatamMarketPageContent[] = [
  {
    slug: "paraguay",
    country: "Paraguay",
    locale: "es-PY",
    path: "/es/destinations/paraguay",
    seo: {
      title: "Importar maquinaria agrícola usada de EE.UU. a Paraguay",
      description:
        "La Ley 7565/2025 fija máximo de 5 años para maquinaria agrícola usada en Paraguay. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. y Canadá.",
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
        "Tránsito por la Hidrovía Paraná-Paraguay con visibilidad sobre las restricciones de calado vigentes 2025/26.",
      ],
      primaryCtaLabel: "Cotizar por WhatsApp",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage:
        "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Paraguay y necesito una cotización orientativa.",
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
            "Tramo fluvial de 10 a 15 días en operación normal. Con la bajante actual del río Paraguay (calado restringido a 8-9 pies frente a 10-12 normales), planificar entre 5 y 15 días adicionales según el corredor.",
        },
        {
          title: "Llegada a terminal y despacho",
          description:
            "Puerto Villeta (concesión PTP Group) es la terminal principal de contenedores; Asunción opera volúmenes menores. Su despachante coordina DNIT, SENAVE, Licencia Previa y entrega interior.",
        },
      ],
      note:
        "La bajante 2025/2026 mantiene capacidad por barcaza alrededor del 75% del máximo y, según pronósticos, se extenderá hasta febrero o marzo de 2026. Cotizamos con el calendario actualizado de la naviera y del operador fluvial, no con uno teórico.",
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
          question: "¿Cómo funciona el tránsito por la Hidrovía Paraná-Paraguay en 2026?",
          answer:
            "La ruta normal es Costa Este o Houston de EE.UU. → Buenos Aires → Hidrovía → Asunción o Villeta, con un tránsito típico de 36 a 54 días. La bajante actual del río Paraguay limita el calado a 8-9 pies (frente a 10-12 normales) y reduce la capacidad por barcaza alrededor del 25%. Las previsiones indican que la bajante puede mantenerse hasta febrero o marzo de 2026.",
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
        "El mejor momento para corregir limpieza, fotos, documentos y dimensiones es antes de que la maquina salga del vendedor.",
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
          title: "Coordinacion con el despachante",
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
      eyebrow: "Compra selectiva",
      title: "EE.UU. vale la pena cuando la unidad justifica el flete",
      intro:
        "Uruguay tiene alternativas regionales fuertes. La busqueda en EE.UU. debe concentrarse en unidades donde configuracion, horas, estado, tecnologia o documentacion compensan el costo logistico.",
      pillars: [
        {
          title: "Preparacion visible",
          description:
            "Fotos, desmontaje, embalaje y documentacion ayudan al comprador y al despachante a revisar la operacion.",
        },
        {
          title: "DGSA en el centro",
          description:
            "Limpieza, certificado, tratamiento e inspeccion se tratan como parte de la compra, no como tramite posterior.",
        },
        {
          title: "Comparacion honesta",
          description:
            "EE.UU. no se presenta como siempre mas barato; se presenta como opcion fuerte cuando la unidad correcta existe.",
        },
      ],
      noteTitle: "Como trabajamos con Uruguay",
      note:
        "Meridian revisa vendedor, maquina, ubicacion, preparacion y flete internacional. El comprador mantiene NCM, tributos y despacho local con su despachante uruguayo.",
      projectGalleryLabel: "Ver capacidades",
      projectGalleryDescription:
        "Revise equipos, embalajes y operaciones internacionales que ayudan a dimensionar el trabajo logistico.",
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
            "Puede requerir acciones adicionales y, en casos de incumplimiento, rechazo o reexportacion. Por eso las fotos, la limpieza y la preparacion antes de embarcar importan.",
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
      heading: "Maquinaria agricola usada de EE.UU. a Bolivia con ruta definida",
      description:
        "Para compradores en Santa Cruz y otras zonas agricolas, Meridian revisa la unidad en EE.UU., coordina retiro, preparacion, embalaje y flete internacional, y entrega la informacion que su broker/importador necesita para confirmar permisos, tributos y destino interior.",
      image: {
        src: "/images/project-jd-sprayer-port-crane.jpg",
        alt: "Pulverizadora agricola cargada con grua para exportacion internacional",
        caption: "Ruta internacional, puerto de transito y destino interior definidos antes de mover la maquina.",
      },
      highlights: [
        "Enfocada en Santa Cruz y compradores que buscan tractores, cosechadoras, sembradoras y equipos de precision.",
        "SENASAG, Aduana, incentivos y antiguedad se revisan con el broker/importador antes de embarcar.",
        "La ruta se arma considerando puerto de transito, dimensiones, documentos y destino interior.",
      ],
      primaryCtaLabel: "Revisar ruta y elegibilidad",
      secondaryCtaLabel: "Calcular flete estimado",
      whatsappMessage:
        "Hola. Estoy evaluando importar maquinaria agricola usada desde EE.UU. a Bolivia. Quiero revisar ruta, ano, documentacion, destino y que debe confirmar mi broker/importador.",
      scopeIncluded: [
        "Revision de maquina, vendedor, ano, horas, ubicacion y dimensiones.",
        "Coordinacion de retiro, preparacion, embalaje, documentacion de exportacion y reserva internacional.",
        "Resumen de datos para que el broker/importador boliviano confirme permisos, tributos y despacho.",
      ],
      scopeExcluded: [
        "Confirmacion final de SENASAG, Aduana Nacional, tributos, incentivos y despacho local.",
        "Entrega interior en Bolivia si no fue aprobada como parte del alcance cotizado.",
        "Decision final sobre beneficios tributarios, antiguedad aplicable o clasificacion aduanera.",
      ],
      scopeFootnote:
        "Para Bolivia, el flete oceanico es solo una parte del costo. El destino interior y el broker/importador deben estar en la conversacion desde el primer mensaje.",
    },
    route: {
      eyebrow: "Destino sin litoral",
      title: "Bolivia requiere pensar en puerto de transito y destino interior",
      intro:
        "La ruta hacia Bolivia combina retiro en Norteamerica, flete internacional, puerto de transito y tramo posterior hacia el destino final. Cada parte cambia el costo y la responsabilidad de la operacion.",
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
            "El puerto de transito y el tramo posterior se coordinan con agentes y broker antes de cerrar el costo final.",
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
      title: "Lo que debe quedar confirmado antes de embarcar a Bolivia",
      intro:
        "Bolivia importa maquinaria agricola y concentra gran parte de su agricultura comercial en Santa Cruz. Para una compra usada, el comprador debe confirmar por unidad la clasificacion, permisos, tributos, incentivos y documentos con su broker/importador.",
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
        "Asumir exencion de IVA o incentivo vigente sin confirmacion 2026.",
        "Comprar una unidad sin validar importador, ruta y destino interior.",
      ],
    },
    equipmentFocus: {
      eyebrow: "Demanda agricola en Santa Cruz",
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
        "Con estos datos podemos revisar si la unidad merece avanzar, como saldria de EE.UU. y que debe confirmar el broker/importador antes del embarque.",
      items: [
        "Link de concesionario, subasta o vendedor.",
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
            "Listamos lo que debe confirmar el broker/importador: SENASAG, Aduana, tributos, incentivo y destino interior.",
        },
        {
          title: "Armar ruta internacional",
          description:
            "Cotizamos retiro, preparacion, embalaje, documentos y reserva segun alcance aprobado.",
        },
        {
          title: "Definir la entrega operativa en Bolivia",
          description:
            "Queda definido donde termina Meridian y que debe cerrar el equipo local antes de nacionalizar.",
        },
      ],
    },
    credibility: {
      eyebrow: "Ruta antes que impulso",
      title: "Bolivia exige claridad desde el primer mensaje",
      intro:
        "Una buena compra en EE.UU. solo funciona si la maquina, la ruta de transito y el destino boliviano se revisan juntos. El objetivo es evitar compras que parezcan atractivas en origen pero fallen por documentos, dimensiones o costo interior.",
      pillars: [
        {
          title: "Santa Cruz en el centro",
          description:
            "El flujo esta pensado para compradores agricolas que miran tractores, cosechadoras, sembradoras y tecnologia para produccion extensiva.",
        },
        {
          title: "Permisos definidos",
          description:
            "SENASAG, Aduana, tributos e incentivos se tratan como puntos de decision del importador, no como supuestos de venta.",
        },
        {
          title: "Entrega operativa clara",
          description:
            "Meridian coordina el lado EE.UU. y exportacion; el tramo boliviano se confirma con el equipo local del comprador.",
        },
      ],
      noteTitle: "Que aporta Meridian",
      note:
        "Meridian aporta revision de unidad, coordinacion con vendedor, retiro, preparacion, embalaje y flete internacional, con informacion util para que el importador cierre el despacho local.",
      projectGalleryLabel: "Ver proyectos y servicios",
      projectGalleryDescription:
        "Revise tipos de equipos, embalajes y operaciones internacionales para dimensionar el trabajo logistico.",
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
            "SENASAG es autoridad relevante en sanidad vegetal y documentacion fitosanitaria, pero el tramite especifico depende del producto, condicion y operacion. Su broker/importador debe confirmarlo para la unidad concreta.",
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
