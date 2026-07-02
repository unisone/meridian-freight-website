/**
 * Locale-keyed UI-chrome labels for the paid-search landing pages + quote form.
 *
 * The page component (`components/destinations/latam-paid-search-page.tsx`) and
 * the quote form (`components/destinations/paid-search-quote-form.tsx`) render a
 * fixed set of ~static "chrome" strings (section eyebrows, buttons, breadcrumb,
 * the stats sentence, form field labels, JSON-LD language, etc.) that used to be
 * hardcoded Spanish. They are keyed here by the record's locale so an English
 * (African) route renders English chrome while the Spanish (LATAM) route renders
 * byte-identical Spanish.
 *
 * INVARIANT: the `es` entries below MUST reproduce the exact strings the pages
 * shipped before this layer existed, so LATAM output is byte-identical (snapshot-
 * proven by the existing es tests). Do not "improve" the Spanish here.
 */

export type PaidSearchLocale = "es" | "en";

export interface PaidSearchChromeLabels {
  // ── Page component chrome ──────────────────────────────────────────────────
  /** BCP-47 / schema.org language name for JSON-LD availableLanguage. */
  readonly jsonLdLanguageName: string;
  /** Breadcrumb root label ("Destinos" / "Destinations"). */
  readonly breadcrumbDestinations: string;
  /** Hero primary CTA button ("Solicitar cotización"). */
  readonly requestQuote: string;
  /** Process section eyebrow. */
  readonly eyebrowProcess: string;
  /** Scope section eyebrow. */
  readonly eyebrowScope: string;
  /** Scope section title. */
  readonly scopeTitle: string;
  /** Scope section intro. Takes the per-country customs-broker term. */
  readonly scopeIntro: (broker: string) => string;
  /** Scope "Meridian coordinates" column heading (page body + hero card). */
  readonly scopeMeridianHeading: string;
  /** Scope "your broker confirms at destination" column heading. Takes the per-country broker term. */
  readonly scopeBrokerHeading: (broker: string) => string;
  /** Quote section eyebrow. */
  readonly eyebrowQuote: string;
  /** Quote form card heading ("Solicitar cotización"). */
  readonly quoteFormHeading: string;
  /** Quote form card sub-copy. */
  readonly quoteFormIntro: string;
  /** Compliance section eyebrow. */
  readonly eyebrowCompliance: string;
  /** Stats sentence prefix (before the count). */
  readonly statsSentencePrefix: string;
  /** Stats sentence middle (between count and "40+"). */
  readonly statsSentenceMiddle: string;
  /** Stats sentence suffix (after "40"). */
  readonly statsSentenceSuffix: string;
  /** FAQ section eyebrow. */
  readonly eyebrowFaq: string;
  /** FAQ section title. */
  readonly faqTitle: string;
  /** FAQ section intro. */
  readonly faqIntro: string;
  /** Official-sources section eyebrow. */
  readonly eyebrowSources: string;
  /** Official-sources section title. */
  readonly sourcesTitle: string;
  /** Official-sources section intro. Takes the per-country customs-broker term. */
  readonly sourcesIntro: (broker: string) => string;
  /** Accessible label suffix on each source link (opens in a new tab). */
  readonly sourceOpensNewTab: (label: string) => string;
  /** Related-resources section eyebrow. */
  readonly eyebrowRelated: string;
  /** Related-resources section title. */
  readonly relatedTitle: string;

  // ── Quote form chrome ──────────────────────────────────────────────────────
  readonly form: {
    readonly requiredHintPrefix: string;
    readonly requiredHintAsteriskSr: string;
    readonly requiredHintSuffix: string;
    readonly labelName: string;
    readonly labelPhone: string;
    readonly labelEmail: string;
    readonly labelEquipment: string;
    readonly equipmentPlaceholder: string;
    readonly labelMakeModel: string;
    readonly labelPurchaseStatus: string;
    readonly selectPlaceholder: string;
    readonly purchaseEvaluating: string;
    readonly purchaseReserved: string;
    readonly purchasePurchased: string;
    readonly labelBuyerRole: string;
    readonly roleImporter: string;
    readonly roleDealer: string;
    readonly roleBroker: string;
    readonly roleOther: string;
    readonly labelOrigin: string;
    readonly labelDestination: string;
    readonly labelDimensions: string;
    readonly dimensionsPlaceholder: string;
    readonly labelWeight: string;
    readonly weightPlaceholder: string;
    readonly labelListingUrl: string;
    readonly labelTiming: string;
    readonly timingPlaceholder: string;
    readonly labelMessage: string;
    readonly consentText: string;
    readonly submit: string;
    readonly submitting: string;
    // Success state
    readonly successHeading: string;
    readonly successBody: string;
    readonly successWhatsApp: string;
    // Client-side validation messages
    readonly errName: string;
    readonly errEquipment: string;
    readonly errContact: string;
    readonly errEmail: string;
    readonly errConsent: string;
    readonly errSubmit: string;
  };
}

