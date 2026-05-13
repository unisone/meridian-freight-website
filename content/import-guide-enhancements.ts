/**
 * LATAM import-guide enhancement data.
 *
 * Each guide page renders five structured modules driven by this data:
 *  1. Quick answer (skimmable row of pre-purchase steps)
 *  2. Scope split (Meridian coordinates / local broker confirms)
 *  3. Route table (per country)
 *  4. Buyer packet (sidebar CTA card with WhatsApp prefill)
 *  5. Country-specific CTA
 *
 * Only the five currently-published LATAM guides are covered (Paraguay,
 * Argentina, Uruguay, Bolivia, Chile). Adding a new country requires both
 * a blog post in `content/blog.ts`/`blog-es.ts` AND a matching entry here.
 */
import { CONTACT } from "@/lib/constants";

export type ImportGuideLocale = "en" | "es";

export interface ImportGuideQuickStep {
  title: string;
  description: string;
}

export interface ImportGuideScopeRow {
  checkpoint: string;
  confirmedBy: "meridian" | "broker";
  meridianNote: string;
  brokerNote: string;
}

export interface ImportGuideRouteRow {
  route: string;
  bestFor: string;
  buyerConfirms: string;
}

export interface ImportGuideCta {
  heading: string;
  description: string;
  primaryLabel: string;
  whatsappMessage: string;
}

export interface ImportGuideEnhancement {
  slug: string;
  country: string;
  countryLabel: string;
  scopeIntro: string;
  quickAnswer: {
    eyebrow: string;
    heading: string;
    description: string;
    steps: ImportGuideQuickStep[];
  };
  scopeSplit: {
    heading: string;
    description: string;
    meridianHeading: string;
    brokerHeading: string;
    rows: ImportGuideScopeRow[];
  };
  routeTable: {
    heading: string;
    description: string;
    columnRoute: string;
    columnBestFor: string;
    columnBuyerConfirms: string;
    rows: ImportGuideRouteRow[];
  };
  buyerPacket: {
    heading: string;
    description: string;
    items: string[];
    secondaryLabel: string;
  };
  cta: ImportGuideCta;
  sourcesHeading: string;
}

export const LATAM_IMPORT_GUIDE_SLUGS = [
  "import-farm-machinery-united-states-paraguay",
  "import-farm-machinery-united-states-argentina",
  "import-farm-machinery-united-states-uruguay",
  "import-farm-machinery-united-states-bolivia",
  "import-farm-machinery-united-states-chile",
] as const;

export type LatamImportGuideSlug = (typeof LATAM_IMPORT_GUIDE_SLUGS)[number];

export function isLatamImportGuideSlug(slug: string): slug is LatamImportGuideSlug {
  return (LATAM_IMPORT_GUIDE_SLUGS as readonly string[]).includes(slug);
}

const PHONE_DIGITS = CONTACT.phoneRaw.replace(/^\+/, "");

export function buildWhatsappUrl(prefillMessage: string): string {
  return `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(prefillMessage)}`;
}

// ─── Spanish enhancements ───────────────────────────────────────────────────

const paraguayEs: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-paraguay",
  country: "paraguay",
  countryLabel: "Paraguay",
  scopeIntro:
    "Meridian coordina el tramo de exportación desde EE.UU./Canadá; su importador o despachante paraguayo confirma la importación, Ley 7565/2025, DNIT, SENAVE, tributos y entrega final.",
  quickAnswer: {
    eyebrow: "Respuesta rápida",
    heading: "Qué confirmar antes de comprar",
    description:
      "Cuando la unidad, la ruta, los documentos y la responsabilidad local están claros antes de transferir fondos, importar maquinaria usada a Paraguay se vuelve manejable.",
    steps: [
      {
        title: "Envíe la máquina antes de comprar",
        description:
          "Link del anuncio, marca, modelo, año, número de serie, horas, fotos, ZIP de retiro y destino paraguayo.",
      },
      {
        title: "Revise Ley 7565/2025",
        description:
          "Límite de cinco años, limpieza, fitosanitario, DNIT, SENAVE y preparación del despachante paraguayo.",
      },
      {
        title: "Confirme limpieza y documentos",
        description:
          "Tierra, restos vegetales, plagas, certificados y serie deben estar en orden antes del embarque.",
      },
      {
        title: "Elija el punto de entrega",
        description:
          "Asunción/Villeta, Paranaguá o Montevideo son modelos de responsabilidad distintos, no solo rutas.",
      },
      {
        title: "Separe el alcance",
        description:
          "Meridian coordina la exportación; despachante e importador confirman nacionalización, tributos y entrega local.",
      },
    ],
  },
  scopeSplit: {
    heading: "Qué coordina Meridian y qué confirma su despachante",
    description:
      "El proceso queda claro cuando cada parte asume lo que realmente puede controlar.",
    meridianHeading: "Meridian coordina",
    brokerHeading: "Su despachante o importador paraguayo confirma",
    rows: [
      {
        checkpoint: "Revisión previa de la unidad",
        confirmedBy: "meridian",
        meridianNote:
          "Datos de la máquina, vendedor, ZIP, fotos, accesorios y dimensiones antes de comprar.",
        brokerNote:
          "Encuadre con Ley 7565/2025, antigüedad y elegibilidad final en destino.",
      },
      {
        checkpoint: "Retiro, transporte interno y preparación en EE.UU.",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, transporte interno, desmontaje, lavado, embalaje y fotos de carga.",
        brokerNote:
          "Confirma que la limpieza y la condición cumplen con los requisitos paraguayos.",
      },
      {
        checkpoint: "Documentación de exportación",
        confirmedBy: "meridian",
        meridianNote:
          "Factura comercial, packing list, BL, AES/EEI y certificado fitosanitario USDA cuando aplica.",
        brokerNote:
          "Encaje con DNIT, SENAVE, licencia previa y documentación paraguaya.",
      },
      {
        checkpoint: "Reserva marítima y ruta hasta puerto",
        confirmedBy: "meridian",
        meridianNote:
          "Comparación de Asunción/Villeta, Paranaguá y Montevideo, naviera y fecha.",
        brokerNote:
          "Coordinación de puerto, descarga, tránsito y movimiento local desde puerto.",
      },
      {
        checkpoint: "Nacionalización y tributos",
        confirmedBy: "broker",
        meridianNote:
          "No actuamos como despachante en Paraguay; entregamos documentos al importador.",
        brokerNote:
          "Despacho, IVA, tributos, registro de importador, inspección y costos portuarios.",
      },
      {
        checkpoint: "Entrega final a campo, taller o cooperativa",
        confirmedBy: "broker",
        meridianNote:
          "El alcance termina en el puerto acordado salvo que se contrate un servicio local extra.",
        brokerNote:
          "Transporte interior, descarga y entrega al destino paraguayo final.",
      },
    ],
  },
  routeTable: {
    heading: "Rutas y puntos de entrega",
    description:
      "Una cotización seria debe dejar claro dónde termina el alcance internacional y dónde empieza la responsabilidad local.",
    columnRoute: "Ruta",
    columnBestFor: "Mejor encaje",
    columnBuyerConfirms: "Comprador o despachante confirma",
    rows: [
      {
        route: "Asunción / Villeta",
        bestFor:
          "Casos en contenedor o ruta directa soportada hacia un puerto fluvial paraguayo.",
        buyerConfirms:
          "Despacho en destino, tributos, inspecciones, retiro y entrega después del puerto fluvial.",
      },
      {
        route: "Paranaguá, Brasil",
        bestFor:
          "Muchos casos en flat rack o sobredimensionados, especialmente hacia el este agrícola.",
        buyerConfirms:
          "Manejo en puerto brasileño, transporte transfronterizo, despachante paraguayo y entrega local.",
      },
      {
        route: "Montevideo, Uruguay",
        bestFor:
          "Compradores con camiones propios, despachante o socios logísticos regionales.",
        buyerConfirms:
          "Retiro en Montevideo, movimiento posterior, importación, tributos y entrega final.",
      },
    ],
  },
  buyerPacket: {
    heading: "Para revisar una unidad, envíe esto",
    description:
      "Con estos datos Meridian puede revisar el alcance de exportación y la ruta antes de que comprometa fondos.",
    items: [
      "Link del anuncio o subasta",
      "Marca, modelo, año, número de serie y horas",
      "ZIP de retiro en EE.UU.",
      "Fotos de la máquina, limpieza, neumáticos u orugas y serie",
      "Dimensiones, peso y accesorios incluidos",
      "Destino final en Paraguay y datos del despachante si ya está definido",
    ],
    secondaryLabel: "Enviar link de la máquina por WhatsApp",
  },
  cta: {
    heading: "Revisar Ley 7565 y ruta antes de comprar",
    description:
      "Envíe la unidad y el destino paraguayo. Meridian revisa el tramo de exportación, ruta y documentos antes de que comprometa fondos; su despachante confirma el tramo local.",
    primaryLabel: "Revisar Ley 7565 y ruta antes de comprar",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Paraguay.\n\nLink del anuncio/subasta:\nMarca/modelo/año:\nHoras:\nUbicación en EE.UU. (ZIP):\nDestino final:\nDimensiones/peso si están disponibles:\nAccesorios incluidos:\n¿Ya tengo despachante/importador local?: sí/no",
  },
  sourcesHeading: "Fuentes oficiales para revisar con su despachante",
};

