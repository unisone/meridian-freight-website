import type { FaqEntry } from "@/content/faq";

export interface ArgentinaMarketPageContent {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    highlights: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    whatsappMessage: string;
    scopeCaption: string;
    scopeIncludedLabel: string;
    scopeIncluded: string[];
    scopeExcludedLabel: string;
    scopeExcluded: string[];
    scopeFootnote: string;
  };
  marketChange: {
    title: string;
    intro: string;
    dateLabel: string;
    changedLabel: string;
    changed: string[];
    unchangedLabel: string;
    unchanged: string[];
    officialLinks: Array<{
      label: string;
      href: string;
    }>;
  };
  includedVsExcluded: {
    title: string;
    intro: string;
    includedLabel: string;
    included: string[];
    excludedLabel: string;
    excluded: string[];
    note: string;
    midCtaHeading: string;
    midCtaDescription: string;
    midCtaWhatsAppLabel: string;
    midCtaCalculatorLabel: string;
  };
  equipmentFocus: {
    title: string;
    intro: string;
    items: Array<{
      title: string;
      summary: string;
      reason: string;
      href: string;
      linkLabel: string;
    }>;
  };
  processSteps: {
    title: string;
    intro: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  credibility: {
    title: string;
    intro: string;
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
  faq: {
    title: string;
    intro: string;
    entries: FaqEntry[];
  };
  proofLinks: Array<{
    href: string;
    label: string;
    description: string;
  }>;
  cta: {
    heading: string;
    description: string;
    whatsappLabel: string;
    calculatorLabel: string;
  };
}

export const argentinaMarketPage: ArgentinaMarketPageContent = {
  seo: {
    title: "Importar maquinaria agrícola usada desde EE.UU. a Argentina",
    description:
      "Guía en español para compradores argentinos: alcance puerta a puerto, qué cubre Meridian, qué queda del lado local y cuándo conviene mirar equipos usados en EE.UU.",
    keywords: [
      "importar maquinaria agrícola usada desde estados unidos a argentina",
      "comprar cosechadora usada en estados unidos desde argentina",
      "importar tractor usado desde usa a argentina",
      "enviar maquinaria agrícola a zárate",
      "maquinaria usada eeuu argentina",
      "precio final maquinaria en argentina desde usa",
      "despachante maquinaria agrícola argentina",
      "puesta en puerto zárate maquinaria",
    ],
  },
  hero: {
    eyebrow: "Guía para compradores argentinos",
    heading:
      "Importe maquinaria agrícola usada de EE.UU. a Argentina con un solo socio, del vendedor al puerto",
    description:
      "Meridian coordina compra asistida, retiro, desmontaje, embalaje, documentación de exportación y reserva marítima desde EE.UU. o Canadá hasta puerto argentino. El lado argentino se deja separado y claro desde el primer mensaje.",
    highlights: [
      "Pensado para compradores argentinos, no para dealers estadounidenses.",
      "WhatsApp para cotizar; calculadora como referencia del tramo logístico, no como costo final argentino.",
      "Enfoque comercial en cosechadoras, tractores de alta potencia, pulverizadoras y paquetes con draper.",
    ],
    primaryCtaLabel: "Cotizar por WhatsApp",
    secondaryCtaLabel: "Calcular flete estimado",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a Argentina y necesito una cotización orientativa.",
    scopeCaption: "Antes de comprar, hay que separar bien los dos lados de la operación",
    scopeIncludedLabel: "Meridian cubre",
    scopeIncluded: [
      "Compra asistida y coordinación con el vendedor",
      "Retiro en origen, desmontaje y embalaje",
      "Documentación de exportación y reserva marítima",
    ],
    scopeExcludedLabel: "Argentina queda aparte",
    scopeExcluded: [
      "Despachante y nacionalización local",
      "AFIDI / SENASA cuando aplique",
      "Tributos, tasas y flete interior",
    ],
    scopeFootnote:
      "Eso evita comparar una cotización puerta a puerto con un “precio final en Argentina” armado sobre supuestos distintos.",
  },
  marketChange: {
    title: "Qué cambió en Argentina y qué no",
    intro:
      "El 16 de abril de 2025 el Decreto 273/2025 eliminó el requisito previo del CIBU para muchos bienes usados. Eso abrió el mercado. Lo que no hizo fue volver automática una operación que sigue dependiendo de documentación, limpieza y coordinación técnica.",
    dateLabel: "16 abril 2025",
    changedLabel: "Lo que sí cambió",
    changed: [
      "La conversación dejó de ser si se puede importar y pasó a ser cómo cerrar una operación seria.",
      "Hoy es más viable comparar disponibilidad, configuración y precio de usados en EE.UU. frente a mercado local.",
      "El comprador argentino puede avanzar más rápido si separa bien el tramo puerta a puerto del costo argentino final.",
    ],
    unchangedLabel: "Lo que sigue exigiendo trabajo",
    unchanged: [
      "AFIDI y controles fitosanitarios de SENASA siguen siendo relevantes para maquinaria agrícola usada.",
      "Limpieza, ausencia de tierra o restos vegetales y documentación prolija siguen siendo críticas.",
      "El costo final depende además de NCM, despachante, tributos, gastos portuarios y transporte interior en Argentina.",
    ],
    officialLinks: [
      {
        label: "Decreto 273/2025",
        href: "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto",
      },
      {
        label: "AFIDI y evaluación de importaciones",
        href: "https://www.argentina.gob.ar/servicio/solicitar-autorizacion-fitosanitaria-de-importacion-afidi-y-evaluacion-de-importaciones",
      },
      {
        label: "Control SENASA sobre maquinaria usada",
        href: "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de",
      },
    ],
  },
  includedVsExcluded: {
    title: "Qué incluye Meridian y qué queda fuera",
    intro:
      "La compra correcta no se decide sólo por el valor de la máquina. Se decide entendiendo qué parte del proceso controla Meridian y qué parte debe cerrar el importador argentino con su despachante y sus costos locales.",
    includedLabel: "Incluido en nuestro alcance",
    included: [
      "Búsqueda y validación con dealer, subasta o vendedor privado en EE.UU. o Canadá.",
      "Retiro en origen y movimiento hacia instalación de embalaje o puerto de carga.",
      "Desmontaje técnico, etiquetado, fotos de referencia y embalaje para exportación.",
      "Reserva marítima, documentación de exportación y coordinación hasta puerto de destino.",
    ],
    excludedLabel: "Queda fuera de la cotización puerta a puerto",
    excluded: [
      "Despachante argentino, nacionalización y honorarios locales de aduana.",
      "Derechos, IVA, tasas, percepciones y otros costos ligados a NCM y régimen aplicable.",
      "AFIDI, trámites SENASA y exigencias del importador argentino ante autoridades locales.",
      "Flete interior desde Zárate, Buenos Aires u otro puerto hasta campo, taller o concesionario.",
    ],
    note:
      "Si usted quiere hablar de precio final en Argentina, el paso correcto es sumar nuestra cotización puerta a puerto con la parte argentina armada por su despachante.",
    midCtaHeading:
      "Si necesita alcance claro antes de comprometerse con una compra, esta página está hecha para eso",
    midCtaDescription:
      "Podemos orientarlo sobre el tramo EE.UU. a puerto argentino y decirle qué debe validar del lado argentino antes de cerrar con un vendedor.",
    midCtaWhatsAppLabel: "Hablar por WhatsApp",
    midCtaCalculatorLabel: "Ver calculadora de flete",
  },
  equipmentFocus: {
    title: "En qué equipos suele tener sentido mirar EE.UU.",
    intro:
      "No todo equipo justifica la operación. Donde EE.UU. suele tener más lógica es en máquinas premium, configuraciones difíciles de conseguir y unidades usadas donde disponibilidad, estado y equipamiento pesan tanto como el precio.",
    items: [
      {
        title: "Cosechadoras usadas de alta gama",
        summary:
          "Es la categoría más fuerte cuando el comprador argentino busca capacidad, horas razonables y configuración específica.",
        reason:
          "La ventaja no es sólo el valor publicado. También importa encontrar la unidad correcta, con cabezal compatible y una salida logística clara hacia puerto.",
        href: "/equipment/combines",
        linkLabel: "Ver página de cosechadoras",
      },
      {
        title: "Tractores de alta potencia",
        summary:
          "Los tractores de potencia alta o configuración menos común son mejores candidatos que los segmentos donde ya hay mucha oferta regional.",
        reason:
          "En estas bandas, el comprador suele valorar disponibilidad real, equipamiento y condición antes que una simple comparación de lista.",
        href: "/equipment/tractors",
        linkLabel: "Ver página de tractores",
      },
      {
        title: "Pulverizadoras autopropulsadas",
        summary:
          "Las pulverizadoras premium y ciertas configuraciones de precisión pueden justificar una búsqueda en EE.UU. mejor que un equivalente limitado en plaza.",
        reason:
          "Cuando aparece la unidad correcta, la rapidez para inspeccionar, retirar y embarcar pesa mucho en la decisión.",
        href: "/equipment/sprayers",
        linkLabel: "Ver página de pulverizadoras",
      },
      {
        title: "Plataformas draper y paquetes completos",
        summary:
          "Muchas compras se traban no por la máquina principal, sino por cerrar bien el paquete con draper, cabezal o configuración correcta.",
        reason:
          "Ahí entra la compra asistida: búsqueda, validación del vendedor y coordinación de todo el paquete antes de mover nada al puerto.",
        href: "/services/equipment-sales",
        linkLabel: "Ver servicio de compra asistida",
      },
    ],
  },
  processSteps: {
    title: "Cómo funciona",
    intro:
      "La forma más segura de avanzar es separar la operación en cinco decisiones claras. Así usted sabe cuándo cotizar, cuándo validar con despachante y cuándo cerrar la compra.",
    steps: [
      {
        step: "1",
        title: "Definir máquina, horas y configuración",
        description:
          "Usted comparte modelo, estado, ubicación y si la compra necesita incluir draper, plataforma u otros accesorios.",
      },
      {
        step: "2",
        title: "Validar compra y alcance puerta a puerto",
        description:
          "Revisamos retiro, desmontaje, embalaje y salida marítima para decirle qué entra en la cotización y qué debe quedar del lado argentino.",
      },
      {
        step: "3",
        title: "Retirar, desmontar y embalar",
        description:
          "Movemos el equipo desde el vendedor, preparamos la máquina para exportación y documentamos el proceso para control y rearme.",
      },
      {
        step: "4",
        title: "Reservar flete y preparar documentación",
        description:
          "Coordinamos espacio marítimo y documentación de exportación desde EE.UU. o Canadá hasta el puerto acordado.",
      },
      {
        step: "5",
        title: "Arribo a puerto argentino y handoff local",
        description:
          "El comprador continúa con despachante, AFIDI/SENASA cuando aplique, tributos y flete interior hasta destino final.",
      },
    ],
  },
  credibility: {
    title: "Qué sí puede validar hoy antes de avanzar",
    intro:
      "Para esta página evitamos usar operaciones puntuales como si fueran prueba directa de Argentina. Lo correcto es mostrar qué capacidad comercial y operativa puede verificar hoy mismo en Meridian.",
    pillars: [
      {
        title: "Compra asistida en EE.UU. y Canadá",
        description:
          "Si todavía no cerró la máquina, Meridian puede intervenir antes del embarque: búsqueda, validación con el vendedor y coordinación de compra.",
      },
      {
        title: "Desmontaje, embalaje y documentación de exportación",
        description:
          "La propuesta no es sólo conseguir el equipo. Es moverlo bien desde el origen, prepararlo para exportación y dejar claro el alcance hasta puerto.",
      },
      {
        title: "Biblioteca visible de proyectos internacionales",
        description:
          "La galería de proyectos sirve para revisar cómo trabaja Meridian en distintos equipos y mercados, sin presentarla como prueba específica del corredor Argentina.",
      },
    ],
    noteTitle: "Importante",
    note:
      "Si más adelante se confirman proyectos reales que encajen con la narrativa Argentina, se pueden curar de forma explícita. Mientras tanto, es mejor ser exactos que inflar prueba.",
    projectGalleryLabel: "Ver proyectos globales de Meridian",
    projectGalleryDescription:
      "Explore la biblioteca completa de proyectos y revise el tipo de operación, embalaje y documentación que Meridian ya ejecuta en otros mercados.",
    projectGalleryHref: "/projects",
  },
  faq: {
    title: "Preguntas reales de compradores argentinos",
    intro:
      "Las conversaciones serias no arrancan con una pregunta técnica de flete. Arrancan con precio final, alcance real y riesgo de aduana. Esta guía responde eso primero.",
    entries: [
      {
        question: "Cuando dicen puerta a puerto, ¿qué incluye exactamente?",
        answer:
          "Puerta a puerto significa que Meridian cubre la coordinación desde el vendedor en EE.UU. o Canadá hasta el puerto de destino acordado. Incluye retiro, desmontaje, embalaje, documentación de exportación y reserva marítima. No incluye nacionalización, despachante, impuestos, AFIDI/SENASA ni transporte interior en Argentina.",
        category: "Argentina",
      },
      {
        question: "¿Pueden cotizar puesta en Zárate o Buenos Aires?",
        answer:
          "Sí. Podemos orientar el tramo hasta puerto argentino y preparar la parte puerta a puerto. Para cerrar el costo total en Zárate, Buenos Aires u otro punto, hace falta sumar la parte argentina con su despachante y los gastos locales correspondientes.",
        category: "Argentina",
      },
      {
        question: "¿Me pueden decir el precio final en Argentina?",
        answer:
          "Podemos darle con precisión la parte que controlamos: compra asistida si aplica, retiro, embalaje, exportación y flete hasta puerto. El precio final en Argentina requiere sumar tributos, gastos portuarios, despachante y transporte interior según la clasificación del equipo y su destino final.",
        category: "Argentina",
      },
      {
        question: "¿Cuánto tarda traer una cosechadora o un tractor desde EE.UU.?",
        answer:
          "El plazo real depende del estado de la compra, la ubicación del vendedor, el modo de embarque y la salida disponible. Lo correcto es cotizar sobre una unidad concreta. La parte operativa previa al zarpe y el tramo marítimo no deben analizarse por separado si usted quiere un escenario serio.",
        category: "Argentina",
      },
      {
        question: "Si la cosechadora lleva plataforma draper, ¿también la manejan?",
        answer:
          "Sí. Podemos coordinar la máquina principal y también plataforma, draper u otros componentes que cambian el embalaje y la logística. Esa parte debe definirse antes de cerrar la compra para que la cotización contemple el paquete completo.",
        category: "Argentina",
      },
      {
        question: "¿Meridian también me ayuda a encontrar la máquina?",
        answer:
          "Sí. Si usted todavía no cerró la compra, podemos trabajar la búsqueda y validación con dealers, subastas o vendedores privados en EE.UU. o Canadá antes de mover el equipo.",
        category: "Argentina",
      },
      {
        question: "¿Meridian se ocupa del despachante argentino?",
        answer:
          "No actuamos como despachante argentino. Si lo necesita, podemos coordinar el tramo de exportación y ayudarle a preparar la información que su despachante va a necesitar para armar la parte local.",
        category: "Argentina",
      },
    ],
  },
  proofLinks: [
    {
      href: "/equipment/combines",
      label: "Cosechadoras usadas",
      description:
        "Revise el tipo de equipos y embalaje que mejor calzan con demanda argentina.",
    },
    {
      href: "/services/equipment-sales",
      label: "Compra asistida en EE.UU.",
      description:
        "Si todavía no tiene la máquina cerrada, esta es la capa comercial que reduce errores caros.",
    },
    {
      href: "/pricing/calculator",
      label: "Calculadora de flete",
      description:
        "Úsela para una referencia del tramo logístico y complete la parte argentina con su despachante.",
    },
    {
      href: "/projects",
      label: "Galería de proyectos",
      description:
        "Revise la biblioteca global de exportaciones de Meridian sin usarla como prueba artificial del corredor Argentina.",
    },
  ],
  cta: {
    heading:
      "Si está comparando EE.UU. contra mercado local, primero cierre bien el alcance",
    description:
      "Le ayudamos a separar compra, exportación y costo argentino para que no tome una decisión con una foto incompleta. WhatsApp primero; calculadora como apoyo.",
    whatsappLabel: "Cotizar por WhatsApp",
    calculatorLabel: "Calcular flete estimado",
  },
};
