import { describe, expect, it } from "vitest";
import { getAllEquipmentSlugs } from "@/content/equipment";
import {
  getLatamMarketPage,
  latamMarketPages,
  latamMarketSlugs,
} from "@/content/latam-market-pages";
import { getAllServices } from "@/content/services";

function flattenText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(flattenText).join("\n");
  }
  return "";
}

describe("LATAM market buyer hub content", () => {
  it("defines exactly the approved Spanish country hubs", () => {
    expect(latamMarketSlugs).toEqual(["paraguay", "uruguay", "bolivia", "chile"]);
    expect(latamMarketPages.map((page) => page.slug)).toEqual(latamMarketSlugs);

    for (const page of latamMarketPages) {
      expect(page.locale.startsWith("es-")).toBe(true);
      expect(page.path).toBe(`/es/destinations/${page.slug}`);
      expect(getLatamMarketPage(page.slug)).toBe(page);
    }
  });

  it("keeps every country page deep enough for a strategic buyer hub", () => {
    for (const page of latamMarketPages) {
      expect(page.officialSources.length).toBeGreaterThanOrEqual(3);
      expect(page.faq.entries.length).toBeGreaterThanOrEqual(8);
      expect(page.equipmentFocus.items).toHaveLength(4);
      expect(page.sendUsThis.items.length).toBeGreaterThanOrEqual(6);
      expect(page.route.steps.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps SEO titles and descriptions within search-result limits", () => {
    for (const page of latamMarketPages) {
      expect(page.seo.title.length).toBeLessThanOrEqual(60);
      expect(page.seo.description.length).toBeGreaterThanOrEqual(120);
      expect(page.seo.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("uses structured WhatsApp prefills that qualify the lead", () => {
    const requiredFields = [
      "Necesito cotizar:",
      "Equipo o parte:",
      "Año/modelo:",
      "Ubicación en origen:",
      "Destino final:",
      "Cantidad/configuración:",
      "Link del anuncio:",
    ];

    for (const page of latamMarketPages) {
      expect(page.hero.whatsappMessage).toContain(
        `Hola. Estoy evaluando importar maquinaria agrícola usada o repuestos desde EE.UU. a ${page.country}.`,
      );
      expect(page.hero.whatsappMessage).not.toContain("cotización orientativa");
      for (const field of requiredFields) {
        expect(page.hero.whatsappMessage).toContain(field);
      }
    }
  });

  it("keeps required internal links available on each buyer hub", () => {
    const requiredLinks = [
      "/services/equipment-sales",
      "/services/agricultural",
      "/pricing/calculator",
      "/projects",
      "/equipment/combines",
      "/equipment/tractors",
    ];

    for (const page of latamMarketPages) {
      const hrefs = [
        ...page.resourceLinks.map((item) => item.href),
        ...page.equipmentFocus.items.map((item) => item.href),
      ];

      for (const href of requiredLinks) {
        expect(hrefs).toContain(href);
      }

      expect(
        hrefs.some((href) => href === "/equipment/sprayers" || href === "/equipment/planters"),
      ).toBe(true);
    }
  });

  it("keeps buyer-hub internal links on supported localized route families", () => {
    const supportedServicePaths = new Set(
      getAllServices("es").map((service) => `/services/${service.slug}`),
    );
    const supportedEquipmentPaths = new Set(
      getAllEquipmentSlugs().map((slug) => `/equipment/${slug}`),
    );
    const supportedStaticPaths = new Set(["/pricing/calculator", "/projects", "/contact"]);

    for (const page of latamMarketPages) {
      const hrefs = [
        ...page.resourceLinks.map((item) => item.href),
        ...page.equipmentFocus.items.map((item) => item.href),
        page.credibility.projectGalleryHref,
      ];

      expect(hrefs).not.toContain("/projects/equipment/combines");

      for (const href of hrefs) {
        expect(href.startsWith("/")).toBe(true);

        const isSupported =
          supportedStaticPaths.has(href) ||
          supportedServicePaths.has(href) ||
          supportedEquipmentPaths.has(href);

        expect(isSupported, `${page.slug} has unsupported internal link ${href}`).toBe(true);
      }
    }
  });

  it("keeps the Paraguay Hidrovía and terminal copy durable", () => {
    const paraguay = flattenText(getLatamMarketPage("paraguay"));

    expect(paraguay).toContain(
      "Las restricciones de calado en la Hidrovía cambian por resolución y por condiciones hidrométricas.",
    );
    expect(paraguay).toContain(
      "Villeta y Asunción concentran operaciones fluviales relevantes",
    );
    expect(paraguay).not.toContain("febrero o marzo de 2026");
    expect(paraguay).not.toContain("bajante actual");
    expect(paraguay).not.toContain("terminal principal de contenedores");
  });

  it("keeps Uruguay metadata concise and buyer-facing", () => {
    const uruguay = getLatamMarketPage("uruguay");
    expect(uruguay).toBeDefined();
    if (!uruguay) throw new Error("Uruguay LATAM page is missing");

    expect(uruguay.seo.description).toBe(
      "DGSA 98/016 exige limpieza y certificado fitosanitario. Meridian coordina compra, retiro, embalaje y flete desde EE.UU. a Montevideo.",
    );
    expect(uruguay.seo.description.length).toBeLessThanOrEqual(155);
    expect(uruguay.hero.description).toContain(
      "Uruguay tiene una ruta marítima directa hacia Montevideo",
    );
    expect(uruguay.hero.description).not.toContain("18,4%");
  });

  it("locks the country-specific compliance strategies", () => {
    const paraguay = flattenText(getLatamMarketPage("paraguay"));
    expect(paraguay).toContain("Ley 7565/2025");
    expect(paraguay).toContain("cinco años");
    expect(paraguay.toLowerCase()).not.toContain("pending");

    const uruguay = flattenText(getLatamMarketPage("uruguay"));
    expect(uruguay).toContain("DGSA");
    expect(uruguay).toContain("Resolución 98/016");

    const bolivia = flattenText(getLatamMarketPage("bolivia"));
    expect(bolivia).toContain("SENASAG");
    expect(bolivia).toContain("Permiso Fitosanitario");
    expect(bolivia).toContain("Repuestos y componentes John Deere");
    expect(bolivia).toContain("broker o importador");
    expect(bolivia).toContain("Su broker/importador confirma en Bolivia");
    expect(bolivia).toContain("Documentos para revisar con su broker/importador");
    expect(bolivia).toContain("confirmar");
    expect(bolivia).toContain(
      "Para bienes de capital incluidos en regímenes de incentivo fiscal, la antigüedad puede ser determinante.",
    );
    expect(bolivia.toLowerCase()).not.toContain("tope universal de 10 años");
    expect(bolivia.toLowerCase()).not.toContain("límite universal de 10 años");
    expect(bolivia.toLowerCase()).not.toContain("limite universal de 10 años");
    expect(bolivia).not.toContain("Bolivia exige máximo 10 años");
    expect(bolivia).not.toContain("Bolivia exige máximo diez años");
    expect(bolivia).not.toContain("Bolivia limita la importación de bienes de capital usados");
    expect(bolivia).not.toContain("tasa cero IVA");

    const chile = flattenText(getLatamMarketPage("chile"));
    expect(chile).toContain("SAG");
    expect(chile).toContain("Resolución 3.103/2016");
    expect(chile).toContain("libre de suelo, restos vegetales y plagas reglamentadas");
    expect(chile).toContain("Su despachador de aduanas confirma en Chile");
    expect(chile).not.toContain("libre de aranceles");
    expect(chile).not.toContain("costo final nacionalizado");
  });

  it("includes the requested FAQ depth questions by country", () => {
    const expectedQuestions: Record<string, string[]> = {
      paraguay: [
        "¿Puedo importar una cosechadora con más de cinco años de antigüedad?",
        "¿Qué documentos necesita mi despachante antes de emitir la Licencia Previa?",
        "¿Cómo funciona el tránsito por la Hidrovía Paraná-Paraguay?",
        "¿Qué cubre Meridian y qué queda para mi despachante?",
        "¿Qué pasa si la unidad llega con tierra, restos vegetales o un odómetro manipulado?",
        "¿Qué pasa si la unidad tiene accesorios, cabezal o draper?",
        "¿Conviene comprar en EE.UU. o en Brasil/Argentina?",
        "¿Hay nuevos tributos asociados a la Ley 7565/2025?",
        "¿La calculadora incluye DNIT, SENAVE o la Tasa de Biodiversidad?",
        "¿También cotizan repuestos John Deere por separado?",
      ],
      uruguay: [
        "¿Meridian entrega la maquinaria nacionalizada en Uruguay?",
        "¿Qué exige la Resolución DGSA 98/016?",
        "¿Qué pasa si la máquina llega con tierra, restos vegetales o plagas?",
        "¿Pueden coordinar limpieza/desmontaje antes del certificado fitosanitario?",
        "¿Cuál es la diferencia entre cotización a Montevideo y costo nacionalizado?",
        "¿Qué arancel, TGA o impuestos aplican a maquinaria agrícola usada?",
        "¿Cuándo conviene comprar en EE.UU. frente a Brasil o Argentina?",
        "¿También manejan repuestos John Deere?",
        "¿Qué datos necesitan para cotizar una cosechadora o tractor?",
      ],
      bolivia: [
        "¿Por qué Bolivia necesita una ruta especial?",
        "¿Qué debe confirmar mi broker antes de comprar?",
        "¿La regla de 10 años aplica a toda maquinaria agrícola usada?",
        "¿Qué pasó con la tasa cero/IVA de 2025?",
        "¿Qué documentos ayudan a respaldar antigüedad y condición?",
        "¿Qué cambia si el destino es Santa Cruz versus La Paz o Cochabamba?",
        "¿Qué rol tiene SENASAG?",
        "¿Meridian nacionaliza la maquinaria en Bolivia?",
        "¿También manejan repuestos John Deere?",
        "¿Cuánto tarda una operación?",
      ],
      chile: [
        "¿Qué exige SAG para maquinaria usada que entra a Chile?",
        "¿Qué pasa si SAG encuentra suelo, restos vegetales o plagas?",
        "¿La cotización incluye nacionalización en Chile?",
        "¿San Antonio es siempre el puerto correcto?",
        "¿Qué debe confirmar mi despachador de aduanas antes de comprar?",
        "¿El TLC EE.UU.-Chile elimina todos los costos?",
        "¿Conviene comprar en EE.UU. frente a proveedores europeos o chinos?",
        "¿También manejan repuestos John Deere?",
        "¿Qué datos necesitan para revisar una unidad?",
      ],
    };

    for (const [slug, questions] of Object.entries(expectedQuestions)) {
      const pageQuestions = getLatamMarketPage(slug)?.faq.entries.map((entry) => entry.question);
      expect(pageQuestions).toBeDefined();
      for (const question of questions) {
        expect(pageQuestions).toContain(question);
      }
    }
  });

  it("does not include banned proof, price, or placeholder language", () => {
    const bannedPatterns = [
      /trusted by Paraguay/i,
      /trusted by Uruguay/i,
      /trusted by Bolivia/i,
      /trusted by Chile/i,
      /best price/i,
      /cheapest/i,
      /guaranteed/i,
      /sin complicaciones/i,
      /fácil/i,
      /\bproof\b/i,
      /\bfake\b/i,
      /placeholder/i,
      /\bTBD\b/i,
    ];

    for (const page of latamMarketPages) {
      const text = flattenText(page);
      for (const pattern of bannedPatterns) {
        expect(text).not.toMatch(pattern);
      }
    }
  });

  it("keeps public copy buyer-facing instead of editorial or internal", () => {
    const internalPatterns = [
      /la pagina/i,
      /esta pagina/i,
      /desde una pagina web/i,
      /no presentamos/i,
      /no afirma/i,
      /no necesitamos/i,
      /sin inventar/i,
      /historial no probado/i,
      /prueba interna/i,
      /prueba especifica/i,
      /evidencia publicada/i,
      /no debe leerse/i,
      /sobria/i,
      /cuidadosa/i,
      /sobrepromesas/i,
      /\bhandoff\b/i,
      /row-crop/i,
      /\bdealer\b/i,
      /\bZIP\b/,
    ];

    for (const page of latamMarketPages) {
      const text = flattenText(page);
      for (const pattern of internalPatterns) {
        expect(text).not.toMatch(pattern);
      }
    }
  });
});