const argentinaEs: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-argentina",
  country: "argentina",
  countryLabel: "Argentina",
  scopeIntro:
    "Meridian coordina el tramo de exportación desde EE.UU./Canadá; el despachante argentino confirma AFIDI, SENASA, encuadre en el Sistema Informático Malvina, tributos y entrega local.",
  quickAnswer: {
    eyebrow: "Respuesta rápida",
    heading: "Qué confirmar antes de comprar",
    description:
      "Antes de pagar al vendedor, separe la parte de exportación que coordina Meridian de la parte local que debe confirmar su despachante argentino.",
    steps: [
      {
        title: "Envíe la unidad antes de ofertar",
        description:
          "Link, marca, modelo, año, número de serie, horas, fotos, ZIP de retiro y destino en Argentina.",
      },
      {
        title: "Confirme AFIDI y SENASA",
        description:
          "Su despachante confirma la Autorización Fitosanitaria de Importación y los requisitos vigentes de SENASA.",
      },
      {
        title: "Encuadre en Malvina",
        description:
          "La Declaración Jurada del régimen de bienes usados la prepara el despachante argentino, no Meridian.",
      },
      {
        title: "Revise limpieza y documentos",
        description:
          "Tierra, restos vegetales, fluidos, número de serie y certificados deben estar en orden antes del embarque.",
      },
      {
        title: "Separe el alcance",
        description:
          "Cotización a puerto argentino no equivale a costo final nacionalizado ni a entrega en campo.",
      },
    ],
  },
  scopeSplit: {
    heading: "Qué coordina Meridian y qué confirma su despachante argentino",
    description:
      "Cada parte se hace responsable de lo que realmente puede controlar; eso reduce el riesgo antes de comprar.",
    meridianHeading: "Meridian coordina",
    brokerHeading: "Su despachante o importador argentino confirma",
    rows: [
      {
        checkpoint: "Revisión previa de la unidad",
        confirmedBy: "meridian",
        meridianNote:
          "Datos de la máquina, vendedor, ZIP, fotos, accesorios y dimensiones antes de comprar.",
        brokerNote:
          "Encaje con AFIDI, SENASA, NCM y régimen del Decreto 273/2025.",
      },
      {
        checkpoint: "Retiro, transporte interno y preparación en EE.UU.",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, transporte interno, desmontaje, lavado, embalaje y fotos de carga.",
        brokerNote:
          "Confirma que la limpieza y los documentos cumplen con los requisitos argentinos.",
      },
      {
        checkpoint: "Documentación de exportación",
        confirmedBy: "meridian",
        meridianNote:
          "Factura comercial, packing list, BL, AES/EEI y certificado fitosanitario USDA cuando aplica.",
        brokerNote:
          "Declaración Jurada en Malvina, AFIDI cuando corresponde y documentación argentina de importación.",
      },
      {
        checkpoint: "Reserva marítima y ruta hasta puerto",
        confirmedBy: "meridian",
        meridianNote:
          "Comparación de Buenos Aires, Zárate u otro puerto argentino, naviera y fecha.",
        brokerNote:
          "Coordinación con la autoridad portuaria, descarga e inspección al arribo.",
      },
      {
        checkpoint: "Nacionalización y tributos",
        confirmedBy: "broker",
        meridianNote:
          "Meridian no actúa como despachante en Argentina; entregamos documentos al importador.",
        brokerNote:
          "Clasificación NCM, IVA, derechos, tasas, encuadre en Malvina y trámites locales.",
      },
      {
        checkpoint: "Inspección y entrega interior",
        confirmedBy: "broker",
        meridianNote:
          "El alcance termina en el puerto argentino acordado salvo contrato local adicional.",
        brokerNote:
          "Inspección SENASA al arribo, retiro de puerto y entrega a campo, concesionario o taller.",
      },
    ],
  },
  routeTable: {
    heading: "Rutas y puntos de entrega",
    description:
      "Una cotización a puerto argentino no equivale a costo nacionalizado ni a entrega final.",
    columnRoute: "Ruta",
    columnBestFor: "Mejor encaje",
    columnBuyerConfirms: "Comprador o despachante confirma",
    rows: [
      {
        route: "Buenos Aires / Dock Sud",
        bestFor:
          "Maquinaria que encaja en operativa de contenedor y consignatarios con base metropolitana.",
        buyerConfirms:
          "Despacho, AFIDI, NCM, tributos, descarga y retiro hacia campo o concesionario.",
      },
      {
        route: "Zárate",
        bestFor:
          "Carga rodante, sobredimensionada o con consignatario industrial de zona norte.",
        buyerConfirms:
          "Coordinación portuaria, inspección y movimiento interior hacia destino final.",
      },
      {
        route: "Otro puerto / vía operativa especial",
        bestFor:
          "Casos donde la unidad, la naviera o el plan del importador justifican otro punto operativo.",
        buyerConfirms:
          "Operativa portuaria, descarga, despachante y todos los costos locales hasta entrega.",
      },
    ],
  },
  buyerPacket: {
    heading: "Para revisar una unidad, envíe esto",
    description:
      "Con estos datos Meridian revisa el tramo de exportación y marca lo que su despachante argentino debe confirmar antes de comprar.",
    items: [
      "Link del anuncio o subasta",
      "Marca, modelo, año, número de serie y horas",
      "ZIP de retiro en EE.UU.",
      "Fotos de la máquina, limpieza y serie",
      "Dimensiones, peso y accesorios incluidos",
      "Destino en Argentina y datos del despachante si ya está definido",
    ],
    secondaryLabel: "Enviar link de la máquina por WhatsApp",
  },
  cta: {
    heading: "Revisar AFIDI, SENASA y ruta antes de comprar",
    description:
      "Envíe la unidad y el destino argentino. Meridian revisa el tramo de exportación; su despachante confirma AFIDI, SENASA, Malvina y costo nacionalizado antes de comprar.",
    primaryLabel: "Revisar AFIDI, SENASA y ruta antes de comprar",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Argentina.\n\nLink del anuncio/subasta:\nMarca/modelo/año:\nHoras:\nUbicación en EE.UU. (ZIP):\nDestino final:\nDimensiones/peso si están disponibles:\nAccesorios incluidos:\n¿Ya tengo despachante/importador local?: sí/no",
  },
  sourcesHeading: "Fuentes oficiales para revisar con su despachante",
};