export const PAID_SEARCH_CHROME_LABELS: Record<PaidSearchLocale, PaidSearchChromeLabels> = {
  es: {
    jsonLdLanguageName: "Spanish",
    breadcrumbDestinations: "Destinos",
    requestQuote: "Solicitar cotización",
    eyebrowProcess: "Proceso",
    eyebrowScope: "Alcance",
    scopeTitle: "Qué incluye y qué no la cotización",
    scopeIntro: (broker) =>
      `Separamos el tramo internacional que controlamos de los costos y trámites locales que confirma su ${broker}.`,
    scopeMeridianHeading: "Meridian coordina",
    scopeBrokerHeading: (broker) => `Su ${broker} confirma en destino`,
    eyebrowQuote: "Cotización",
    quoteFormHeading: "Solicitar cotización",
    quoteFormIntro:
      "Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional.",
    eyebrowCompliance: "Cumplimiento local",
    statsSentencePrefix: "Meridian ha coordinado más de",
    statsSentenceMiddle: "exportaciones a más de",
    statsSentenceSuffix: "países.",
    // W8 (Africa audit): intentional deviation from the original hardcoded Spanish —
    // the eyebrow duplicated faqTitle verbatim; "FAQ" removes the double heading text.
    eyebrowFaq: "FAQ",
    faqTitle: "Preguntas frecuentes",
    faqIntro: "Lo que más nos consultan los compradores antes de embarcar.",
    eyebrowSources: "Fuentes oficiales",
    sourcesTitle: "Fuentes oficiales para validar su operación",
    sourcesIntro: (broker) =>
      `Los requisitos pueden cambiar y dependen de la clasificación, condición y uso del equipo. Confirme su caso con su importador o ${broker} antes de comprar o embarcar.`,
    sourceOpensNewTab: (label) => `${label} (fuente oficial, abre en una pestaña nueva)`,
    eyebrowRelated: "Recursos relacionados",
    relatedTitle: "Siga explorando",
    form: {
      requiredHintPrefix: "Los campos marcados con ",
      requiredHintAsteriskSr: " asterisco",
      requiredHintSuffix: " son obligatorios.",
      labelName: "Nombre",
      labelPhone: "WhatsApp o teléfono",
      labelEmail: "Email",
      labelEquipment: "Equipo",
      equipmentPlaceholder: "Ej.: cosechadora, tractor, excavadora",
      labelMakeModel: "Marca, modelo y año",
      labelPurchaseStatus: "Estado de compra",
      selectPlaceholder: "Seleccione…",
      purchaseEvaluating: "Evaluando opciones",
      purchaseReserved: "Reservado",
      purchasePurchased: "Comprado",
      labelBuyerRole: "Rol del comprador",
      roleImporter: "Importador / usuario final",
      roleDealer: "Concesionario o revendedor",
      roleBroker: "Despachante o gestor",
      roleOther: "Otro",
      labelOrigin: "Ubicación en EE. UU./Canadá",
      labelDestination: "Ciudad de destino",
      labelDimensions: "Dimensiones (alto × ancho × largo)",
      dimensionsPlaceholder: "Ej.: 3,5 × 2,5 × 6 m",
      labelWeight: "Peso aproximado",
      weightPlaceholder: "Ej.: 12.000 kg",
      labelListingUrl: "Link del equipo o factura proforma",
      labelTiming: "Fecha estimada de embarque",
      timingPlaceholder: "Ej.: agosto 2026",
      labelMessage: "Detalles adicionales",
      consentText:
        "Autorizo a Meridian a contactarme y a usar mis datos para responder esta solicitud de cotización.",
      submit: "Solicitar cotización",
      submitting: "Enviando…",
      successHeading: "Solicitud recibida",
      successBody:
        "Gracias. Revisaremos los datos del equipo y le responderemos con el alcance del tramo internacional. Le contactaremos dentro de las próximas 24 horas.",
      successWhatsApp: "¿Prefiere avanzar ahora? Escríbanos por WhatsApp",
      errName: "Ingrese su nombre.",
      errEquipment: "Indique el tipo de equipo.",
      errContact: "Ingrese un email o un teléfono/WhatsApp para que podamos responderle.",
      errEmail: "Ingrese un email válido.",
      errConsent: "Debe aceptar las condiciones para continuar.",
      errSubmit: "No pudimos enviar su solicitud. Intente nuevamente.",
    },
  },
  en: {
    jsonLdLanguageName: "English",
    breadcrumbDestinations: "Destinations",
    requestQuote: "Request a quote",
    eyebrowProcess: "Process",
    eyebrowScope: "Scope",
    scopeTitle: "What the quote covers and what it doesn't",
    scopeIntro: (broker) =>
      `We separate the international leg we control from the local costs and formalities your ${broker} confirms.`,
    scopeMeridianHeading: "Meridian coordinates",
    scopeBrokerHeading: (broker) => `Your ${broker} confirms at destination`,
    eyebrowQuote: "Quote",
    quoteFormHeading: "Request a quote",
    quoteFormIntro:
      "Share the machine and the destination; we send back the scope of the international leg in writing.",
    eyebrowCompliance: "Local compliance",
    statsSentencePrefix: "Meridian has coordinated more than",
    statsSentenceMiddle: "exports to more than",
    statsSentenceSuffix: "countries.",
    // W8 (Africa audit): eyebrow shortened to "FAQ" so it no longer duplicates faqTitle.
    eyebrowFaq: "FAQ",
    faqTitle: "Frequently asked questions",
    faqIntro: "What buyers ask us most before they ship.",
    eyebrowSources: "Official sources",
    sourcesTitle: "Official sources to validate your import",
    sourcesIntro: (broker) =>
      `Requirements can change and depend on the classification, condition and use of the machine. Confirm your case with your importer or ${broker} before you buy or ship.`,
    sourceOpensNewTab: (label) => `${label} (official source, opens in a new tab)`,
    eyebrowRelated: "Related resources",
    relatedTitle: "Keep exploring",
    form: {
      requiredHintPrefix: "Fields marked with ",
      requiredHintAsteriskSr: " asterisk",
      requiredHintSuffix: " are required.",
      labelName: "Name",
      labelPhone: "WhatsApp or phone",
      labelEmail: "Email",
      labelEquipment: "Equipment",
      equipmentPlaceholder: "e.g. combine, tractor, excavator",
      labelMakeModel: "Make, model and year",
      labelPurchaseStatus: "Purchase status",
      selectPlaceholder: "Select…",
      purchaseEvaluating: "Evaluating options",
      purchaseReserved: "Reserved",
      purchasePurchased: "Purchased",
      labelBuyerRole: "Buyer role",
      roleImporter: "Importer / end user",
      roleDealer: "Dealer or reseller",
      roleBroker: "Customs broker or agent",
      roleOther: "Other",
      labelOrigin: "Location in the USA/Canada",
      labelDestination: "Destination city",
      labelDimensions: "Dimensions (height × width × length)",
      dimensionsPlaceholder: "e.g. 3.5 × 2.5 × 6 m",
      labelWeight: "Approximate weight",
      weightPlaceholder: "e.g. 12,000 kg",
      labelListingUrl: "Listing link or proforma invoice",
      labelTiming: "Estimated shipping date",
      timingPlaceholder: "e.g. August 2026",
      labelMessage: "Additional details",
      consentText:
        "I authorize Meridian to contact me and use my details to respond to this quote request.",
      submit: "Request a quote",
      submitting: "Sending…",
      successHeading: "Request received",
      successBody:
        "Thank you. We'll review the machine details and reply with the scope of the international leg. We'll be in touch within the next 24 hours.",
      successWhatsApp: "Prefer to move now? Message us on WhatsApp",
      errName: "Enter your name.",
      errEquipment: "Tell us the equipment type.",
      errContact: "Enter an email or a phone/WhatsApp number so we can reply.",
      errEmail: "Enter a valid email.",
      errConsent: "You must accept the terms to continue.",
      errSubmit: "We couldn't send your request. Please try again.",
    },
  },
};

/** Convenience accessor used by the shared page + form components. */
export function getPaidSearchChromeLabels(locale: PaidSearchLocale): PaidSearchChromeLabels {
  return PAID_SEARCH_CHROME_LABELS[locale];
}
