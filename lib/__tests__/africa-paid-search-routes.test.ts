import { describe, expect, it } from "vitest";
import { AFRICA_PAID_SEARCH_DESTINATIONS } from "@/content/africa-paid-search-destinations";
import {
  assertAfricaRouteRegistry,
  getAfricaPaidSearchStaticParams,
} from "@/lib/africa-paid-search-routes";
import {
  getPaidSearchDestination,
  resolvePaidSearchRoute,
} from "@/lib/latam-paid-search-routes";

describe("africa paid-search route registry", () => {
  it("contains exactly 6 records (Ghana + Kenya + Tanzania × 2 segments; own count invariant, distinct from LATAM's 14)", () => {
    expect(AFRICA_PAID_SEARCH_DESTINATIONS).toHaveLength(6);
  });

  it("every record is locale en with a locale-neutral canonical path", () => {
    for (const r of AFRICA_PAID_SEARCH_DESTINATIONS) {
      expect(r.locale).toBe("en");
      expect(r.seo.canonicalPath).toBe(
        `/destinations/${r.country.slug}/${r.segment.slug}`,
      );
      // No /en (or /es) prefix — locale-neutral URL.
      expect(r.seo.canonicalPath.startsWith("/destinations/")).toBe(true);
    }
  });

  it("has unique route keys and canonical paths", () => {
    const keys = AFRICA_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey);
    const paths = AFRICA_PAID_SEARCH_DESTINATIONS.map((r) => r.seo.canonicalPath);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("covers both segments for each of Ghana, Kenya and Tanzania", () => {
    const keys = AFRICA_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey).sort();
    expect(keys).toEqual([
      "ghana/farm-tractors-usa",
      "ghana/heavy-equipment-usa",
      "kenya/farm-tractors-usa",
      "kenya/heavy-equipment-usa",
      "tanzania/farm-tractors-usa",
      "tanzania/heavy-equipment-usa",
    ]);
  });

  it("derives cargo_class and request_type consistently from segment", () => {
    const expected: Record<string, { cargoClass: string; requestType: string }> = {
      farm_tractor_import: { cargoClass: "farm_tractor", requestType: "farm_tractor_import_quote" },
      heavy_equipment_import: { cargoClass: "heavy_oog", requestType: "heavy_equipment_import_quote" },
    };
    for (const r of AFRICA_PAID_SEARCH_DESTINATIONS) {
      expect(r.segment.cargoClass).toBe(expected[r.segment.key].cargoClass);
      expect(r.segment.requestType).toBe(expected[r.segment.key].requestType);
    }
  });

  it("registry invariants hold (assertAfricaRouteRegistry does not throw)", () => {
    expect(() => assertAfricaRouteRegistry()).not.toThrow();
  });

  it("required copy fields are non-empty on every route", () => {
    for (const r of AFRICA_PAID_SEARCH_DESTINATIONS) {
      expect(r.h1.length).toBeGreaterThan(0);
      expect(r.heroBody.length).toBeGreaterThan(0);
      expect(r.scopeIncluded.length).toBeGreaterThan(0);
      expect(r.scopeExcluded.length).toBeGreaterThan(0);
      expect(r.process.steps.length).toBeGreaterThan(0);
      expect(r.quoteReadiness.fields.length).toBeGreaterThan(0);
      expect(r.compliance.body.length).toBeGreaterThan(0);
      expect(r.faq.length).toBeGreaterThan(0);
      expect(r.officialSources.length).toBeGreaterThan(0);
      // WhatsApp prefill keeps the interpolation placeholder verbatim.
      expect(r.cta.whatsappPrefill).toContain("{{whatsapp_ref}}");
      // Router tag for en leads is #FRT_EN.
      expect(r.cta.whatsappPrefill).toContain("#FRT_EN");
    }
  });

  it("official sources are the named per-country authorities (customs + standards/PVoC)", () => {
    // Each country pairs its customs/revenue authority with its standards/PVoC authority.
    const expectedHosts: Record<string, [string, string]> = {
      ghana: ["gra.gov.gh", "gsa.gov.gh"],
      kenya: ["kra.go.ke", "kebs.org"],
      tanzania: ["tra.go.tz", "tbs.go.tz"],
    };
    for (const r of AFRICA_PAID_SEARCH_DESTINATIONS) {
      const hosts = r.officialSources.map((s) => new URL(s.url).host);
      const [customs, standards] = expectedHosts[r.country.slug];
      expect(hosts.some((h) => h.includes(customs))).toBe(true);
      expect(hosts.some((h) => h.includes(standards))).toBe(true);
    }
  });
});

describe("locale-parametric resolver + trust boundary", () => {
  it("resolves every en Africa combo via getPaidSearchDestination('en', ...)", () => {
    for (const r of AFRICA_PAID_SEARCH_DESTINATIONS) {
      const found = getPaidSearchDestination("en", r.country.slug, r.segment.slug);
      expect(found?.routeKey).toBe(r.routeKey);
      expect(found?.locale).toBe("en");
    }
  });

  it("resolves Kenya and Tanzania route keys server-side", () => {
    for (const key of [
      "kenya/farm-tractors-usa",
      "kenya/heavy-equipment-usa",
      "tanzania/farm-tractors-usa",
      "tanzania/heavy-equipment-usa",
    ]) {
      const found = resolvePaidSearchRoute(key);
      expect(found?.routeKey).toBe(key);
      expect(found?.locale).toBe("en");
    }
  });

  it("an en routeKey requested as es (or vice versa) never cross-resolves", () => {
    // Ghana record requested with the wrong locale → null.
    expect(getPaidSearchDestination("es", "ghana", "farm-tractors-usa")).toBeNull();
    // LATAM record requested as en → null (locale mismatch).
    expect(getPaidSearchDestination("en", "argentina", "importacion-maquinaria-usa")).toBeNull();
  });

  it("rejects unknown locales", () => {
    expect(getPaidSearchDestination("ru", "ghana", "farm-tractors-usa")).toBeNull();
  });

  it("resolvePaidSearchRoute derives locale server-side from the record", () => {
    const gh = resolvePaidSearchRoute("ghana/farm-tractors-usa");
    expect(gh?.locale).toBe("en");
    const ar = resolvePaidSearchRoute("argentina/importacion-maquinaria-usa");
    expect(ar?.locale).toBe("es");
    expect(resolvePaidSearchRoute("nope/nope")).toBeNull();
  });
});

describe("africa static params", () => {
  it("returns all Ghana, Kenya and Tanzania combos for the dynamic [slug]/[segment] route", () => {
    const params = getAfricaPaidSearchStaticParams();
    expect(params).toHaveLength(6);
    expect(params.map((p) => `${p.slug}/${p.segment}`).sort()).toEqual([
      "ghana/farm-tractors-usa",
      "ghana/heavy-equipment-usa",
      "kenya/farm-tractors-usa",
      "kenya/heavy-equipment-usa",
      "tanzania/farm-tractors-usa",
      "tanzania/heavy-equipment-usa",
    ]);
  });
});