const uruguayEs: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-uruguay",
  country: "uruguay",
  countryLabel: "Uruguay",
  scopeIntro:
    "Meridian coordina el tramo de exportación desde EE.UU./Canadá; el despachante uruguayo confirma DGSA, Resolución 98/016, DUA, NCM, tributos y entrega interior.",
  quickAnswer: {
    eyebrow: "Respuesta rápida",
    heading: "Qué confirmar antes de comprar",
    description:
      "Una cotización a Montevideo no equivale a nacionalización ni a entrega final; separe los tramos antes de comprar.",
    steps: [
      {
        title: "Envíe la unidad antes de ofertar",
        description:
          "Link, marca, modelo, año, número de serie, horas, fotos, ZIP de retiro y destino en Uruguay.",
      },
      {
        title: "Confirme DGSA y Resolución 98/016",
        description:
          "Limpieza interna y externa, certificado fitosanitario y tratamiento en origen cuando corresponda.",
      },
      {
        title: "Prepare DUA y NCM con su despachante",
        description:
          "La declaración aduanera, la clasificación NCM y los tributos los confirma el despachante uruguayo.",
      },
      {
        title: "Revise limpieza y documentos",
        description:
          "Tierra, restos vegetales, accesorios y serie deben estar en orden antes del embarque.",
      },
      {
        title: "Separe Montevideo de entrega final",
        description:
          "Montevideo es punto portuario, no entrega en Soriano, Colonia, Paysandú u otro departamento.",
      },
    ],
  },
  scopeSplit: {
    heading: "Qué coordina Meridian y qué confirma su despachante uruguayo",
    description:
      "Separar el tramo internacional del local es lo que hace que la operación sea predecible.",
    meridianHeading: "Meridian coordina",
    brokerHeading: "Su despachante o importador uruguayo confirma",
    rows: [
      {
        checkpoint: "Revisión previa de la unidad",
        confirmedBy: "meridian",
        meridianNote:
          "Datos de la máquina, vendedor, ZIP, fotos, accesorios y dimensiones antes de comprar.",
        brokerNote:
          "Encaje con Resolución 98/016, NCM y régimen vigente de bienes de capital.",
      },
      {
        checkpoint: "Retiro, transporte interno y preparación en EE.UU.",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, transporte interno, desmontaje, lavado, embalaje y fotos de carga.",
        brokerNote:
          "Confirma que la limpieza y los documentos cumplen con DGSA.",
      },
      {
        checkpoint: "Documentación de exportación",
        confirmedBy: "meridian",
        meridianNote:
          "Factura comercial, packing list, BL, AES/EEI y certificado fitosanitario USDA cuando aplica.",
        brokerNote:
          "DUA, NCM, tributos y documentos de importación en Uruguay.",
      },
      {
        checkpoint: "Reserva marítima hacia Montevideo",
        confirmedBy: "meridian",
        meridianNote:
          "Comparación de servicios marítimos, naviera y fecha hacia Montevideo u otro punto.",
        brokerNote:
          "Coordinación portuaria, costos de puerto, inspección DGSA y retiro local.",
      },
      {
        checkpoint: "Nacionalización y tributos",
        confirmedBy: "broker",
        meridianNote:
          "Meridian no actúa como despachante en Uruguay; entregamos documentos al importador.",
        brokerNote:
          "Tasa Global Arancelaria, IVA, recargos, encuadre y trámites locales.",
      },
      {
        checkpoint: "Entrega interior",
        confirmedBy: "broker",
        meridianNote:
          "El alcance termina en Montevideo salvo contrato local adicional.",
        brokerNote:
          "Transporte interior, descarga y entrega al destino uruguayo final.",
      },
    ],
  },
  routeTable: {
    heading: "Rutas y puntos de entrega",
    description:
      "Montevideo concentra la conversación, pero el tramo Montevideo–campo siempre se confirma por separado.",
    columnRoute: "Ruta",
    columnBestFor: "Mejor encaje",
    columnBuyerConfirms: "Comprador o despachante confirma",
    rows: [
      {
        route: "Montevideo (puerto principal)",
        bestFor:
          "Maquinaria con consignatario y despachante uruguayos listos para nacionalizar a la llegada.",
        buyerConfirms:
          "DUA, NCM, DGSA, tributos, costos portuarios y retiro hacia el destino interior.",
      },
      {
        route: "Otro punto operativo",
        bestFor:
          "Casos donde la unidad, la naviera o el plan logístico aconsejan un punto distinto.",
        buyerConfirms:
          "Operativa portuaria, inspección, despachante y todos los costos locales hasta entrega.",
      },
    ],
  },
  buyerPacket: {
    heading: "Para revisar una unidad, envíe esto",
    description:
      "Con estos datos Meridian revisa el tramo de exportación y marca lo que su despachante uruguayo debe confirmar antes de comprar.",
    items: [
      "Link del anuncio o subasta",
      "Marca, modelo, año, número de serie y horas",
      "ZIP de retiro en EE.UU.",
      "Fotos de limpieza, tren de rodaje y serie",
      "Dimensiones, peso y accesorios incluidos",
      "Destino en Uruguay y datos del despachante si ya está definido",
    ],
    secondaryLabel: "Enviar link de la máquina por WhatsApp",
  },
  cta: {
    heading: "Revisar DGSA, Montevideo y documentos",
    description:
      "Envíe la unidad y el destino uruguayo. Meridian revisa el tramo de exportación y documentos; su despachante confirma DGSA, DUA, NCM y costo nacionalizado.",
    primaryLabel: "Revisar DGSA, Montevideo y documentos",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Uruguay.\n\nLink del anuncio/subasta:\nMarca/modelo/año:\nHoras:\nUbicación en EE.UU. (ZIP):\nDestino final:\nDimensiones/peso si están disponibles:\nAccesorios incluidos:\n¿Ya tengo despachante/importador local?: sí/no",
  },
  sourcesHeading: "Fuentes oficiales para revisar con su despachante",
};

