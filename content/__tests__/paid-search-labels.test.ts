import { describe, expect, it } from "vitest";
import { getPaidSearchChromeLabels } from "@/content/paid-search-labels";

/**
 * Byte-identical guard for the LATAM (`es`) paid-search chrome.
 *
 * The page component + quote form used to hardcode these Spanish strings inline.
 * After extracting them into the locale-keyed labels layer, `es` output must stay
 * byte-for-byte identical (LATAM is live). This test pins the EXACT original
 * strings, so any accidental edit to the `es` labels fails loudly. (There is no
 * pre-existing render/snapshot test for these components, so this is the
 * regression net for the byte-identical requirement.)
 */
describe("paid-search chrome labels — es byte-identical", () => {
  const es = getPaidSearchChromeLabels("es");

  it("page chrome matches the original hardcoded Spanish", () => {
    expect(es.jsonLdLanguageName).toBe("Spanish");
    expect(es.breadcrumbDestinations).toBe("Destinos");
    expect(es.requestQuote).toBe("Solicitar cotización");
    expect(es.eyebrowProcess).toBe("Proceso");
    expect(es.eyebrowScope).toBe("Alcance");
    expect(es.scopeTitle).toBe("Qué incluye y qué no la cotización");
    expect(es.scopeIntro("despachante")).toBe(
      "Separamos el tramo internacional que controlamos de los costos y trámites locales que confirma su despachante.",
    );
    expect(es.scopeMeridianHeading).toBe("Meridian coordina");
    expect(es.scopeBrokerHeading("despachante")).toBe("Su despachante confirma en destino");
    // per-country broker term is preserved (CL/PE/VE differ from the AR/BO/PY/UY default)
    expect(es.scopeBrokerHeading("agente de aduana")).toBe("Su agente de aduana confirma en destino");
    expect(es.eyebrowQuote).toBe("Cotización");
    expect(es.quoteFormHeading).toBe("Solicitar cotización");
    expect(es.quoteFormIntro).toBe(
      "Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional.",
    );
    expect(es.eyebrowCompliance).toBe("Cumplimiento local");
    expect(es.statsSentencePrefix).toBe("Meridian ha coordinado más de");
    expect(es.statsSentenceMiddle).toBe("exportaciones a más de");
    expect(es.statsSentenceSuffix).toBe("países.");
    expect(es.eyebrowFaq).toBe("Preguntas frecuentes");
    expect(es.faqTitle).toBe("Preguntas frecuentes");
    expect(es.faqIntro).toBe("Lo que más nos consultan los compradores antes de embarcar.");
    expect(es.eyebrowSources).toBe("Fuentes oficiales");
    expect(es.sourcesTitle).toBe("Fuentes oficiales para validar su operación");
    expect(es.sourcesIntro("despachante")).toBe(
      "Los requisitos pueden cambiar y dependen de la clasificación, condición y uso del equipo. Confirme su caso con su importador o despachante antes de comprar o embarcar.",
    );
    expect(es.sourceOpensNewTab("SAG")).toBe("SAG (fuente oficial, abre en una pestaña nueva)");
    expect(es.eyebrowRelated).toBe("Recursos relacionados");
    expect(es.relatedTitle).toBe("Siga explorando");
  });

  it("form chrome matches the original hardcoded Spanish", () => {
    const f = es.form;
    expect(f.requiredHintPrefix).toBe("Los campos marcados con ");
    expect(f.requiredHintAsteriskSr).toBe(" asterisco");
    expect(f.requiredHintSuffix).toBe(" son obligatorios.");
    expect(f.labelName).toBe("Nombre");
    expect(f.labelPhone).toBe("WhatsApp o teléfono");
    expect(f.labelEmail).toBe("Email");
    expect(f.labelEquipment).toBe("Equipo");
    expect(f.equipmentPlaceholder).toBe("Ej.: cosechadora, tractor, excavadora");
    expect(f.labelMakeModel).toBe("Marca, modelo y año");
    expect(f.labelPurchaseStatus).toBe("Estado de compra");
    expect(f.selectPlaceholder).toBe("Seleccione…");
    expect(f.purchaseEvaluating).toBe("Evaluando opciones");
    expect(f.purchaseReserved).toBe("Reservado");
    expect(f.purchasePurchased).toBe("Comprado");
    expect(f.labelBuyerRole).toBe("Rol del comprador");
    expect(f.roleImporter).toBe("Importador / usuario final");
    expect(f.roleDealer).toBe("Concesionario o revendedor");
    expect(f.roleBroker).toBe("Despachante o gestor");
    expect(f.roleOther).toBe("Otro");
    expect(f.labelOrigin).toBe("Ubicación en EE. UU./Canadá");
    expect(f.labelDestination).toBe("Ciudad de destino");
    expect(f.labelDimensions).toBe("Dimensiones (alto × ancho × largo)");
    expect(f.dimensionsPlaceholder).toBe("Ej.: 3,5 × 2,5 × 6 m");
    expect(f.labelWeight).toBe("Peso aproximado");
    expect(f.weightPlaceholder).toBe("Ej.: 12.000 kg");
    expect(f.labelListingUrl).toBe("Link del equipo o factura proforma");
    expect(f.labelTiming).toBe("Fecha estimada de embarque");
    expect(f.timingPlaceholder).toBe("Ej.: agosto 2026");
    expect(f.labelMessage).toBe("Detalles adicionales");
    expect(f.consentText).toBe(
      "Autorizo a Meridian a contactarme y a usar mis datos para responder esta solicitud de cotización.",
    );
    expect(f.submit).toBe("Solicitar cotización");
    expect(f.submitting).toBe("Enviando…");
    expect(f.successHeading).toBe("Solicitud recibida");
    expect(f.successBody).toBe(
      "Gracias. Revisaremos los datos del equipo y le responderemos con el alcance del tramo internacional. Le contactaremos dentro de las próximas 24 horas.",
    );
    expect(f.successWhatsApp).toBe("¿Prefiere avanzar ahora? Escríbanos por WhatsApp");
    expect(f.errName).toBe("Ingrese su nombre.");
    expect(f.errEquipment).toBe("Indique el tipo de equipo.");
    expect(f.errContact).toBe(
      "Ingrese un email o un teléfono/WhatsApp para que podamos responderle.",
    );
    expect(f.errEmail).toBe("Ingrese un email válido.");
    expect(f.errConsent).toBe("Debe aceptar las condiciones para continuar.");
    expect(f.errSubmit).toBe("No pudimos enviar su solicitud. Intente nuevamente.");
  });

  it("en chrome is fully populated (no es leakage into en)", () => {
    const en = getPaidSearchChromeLabels("en");
    expect(en.jsonLdLanguageName).toBe("English");
    // A representative sample of en strings differs from es.
    expect(en.eyebrowProcess).toBe("Process");
    expect(en.form.submit).toBe("Request a quote");
    // Ensure no obviously-Spanish string leaked into the en set.
    const enValues = [
      en.breadcrumbDestinations,
      en.eyebrowScope,
      en.eyebrowCompliance,
      en.form.labelName,
      en.form.consentText,
    ];
    for (const v of enValues) {
      expect(v).not.toMatch(/cotización|despachante|Seleccione/);
    }
  });
});
