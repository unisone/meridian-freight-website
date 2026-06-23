// AUTO-GENERATED P2 copy (verified LATAM Spanish). Source: workflow wf_17d2cfa9-968.
// Claim-safety + consistency reviewed; CFIA/seoTitle/trust-line fixes applied in transform.
// English-internal review version: docs/plans/latam-paid-search-destinations/copy-en-internal.md
// Pending client native LATAM review before Gate B go-live.

export interface PaidSearchCopy {
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly eyebrow: string;
  readonly h1: string;
  readonly heroBody: string;
  readonly heroBullets: readonly string[];
  readonly scopeIncluded: readonly string[];
  readonly scopeExcluded: readonly string[];
  readonly processIntro: string;
  readonly processSteps: readonly { readonly title: string; readonly body: string }[];
  readonly quoteIntro: string;
  readonly quoteFields: readonly string[];
  readonly complianceHeading: string;
  readonly complianceBody: string;
  readonly localResponsibility: string;
  readonly faq: readonly { readonly question: string; readonly answer: string }[];
  readonly ctaHeading: string;
  readonly ctaDescription: string;
  readonly whatsappPrefill: string;
}

export const PAID_SEARCH_COPY: Record<string, PaidSearchCopy> = {
  "argentina/importacion-maquinaria-usa": {
    "seoTitle": "Importar maquinaria de EE. UU. a Argentina",
    "seoDescription": "Coordinamos retiro, embalaje, documentación y flete de maquinaria usada desde EE. UU. a Argentina. La nacionalización la gestiona tu despachante.",
    "eyebrow": "Maquinaria usada desde EE. UU. · Argentina",
    "h1": "Importación de maquinaria desde EE. UU. a Argentina",
    "heroBody": "Meridian coordina el lado estadounidense de tu importación: contacto con el vendedor, retiro, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo hasta el puerto acordado. La nacionalización, los aranceles, el IVA y la entrega interior en Argentina los confirma y gestiona tu despachante. Coordiná con nosotros el tramo de EE. UU. a Argentina y revisá con tu despachante la admisibilidad de cada unidad antes de comprar o embarcar.",
    "heroBullets": [
      "Retiro y transporte de la maquinaria dentro de EE. UU. y Canadá.",
      "Medición, desmontaje o embalaje y carga en origen según el equipo.",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA).",
      "Reserva de flete marítimo: contenedor, flat rack o RoRo según la unidad."
    ],
    "scopeIncluded": [
      "Compra asistida y retiro en EE. UU./Canadá",
      "Medición, desmontaje y embalaje cuando corresponde",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo al puerto acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Argentina",
      "Despacho aduanero y declaración jurada en el SIM (Sistema Malvina)",
      "AFIDI (SENASA) e inspección fitosanitaria en destino",
      "Permisos del importador y entrega interior en Argentina"
    ],
    "processIntro": "La ruta se define a partir de tu equipo real, no de una tarifa genérica. Primero confirmamos la información técnica y el alcance del lado de EE. UU.; después reservás. La parte argentina la coordinás en paralelo con tu despachante.",
    "processSteps": [
      {
        "title": "Compartí la maquinaria",
        "body": "Enviá el anuncio o la factura proforma, con marca, modelo, año, ubicación en EE. UU. y estado de compra de la unidad usada."
      },
      {
        "title": "Definimos medidas y modalidad",
        "body": "Revisamos dimensiones, peso y si requiere desmontaje, y elegimos contenedor, flat rack o RoRo. Conviene limpiar la unidad y dejarla libre de suelo y restos vegetales antes de embarcar."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
      },
      {
        "title": "Entregamos el expediente para destino",
        "body": "Te pasamos los documentos del tramo internacional para que tu despachante arme la declaración jurada en el SIM y gestione la nacionalización en Argentina."
      }
    ],
    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. Mientras tanto, validá la admisibilidad de la unidad con tu despachante.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo y año de la maquinaria",
      "Ubicación exacta en EE. UU. o Canadá",
      "Estado de compra: evaluando, reservado o comprado",
      "Dimensiones y peso disponibles",
      "Ciudad de destino en Argentina y fecha estimada",
      "Contacto de tu despachante, si ya lo tenés"
    ],
    "complianceHeading": "Qué cambió en Argentina y qué tenés que validar antes de embarcar",
    "complianceBody": "El Decreto 273/2025, vigente desde el 17/04/2025, eliminó el CIBU como requisito previo y lo reemplazó por una declaración jurada que tu despachante presenta en el Sistema Informático Malvina (SIM). Esto no eliminó los controles fitosanitarios, ambientales ni de seguridad: según la clasificación, condición y uso, la maquinaria agrícola usada normalmente requiere la Autorización Fitosanitaria de Importación (AFIDI) de SENASA, que se gestiona por SIGPV-IMPO antes de la transacción. SENASA inspecciona en puerto, por lo que el equipo debe llegar limpio, libre de suelo y restos vegetales. Meridian no gestiona AFIDI, el SIM ni la nacionalización.",
    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad, la AFIDI y la nacionalización en Argentina quedan bajo responsabilidad de tu importador y su despachante.",
    "faq": [
      {
        "question": "¿Meridian vende la maquinaria o la nacionaliza en Argentina?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. Coordinamos con tu vendedor o brindamos compra asistida bajo un alcance separado, pero la nacionalización, los tributos y el despacho aduanero los gestiona tu despachante en Argentina."
      },
      {
        "question": "¿Con el Decreto 273/2025 ya no hay requisitos para importar usados?",
        "answer": "No es así. El decreto reemplazó el CIBU por una declaración jurada en el SIM que arma tu despachante, pero siguen vigentes los controles fitosanitarios, ambientales y de seguridad. Según el equipo, puede requerirse la AFIDI de SENASA. Validá cada caso con tu despachante antes de comprar o embarcar."
      },
      {
        "question": "¿Pueden darme el costo final nacionalizado?",
        "answer": "Cotizamos el alcance internacional que controlamos desde EE. UU. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Tu despachante calcula aranceles, IVA, tasas e inspecciones según la clasificación real de la unidad."
      },
      {
        "question": "¿La maquinaria tiene que llegar limpia?",
        "answer": "Sí. SENASA inspecciona en puerto y exige equipos limpios, libres de suelo y restos vegetales. Preparamos la unidad para el embarque, pero la inspección fitosanitaria en destino la realiza SENASA y la coordina tu despachante."
      }
    ],
    "ctaHeading": "Cotizá tu importación de maquinaria desde EE. UU. a Argentina",
    "ctaDescription": "Compartí el equipo y el destino; te devolvemos por escrito el alcance del tramo internacional antes de reservar.",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar la importación de maquinaria desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Argentina]. Ref: {{whatsapp_ref}}"
  },
  "argentina/flete-cosechadoras-usa": {
    "seoTitle": "Flete de cosechadoras EE. UU. a Argentina",
    "seoDescription": "Coordinamos retiro, desarme, embalaje, documentación y flete de cosechadoras usadas desde EE. UU. a Argentina. La nacionalización la gestiona tu despachante.",
    "eyebrow": "Cosechadoras desde EE. UU. · Argentina",
    "h1": "Flete de cosechadoras desde EE. UU. a Argentina",
    "heroBody": "Meridian coordina el tramo estadounidense de tu cosechadora: contacto con el vendedor, retiro, medición, desarme de plataforma y cabezal cuando corresponde, embalaje, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo hasta el puerto acordado. La nacionalización, los aranceles, el IVA y la entrega interior en Argentina los confirma y gestiona tu despachante. Coordiná con nosotros el flete de EE. UU. a Argentina y revisá la admisibilidad de la unidad con tu despachante antes de comprar o embarcar.",
    "heroBullets": [
      "Retiro de la cosechadora en EE. UU. o Canadá y transporte a puerto.",
      "Desarme de cabezal o plataforma, medición y embalaje cuando corresponde.",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA).",
      "Reserva de flete marítimo en flat rack o RoRo según las dimensiones."
    ],
    "scopeIncluded": [
      "Compra asistida y retiro de la cosechadora en EE. UU./Canadá",
      "Desarme, medición y embalaje del cabezal o plataforma cuando corresponde",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo al puerto acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Argentina",
      "Despacho aduanero y declaración jurada en el SIM (Sistema Malvina)",
      "AFIDI (SENASA) e inspección fitosanitaria en destino",
      "Permisos del importador y entrega interior hasta el campo"
    ],
    "processIntro": "La ruta de tu cosechadora se define por sus dimensiones reales, no por una tarifa genérica. Primero confirmamos las medidas, el desarme y el alcance del lado de EE. UU.; después reservás. La parte argentina la coordinás en paralelo con tu despachante.",
    "processSteps": [
      {
        "title": "Compartí la cosechadora",
        "body": "Enviá el anuncio o la factura proforma, con marca, modelo, año, ancho del cabezal, ubicación en EE. UU. y estado de compra."
      },
      {
        "title": "Definimos desarme y modalidad",
        "body": "Revisamos dimensiones y peso, definimos el desarme de cabezal o plataforma y elegimos flat rack o RoRo. La unidad debe quedar limpia, libre de suelo y restos vegetales antes de embarcar."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, desarme, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
      },
      {
        "title": "Entregamos el expediente para destino",
        "body": "Te pasamos los documentos del tramo internacional para que tu despachante arme la declaración jurada en el SIM y gestione la nacionalización en Argentina."
      }
    ],
    "quoteIntro": "Con estos datos definimos el flete internacional de tu cosechadora sin inventar medidas, ruta ni formato de carga. Mientras tanto, validá la admisibilidad de la unidad con tu despachante.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo y año de la cosechadora",
      "Ancho del cabezal o plataforma y peso disponible",
      "Ubicación exacta en EE. UU. o Canadá",
      "Estado de compra: evaluando, reservado o comprado",
      "Ciudad de destino en Argentina y fecha estimada",
      "Contacto de tu despachante, si ya lo tenés"
    ],
    "complianceHeading": "Qué cambió en Argentina y qué tenés que validar antes de embarcar tu cosechadora",
    "complianceBody": "El Decreto 273/2025, vigente desde el 17/04/2025, eliminó el CIBU como requisito previo y lo reemplazó por una declaración jurada que tu despachante presenta en el Sistema Informático Malvina (SIM). Esto no eliminó los controles fitosanitarios, ambientales ni de seguridad: por tratarse de maquinaria agrícola usada, la cosechadora normalmente requiere la Autorización Fitosanitaria de Importación (AFIDI) de SENASA, que se gestiona por SIGPV-IMPO antes de la transacción. SENASA inspecciona en puerto, así que la unidad debe llegar limpia, libre de suelo y restos vegetales. Meridian no gestiona AFIDI, el SIM ni la nacionalización.",
    "localResponsibility": "Meridian coordina el flete de tu cosechadora desde origen; la admisibilidad, la AFIDI y la nacionalización en Argentina quedan bajo responsabilidad de tu importador y su despachante.",
    "faq": [
      {
        "question": "¿Meridian desarma la cosechadora para embarcarla?",
        "answer": "Sí, cuando corresponde. Coordinamos el desarme de cabezal o plataforma, la medición y el embalaje en origen para que la cosechadora viaje segura en flat rack o RoRo. El armado final en Argentina queda fuera de nuestro alcance del lado de EE. UU."
      },
      {
        "question": "¿La cosechadora necesita AFIDI de SENASA?",
        "answer": "Normalmente sí. Por ser maquinaria agrícola usada, la cosechadora suele requerir la AFIDI, que se gestiona por SIGPV-IMPO antes de la transacción. Confirmá tu caso con tu despachante: Meridian no gestiona la AFIDI."
      },
      {
        "question": "¿Pueden darme el costo final puesto en Argentina?",
        "answer": "Cotizamos el flete internacional que controlamos desde EE. UU. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Tu despachante calcula aranceles, IVA, tasas e inspecciones según la clasificación real de la cosechadora."
      },
      {
        "question": "¿Por qué la cosechadora tiene que llegar limpia?",
        "answer": "SENASA inspecciona en puerto y exige equipos limpios, libres de suelo y restos vegetales para prevenir el ingreso de plagas. Preparamos la unidad en origen, pero la inspección fitosanitaria en destino la realiza SENASA y la coordina tu despachante."
      }
    ],
    "ctaHeading": "Cotizá el flete de tu cosechadora desde EE. UU. a Argentina",
    "ctaDescription": "Compartí la cosechadora y el destino; te devolvemos por escrito el alcance del tramo internacional antes de reservar.",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de una cosechadora desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Argentina]. Ref: {{whatsapp_ref}}"
  },
  "bolivia/importacion-maquinaria-usa": {
    "seoTitle": "Importar maquinaria de EE. UU. a Bolivia",
    "seoDescription": "Coordinamos el tramo de EE. UU.: retiro, embalaje, documentos de exportación y flete de maquinaria usada a Bolivia. La nacionalización la maneja su despachante.",
    "eyebrow": "Maquinaria usada desde EE. UU. · Bolivia",
    "h1": "Importación de maquinaria desde EE. UU. a Bolivia",
    "heroBody": "Meridian coordina la parte de EE. UU. y Canadá de su importación de maquinaria usada a Bolivia: contacto con el vendedor o compra asistida, retiro, medición, embalaje o desmontaje cuando corresponde, documentación de exportación y reserva del flete marítimo. La nacionalización, los aranceles, el IVA y el despacho aduanero en Bolivia los gestiona por separado su despachante e importador. Le entregamos el expediente del tramo internacional para que su profesional local lo presente ante la Aduana Nacional.",
    "heroBullets": [
      "Origen en EE. UU./Canadá: retiro, medición, embalaje y carga.",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA) cuando corresponde.",
      "Reserva de flete marítimo; puerto y ruta los confirma su despachante.",
      "Cotización del tramo internacional separada de aranceles, IVA y costos locales."
    ],
    "scopeIncluded": [
      "Compra asistida o coordinación con el vendedor en EE. UU./Canadá",
      "Retiro, medición, embalaje y desmontaje cuando corresponde",
      "Documentación de exportación y certificado fitosanitario de origen",
      "Reserva del flete marítimo hasta el puerto acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Bolivia",
      "Despacho aduanero y registro de importador ante la Aduana Nacional",
      "Inspección o autorización fitosanitaria de SENASAG en destino",
      "Tránsito por puerto del Pacífico y entrega interior en Bolivia"
    ],
    "processIntro": "La ruta se arma con la unidad real y su alcance, no con una tarifa genérica. Primero confirmamos datos técnicos y formato de carga; recién después se reserva.",
    "processSteps": [
      {
        "title": "Comparta la maquinaria",
        "body": "Envíe el anuncio o proforma, marca, modelo, año, ubicación en EE. UU. o Canadá y estado de compra de la maquinaria usada."
      },
      {
        "title": "Definimos medidas y modalidad",
        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor, flat rack, RoRo o carga de proyecto."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentos de exportación y el certificado fitosanitario de origen cuando aplica al equipo."
      },
      {
        "title": "Entregamos el expediente para Bolivia",
        "body": "Le compartimos los documentos del tramo internacional para que su despachante gestione el registro de importador y la declaración ante la Aduana Nacional."
      }
    ],
    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. El resto lo confirma su despachante en Bolivia.",
    "quoteFields": [
      "Link del anuncio o factura proforma",
      "Marca, modelo y año de la maquinaria",
      "Ubicación exacta en EE. UU. o Canadá",
      "Estado de compra: evaluando, reservado o comprado",
      "Dimensiones y peso disponibles",
      "Ciudad de destino en Bolivia y fecha estimada",
      "Datos de su despachante o importador, si ya lo tiene"
    ],
    "complianceHeading": "Qué confirmar en Bolivia antes de comprar o embarcar",
    "complianceBody": "Los requisitos dependen de la subpartida, el origen y la condición de la unidad. SENASAG puede aplicar una inspección o autorización fitosanitaria; su despachante lo confirma según el caso. La Aduana Nacional y su despachante manejan el registro de importador y la declaración de importación. No dé por sentadas franquicias de IVA ni límites de antigüedad: estos pueden cambiar y no asumimos un régimen específico, así que su importador debe confirmar el régimen tributario vigente para 2026. Tampoco prometemos tránsito garantizado por Arica, almacenaje gratuito ni una ruta interior fija: esos puntos los define su despachante con la naviera y el agente de tránsito.",
    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU./Canadá; la admisibilidad y la nacionalización en Bolivia quedan bajo responsabilidad del importador y su despachante.",
    "faq": [
      {
        "question": "¿Meridian vende la maquinaria o la nacionaliza en Bolivia?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero la nacionalización, los tributos y el despacho en Bolivia los gestiona su despachante."
      },
      {
        "question": "¿Pueden darme el costo final puesto en Bolivia?",
        "answer": "Cotizamos el tramo internacional que controlamos. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Aranceles, IVA, despacho y entrega interior los calcula su despachante según la clasificación real de la unidad."
      },
      {
        "question": "¿Necesito permiso de SENASAG para maquinaria usada?",
        "answer": "Puede aplicar. SENASAG decide según la subpartida, el origen y la condición del equipo; para maquinaria usada suele ser una inspección o verificación de limpieza más que un permiso de productos vegetales. Su despachante lo confirma antes del embarque, y nosotros emitimos el certificado fitosanitario de origen cuando corresponde."
      },
      {
        "question": "¿Hay exoneración de IVA o límite de antigüedad para importar a Bolivia?",
        "answer": "El régimen de incentivos y los límites de antigüedad pueden cambiar con el tiempo. No dé por sentado ningún beneficio ni restricción: su importador debe confirmar con la Aduana Nacional el régimen tributario y de antigüedad vigente para su unidad antes de comprar."
      },
      {
        "question": "¿A qué puerto llega y cómo continúa hasta Bolivia?",
        "answer": "El puerto se define según la naviera, el formato de carga y el plan de su despachante. Como Bolivia no tiene litoral, el ingreso suele ser por un puerto del Pacífico con tránsito posterior por tierra, pero no garantizamos un puerto único, tránsito por Arica ni una ruta interior fija: eso lo coordina su despachante."
      }
    ],
    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Bolivia",
    "ctaDescription": "Comparta la unidad y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La parte aduanera la confirma su despachante.",
    "whatsappPrefill": "#FRT_ES Hola, quiero importar maquinaria usada desde EE. UU. a Bolivia. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Bolivia]. Ref: {{whatsapp_ref}}"
  },
  "bolivia/flete-equipo-pesado-usa": {
    "seoTitle": "Flete de equipo pesado EE. UU. a Bolivia",
    "seoDescription": "Coordinamos el flete de equipo pesado desde EE. UU.: retiro, flat rack o proyecto, documentos y reserva marítima a Bolivia. Aduana, su despachante.",
    "eyebrow": "Equipo pesado desde EE. UU. · Bolivia",
    "h1": "Flete de equipo pesado desde EE. UU. a Bolivia",
    "heroBody": "Meridian coordina el flete de equipo pesado desde EE. UU. y Canadá hacia Bolivia: retiro en sitio, medición, desmontaje y embalaje cuando corresponde, documentación de exportación y reserva del flete marítimo en flat rack, RoRo o carga de proyecto según las dimensiones. La nacionalización, los aranceles, el IVA y el despacho aduanero en Bolivia los gestiona por separado su despachante e importador. Trabajamos el tramo internacional; el ingreso a destino lo confirma su profesional local.",
    "heroBullets": [
      "Retiro y medición de equipo pesado fuera de norma en EE. UU./Canadá.",
      "Flat rack, RoRo o carga de proyecto según peso y dimensiones reales.",
      "Documentos de exportación y certificado fitosanitario de origen cuando corresponde.",
      "Reserva marítima cotizada aparte de aranceles, IVA y costos locales."
    ],
    "scopeIncluded": [
      "Retiro, medición y manejo de carga sobredimensionada en EE. UU./Canadá",
      "Desmontaje y embalaje cuando corresponde al equipo",
      "Documentación de exportación y certificado fitosanitario de origen",
      "Reserva del flete marítimo en flat rack, RoRo o carga de proyecto"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Bolivia",
      "Despacho aduanero y registro de importador ante la Aduana Nacional",
      "Inspección o autorización fitosanitaria de SENASAG en destino",
      "Tránsito por puerto del Pacífico y transporte interior pesado en Bolivia"
    ],
    "processIntro": "Para equipo pesado, las medidas reales mandan. Primero confirmamos peso, dimensiones y formato de carga; recién después se reserva la naviera.",
    "processSteps": [
      {
        "title": "Comparta el equipo pesado",
        "body": "Envíe marca, modelo, año, peso, dimensiones, ubicación en EE. UU. o Canadá y estado de compra del equipo."
      },
      {
        "title": "Definimos modalidad sobredimensionada",
        "body": "Evaluamos si va en flat rack, RoRo o carga de proyecto, y si requiere desmontaje o permisos de transporte en origen."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, manejo especializado, carga, documentos de exportación y el certificado fitosanitario de origen cuando aplica."
      },
      {
        "title": "Entregamos el expediente para Bolivia",
        "body": "Le compartimos los documentos del tramo internacional para que su despachante gestione el ingreso y la declaración ante la Aduana Nacional."
      }
    ],
    "quoteIntro": "Con peso, dimensiones y ubicación definimos el formato de carga y el tramo internacional sin suposiciones. La parte de destino la confirma su despachante en Bolivia.",
    "quoteFields": [
      "Link del anuncio o factura proforma",
      "Marca, modelo y año del equipo pesado",
      "Peso y dimensiones (largo, ancho, alto)",
      "Ubicación exacta en EE. UU. o Canadá",
      "Estado de compra: evaluando, reservado o comprado",
      "Ciudad de destino en Bolivia y fecha estimada",
      "Datos de su despachante o importador, si ya lo tiene"
    ],
    "complianceHeading": "Qué confirmar en Bolivia antes de embarcar equipo pesado",
    "complianceBody": "Los requisitos dependen de la subpartida, el origen y la condición del equipo. SENASAG puede aplicar una inspección o autorización; su despachante lo confirma según el caso. La Aduana Nacional y su despachante manejan el registro de importador y la declaración de importación. No dé por sentadas franquicias de IVA ni límites de antigüedad: estos pueden cambiar y no asumimos un régimen específico, por lo que su importador debe confirmar el régimen tributario vigente para 2026. Tampoco prometemos tránsito garantizado por Arica, período de almacenaje gratuito ni una ruta interior fija: la carga sobredimensionada exige que su despachante coordine puerto, agente de tránsito y transporte pesado interior caso por caso.",
    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU./Canadá; la admisibilidad y la nacionalización del equipo pesado en Bolivia quedan bajo responsabilidad del importador y su despachante.",
    "faq": [
      {
        "question": "¿Meridian nacionaliza o entrega el equipo pesado en Bolivia?",
        "answer": "No. Meridian coordina el tramo de origen y exportación desde EE. UU. y Canadá: retiro, manejo especializado, documentos de exportación y reserva marítima. La nacionalización, el despacho aduanero y el transporte interior pesado en Bolivia los gestiona su despachante e importador."
      },
      {
        "question": "¿Cómo se decide entre flat rack, RoRo o carga de proyecto?",
        "answer": "Según el peso, las dimensiones y si el equipo es autopropulsado o requiere desmontaje. Por eso pedimos medidas reales desde el primer mensaje: no cotizamos un formato de carga sobre suposiciones."
      },
      {
        "question": "¿Pueden darme el costo final puesto en Bolivia?",
        "answer": "Cotizamos el tramo internacional que controlamos. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Aranceles, IVA, despacho y transporte interior pesado los calcula su despachante según la clasificación real del equipo."
      },
      {
        "question": "¿A qué puerto llega y cómo continúa hasta Bolivia?",
        "answer": "El puerto y la ruta los define su despachante con la naviera y el agente de tránsito. Como Bolivia no tiene litoral, el ingreso suele ser por un puerto del Pacífico con tránsito por tierra, pero no garantizamos un puerto único, tránsito por Arica ni una ruta interior fija; con carga sobredimensionada esa coordinación es caso por caso."
      }
    ],
    "ctaHeading": "Cotice el flete de su equipo pesado desde EE. UU. a Bolivia",
    "ctaDescription": "Comparta peso, dimensiones y destino; le devolvemos por escrito el formato de carga y el alcance del tramo internacional antes de reservar. El despacho lo confirma su despachante.",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de equipo pesado desde EE. UU. a Bolivia. Equipo: [marca/modelo/año]. Peso/medidas: [peso/dimensiones]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Bolivia]. Ref: {{whatsapp_ref}}"
  },
  "paraguay/importacion-maquinaria-usa": {
    "seoTitle": "Importar maquinaria de EE. UU. a Paraguay",
    "seoDescription": "Coordinamos compra, retiro, embalaje, certificado fitosanitario y flete de maquinaria de EE. UU. a Paraguay. La nacionalización la confirma su despachante.",
    "eyebrow": "Importación de maquinaria EE. UU. → Paraguay",
    "h1": "Importación de maquinaria agrícola usada de EE. UU. a Paraguay",
    "heroBody": "Meridian coordina el tramo en origen para importar su maquinaria desde EE. UU. y Canadá hacia Paraguay: compra asistida, retiro, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. La nacionalización, los tributos y la admisibilidad final en Paraguay las confirma su despachante en destino. La Ley 7565/2025 introduce medidas fitosanitarias y de mitigación de riesgo para maquinaria usada; una de sus disposiciones fija una antigüedad máxima de 5 años, pero la admisibilidad final la determinan SENAVE/MIC/DNIT vía su despachante, no la edad.",
    "heroBullets": [
      "Tramo en origen completo: compra asistida, retiro en EE. UU./Canadá, embalaje y reserva de flete marítimo.",
      "Certificado fitosanitario de origen (USDA APHIS o CFIA) emitido antes del embarque.",
      "Revisión documental preliminar bajo la Ley 7565/2025: revisamos antigüedad y estado antes de comprometer fondos.",
      "Nacionalización, aranceles, IVA y despacho aduanero en Paraguay quedan a cargo de su despachante."
    ],
    "scopeIncluded": [
      "Compra asistida y coordinación con vendedor en EE. UU. o Canadá (subasta, concesionario o privado), bajo un alcance separado.",
      "Retiro en origen, medición, desmontaje y embalaje cuando corresponde, etiquetado y carga.",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS para EE. UU., CFIA para Canadá).",
      "Reserva de flete marítimo hacia el puerto de transbordo y coordinación del tramo logístico."
    ],
    "scopeExcluded": [
      "Nacionalización, despacho aduanero, aranceles, IVA y tributos en Paraguay (DNIT).",
      "Inscripción en el Registro de Importadores y Licencia Previa de Importación ante el MIC.",
      "Inspección fitosanitaria final en destino y determinación de admisibilidad por SENAVE.",
      "Tasa de conservación de la biodiversidad, tasas portuarias, permisos y entrega interior."
    ],
    "processIntro": "El orden importa: primero filtramos la unidad por la ley y por su estado, después armamos ruta, alcance y documentación. Así separamos desde el inicio el tramo que Meridian coordina del costo que confirma su despachante en Paraguay.",
    "processSteps": [
      {
        "title": "Revisión preliminar de la unidad",
        "body": "Revisamos año de fabricación, horas, condición visible, vendedor y ubicación frente a la Ley 7565/2025. Si la unidad supera los 5 años o presenta señales que comprometen su ingreso, lo decimos antes de avanzar. La admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad."
      },
      {
        "title": "Mapa de responsabilidades",
        "body": "Listamos qué confirma su despachante en destino: DNIT (aduana y tributos), SENAVE (fitosanitario en destino), MIC (registro de importadores y licencia previa) y la tasa de conservación de la biodiversidad prevista en la ley."
      },
      {
        "title": "Coordinación del tramo en origen",
        "body": "Compra asistida, retiro, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo."
      },
      {
        "title": "Cotización con alcance separado",
        "body": "Entregamos un presupuesto que separa el tramo de Meridian del despacho local. La calculadora es referencia del tramo logístico, no el costo nacionalizado final. Sin esa separación no hay comparación honesta."
      }
    ],
    "quoteIntro": "Con una ficha completa confirmamos si la unidad pasa el filtro inicial de la Ley 7565/2025 y armamos el alcance de exportación antes de comprometer fondos. Cuantos más datos envíe, más precisa es la referencia del tramo logístico.",
    "quoteFields": [
      "Link de subasta, concesionario o vendedor privado en EE. UU. o Canadá.",
      "Marca, modelo, año de fabricación y horas de motor.",
      "Ubicación de retiro en EE. UU. o Canadá con código postal.",
      "Destino previsto en Paraguay: Asunción, Villeta u otro punto.",
      "Fotos de limpieza interior, tren de rodaje, accesorios y placa con número de serie.",
      "Nombre del importador o despachante en destino si ya está definido.",
      "Fecha objetivo de embarque y si la operación incluye cabezales o accesorios."
    ],
    "complianceHeading": "Ley 7565/2025: marco fitosanitario y de mitigación de riesgo",
    "complianceBody": "La Ley 7565/2025 establece medidas fitosanitarias y de mitigación de riesgo para la introducción al país de maquinaria, equipos e implementos agrícolas usados. La antigüedad máxima de 5 años es una de sus disposiciones, no el conjunto de la norma: la ley también contempla certificación, limpieza libre de suelo y restos vegetales, inspección y una tasa de conservación de la biodiversidad. Según el texto de la ley, verifique cada requisito con su despachante. No afirmamos fechas exactas de promulgación o vigencia ni montos ni fórmulas de esa tasa. En toda mención de los 5 años aplica la misma regla: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. DNIT actúa como aduana y tributos, SENAVE como autoridad fitosanitaria y MIC como registro de importadores y licencia previa.",
    "localResponsibility": "La nacionalización, los aranceles, el IVA, el despacho aduanero, la inspección fitosanitaria en destino y la admisibilidad final son responsabilidad de su despachante o importador en Paraguay; Meridian no las promete ni las ejecuta.",
    "faq": [
      {
        "question": "¿Meridian vende la maquinaria?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
      },
      {
        "question": "¿Puedo importar una unidad con más de 5 años de antigüedad?",
        "answer": "La Ley 7565/2025 contempla una antigüedad máxima de 5 años entre sus disposiciones. Según el texto de la ley, conviene verificarlo con su despachante: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. No afirmamos que ese límite ya rija de una forma puntual antes de su reglamentación; ese punto lo confirma su despachante para la unidad concreta."
      },
      {
        "question": "¿Qué cubre Meridian y qué queda para mi despachante?",
        "answer": "Meridian coordina el tramo en origen: compra asistida, retiro en EE. UU. o Canadá, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. Su despachante en Paraguay maneja el registro de importadores y la licencia previa ante el MIC, la inspección fitosanitaria final de SENAVE, los tributos y el despacho ante DNIT, la tasa de conservación de la biodiversidad y la entrega interior."
      },
      {
        "question": "¿La calculadora me da el costo final puesto en Paraguay?",
        "answer": "No. La calculadora es una referencia del tramo logístico que Meridian puede coordinar, no el costo nacionalizado final. Los aranceles, el IVA, la tasa de conservación de la biodiversidad, las tasas portuarias, los honorarios del despachante y el despacho local se confirman en Paraguay con su despachante para la unidad concreta."
      },
      {
        "question": "¿Cuánto tarda y por qué ruta llega a Paraguay?",
        "answer": "Paraguay es un destino sin litoral, por lo que el tránsito suele combinar tramo oceánico hasta un puerto de transbordo (habitualmente Buenos Aires) y luego tramo fluvial por la Hidrovía hacia Asunción o Villeta. Los tiempos de tránsito y la ruta son siempre estimados, no universales: dependen de naviera, operador fluvial, condiciones de calado y coordinación de su despachante, y se confirman antes de cotizar."
      }
    ],
    "ctaHeading": "¿Vio una máquina en EE. UU. para Paraguay?",
    "ctaDescription": "Envíenos el link, el año de fabricación, las horas, la ubicación de retiro y el destino. Hacemos una revisión documental preliminar frente a la Ley 7565/2025 —la admisibilidad la confirma su despachante con SENAVE/MIC/DNIT— y separamos el tramo que coordina Meridian del costo que confirma su despachante en Paraguay.",
    "whatsappPrefill": "#FRT_ES Importación de maquinaria de EE. UU. a Paraguay. Equipo: [marca/modelo/año]. Retiro en: [ciudad/estado]. Destino: [ciudad de Paraguay]. Quiero cotizar el tramo de origen. Ref: {{whatsapp_ref}}"
  },
  "paraguay/flete-cosechadoras-usa": {
    "seoTitle": "Flete de cosechadoras EE. UU. a Paraguay",
    "seoDescription": "Coordinamos retiro, desarme, embalaje, certificado fitosanitario y flete de cosechadoras de EE. UU. a Paraguay. La nacionalización la confirma su despachante.",
    "eyebrow": "Flete de cosechadoras EE. UU. → Paraguay",
    "h1": "Flete de cosechadoras usadas de EE. UU. a Paraguay",
    "heroBody": "Meridian coordina el tramo en origen para mover su cosechadora desde EE. UU. y Canadá hacia Paraguay: compra asistida, retiro, medición, desmontaje del cabezal y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. La nacionalización, los tributos y la admisibilidad final en Paraguay las confirma su despachante en destino. La Ley 7565/2025 introduce medidas fitosanitarias y de mitigación de riesgo para maquinaria usada; una de sus disposiciones fija una antigüedad máxima de 5 años, pero la admisibilidad final la determinan SENAVE/MIC/DNIT vía su despachante, no la edad.",
    "heroBullets": [
      "Tramo en origen completo para cosechadoras: retiro, desmontaje de cabezal, embalaje y reserva de flete marítimo.",
      "Certificado fitosanitario de origen (USDA APHIS o CFIA) emitido antes del embarque, con limpieza libre de suelo y restos vegetales.",
      "Revisión documental preliminar bajo la Ley 7565/2025: revisamos antigüedad y estado de la cosechadora antes de comprometer fondos.",
      "Nacionalización, aranceles, IVA y despacho aduanero en Paraguay quedan a cargo de su despachante."
    ],
    "scopeIncluded": [
      "Compra asistida y coordinación con vendedor de la cosechadora en EE. UU. o Canadá, bajo un alcance separado.",
      "Retiro en origen, medición, desmontaje de cabezal/draper y embalaje cuando corresponde, etiquetado y carga.",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS para EE. UU., CFIA para Canadá).",
      "Reserva de flete marítimo hacia el puerto de transbordo y coordinación del tramo logístico de la cosechadora y sus accesorios."
    ],
    "scopeExcluded": [
      "Nacionalización, despacho aduanero, aranceles, IVA y tributos en Paraguay (DNIT).",
      "Inscripción en el Registro de Importadores y Licencia Previa de Importación ante el MIC.",
      "Inspección fitosanitaria final en destino y determinación de admisibilidad de la cosechadora por SENAVE.",
      "Tasa de conservación de la biodiversidad, tasas portuarias, permisos y entrega interior al campo."
    ],
    "processIntro": "El orden importa, sobre todo en cosechadoras: primero filtramos la unidad por la ley y por su estado, después resolvemos cabezal, dimensiones, embalaje, ruta y documentación. Así separamos desde el inicio el tramo que Meridian coordina del costo que confirma su despachante en Paraguay.",
    "processSteps": [
      {
        "title": "Revisión preliminar de la cosechadora",
        "body": "Revisamos año de fabricación, horas, estado del cabezal y la plataforma, vendedor y ubicación frente a la Ley 7565/2025. Si la unidad supera los 5 años o presenta señales que comprometen su ingreso, lo decimos antes de avanzar. La admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad."
      },
      {
        "title": "Mapa de responsabilidades",
        "body": "Listamos qué confirma su despachante en destino: DNIT (aduana y tributos), SENAVE (fitosanitario en destino), MIC (registro de importadores y licencia previa) y la tasa de conservación de la biodiversidad prevista en la ley."
      },
      {
        "title": "Coordinación del tramo en origen",
        "body": "Compra asistida, retiro, medición, desmontaje del cabezal y embalaje cuando corresponde, limpieza libre de suelo y restos vegetales, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo."
      },
      {
        "title": "Cotización con alcance separado",
        "body": "Entregamos un presupuesto que separa el tramo de Meridian del despacho local. La calculadora es referencia del tramo logístico, no el costo nacionalizado final. Sin esa separación no hay comparación honesta."
      }
    ],
    "quoteIntro": "Con una ficha completa de la cosechadora confirmamos si pasa el filtro inicial de la Ley 7565/2025 y armamos el alcance de exportación, incluyendo cabezal y accesorios, antes de comprometer fondos. Cuantos más datos envíe, más precisa es la referencia del tramo logístico.",
    "quoteFields": [
      "Link de subasta, concesionario o vendedor privado de la cosechadora en EE. UU. o Canadá.",
      "Marca, modelo, año de fabricación y horas de motor y de separador.",
      "Tipo de cabezal o draper y accesorios incluidos (monitor, GPS, kits).",
      "Ubicación de retiro en EE. UU. o Canadá con código postal.",
      "Destino previsto en Paraguay: Asunción, Villeta u otro punto.",
      "Fotos de limpieza interior, tren de rodaje, cabezal y placa con número de serie.",
      "Nombre del importador o despachante en destino si ya está definido."
    ],
    "complianceHeading": "Ley 7565/2025: marco fitosanitario y de mitigación de riesgo",
    "complianceBody": "La Ley 7565/2025 establece medidas fitosanitarias y de mitigación de riesgo para la introducción al país de maquinaria, equipos e implementos agrícolas usados, incluidas las cosechadoras. La antigüedad máxima de 5 años es una de sus disposiciones, no el conjunto de la norma: la ley también contempla certificación, limpieza libre de suelo y restos vegetales —crítica en cosechadoras por el cabezal y la tolva—, inspección y una tasa de conservación de la biodiversidad. Según el texto de la ley, verifique cada requisito con su despachante. No afirmamos fechas exactas de promulgación o vigencia ni montos ni fórmulas de esa tasa. En toda mención de los 5 años aplica la misma regla: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. DNIT actúa como aduana y tributos, SENAVE como autoridad fitosanitaria y MIC como registro de importadores y licencia previa.",
    "localResponsibility": "La nacionalización, los aranceles, el IVA, el despacho aduanero, la inspección fitosanitaria en destino y la admisibilidad final de la cosechadora son responsabilidad de su despachante o importador en Paraguay; Meridian no las promete ni las ejecuta.",
    "faq": [
      {
        "question": "¿Meridian vende la cosechadora?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
      },
      {
        "question": "¿Puedo importar una cosechadora con más de 5 años de antigüedad?",
        "answer": "La Ley 7565/2025 contempla una antigüedad máxima de 5 años entre sus disposiciones. Según el texto de la ley, conviene verificarlo con su despachante: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. No afirmamos que ese límite ya rija de una forma puntual antes de su reglamentación; ese punto lo confirma su despachante para la cosechadora concreta."
      },
      {
        "question": "¿Cómo manejan la limpieza y el cabezal de la cosechadora?",
        "answer": "El marco fitosanitario de la Ley 7565/2025 exige que la unidad llegue libre de suelo, plagas y restos vegetales, algo especialmente sensible en cosechadoras por el cabezal, la tolva y el sinfín. Coordinamos limpieza, desmontaje del cabezal cuando corresponde, medición y embalaje, y emitimos el certificado fitosanitario de origen (USDA APHIS o CFIA). La inspección fitosanitaria final en destino la realiza SENAVE vía su despachante."
      },
      {
        "question": "¿Qué cubre Meridian y qué queda para mi despachante?",
        "answer": "Meridian coordina el tramo en origen: compra asistida, retiro, desmontaje del cabezal, embalaje, documentación de exportación, certificado fitosanitario de origen y reserva de flete marítimo. Su despachante en Paraguay maneja el registro de importadores y la licencia previa ante el MIC, la inspección final de SENAVE, los tributos y el despacho ante DNIT, la tasa de conservación de la biodiversidad y la entrega interior al campo."
      },
      {
        "question": "¿Cuánto tarda y por qué ruta llega la cosechadora a Paraguay?",
        "answer": "Paraguay es un destino sin litoral, por lo que el tránsito suele combinar tramo oceánico hasta un puerto de transbordo (habitualmente Buenos Aires) y luego tramo fluvial por la Hidrovía hacia Asunción o Villeta. Los tiempos de tránsito y la ruta son siempre estimados, no universales: dependen de naviera, operador fluvial, condiciones de calado y coordinación de su despachante, y se confirman antes de cotizar. La calculadora es referencia del tramo logístico, no el costo nacionalizado final."
      }
    ],
    "ctaHeading": "¿Vio una cosechadora en EE. UU. para Paraguay?",
    "ctaDescription": "Envíenos el link, el año de fabricación, las horas, el tipo de cabezal, la ubicación de retiro y el destino. Hacemos una revisión documental preliminar frente a la Ley 7565/2025 —la admisibilidad la confirma su despachante con SENAVE/MIC/DNIT— y separamos el tramo que coordina Meridian del costo que confirma su despachante en Paraguay.",
    "whatsappPrefill": "#FRT_ES Flete de cosechadora de EE. UU. a Paraguay. Equipo: [marca/modelo/año]. Retiro en: [ciudad/estado]. Destino: [ciudad de Paraguay]. Quiero cotizar el tramo de origen. Ref: {{whatsapp_ref}}"
  },
  "chile/importacion-maquinaria-usa": {
    "seoTitle": "Importar maquinaria de EE. UU. a Chile",
    "seoDescription": "Coordinamos el tramo de EE. UU. a Chile: retiro, embalaje, documentación y flete marítimo de maquinaria usada. La nacionalización la gestiona su despachante.",
    "eyebrow": "Importación de maquinaria desde EE. UU. · Chile",
    "h1": "Importación de maquinaria desde EE. UU. a Chile",
    "heroBody": "Meridian coordina el tramo de origen para su importación de maquinaria desde EE. UU. y Canadá a Chile: contacto con el vendedor, retiro, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo. La nacionalización, los aranceles, el IVA, el despacho aduanero y la entrega interior en Chile los gestiona por separado su despachante o importador. Le entregamos el alcance del tramo internacional por escrito antes de reservar.",
    "heroBullets": [
      "Operación coordinada del lado de EE. UU. y Canadá, con compra asistida bajo alcance separado.",
      "Retiro, medición, desmontaje y embalaje en origen según el equipo.",
      "Certificado fitosanitario de origen (USDA APHIS o CFIA) y documentación de exportación.",
      "Cotización del flete marítimo separada de los costos locales chilenos."
    ],
    "scopeIncluded": [
      "Compra asistida y retiro del equipo en EE. UU. o Canadá",
      "Medición, desmontaje y embalaje cuando corresponde",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo hasta el puerto chileno acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Chile",
      "Despacho aduanero y permisos a cargo del importador",
      "Inspección fitosanitaria del SAG al ingreso en Chile",
      "Entrega interior dentro de Chile"
    ],
    "processIntro": "La ruta se arma a partir del equipo real, no de una tarifa genérica. Primero confirmamos la información técnica y el alcance del tramo de EE. UU. a Chile; luego reservamos. La elegibilidad y la nacionalización quedan del lado de su despachante chileno.",
    "processSteps": [
      {
        "title": "Comparta el equipo",
        "body": "Envíe el anuncio o la factura proforma con marca, modelo, año, ubicación en EE. UU. o Canadá y estado de compra de la maquinaria."
      },
      {
        "title": "Definimos medidas y modalidad",
        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor, flat rack, RoRo o carga de proyecto para fijar la modalidad correcta."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
      },
      {
        "title": "Entregamos el expediente para Chile",
        "body": "Compartimos los documentos del tramo internacional para que su despachante gestione el despacho, los tributos y la inspección del SAG al ingreso en Chile."
      }
    ],
    "quoteIntro": "Con estos datos definimos el tramo de EE. UU. a Chile sin inventar medidas, ruta ni formato de carga. Cuanto más completa la información, más útil es la cotización.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo y año",
      "Ubicación exacta en EE. UU. o Canadá",
      "Estado de compra: evaluando, reservado o comprado",
      "Dimensiones y peso disponibles",
      "Ciudad de destino en Chile y fecha estimada"
    ],
    "complianceHeading": "Requisito fitosanitario del SAG al ingreso a Chile",
    "complianceBody": "La maquinaria usada debe llegar a Chile limpia, libre de suelo, restos vegetales y plagas reglamentadas, conforme a la Resolución SAG N° 3.103/2016 (vigente). El SAG inspecciona la maquinaria al ingreso al país: no existe una aprobación previa del SAG ni una entrada garantizada antes de esa inspección. Si la maquinaria no cumple, puede generar costos correctivos de limpieza o el reembarque, que asume el importador. Por eso embalamos y preparamos en origen cuidando la limpieza del equipo, pero la decisión de admisión es del SAG en el punto de ingreso.",
    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU. y Canadá; la admisibilidad, la inspección del SAG al ingreso y la nacionalización en Chile quedan bajo responsabilidad del importador y su despachante.",
    "faq": [
      {
        "question": "¿Meridian vende la maquinaria?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
      },
      {
        "question": "¿Pueden darme el costo final nacionalizado en Chile?",
        "answer": "No. Cotizamos el tramo internacional que controlamos. Los aranceles, el IVA y las tasas locales los calcula su despachante según la clasificación real del equipo. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado."
      },
      {
        "question": "¿El equipo entra a Chile aprobado por el SAG?",
        "answer": "No. El SAG inspecciona la maquinaria usada al ingreso al país conforme a la Resolución 3.103/2016. Debe llegar limpia, libre de suelo, restos vegetales y plagas reglamentadas. Si no cumple, puede generar costos correctivos o el reembarque a cargo del importador. No hay aprobación previa del SAG."
      },
      {
        "question": "¿A qué puerto llega la carga en Chile?",
        "answer": "Generalmente San Antonio o Valparaíso, según naviera, carga y destino. No fijamos un puerto obligatorio: la modalidad de carga, las dimensiones y el plan de su despachante definen el puerto de descarga."
      }
    ],
    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Chile",
    "ctaDescription": "Comparta el equipo y el destino en Chile; le devolvemos el alcance del tramo internacional por escrito antes de reservar.",
    "whatsappPrefill": "#FRT_ES Hola, quiero importar maquinaria desde EE. UU. a Chile. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad en Chile]. Ref: {{whatsapp_ref}}"
  },
  "chile/flete-equipo-pesado-usa": {
    "seoTitle": "Flete de equipo pesado EE. UU. a Chile",
    "seoDescription": "Coordinamos el flete de equipo pesado de EE. UU. a Chile: retiro, embalaje, documentación y reserva marítima. La aduana la gestiona su despachante.",
    "eyebrow": "Flete de equipo pesado desde EE. UU. · Chile",
    "h1": "Flete de equipo pesado desde EE. UU. a Chile",
    "heroBody": "Meridian coordina el flete de su equipo pesado de EE. UU. y Canadá a Chile: retiro en origen, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo en contenedor, flat rack, RoRo o carga de proyecto según las dimensiones. La nacionalización, los aranceles, el IVA, el despacho aduanero y la entrega interior en Chile los gestiona por separado su despachante. Le confirmamos por escrito el alcance del tramo internacional antes de reservar.",
    "heroBullets": [
      "Coordinación de equipo pesado y sobredimensionado del lado de EE. UU. y Canadá.",
      "Retiro, medición, desmontaje y embalaje en origen según las dimensiones.",
      "Flat rack, RoRo o carga de proyecto para piezas que no van en contenedor estándar.",
      "Cotización del flete marítimo separada de los tributos y costos locales en Chile."
    ],
    "scopeIncluded": [
      "Retiro y transporte del equipo pesado en EE. UU. o Canadá",
      "Medición, desmontaje y embalaje para flat rack, RoRo o carga de proyecto",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo hasta el puerto chileno acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, aranceles, IVA y tributos en Chile",
      "Despacho aduanero y permisos a cargo del importador",
      "Inspección fitosanitaria del SAG al ingreso en Chile",
      "Entrega interior y permisos de transporte sobredimensionado dentro de Chile"
    ],
    "processIntro": "El equipo pesado se cotiza por sus medidas reales: peso, alto, ancho y largo definen la modalidad. Primero confirmamos las dimensiones y el alcance del tramo de EE. UU. a Chile; luego reservamos. La nacionalización queda del lado de su despachante chileno.",
    "processSteps": [
      {
        "title": "Comparta el equipo y sus medidas",
        "body": "Envíe marca, modelo, año, ubicación en EE. UU. o Canadá y, si las tiene, las dimensiones y el peso del equipo pesado."
      },
      {
        "title": "Definimos la modalidad de carga",
        "body": "Según peso y dimensiones determinamos si va en contenedor, flat rack, RoRo o como carga de proyecto, y si requiere desmontaje parcial."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
      },
      {
        "title": "Entregamos el expediente para Chile",
        "body": "Compartimos los documentos del tramo internacional para que su despachante gestione el despacho, los tributos y la inspección del SAG al ingreso en Chile."
      }
    ],
    "quoteIntro": "Para equipo pesado, las medidas mandan. Con estos datos definimos la modalidad y el tramo de EE. UU. a Chile sin suponer dimensiones ni ruta.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo y año",
      "Ubicación exacta en EE. UU. o Canadá",
      "Dimensiones y peso (alto, ancho, largo)",
      "Estado de compra: evaluando, reservado o comprado",
      "Ciudad de destino en Chile y fecha estimada"
    ],
    "complianceHeading": "Requisito fitosanitario del SAG al ingreso a Chile",
    "complianceBody": "El equipo pesado usado debe llegar a Chile limpio, libre de suelo, restos vegetales y plagas reglamentadas, conforme a la Resolución SAG N° 3.103/2016 (vigente). El SAG inspecciona el equipo al ingreso al país: no existe una aprobación previa del SAG ni una entrada garantizada antes de esa inspección. Si el equipo no cumple, puede generar costos correctivos de limpieza o el reembarque, que asume el importador. Preparamos y embalamos en origen cuidando la limpieza del equipo, pero la decisión de admisión corresponde al SAG en el punto de ingreso.",
    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU. y Canadá; la admisibilidad, la inspección del SAG al ingreso y la nacionalización en Chile quedan bajo responsabilidad del importador y su despachante.",
    "faq": [
      {
        "question": "¿Cómo se envía el equipo que no entra en un contenedor estándar?",
        "answer": "Según las dimensiones y el peso usamos flat rack, RoRo o carga de proyecto, con desmontaje parcial cuando conviene. La modalidad se fija con las medidas reales del equipo, no con una tarifa genérica."
      },
      {
        "question": "¿Pueden darme el costo final nacionalizado en Chile?",
        "answer": "No. Cotizamos el tramo internacional que controlamos. Los aranceles, el IVA y las tasas locales los calcula su despachante según la clasificación real del equipo. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado."
      },
      {
        "question": "¿El equipo entra a Chile aprobado por el SAG?",
        "answer": "No. El SAG inspecciona el equipo usado al ingreso al país conforme a la Resolución 3.103/2016. Debe llegar limpio, libre de suelo, restos vegetales y plagas reglamentadas. Si no cumple, puede generar costos correctivos o el reembarque a cargo del importador. No hay aprobación previa del SAG."
      },
      {
        "question": "¿A qué puerto llega el equipo pesado en Chile?",
        "answer": "Generalmente San Antonio o Valparaíso, según naviera, carga y destino. No fijamos un puerto obligatorio: el peso, las dimensiones, la modalidad de carga y el plan de su despachante definen el puerto de descarga."
      }
    ],
    "ctaHeading": "Cotice el flete de su equipo pesado desde EE. UU. a Chile",
    "ctaDescription": "Comparta el equipo, sus medidas y el destino en Chile; le devolvemos el alcance del tramo internacional por escrito antes de reservar.",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar flete de equipo pesado desde EE. UU. a Chile. Equipo: [marca/modelo/año]. Medidas: [alto/ancho/largo/peso]. Ubicación: [ciudad/estado]. Destino: [ciudad en Chile]. Ref: {{whatsapp_ref}}"
  },
  "uruguay/importacion-maquinaria-usa": {
    "seoTitle": "Importar maquinaria de EE. UU. a Uruguay",
    "seoDescription": "Coordinamos retiro, embalaje, documentación y flete de maquinaria usada desde EE. UU. a Uruguay. La nacionalización la gestiona su despachante (ADAU).",
    "eyebrow": "Maquinaria usada desde EE. UU. · Uruguay",
    "h1": "Importación de maquinaria desde EE. UU. a Uruguay",
    "heroBody": "Meridian coordina el tramo del lado de EE. UU.: contacto con el vendedor o compra asistida, retiro, medición, desmontaje y embalaje cuando corresponda, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo, habitualmente vía Montevideo. La nacionalización, los tributos y el despacho aduanero en Uruguay quedan a cargo de su despachante (ADAU). No prometemos costo final nacionalizado ni admisión garantizada: eso depende de la clasificación NCM y de la inspección de la DGSA al ingreso.",
    "heroBullets": [
      "Operación del lado de EE. UU.: retiro, medición, embalaje y carga en origen.",
      "Documentación de exportación + certificado fitosanitario USDA APHIS o CFIA de origen.",
      "Reserva de flete marítimo, habitualmente vía Montevideo (no garantizado).",
      "Cotización del tramo logístico, separada de aranceles y tributos locales."
    ],
    "scopeIncluded": [
      "Compra asistida y retiro en EE. UU./Canadá",
      "Medición, desmontaje y embalaje cuando corresponda",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo al puerto acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, TGA, IVA y recargos en Uruguay",
      "Despacho aduanero y clasificación NCM (lo confirma el despachante/ADAU)",
      "Inspección fitosanitaria de la DGSA al ingreso",
      "Permisos del importador y entrega interior en Uruguay"
    ],
    "processIntro": "Definimos la ruta a partir del equipo real, no de una tarifa genérica. Primero confirmamos información técnica y alcance; después se reserva y se entrega el expediente para que su despachante gestione el ingreso en Uruguay.",
    "processSteps": [
      {
        "title": "Comparta el equipo",
        "body": "Envíe el anuncio o la factura proforma, con marca, modelo, año, ubicación en EE. UU./Canadá y estado de compra de la maquinaria."
      },
      {
        "title": "Definimos medidas y modalidad",
        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor de 40' HC, flat rack o carga de proyecto, y preparamos la limpieza de origen."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional que exige la DGSA."
      },
      {
        "title": "Entregamos el expediente para destino",
        "body": "Compartimos los documentos del tramo internacional para que su despachante (ADAU) clasifique la NCM, calcule tributos y gestione la nacionalización en Uruguay."
      }
    ],
    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. Cuanto más completo, más útil y firme es la cotización del tramo logístico.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo y año de la maquinaria",
      "Ubicación exacta en EE. UU. o Canadá (ciudad y ZIP)",
      "Estado de compra: evaluando, reservado o comprado",
      "Dimensiones y peso disponibles",
      "Ciudad de destino en Uruguay y fecha estimada",
      "Datos de su despachante (ADAU), si ya lo tiene"
    ],
    "complianceHeading": "Requisitos fitosanitarios y tributos en Uruguay antes de embarcar",
    "complianceBody": "La DGSA exige (Resolución 98/016, vigente) limpieza de origen, certificado fitosanitario con declaración adicional, tratamiento cuando corresponda e inspección de la DGSA al ingreso; la aceptación no está garantizada. El origen EE. UU. no tiene preferencias Mercosur. Los tributos dependen de la clasificación NCM: la TGA aplica según la clasificación (por ejemplo, a bienes de capital BK/BIT) y no es una tasa universal, más IVA y recargos según el caso. No publicamos un costo nacionalizado ni un arancel final: esos importes los confirma su despachante (ADAU).",
    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad y la nacionalización en Uruguay quedan bajo responsabilidad del importador y su despachante (ADAU).",
    "faq": [
      {
        "question": "¿Meridian vende la maquinaria?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
      },
      {
        "question": "¿Pueden darme el costo final nacionalizado en Uruguay?",
        "answer": "No. Cotizamos el tramo logístico que controlamos (origen, exportación y flete marítimo). La TGA, el IVA y los recargos dependen de la clasificación NCM y los confirma su despachante (ADAU); la TGA no es universal: aplica según la clasificación NCM (por ejemplo, a bienes de capital BK/BIT) y su despachante (ADAU) confirma la tasa vigente."
      },
      {
        "question": "¿Garantizan que la maquinaria será admitida en Uruguay?",
        "answer": "No. La DGSA inspecciona el equipo al ingreso (Resolución 98/016) y la aceptación no está garantizada. Preparamos la limpieza de origen, el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional y el tratamiento cuando corresponda para llegar en condiciones, pero la decisión final es del organismo en destino."
      },
      {
        "question": "¿Por qué no se aplica una preferencia Mercosur si Uruguay es miembro?",
        "answer": "Porque la mercadería tiene origen EE. UU. y el origen estadounidense no tiene preferencias Mercosur. La clasificación NCM y los tributos aplicables los determina su despachante (ADAU) en función del equipo real."
      },
      {
        "question": "¿A qué puerto llega la maquinaria?",
        "answer": "Habitualmente vía Montevideo, pero no está garantizado: el puerto depende de la naviera, la modalidad de carga, las dimensiones y el plan de su despachante. La página no promete un puerto único."
      }
    ],
    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Uruguay",
    "ctaDescription": "Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La nacionalización y los tributos los confirma su despachante (ADAU).",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar la importación de maquinaria desde EE. UU. a Uruguay. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad de Uruguay]. Ref: {{whatsapp_ref}}"
  },
  "uruguay/flete-cosechadoras-usa": {
    "seoTitle": "Flete de cosechadoras EE. UU. a Uruguay",
    "seoDescription": "Coordinamos retiro, desarme, embalaje, documentación y flete de cosechadoras desde EE. UU. a Uruguay. La nacionalización la gestiona su despachante (ADAU).",
    "eyebrow": "Cosechadoras desde EE. UU. · Uruguay",
    "h1": "Flete de cosechadoras desde EE. UU. a Uruguay",
    "heroBody": "Meridian coordina el tramo del lado de EE. UU. para su cosechadora: contacto con el vendedor o compra asistida, retiro, medición, desmontaje del cabezal y embalaje, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo, habitualmente vía Montevideo. La nacionalización, los tributos y el despacho aduanero en Uruguay quedan a cargo de su despachante (ADAU). No prometemos costo final nacionalizado ni admisión garantizada: eso depende de la clasificación NCM y de la inspección de la DGSA al ingreso.",
    "heroBullets": [
      "Desmontaje del cabezal, medición y embalaje de la cosechadora en EE. UU.",
      "Documentación de exportación + certificado fitosanitario USDA APHIS o CFIA de origen.",
      "Flat rack o carga de proyecto según dimensiones, vía Montevideo (no garantizado).",
      "Cotización del tramo logístico, separada de aranceles y tributos locales."
    ],
    "scopeIncluded": [
      "Compra asistida y retiro de la cosechadora en EE. UU./Canadá",
      "Medición, desmontaje del cabezal y embalaje en origen",
      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
      "Reserva del flete marítimo (flat rack o proyecto) al puerto acordado"
    ],
    "scopeExcluded": [
      "Nacionalización, TGA, IVA y recargos en Uruguay",
      "Despacho aduanero y clasificación NCM (lo confirma el despachante/ADAU)",
      "Inspección fitosanitaria de la DGSA al ingreso",
      "Permisos del importador y entrega interior en Uruguay"
    ],
    "processIntro": "La cosechadora se cotiza por su geometría real, no por una tarifa fija. Primero confirmamos medidas, desmontaje y alcance; después se reserva y se entrega el expediente para que su despachante gestione el ingreso en Uruguay.",
    "processSteps": [
      {
        "title": "Comparta la cosechadora",
        "body": "Envíe el anuncio o la factura proforma, con marca, modelo, año, tipo de cabezal, ubicación en EE. UU./Canadá y estado de compra."
      },
      {
        "title": "Medición y desmontaje",
        "body": "Definimos dimensiones con y sin cabezal, peso y si conviene flat rack o carga de proyecto, y planificamos el desmontaje y la limpieza de origen."
      },
      {
        "title": "Coordinamos origen y exportación",
        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional que exige la DGSA."
      },
      {
        "title": "Entregamos el expediente para destino",
        "body": "Compartimos los documentos del tramo internacional para que su despachante (ADAU) clasifique la NCM, calcule tributos y gestione la nacionalización en Uruguay."
      }
    ],
    "quoteIntro": "Con estos datos cotizamos el tramo internacional de la cosechadora sin inventar medidas ni formato de carga. La geometría del cabezal define el flete, así que cuanto más preciso, mejor.",
    "quoteFields": [
      "Link del equipo o factura proforma",
      "Marca, modelo, año y tipo de cabezal",
      "Ubicación exacta en EE. UU. o Canadá (ciudad y ZIP)",
      "Estado de compra: evaluando, reservado o comprado",
      "Dimensiones con y sin cabezal, y peso",
      "Ciudad de destino en Uruguay y fecha estimada",
      "Datos de su despachante (ADAU), si ya lo tiene"
    ],
    "complianceHeading": "Requisitos fitosanitarios y tributos en Uruguay antes de embarcar",
    "complianceBody": "La DGSA exige (Resolución 98/016, vigente) limpieza de origen, certificado fitosanitario con declaración adicional, tratamiento cuando corresponda e inspección de la DGSA al ingreso; en cosechadoras usadas la limpieza de tolva, sinfines y cabezal es crítica y la aceptación no está garantizada. El origen EE. UU. no tiene preferencias Mercosur. Los tributos dependen de la clasificación NCM: la TGA aplica según la clasificación (por ejemplo, a bienes de capital BK/BIT) y no es una tasa universal, más IVA y recargos según el caso. No publicamos un costo nacionalizado ni un arancel final: esos importes los confirma su despachante (ADAU).",
    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad y la nacionalización de la cosechadora en Uruguay quedan bajo responsabilidad del importador y su despachante (ADAU).",
    "faq": [
      {
        "question": "¿Meridian vende la cosechadora?",
        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
      },
      {
        "question": "¿La cosechadora viaja entera o se desmonta el cabezal?",
        "answer": "Según las dimensiones, normalmente se desmonta el cabezal y la máquina viaja en flat rack o como carga de proyecto. Coordinamos la medición y el desmontaje en EE. UU. y lo definimos antes de reservar para cotizar el tramo logístico real."
      },
      {
        "question": "¿Garantizan que la cosechadora será admitida en Uruguay?",
        "answer": "No. La DGSA inspecciona el equipo al ingreso (Resolución 98/016) y la aceptación no está garantizada. Preparamos la limpieza de origen (tolva, sinfines y cabezal), el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional y el tratamiento cuando corresponda, pero la decisión final es del organismo en destino."
      },
      {
        "question": "¿Pueden darme el costo final nacionalizado de la cosechadora?",
        "answer": "No. Cotizamos el tramo logístico que controlamos. La TGA, el IVA y los recargos dependen de la clasificación NCM y los confirma su despachante (ADAU); la TGA no es universal: aplica según la clasificación NCM (por ejemplo, a bienes de capital BK/BIT) y su despachante (ADAU) confirma la tasa vigente. El origen EE. UU. no tiene preferencias Mercosur."
      },
      {
        "question": "¿A qué puerto llega la cosechadora?",
        "answer": "Habitualmente vía Montevideo, pero no está garantizado: el puerto depende de la naviera, la modalidad de carga, las dimensiones y el plan de su despachante. La página no promete un puerto único."
      }
    ],
    "ctaHeading": "Cotice el flete de su cosechadora desde EE. UU. a Uruguay",
    "ctaDescription": "Comparta el modelo y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La nacionalización y los tributos los confirma su despachante (ADAU).",
    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de una cosechadora desde EE. UU. a Uruguay. Equipo: [marca/modelo/año/cabezal]. Ubicación: [ciudad/estado]. Destino: [ciudad de Uruguay]. Ref: {{whatsapp_ref}}"
  }
};