const boliviaEs: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-bolivia",
  country: "bolivia",
  countryLabel: "Bolivia",
  scopeIntro:
    "Meridian coordina el tramo de exportación desde EE.UU./Canadá; el broker, importador y agente de tránsito boliviano confirman ASPB, SENASAG cuando aplica, nacionalización y transporte interior.",
  quickAnswer: {
    eyebrow: "Respuesta rápida",
    heading: "Qué confirmar antes de comprar",
    description:
      "Bolivia no tiene puerto oceánico; la ruta cierra cuando el tramo interior está armado, no solo cuando llega el barco a Arica.",
    steps: [
      {
        title: "Envíe la unidad antes de ofertar",
        description:
          "Link, marca, modelo, año, número de serie, horas, fotos, ZIP de retiro y destino boliviano.",
      },
      {
        title: "Confirme ASPB y tránsito",
        description:
          "Arica, Iquique o Antofagasta son puntos de tránsito; el agente boliviano coordina el cruce y la nacionalización.",
      },
      {
        title: "Revise SENASAG con su broker",
        description:
          "Cuando aplique, SENASAG controla la sanidad vegetal y puede exigir tratamientos o inspección.",
      },
      {
        title: "Confirme transporte interior",
        description:
          "Movimiento hacia Santa Cruz, Cochabamba, La Paz u otro destino lo confirma un transportista interior boliviano.",
      },
      {
        title: "Separe el alcance",
        description:
          "Una cotización a puerto chileno no equivale a entrega en destino boliviano ni a costo nacionalizado.",
      },
    ],
  },
  scopeSplit: {
    heading: "Qué coordina Meridian y qué confirma el tramo boliviano",
    description:
      "El proyecto cierra cuando cada parte —exportadora, agente chileno, broker boliviano y transportista interior— está alineada antes de comprar.",
    meridianHeading: "Meridian coordina",
    brokerHeading: "Su broker, importador y agente de tránsito boliviano confirma",
    rows: [
      {
        checkpoint: "Revisión previa de la unidad",
        confirmedBy: "meridian",
        meridianNote:
          "Datos de la máquina, vendedor, ZIP, fotos, accesorios y dimensiones antes de comprar.",
        brokerNote:
          "Encaje con clasificación NANDINA, Padrón de Importadores y régimen boliviano.",
      },
      {
        checkpoint: "Retiro, transporte interno y preparación en EE.UU.",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, transporte interno, desmontaje, lavado, embalaje y fotos de carga.",
        brokerNote:
          "Confirma que la condición y los documentos sirven para SENASAG cuando aplica.",
      },
      {
        checkpoint: "Documentación de exportación",
        confirmedBy: "meridian",
        meridianNote:
          "Factura comercial, packing list, BL, AES/EEI y certificado fitosanitario USDA cuando aplica.",
        brokerNote:
          "Documentos de importación, permisos boliviano y tránsito chileno.",
      },
      {
        checkpoint: "Reserva marítima hasta puerto chileno",
        confirmedBy: "meridian",
        meridianNote:
          "Comparación de Arica, Iquique o Antofagasta, naviera y fecha.",
        brokerNote:
          "Coordinación ASPB, agente de tránsito y traslado hacia frontera boliviana.",
      },
      {
        checkpoint: "Nacionalización y tributos",
        confirmedBy: "broker",
        meridianNote:
          "Meridian no actúa como despachante en Bolivia; entregamos documentos al importador.",
        brokerNote:
          "Nacionalización, tributos, SENASAG cuando aplica y trámites locales.",
      },
      {
        checkpoint: "Transporte interior boliviano",
        confirmedBy: "broker",
        meridianNote:
          "El alcance termina en el puerto chileno acordado salvo contrato local adicional.",
        brokerNote:
          "Tramo terrestre hacia Santa Cruz, Cochabamba, La Paz u otro destino.",
      },
    ],
  },
  routeTable: {
    heading: "Rutas y puntos de entrega",
    description:
      "Los puertos chilenos son puntos de tránsito; la entrega ocurre dentro de Bolivia tras nacionalización y movimiento interior.",
    columnRoute: "Ruta",
    columnBestFor: "Mejor encaje",
    columnBuyerConfirms: "Comprador, broker o transportista confirma",
    rows: [
      {
        route: "Arica (vía ASPB)",
        bestFor:
          "Carga boliviana con infraestructura ASPB y plan de tránsito hacia La Paz, Oruro o Santa Cruz.",
        buyerConfirms:
          "Coordinación ASPB, agente de tránsito, nacionalización y transporte interior.",
      },
      {
        route: "Iquique",
        bestFor:
          "Casos donde la naviera, la fecha o el destino aconsejan Iquique sobre Arica.",
        buyerConfirms:
          "Tránsito chileno, agente, despacho boliviano y movimiento interior hasta destino.",
      },
      {
        route: "Antofagasta",
        bestFor:
          "Cargas con consignatarios que ya operan vía Antofagasta o destinos del sur boliviano.",
        buyerConfirms:
          "Tránsito chileno, agente, despacho boliviano y movimiento interior hasta destino.",
      },
    ],
  },
  buyerPacket: {
    heading: "Para revisar una unidad, envíe esto",
    description:
      "Con estos datos Meridian revisa el tramo de exportación y marca lo que su broker boliviano debe confirmar antes de comprar.",
    items: [
      "Link del anuncio o subasta",
      "Marca, modelo, año, número de serie y horas",
      "ZIP de retiro en EE.UU.",
      "Fotos de la máquina, limpieza y serie",
      "Dimensiones, peso y accesorios incluidos",
      "Destino boliviano y datos del broker o agente si ya están definidos",
    ],
    secondaryLabel: "Enviar link de la máquina por WhatsApp",
  },
  cta: {
    heading: "Revisar ruta vía puerto chileno",
    description:
      "Envíe la unidad y el destino boliviano. Meridian revisa el tramo de exportación; su broker, agente de tránsito y transportista confirman ASPB, SENASAG cuando aplica y entrega interior.",
    primaryLabel: "Revisar ruta vía puerto chileno",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Bolivia.\n\nLink del anuncio/subasta:\nMarca/modelo/año:\nHoras:\nUbicación en EE.UU. (ZIP):\nDestino final:\nDimensiones/peso si están disponibles:\nAccesorios incluidos:\n¿Ya tengo broker/agente boliviano?: sí/no",
  },
  sourcesHeading: "Fuentes oficiales para revisar con su broker",
};

const chileEs: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-chile",
  country: "chile",
  countryLabel: "Chile",
  scopeIntro:
    "Meridian coordina el tramo de exportación desde EE.UU./Canadá; el importador y despachador de aduanas chileno confirman SAG Resolución 3.103/2016, clasificación, tributos y entrega local.",
  quickAnswer: {
    eyebrow: "Respuesta rápida",
    heading: "Qué confirmar antes de comprar",
    description:
      "Chile tiene puertos eficientes, pero la maquinaria usada se evalúa por unidad, no por flete; revise SAG y condición antes de comprar.",
    steps: [
      {
        title: "Envíe la unidad antes de ofertar",
        description:
          "Link, marca, modelo, año, número de serie, horas, fotos, ZIP de retiro y destino en Chile.",
      },
      {
        title: "Revise SAG Resolución 3.103/2016",
        description:
          "Limpieza interna y externa, libre de suelo y restos vegetales; SAG inspecciona al arribo.",
      },
      {
        title: "Confirme puerto y despachador",
        description:
          "San Antonio, Valparaíso u otro puerto; el despachador chileno confirma clasificación, tributos y retiro.",
      },
      {
        title: "Revise limpieza y fotos",
        description:
          "Fotos de tren de rodaje, accesorios y serie reducen el riesgo de medidas fitosanitarias al arribo.",
      },
      {
        title: "Separe alcance y costos",
        description:
          "Una cotización a puerto no equivale a costo nacionalizado ni a entrega final en región.",
      },
    ],
  },
  scopeSplit: {
    heading: "Qué coordina Meridian y qué confirma su despachador de aduanas",
    description:
      "La separación clara entre exportación y nacionalización evita sorpresas en puerto chileno.",
    meridianHeading: "Meridian coordina",
    brokerHeading: "Su despachador de aduanas o importador chileno confirma",
    rows: [
      {
        checkpoint: "Revisión previa de la unidad",
        confirmedBy: "meridian",
        meridianNote:
          "Datos de la máquina, vendedor, ZIP, fotos, accesorios y dimensiones antes de comprar.",
        brokerNote:
          "Encaje con SAG Resolución 3.103/2016 y régimen vigente.",
      },
      {
        checkpoint: "Retiro, transporte interno y preparación en EE.UU.",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, transporte interno, desmontaje, lavado intensivo, embalaje y fotos de carga.",
        brokerNote:
          "Confirma que la limpieza cumple los requisitos SAG para evitar tratamientos al arribo.",
      },
      {
        checkpoint: "Documentación de exportación",
        confirmedBy: "meridian",
        meridianNote:
          "Factura comercial, packing list, BL, AES/EEI y certificado fitosanitario USDA cuando aplica.",
        brokerNote:
          "Clasificación, documentos de importación y registros chilenos.",
      },
      {
        checkpoint: "Reserva marítima y ruta hasta puerto",
        confirmedBy: "meridian",
        meridianNote:
          "Comparación de San Antonio, Valparaíso u otro puerto, naviera y fecha.",
        brokerNote:
          "Coordinación portuaria, inspección SAG al arribo y retiro local.",
      },
      {
        checkpoint: "Nacionalización y tributos",
        confirmedBy: "broker",
        meridianNote:
          "Meridian no actúa como despachador en Chile; entregamos documentos al importador.",
        brokerNote:
          "Clasificación, IVA, derechos, tributos y trámites locales.",
      },
      {
        checkpoint: "Entrega interior",
        confirmedBy: "broker",
        meridianNote:
          "El alcance termina en el puerto chileno acordado salvo contrato local adicional.",
        brokerNote:
          "Transporte interior, descarga y entrega al destino chileno final.",
      },
    ],
  },
  routeTable: {
    heading: "Rutas y puntos de entrega",
    description:
      "Una cotización a puerto no equivale a entrega final en Santiago, O'Higgins, Maule, Ñuble, Biobío o Los Lagos.",
    columnRoute: "Ruta",
    columnBestFor: "Mejor encaje",
    columnBuyerConfirms: "Comprador o despachador confirma",
    rows: [
      {
        route: "San Antonio",
        bestFor:
          "Carga destinada a Chile central con consignatarios y despachadores en el área metropolitana.",
        buyerConfirms:
          "Despacho, SAG, clasificación, tributos, descarga y movimiento interior hacia destino.",
      },
      {
        route: "Valparaíso",
        bestFor:
          "Casos donde la naviera, el destino regional o el plan operativo aconsejan Valparaíso.",
        buyerConfirms:
          "Operativa portuaria, SAG, despachador y todos los costos locales hasta entrega.",
      },
      {
        route: "Otro puerto",
        bestFor:
          "Cargas con consignatario regional o naviera específica con base operativa distinta.",
        buyerConfirms:
          "Operativa portuaria, SAG, despachador y todos los costos locales hasta entrega.",
      },
    ],
  },
  buyerPacket: {
    heading: "Para revisar una unidad, envíe esto",
    description:
      "Con estos datos Meridian revisa el tramo de exportación y marca lo que su despachador chileno debe confirmar antes de comprar.",
    items: [
      "Link del anuncio o subasta",
      "Marca, modelo, año, número de serie y horas",
      "ZIP de retiro en EE.UU.",
      "Fotos de limpieza, tren de rodaje, accesorios y serie",
      "Dimensiones, peso y puerto chileno preferido si ya lo tiene",
      "Destino en Chile y datos del despachador si ya está definido",
    ],
    secondaryLabel: "Enviar link de la máquina por WhatsApp",
  },
  cta: {
    heading: "Revisar SAG y condición de la máquina",
    description:
      "Envíe la unidad y el destino chileno. Meridian revisa el tramo de exportación y limpieza; su despachador confirma SAG, clasificación, tributos y retiro local.",
    primaryLabel: "Revisar SAG y condición de la máquina",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Chile.\n\nLink del anuncio/subasta:\nMarca/modelo/año:\nHoras:\nUbicación en EE.UU. (ZIP):\nDestino final:\nDimensiones/peso si están disponibles:\nAccesorios incluidos:\n¿Ya tengo despachador/importador local?: sí/no",
  },
  sourcesHeading: "Fuentes oficiales para revisar con su despachador",
};

