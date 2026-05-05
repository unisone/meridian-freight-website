import { describe, expect, it } from "vitest";
import {
  getLatamMarketPage,
  latamMarketPages,
  latamMarketSlugs,
} from "@/content/latam-market-pages";

function flattenText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(flattenText).join("\n");
  }
  return "";
}

describe("LATAM market buyer hub content", () => {
  it("defines exactly the three approved Spanish country hubs", () => {
    expect(latamMarketSlugs).toEqual(["paraguay", "uruguay", "bolivia"]);
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
      expect(page.faq.entries.length).toBeGreaterThanOrEqual(5);
      expect(page.equipmentFocus.items).toHaveLength(4);
      expect(page.sendUsThis.items.length).toBeGreaterThanOrEqual(6);
      expect(page.route.steps.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("locks the country-specific compliance strategies", () => {
    const paraguay = flattenText(getLatamMarketPage("paraguay"));
    expect(paraguay).toContain("Ley 7565/2025");
    expect(paraguay.toLowerCase()).not.toContain("pending");

    const uruguay = flattenText(getLatamMarketPage("uruguay"));
    expect(uruguay).toContain("DGSA");
    expect(uruguay).toContain("Resolucion 98/016");

    const bolivia = flattenText(getLatamMarketPage("bolivia"));
    expect(bolivia).toContain("broker/importador");
    expect(bolivia).toContain("confirmar");
    expect(bolivia.toLowerCase()).not.toContain("tope universal de 10 años");
    expect(bolivia.toLowerCase()).not.toContain("limite universal de 10 años");
  });

  it("does not include banned proof, price, or placeholder language", () => {
    const bannedPatterns = [
      /trusted by Paraguay/i,
      /trusted by Uruguay/i,
      /trusted by Bolivia/i,
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
