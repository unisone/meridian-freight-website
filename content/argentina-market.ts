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
    buyerQuestions: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    whatsappMessage: string;
  };
  marketChange: {
    title: string;
    intro: string;
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
  latamProof: {
    title: string;
    intro: string;
    destinationMatches: string[];
    badgeLabel: string;
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
    title: "Importar maquinaria agricola usada desde EE.UU. a Argentina | Meridian Export",
    description:
      "Guia en espanol para compradores argentinos: que incluye Meridian, que queda fuera, como cotizar puerta a puerto y cuando conviene mirar equipos usados en EE.UU.",
    keywords: [
      "importar maquinaria agricola usada desde estados unidos a argentina",
      "comprar cosechadora usada en estados unidos desde argentina",
      "enviar maquinaria agricola a zarate",
      "maquinaria usada eeuu argentina",
      "precio final maquinaria en argentina desde usa",
      "importar tractor usado desde usa a argentina",
      "despachante maquinaria agricola argentina",
      "puesta en puerto zarate maquinaria",
    ],
  },
  hero: {
    eyebrow: "Guia para compradores de Argentina",
    heading: "Importe maquinaria agricola usada desde Estados Unidos a Argentina con un solo socio",
    description:
      "Meridian coordina busqueda, retiro, desmontaje, embalaje, documentacion de exportacion y reserva maritima desde EE.UU. hasta puerto argentino. Un solo equipo desde el vendedor hasta el puerto.",
    highlights: [
      "Puerta a puerto, con alcance claro desde el primer mensaje",
      "Enfoque comercial en cosechadoras, tractores de alta potencia y pulverizadoras",
      "WhatsApp directo para cotizacion y calculadora como apoyo de flete",
    ],
    buyerQuestions: [
      "Precio final en Argentina",
      "Puesta en Zárate o Buenos Aires",
      "Con plataforma draper y equipo completo",
    ],
    primaryCtaLabel: "Cotizar por WhatsApp",
    secondaryCtaLabel: "Calcular flete estimado",
    whatsappMessage:
      "Hola. Estoy evaluando importar maquinaria agricola usada desde EE.UU. a Argentina y necesito una cotizacion orientativa.",
  },
  marketChange: {
    title: "Que cambio en Argentina y que no",
    intro:
      "El 16 de abril de 2025 el Decreto 273/2025 elimino el requisito previo del CIBU para muchos bienes usados. Eso abrio el mercado, pero no convirtio la importacion en un tramite automatico sin coordinacion tecnica.",
    changedLabel: "Lo que si cambio",
    changed: [
      "La conversacion dejo de ser si se puede importar y paso a ser como hacerlo bien.",
      "Hoy es mas viable comparar lotes usados de EE.UU. frente a disponibilidad y precios locales.",
      "El comprador argentino puede avanzar mas rapido si tiene claro el alcance puerta a puerto y su costo argentino por separado.",
    ],
    unchangedLabel: "Lo que sigue requiriendo trabajo",
    unchanged: [
      "La AFIDI y los controles fitosanitarios de SENASA siguen siendo relevantes para maquinaria agricola usada.",
      "La limpieza, ausencia de tierra y restos vegetales, y la documentacion bien armada siguen siendo criticas.",
      "El costo final depende tambien de clasificacion arancelaria, despachante, tributos, gastos portuarios y transporte interior en Argentina.",
    ],
    officialLinks: [
      {
        label: "Decreto 273/2025",
        href: "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto",
      },
      {
        label: "AFIDI y evaluacion de importaciones",
        href: "https://www.argentina.gob.ar/servicio/solicitar-autorizacion-fitosanitaria-de-importacion-afidi-y-evaluacion-de-importaciones",
      },
      {
        label: "Control SENASA sobre maquinaria usada",
        href: "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de",
      },
    ],
  },
  includedVsExcluded: {
    title: "Que incluye Meridian y que queda fuera",
    intro:
      "La pregunta correcta no es solo cuanto cuesta la maquina. La pregunta es que parte cubre la cotizacion de Meridian y que parte debe cerrar el comprador en Argentina con su despachante y sus costos locales.",
    includedLabel: "Incluido en nuestro alcance",
    included: [
      "Coordinacion de compra con dealer, subasta o vendedor privado en EE.UU. o Canada.",
      "Retiro en origen y movimiento hacia la instalacion de embalaje o puerto de carga.",
      "Desmontaje tecnico, etiquetado, fotos de referencia y embalaje para exportacion.",
      "Reserva maritima, documentacion de exportacion y coordinacion hasta puerto de destino.",
    ],
    excludedLabel: "Queda fuera de la cotizacion puerta a puerto",
    excluded: [
      "Despachante argentino, nacionalizacion y honorarios locales de aduana.",
      "Derechos, IVA, tasas, percepciones y otros costos ligados a NCM y regimen aplicable.",
      "AFIDI, tramites SENASA y exigencias del importador argentino ante autoridades locales.",
      "Flete interior desde Zárate, Buenos Aires u otro puerto hasta campo, taller o concesionario.",
    ],
    note:
      "Si usted quiere hablar de precio final en Argentina, el paso correcto es sumar nuestra cotizacion puerta a puerto con el costo argentino que le arme su despachante.",
    midCtaHeading: "Si necesita alcance claro antes de comprar, esta pagina es para usted",
    midCtaDescription:
      "Podemos orientarlo sobre el tramo EE.UU. a puerto argentino y decirle exactamente que debe cerrar del lado argentino antes de comprometerse con una compra.",
    midCtaWhatsAppLabel: "Hablar por WhatsApp",
    midCtaCalculatorLabel: "Ver calculadora de flete",
  },
  equipmentFocus: {
    title: "En que equipos conviene mirar EE.UU.",
    intro:
      "No todo equipo justifica la operacion. Donde EE.UU. suele tener mas sentido es en maquinas premium, configuraciones dificiles de conseguir y unidades usadas donde la disponibilidad pesa tanto como el precio.",
    items: [
      {
        title: "Cosechadoras usadas de alta gama",
        summary:
          "Es la categoria con mejor encaje comercial para compradores argentinos que buscan capacidad, horas razonables y configuraciones especificas.",
        reason:
          "La diferencia no es solo precio. Tambien importa encontrar la unidad correcta, con plataforma compatible y una salida logistica clara hacia puerto.",
        href: "/equipment/combines",
        linkLabel: "Ver pagina de cosechadoras",
      },
      {
        title: "Tractores de alta potencia",
        summary:
          "Los tractores de potencia alta o configuracion menos comun son candidatos mas fuertes que los segmentos donde ya hay mucha oferta regional.",
        reason:
          "En estas bandas de potencia, el comprador suele valorar disponibilidad real, equipamiento y condicion antes que una simple comparacion de lista.",
        href: "/equipment/tractors",
        linkLabel: "Ver pagina de tractores",
      },
      {
        title: "Pulverizadoras autopropulsadas",
        summary:
          "Las pulverizadoras premium y ciertas configuraciones de precision pueden ser mas interesantes que buscar equivalentes limitados en plaza.",
        reason:
          "Cuando la unidad correcta aparece en EE.UU., la rapidez para inspeccionar, retirar y embarcar pesa mucho en la decision.",
        href: "/equipment/sprayers",
        linkLabel: "Ver pagina de pulverizadoras",
      },
      {
        title: "Plataformas draper y compra asistida",
        summary:
          "En muchos casos el cuello de botella no es solo la maquina principal, sino cerrar el paquete correcto con plataforma, configuracion y vendedor serio.",
        reason:
          "Ahi entra nuestro trabajo de busqueda, verificacion y coordinacion de compra antes de mover nada al puerto.",
        href: "/services/equipment-sales",
        linkLabel: "Ver servicio de compra asistida",
      },
    ],
  },
  processSteps: {
    title: "Como funciona",
    intro:
      "La forma mas segura de avanzar es separar la operacion en cinco decisiones claras. Asi usted sabe en que momento cotizar, cuando validar con despachante y cuando cerrar la compra.",
    steps: [
      {
        step: "1",
        title: "Definir maquina, horas y configuracion",
        description:
          "Usted comparte modelo, estado, ubicacion y si la compra necesita incluir plataforma, draper u otros accesorios.",
      },
      {
        step: "2",
        title: "Validar compra y alcance puerta a puerto",
        description:
          "Revisamos retiro, desmontaje, embalaje y salida maritima para decirle que entra en la cotizacion y que debe quedar del lado argentino.",
      },
      {
        step: "3",
        title: "Retirar, desmontar y embalar",
        description:
          "Movemos el equipo desde el vendedor, preparamos la maquina para exportacion y documentamos el proceso para rearmado y control.",
      },
      {
        step: "4",
        title: "Reservar flete y preparar documentacion",
        description:
          "Coordinamos espacio maritimo y la documentacion de exportacion desde EE.UU. o Canada hasta el puerto acordado.",
      },
      {
        step: "5",
        title: "Arribo a puerto argentino y handoff local",
        description:
          "El comprador continua con despachante, AFIDI/SENASA cuando aplique, impuestos y flete interior desde puerto hasta destino final.",
      },
    ],
  },
  latamProof: {
    title: "Exportaciones recientes en LATAM",
    intro:
      "Estas son operaciones reales de Meridian en America Latina. Las mostramos como prueba operativa regional, no como embarques realizados a Argentina.",
    destinationMatches: ["Brasil", "Chile"],
    badgeLabel: "Prueba LATAM",
  },
  faq: {
    title: "Preguntas reales de compradores argentinos",
    intro:
      "La mayoria de las conversaciones serias no arrancan con una pregunta tecnica de flete. Arrancan con precio final, alcance real y riesgo de aduana. Esta guia responde eso primero.",
    entries: [
      {
        question: "Cuando dicen puerta a puerto, que incluye exactamente?",
        answer:
          "Puerta a puerto significa que Meridian cubre la coordinacion desde el vendedor en EE.UU. o Canada hasta el puerto de destino acordado. Incluye retiro, desmontaje, embalaje, documentacion de exportacion y reserva maritima. No incluye nacionalizacion, despachante, impuestos, AFIDI/SENASA ni transporte interior en Argentina.",
        category: "Argentina",
      },
      {
        question: "Pueden cotizar puesta en Zárate o Buenos Aires?",
        answer:
          "Si. Podemos orientar el tramo hasta puerto argentino y preparar la parte puerta a puerto. Para cerrar el costo total en Zárate, Buenos Aires u otro punto, hace falta sumar la parte argentina con su despachante y los gastos locales correspondientes.",
        category: "Argentina",
      },
      {
        question: "Me pueden decir el precio final en Argentina?",
        answer:
          "Podemos darle la parte que controlamos con precision: compra asistida si aplica, retiro, embalaje, exportacion y flete hasta puerto. El precio final en Argentina requiere sumar tributos, gastos portuarios, despachante y transporte interior segun la clasificacion del equipo y su destino final.",
        category: "Argentina",
      },
      {
        question: "Cuanto tarda traer una cosechadora o un tractor desde EE.UU.?",
        answer:
          "El plazo real depende del estado de la compra, la ubicacion del vendedor, el modo de embarque y la salida disponible. Lo correcto es cotizar sobre una unidad concreta. La parte operativa previa al zarpe y el tramo maritimo no deben analizarse por separado si usted quiere un escenario serio.",
        category: "Argentina",
      },
      {
        question: "Si la cosechadora lleva plataforma draper, tambien la manejan?",
        answer:
          "Si. Podemos coordinar la maquina principal y tambien plataforma, draper u otros componentes que cambian el embalaje y la logistica. Esa parte debe definirse antes de cerrar la compra para que la cotizacion contemple el paquete completo.",
        category: "Argentina",
      },
      {
        question: "Meridian tambien me ayuda a encontrar la maquina?",
        answer:
          "Si. Si usted todavia no cerro la compra, podemos trabajar la busqueda y validacion con dealers, subastas o vendedores privados en EE.UU. o Canada antes de mover el equipo.",
        category: "Argentina",
      },
      {
        question: "Meridian se ocupa del despachante argentino?",
        answer:
          "No actuamos como despachante argentino. Si lo necesita, podemos coordinar el tramo de exportacion y ayudarle a preparar la informacion que su despachante va a necesitar para armar la parte local.",
        category: "Argentina",
      },
    ],
  },
  proofLinks: [
    {
      href: "/equipment/combines",
      label: "Cosechadoras usadas",
      description: "Revise el tipo de equipos y embalaje que mejor calzan con demanda argentina.",
    },
    {
      href: "/services/equipment-sales",
      label: "Compra asistida en EE.UU.",
      description: "Si todavia no tiene la maquina cerrada, esta es la capa comercial que reduce errores caros.",
    },
    {
      href: "/pricing/calculator",
      label: "Calculadora de flete",
      description: "Use la calculadora para una referencia de flete y luego complete la parte argentina con su despachante.",
    },
    {
      href: "/projects",
      label: "Proyectos recientes",
      description: "Vea exportaciones reales de Meridian en LATAM y otros mercados.",
    },
  ],
  cta: {
    heading: "Si esta comparando EE.UU. contra mercado local, primero cierre el alcance correcto",
    description:
      "Le ayudamos a separar compra, exportacion y costo argentino para que no tome una decision con una foto incompleta. WhatsApp primero; calculadora como apoyo.",
    whatsappLabel: "Cotizar por WhatsApp",
    calculatorLabel: "Calcular flete estimado",
  },
};