// ─── English enhancements ───────────────────────────────────────────────────

const paraguayEn: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-paraguay",
  country: "paraguay",
  countryLabel: "Paraguay",
  scopeIntro:
    "Meridian coordinates U.S./Canada export-side work; your Paraguayan importer or customs broker confirms import requirements, Ley 7565/2025, DNIT, SENAVE, taxes, and final delivery.",
  quickAnswer: {
    eyebrow: "Quick answer",
    heading: "What to confirm before you buy",
    description:
      "Importing used machinery to Paraguay is manageable once the unit, route, documents, and Paraguay-side responsibilities are clear before funds move.",
    steps: [
      {
        title: "Send the machine before buying",
        description:
          "Listing link, make, model, year, serial number, hours, photos, pickup ZIP, and Paraguay destination.",
      },
      {
        title: "Check Ley 7565/2025",
        description:
          "Five-year age limit, cleaning, phytosanitary documents, DNIT, SENAVE, and broker readiness.",
      },
      {
        title: "Confirm cleaning and documents",
        description:
          "Soil, plant residue, pests, certificates, and serial number must be in order before shipment.",
      },
      {
        title: "Pick the handoff point",
        description:
          "Asunción/Villeta, Paranaguá, and Montevideo are different responsibility models, not just routes.",
      },
      {
        title: "Separate the scope",
        description:
          "Meridian coordinates export; broker and importer confirm clearance, taxes, and local delivery.",
      },
    ],
  },
  scopeSplit: {
    heading: "What Meridian coordinates and what your broker confirms",
    description:
      "The process becomes predictable when each party owns the part it can actually control.",
    meridianHeading: "Meridian coordinates",
    brokerHeading: "Your Paraguayan broker or importer confirms",
    rows: [
      {
        checkpoint: "Pre-purchase machine review",
        confirmedBy: "meridian",
        meridianNote:
          "Machine data, seller contact, pickup ZIP, photos, attachments, and dimensions before purchase.",
        brokerNote:
          "Fit with Ley 7565/2025, age, and final destination eligibility.",
      },
      {
        checkpoint: "U.S. pickup, inland transport, and preparation",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, inland transport, dismantling, washing, packing, and loading photos.",
        brokerNote:
          "Confirms that cleaning and condition meet Paraguayan requirements.",
      },
      {
        checkpoint: "Export documentation",
        confirmedBy: "meridian",
        meridianNote:
          "Commercial invoice, packing list, BL, AES/EEI, and USDA phytosanitary certificate when required.",
        brokerNote:
          "Fit with DNIT, SENAVE, prior license, and Paraguayan import documents.",
      },
      {
        checkpoint: "Ocean booking and route to port",
        confirmedBy: "meridian",
        meridianNote:
          "Compare Asunción/Villeta, Paranaguá, and Montevideo; carrier and sailing date.",
        brokerNote:
          "Port handling, unloading, transit, and onward movement from the river port.",
      },
      {
        checkpoint: "Customs clearance and taxes",
        confirmedBy: "broker",
        meridianNote:
          "Meridian does not act as a Paraguayan broker; we hand documents to the importer.",
        brokerNote:
          "Clearance, IVA, taxes, importer registration, inspection, and port costs.",
      },
      {
        checkpoint: "Final delivery to farm or workshop",
        confirmedBy: "broker",
        meridianNote:
          "Scope ends at the agreed port unless a separate local service is contracted.",
        brokerNote:
          "Inland trucking, unloading, and delivery to the final Paraguayan destination.",
      },
    ],
  },
  routeTable: {
    heading: "Routes and handoff points",
    description:
      "A serious quote should make clear where international scope ends and where local responsibility begins.",
    columnRoute: "Route",
    columnBestFor: "Best fit",
    columnBuyerConfirms: "Buyer or broker confirms",
    rows: [
      {
        route: "Asunción / Villeta",
        bestFor:
          "Container or supported through-route cases ending at a Paraguay river port.",
        buyerConfirms:
          "Destination clearance, taxes, inspections, port pickup, and delivery after the river port.",
      },
      {
        route: "Paranaguá, Brazil",
        bestFor:
          "Many flatrack or oversize cases, especially eastern Paraguay destinations.",
        buyerConfirms:
          "Brazil port handling, cross-border trucking, Paraguay customs, unloading, and local delivery.",
      },
      {
        route: "Montevideo, Uruguay",
        bestFor:
          "Buyers with their own regional trucks, broker, or logistics partners.",
        buyerConfirms:
          "Montevideo pickup, onward movement, import handling, taxes, and final delivery.",
      },
    ],
  },
  buyerPacket: {
    heading: "Send this before bidding",
    description:
      "With this information Meridian can screen the export scope and route before you commit funds.",
    items: [
      "Listing or auction link",
      "Make, model, year, serial number, and hours",
      "U.S. pickup ZIP",
      "Photos of the machine, cleaning, tires or tracks, and serial plate",
      "Dimensions, weight, and attachments included",
      "Paraguay destination and broker details if already chosen",
    ],
    secondaryLabel: "Send the machine link by WhatsApp",
  },
  cta: {
    heading: "Check Ley 7565 and route before buying",
    description:
      "Send the machine and Paraguay destination. Meridian reviews export scope, route, and documents before you commit; your broker confirms the local side.",
    primaryLabel: "Check Ley 7565 and route before buying",
    whatsappMessage:
      "Hi. I'm evaluating importing used farm machinery from the U.S. to Paraguay.\n\nListing link:\nMake/model/year:\nHours:\nU.S. location (ZIP):\nFinal destination:\nDimensions/weight if available:\nAttachments included:\nDo I already have a local broker/importer?: yes/no",
  },
  sourcesHeading: "Official sources to review with your broker",
};

const argentinaEn: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-argentina",
  country: "argentina",
  countryLabel: "Argentina",
  scopeIntro:
    "Meridian coordinates U.S./Canada export-side work; your Argentine customs broker confirms AFIDI, SENASA, the Sistema Informático Malvina filing, taxes, and local delivery.",
  quickAnswer: {
    eyebrow: "Quick answer",
    heading: "What to confirm before you buy",
    description:
      "Before paying the seller, separate Meridian's export scope from the Argentina-side work your broker must confirm.",
    steps: [
      {
        title: "Send the unit before bidding",
        description:
          "Link, make, model, year, serial number, hours, photos, pickup ZIP, and Argentina destination.",
      },
      {
        title: "Confirm AFIDI and SENASA",
        description:
          "Your broker confirms the phytosanitary import authorization and SENASA's current requirements.",
      },
      {
        title: "File through Malvina",
        description:
          "The used-goods Declaración Jurada is prepared by your Argentine broker, not Meridian.",
      },
      {
        title: "Review cleaning and documents",
        description:
          "Soil, plant residue, fluids, serial number, and certificates must be in order before shipping.",
      },
      {
        title: "Separate the scope",
        description:
          "An Argentine port quote is not the same as nationalized cost or delivery to the field.",
      },
    ],
  },
  scopeSplit: {
    heading: "What Meridian coordinates and what your Argentine broker confirms",
    description:
      "Each party owns the part it can actually control, which reduces risk before purchase.",
    meridianHeading: "Meridian coordinates",
    brokerHeading: "Your Argentine broker or importer confirms",
    rows: [
      {
        checkpoint: "Pre-purchase machine review",
        confirmedBy: "meridian",
        meridianNote:
          "Machine data, seller, pickup ZIP, photos, attachments, and dimensions before purchase.",
        brokerNote:
          "Fit with AFIDI, SENASA, NCM, and Decreto 273/2025.",
      },
      {
        checkpoint: "U.S. pickup, inland transport, and preparation",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, inland transport, dismantling, washing, packing, and loading photos.",
        brokerNote:
          "Confirms that cleaning and documents meet Argentine requirements.",
      },
      {
        checkpoint: "Export documentation",
        confirmedBy: "meridian",
        meridianNote:
          "Commercial invoice, packing list, BL, AES/EEI, and USDA phytosanitary certificate when required.",
        brokerNote:
          "Malvina filing, AFIDI when required, and Argentine import documents.",
      },
      {
        checkpoint: "Ocean booking and route to port",
        confirmedBy: "meridian",
        meridianNote:
          "Compare Buenos Aires, Zárate, or another Argentine port; carrier and sailing date.",
        brokerNote:
          "Port authority coordination, unloading, and arrival inspection.",
      },
      {
        checkpoint: "Customs clearance and taxes",
        confirmedBy: "broker",
        meridianNote:
          "Meridian does not act as an Argentine broker; we hand documents to the importer.",
        brokerNote:
          "NCM classification, IVA, duties, fees, Malvina filing, and local procedures.",
      },
      {
        checkpoint: "Inspection and inland delivery",
        confirmedBy: "broker",
        meridianNote:
          "Scope ends at the agreed Argentine port unless a separate local contract exists.",
        brokerNote:
          "SENASA inspection on arrival, port pickup, and delivery to field, dealer, or workshop.",
      },
    ],
  },
  routeTable: {
    heading: "Routes and handoff points",
    description:
      "A quote to an Argentine port is not the same as nationalized cost or final delivery.",
    columnRoute: "Route",
    columnBestFor: "Best fit",
    columnBuyerConfirms: "Buyer or broker confirms",
    rows: [
      {
        route: "Buenos Aires / Dock Sud",
        bestFor:
          "Machinery that fits container operations and consignees based in the metro area.",
        buyerConfirms:
          "Clearance, AFIDI, NCM, taxes, unloading, and pickup to field or dealer.",
      },
      {
        route: "Zárate",
        bestFor:
          "Roll-on, oversize, or industrial cargo with northern consignees.",
        buyerConfirms:
          "Port coordination, inspection, and inland movement to final destination.",
      },
      {
        route: "Other port / special operation",
        bestFor:
          "Cases where the unit, carrier, or importer's plan favors a different port.",
        buyerConfirms:
          "Port operation, unloading, broker, and all local costs through to delivery.",
      },
    ],
  },
  buyerPacket: {
    heading: "Send this before bidding",
    description:
      "With this information Meridian reviews the export scope and flags what your Argentine broker must confirm before purchase.",
    items: [
      "Listing or auction link",
      "Make, model, year, serial number, and hours",
      "U.S. pickup ZIP",
      "Photos of the machine, cleaning, and serial plate",
      "Dimensions, weight, and attachments included",
      "Argentina destination and broker details if already chosen",
    ],
    secondaryLabel: "Send the machine link by WhatsApp",
  },
  cta: {
    heading: "Check AFIDI, SENASA, and route before buying",
    description:
      "Send the unit and Argentina destination. Meridian reviews export scope; your broker confirms AFIDI, SENASA, Malvina, and nationalized cost before you commit.",
    primaryLabel: "Check AFIDI, SENASA, and route before buying",
    whatsappMessage:
      "Hi. I'm evaluating importing used farm machinery from the U.S. to Argentina.\n\nListing link:\nMake/model/year:\nHours:\nU.S. location (ZIP):\nFinal destination:\nDimensions/weight if available:\nAttachments included:\nDo I already have a local broker/importer?: yes/no",
  },
  sourcesHeading: "Official sources to review with your broker",
};

const uruguayEn: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-uruguay",
  country: "uruguay",
  countryLabel: "Uruguay",
  scopeIntro:
    "Meridian coordinates U.S./Canada export-side work; your Uruguayan broker confirms DGSA, Resolution 98/016, DUA, NCM, taxes, and inland delivery.",
  quickAnswer: {
    eyebrow: "Quick answer",
    heading: "What to confirm before you buy",
    description:
      "A Montevideo freight quote is not nationalization or final delivery; separate the scopes before purchase.",
    steps: [
      {
        title: "Send the unit before bidding",
        description:
          "Link, make, model, year, serial number, hours, photos, pickup ZIP, and Uruguay destination.",
      },
      {
        title: "Confirm DGSA and Resolution 98/016",
        description:
          "Internal and external cleaning, phytosanitary certificate, and origin treatment when applicable.",
      },
      {
        title: "Prepare DUA and NCM with your broker",
        description:
          "Customs declaration, NCM classification, and taxes are confirmed by the Uruguayan broker.",
      },
      {
        title: "Review cleaning and documents",
        description:
          "Soil, plant residue, attachments, and serial number must be in order before shipping.",
      },
      {
        title: "Separate Montevideo from final delivery",
        description:
          "Montevideo is a port handoff, not delivery in Soriano, Colonia, Paysandú, or another department.",
      },
    ],
  },
  scopeSplit: {
    heading: "What Meridian coordinates and what your Uruguayan broker confirms",
    description:
      "Separating the international and local legs is what makes the operation predictable.",
    meridianHeading: "Meridian coordinates",
    brokerHeading: "Your Uruguayan broker or importer confirms",
    rows: [
      {
        checkpoint: "Pre-purchase machine review",
        confirmedBy: "meridian",
        meridianNote:
          "Machine data, seller, pickup ZIP, photos, attachments, and dimensions before purchase.",
        brokerNote:
          "Fit with Resolution 98/016, NCM, and capital-goods regime.",
      },
      {
        checkpoint: "U.S. pickup, inland transport, and preparation",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, inland transport, dismantling, washing, packing, and loading photos.",
        brokerNote:
          "Confirms that cleaning and documents meet DGSA requirements.",
      },
      {
        checkpoint: "Export documentation",
        confirmedBy: "meridian",
        meridianNote:
          "Commercial invoice, packing list, BL, AES/EEI, and USDA phytosanitary certificate when required.",
        brokerNote:
          "DUA, NCM, taxes, and Uruguayan import documents.",
      },
      {
        checkpoint: "Ocean booking toward Montevideo",
        confirmedBy: "meridian",
        meridianNote:
          "Compare carriers and sailing dates toward Montevideo or another handoff.",
        brokerNote:
          "Port coordination, port costs, DGSA inspection, and local pickup.",
      },
      {
        checkpoint: "Customs clearance and taxes",
        confirmedBy: "broker",
        meridianNote:
          "Meridian does not act as a Uruguayan broker; we hand documents to the importer.",
        brokerNote:
          "TGA, IVA, surcharges, classification, and local procedures.",
      },
      {
        checkpoint: "Inland delivery",
        confirmedBy: "broker",
        meridianNote:
          "Scope ends at Montevideo unless a separate local contract exists.",
        brokerNote:
          "Inland trucking, unloading, and delivery to the final Uruguayan destination.",
      },
    ],
  },
  routeTable: {
    heading: "Routes and handoff points",
    description:
      "Montevideo concentrates the conversation, but the Montevideo-to-field leg is always confirmed separately.",
    columnRoute: "Route",
    columnBestFor: "Best fit",
    columnBuyerConfirms: "Buyer or broker confirms",
    rows: [
      {
        route: "Montevideo (main port)",
        bestFor:
          "Machinery with a Uruguayan consignee and broker ready to clear on arrival.",
        buyerConfirms:
          "DUA, NCM, DGSA, taxes, port costs, and pickup to inland destination.",
      },
      {
        route: "Other operating point",
        bestFor:
          "Cases where the unit, carrier, or logistics plan favors a different handoff.",
        buyerConfirms:
          "Port operation, inspection, broker, and all local costs through to delivery.",
      },
    ],
  },
  buyerPacket: {
    heading: "Send this before bidding",
    description:
      "With this information Meridian reviews the export scope and flags what your Uruguayan broker must confirm before purchase.",
    items: [
      "Listing or auction link",
      "Make, model, year, serial number, and hours",
      "U.S. pickup ZIP",
      "Photos of cleaning, undercarriage, and serial plate",
      "Dimensions, weight, and attachments included",
      "Uruguay destination and broker details if already chosen",
    ],
    secondaryLabel: "Send the machine link by WhatsApp",
  },
  cta: {
    heading: "Check DGSA, Montevideo, and documents",
    description:
      "Send the unit and Uruguay destination. Meridian reviews export scope and documents; your broker confirms DGSA, DUA, NCM, and nationalized cost.",
    primaryLabel: "Check DGSA, Montevideo, and documents",
    whatsappMessage:
      "Hi. I'm evaluating importing used farm machinery from the U.S. to Uruguay.\n\nListing link:\nMake/model/year:\nHours:\nU.S. location (ZIP):\nFinal destination:\nDimensions/weight if available:\nAttachments included:\nDo I already have a local broker/importer?: yes/no",
  },
  sourcesHeading: "Official sources to review with your broker",
};

const boliviaEn: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-bolivia",
  country: "bolivia",
  countryLabel: "Bolivia",
  scopeIntro:
    "Meridian coordinates U.S./Canada export-side work; your Bolivian broker, importer, and transit agent confirm ASPB, SENASAG when applicable, clearance, and inland transport.",
  quickAnswer: {
    eyebrow: "Quick answer",
    heading: "What to confirm before you buy",
    description:
      "Bolivia is landlocked; the project closes when the inland leg is in place, not just when the vessel reaches Arica.",
    steps: [
      {
        title: "Send the unit before bidding",
        description:
          "Link, make, model, year, serial number, hours, photos, pickup ZIP, and Bolivian destination.",
      },
      {
        title: "Confirm ASPB and transit",
        description:
          "Arica, Iquique, and Antofagasta are transit points; the Bolivian agent coordinates crossing and clearance.",
      },
      {
        title: "Check SENASAG with your broker",
        description:
          "When applicable, SENASAG controls plant health and may require treatments or inspection.",
      },
      {
        title: "Confirm inland transport",
        description:
          "Inland movement to Santa Cruz, Cochabamba, La Paz, or another destination is confirmed by a Bolivian carrier.",
      },
      {
        title: "Separate the scope",
        description:
          "A Chilean port quote is not delivery in Bolivia or nationalized cost.",
      },
    ],
  },
  scopeSplit: {
    heading: "What Meridian coordinates and what the Bolivian side confirms",
    description:
      "The project closes when exporter, Chilean transit agent, Bolivian broker, and inland carrier are aligned before purchase.",
    meridianHeading: "Meridian coordinates",
    brokerHeading: "Your Bolivian broker, importer, or transit agent confirms",
    rows: [
      {
        checkpoint: "Pre-purchase machine review",
        confirmedBy: "meridian",
        meridianNote:
          "Machine data, seller, pickup ZIP, photos, attachments, and dimensions before purchase.",
        brokerNote:
          "Fit with NANDINA classification, importer registry, and Bolivian regime.",
      },
      {
        checkpoint: "U.S. pickup, inland transport, and preparation",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, inland transport, dismantling, washing, packing, and loading photos.",
        brokerNote:
          "Confirms that condition and documents work for SENASAG when applicable.",
      },
      {
        checkpoint: "Export documentation",
        confirmedBy: "meridian",
        meridianNote:
          "Commercial invoice, packing list, BL, AES/EEI, and USDA phytosanitary certificate when required.",
        brokerNote:
          "Bolivian import documents, permits, and Chilean transit paperwork.",
      },
      {
        checkpoint: "Ocean booking to Chilean port",
        confirmedBy: "meridian",
        meridianNote:
          "Compare Arica, Iquique, or Antofagasta; carrier and sailing date.",
        brokerNote:
          "ASPB coordination, transit agent, and onward movement toward the Bolivian border.",
      },
      {
        checkpoint: "Customs clearance and taxes",
        confirmedBy: "broker",
        meridianNote:
          "Meridian does not act as a Bolivian broker; we hand documents to the importer.",
        brokerNote:
          "Clearance, taxes, SENASAG when applicable, and local procedures.",
      },
      {
        checkpoint: "Bolivian inland transport",
        confirmedBy: "broker",
        meridianNote:
          "Scope ends at the agreed Chilean port unless a separate local contract exists.",
        brokerNote:
          "Overland leg to Santa Cruz, Cochabamba, La Paz, or another destination.",
      },
    ],
  },
  routeTable: {
    heading: "Routes and handoff points",
    description:
      "Chilean ports are transit handoffs; delivery happens inside Bolivia after clearance and inland movement.",
    columnRoute: "Route",
    columnBestFor: "Best fit",
    columnBuyerConfirms: "Buyer, broker, or carrier confirms",
    rows: [
      {
        route: "Arica (via ASPB)",
        bestFor:
          "Bolivian cargo with ASPB infrastructure and a transit plan to La Paz, Oruro, or Santa Cruz.",
        buyerConfirms:
          "ASPB coordination, transit agent, clearance, and inland transport.",
      },
      {
        route: "Iquique",
        bestFor:
          "Cases where carrier, sailing date, or destination favors Iquique over Arica.",
        buyerConfirms:
          "Chilean transit, agent, Bolivian clearance, and inland movement to destination.",
      },
      {
        route: "Antofagasta",
        bestFor:
          "Consignees already operating via Antofagasta or southern Bolivian destinations.",
        buyerConfirms:
          "Chilean transit, agent, Bolivian clearance, and inland movement to destination.",
      },
    ],
  },
  buyerPacket: {
    heading: "Send this before bidding",
    description:
      "With this information Meridian reviews the export scope and flags what your Bolivian broker must confirm before purchase.",
    items: [
      "Listing or auction link",
      "Make, model, year, serial number, and hours",
      "U.S. pickup ZIP",
      "Photos of the machine, cleaning, and serial plate",
      "Dimensions, weight, and attachments included",
      "Bolivian destination and broker/agent details if already chosen",
    ],
    secondaryLabel: "Send the machine link by WhatsApp",
  },
  cta: {
    heading: "Check the route via Chilean port",
    description:
      "Send the unit and Bolivian destination. Meridian reviews export scope; your broker, transit agent, and inland carrier confirm ASPB, SENASAG when applicable, and inland delivery.",
    primaryLabel: "Check the route via Chilean port",
    whatsappMessage:
      "Hi. I'm evaluating importing used farm machinery from the U.S. to Bolivia.\n\nListing link:\nMake/model/year:\nHours:\nU.S. location (ZIP):\nFinal destination:\nDimensions/weight if available:\nAttachments included:\nDo I already have a Bolivian broker/agent?: yes/no",
  },
  sourcesHeading: "Official sources to review with your broker",
};

const chileEn: ImportGuideEnhancement = {
  slug: "import-farm-machinery-united-states-chile",
  country: "chile",
  countryLabel: "Chile",
  scopeIntro:
    "Meridian coordinates U.S./Canada export-side work; your Chilean importer and customs broker confirm SAG Resolution 3.103/2016, classification, taxes, and local delivery.",
  quickAnswer: {
    eyebrow: "Quick answer",
    heading: "What to confirm before you buy",
    description:
      "Chile has efficient ports, but used machinery is evaluated by unit, not by freight; review SAG and condition before purchase.",
    steps: [
      {
        title: "Send the unit before bidding",
        description:
          "Link, make, model, year, serial number, hours, photos, pickup ZIP, and Chile destination.",
      },
      {
        title: "Review SAG Resolution 3.103/2016",
        description:
          "Internal and external cleaning, free of soil and plant residue; SAG inspects on arrival.",
      },
      {
        title: "Confirm port and broker",
        description:
          "San Antonio, Valparaíso, or another port; your Chilean broker confirms classification, taxes, and pickup.",
      },
      {
        title: "Review cleaning and photos",
        description:
          "Photos of undercarriage, attachments, and serial plate reduce the risk of phytosanitary measures on arrival.",
      },
      {
        title: "Separate scope and costs",
        description:
          "A port quote is not nationalized cost or final delivery to the region.",
      },
    ],
  },
  scopeSplit: {
    heading: "What Meridian coordinates and what your Chilean broker confirms",
    description:
      "A clean export/clearance split prevents surprises at the Chilean port.",
    meridianHeading: "Meridian coordinates",
    brokerHeading: "Your Chilean broker or importer confirms",
    rows: [
      {
        checkpoint: "Pre-purchase machine review",
        confirmedBy: "meridian",
        meridianNote:
          "Machine data, seller, pickup ZIP, photos, attachments, and dimensions before purchase.",
        brokerNote:
          "Fit with SAG Resolution 3.103/2016 and current regime.",
      },
      {
        checkpoint: "U.S. pickup, inland transport, and preparation",
        confirmedBy: "meridian",
        meridianNote:
          "Pickup, inland transport, dismantling, intensive cleaning, packing, and loading photos.",
        brokerNote:
          "Confirms that cleaning meets SAG requirements to avoid arrival treatments.",
      },
      {
        checkpoint: "Export documentation",
        confirmedBy: "meridian",
        meridianNote:
          "Commercial invoice, packing list, BL, AES/EEI, and USDA phytosanitary certificate when required.",
        brokerNote:
          "Classification, Chilean import documents, and local registry filings.",
      },
      {
        checkpoint: "Ocean booking and route to port",
        confirmedBy: "meridian",
        meridianNote:
          "Compare San Antonio, Valparaíso, or another port; carrier and sailing date.",
        brokerNote:
          "Port coordination, SAG inspection on arrival, and local pickup.",
      },
      {
        checkpoint: "Customs clearance and taxes",
        confirmedBy: "broker",
        meridianNote:
          "Meridian does not act as a Chilean broker; we hand documents to the importer.",
        brokerNote:
          "Classification, IVA, duties, taxes, and local procedures.",
      },
      {
        checkpoint: "Inland delivery",
        confirmedBy: "broker",
        meridianNote:
          "Scope ends at the agreed Chilean port unless a separate local contract exists.",
        brokerNote:
          "Inland trucking, unloading, and delivery to the final Chilean destination.",
      },
    ],
  },
  routeTable: {
    heading: "Routes and handoff points",
    description:
      "A port quote is not final delivery in Santiago, O'Higgins, Maule, Ñuble, Biobío, or Los Lagos.",
    columnRoute: "Route",
    columnBestFor: "Best fit",
    columnBuyerConfirms: "Buyer or broker confirms",
    rows: [
      {
        route: "San Antonio",
        bestFor:
          "Cargo bound for central Chile with consignees and brokers in the metro area.",
        buyerConfirms:
          "Clearance, SAG, classification, taxes, unloading, and inland movement to destination.",
      },
      {
        route: "Valparaíso",
        bestFor:
          "Cases where carrier, regional destination, or operating plan favor Valparaíso.",
        buyerConfirms:
          "Port operation, SAG, broker, and all local costs through to delivery.",
      },
      {
        route: "Other port",
        bestFor:
          "Cargo with a regional consignee or carrier using a different operating base.",
        buyerConfirms:
          "Port operation, SAG, broker, and all local costs through to delivery.",
      },
    ],
  },
  buyerPacket: {
    heading: "Send this before bidding",
    description:
      "With this information Meridian reviews the export scope and flags what your Chilean broker must confirm before purchase.",
    items: [
      "Listing or auction link",
      "Make, model, year, serial number, and hours",
      "U.S. pickup ZIP",
      "Photos of cleaning, undercarriage, attachments, and serial plate",
      "Dimensions, weight, and preferred Chilean port if already chosen",
      "Chile destination and broker details if already chosen",
    ],
    secondaryLabel: "Send the machine link by WhatsApp",
  },
  cta: {
    heading: "Check SAG and machine condition",
    description:
      "Send the unit and Chile destination. Meridian reviews export scope and cleaning; your broker confirms SAG, classification, taxes, and local pickup.",
    primaryLabel: "Check SAG and machine condition",
    whatsappMessage:
      "Hi. I'm evaluating importing used farm machinery from the U.S. to Chile.\n\nListing link:\nMake/model/year:\nHours:\nU.S. location (ZIP):\nFinal destination:\nDimensions/weight if available:\nAttachments included:\nDo I already have a local broker/importer?: yes/no",
  },
  sourcesHeading: "Official sources to review with your broker",
};

// ─── Public lookups ─────────────────────────────────────────────────────────

export const importGuideEnhancementsEs: Record<
  LatamImportGuideSlug,
  ImportGuideEnhancement
> = {
  "import-farm-machinery-united-states-paraguay": paraguayEs,
  "import-farm-machinery-united-states-argentina": argentinaEs,
  "import-farm-machinery-united-states-uruguay": uruguayEs,
  "import-farm-machinery-united-states-bolivia": boliviaEs,
  "import-farm-machinery-united-states-chile": chileEs,
};

export const importGuideEnhancementsEn: Record<
  LatamImportGuideSlug,
  ImportGuideEnhancement
> = {
  "import-farm-machinery-united-states-paraguay": paraguayEn,
  "import-farm-machinery-united-states-argentina": argentinaEn,
  "import-farm-machinery-united-states-uruguay": uruguayEn,
  "import-farm-machinery-united-states-bolivia": boliviaEn,
  "import-farm-machinery-united-states-chile": chileEn,
};

export function getImportGuideEnhancement(
  slug: string,
  locale: string,
): ImportGuideEnhancement | undefined {
  if (!isLatamImportGuideSlug(slug)) return undefined;
  const dictionary =
    locale === "es" ? importGuideEnhancementsEs : importGuideEnhancementsEn;
  return dictionary[slug];
}
