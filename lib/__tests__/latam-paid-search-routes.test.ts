import { describe, expect, it } from "vitest";
import {
  LATAM_PAID_SEARCH_DESTINATIONS,
} from "@/content/latam-paid-search-destinations";
import {
  assertRouteRegistry,
  getArgentinaPaidSearchStaticParams,
  getPaidSearchDestination,
  getPaidSearchStaticParams,
} from "@/lib/latam-paid-search-routes";

describe("latam paid-search route registry", () => {
  it("contains exactly 10 records (ROUTE-001)", () => {
    expect(LATAM_PAID_SEARCH_DESTINATIONS).toHaveLength(10);
  });

  it("has unique route keys (ROUTE-002)", () => {
    const keys = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has unique canonical paths matching the route (ROUTE-003)", () => {
    const paths = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.seo.canonicalPath);
    expect(new Set(paths).size).toBe(paths.length);
    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
      expect(r.seo.canonicalPath).toBe(
        `/es/destinations/${r.country.slug}/${r.segment.slug}`,
      );
    }
  });

  it("registry invariants hold (assertRouteRegistry does not throw)", () => {
    expect(() => assertRouteRegistry()).not.toThrow();
  });

  it("derives cargo_class and request_type consistently from segment", () => {
    const expected: Record<string, { cargoClass: string; requestType: string }> = {
      machinery_import: { cargoClass: "general_machinery", requestType: "import_coordination_quote" },
      combine_shipping: { cargoClass: "combine", requestType: "combine_freight_quote" },
      heavy_equipment_shipping: { cargoClass: "heavy_oog", requestType: "heavy_equipment_freight_quote" },
    };
    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
      expect(r.segment.cargoClass).toBe(expected[r.segment.key].cargoClass);
      expect(r.segment.requestType).toBe(expected[r.segment.key].requestType);
    }
  });
});

describe("getPaidSearchDestination (ROUTE-002 / lookup + locale)", () => {
  it("resolves all 10 valid es combos", () => {
    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
      const found = getPaidSearchDestination("es", r.country.slug, r.segment.slug);
      expect(found?.routeKey).toBe(r.routeKey);
    }
  });

  it("returns null for invalid country/segment combos (ROUTE-005)", () => {
    expect(getPaidSearchDestination("es", "argentina", "flete-equipo-pesado-usa")).toBeNull();
    expect(getPaidSearchDestination("es", "chile", "flete-cosechadoras-usa")).toBeNull();
    expect(getPaidSearchDestination("es", "bolivia", "flete-cosechadoras-usa")).toBeNull();
  });

  it("returns null for non-es locales (ROUTE-006)", () => {
    expect(getPaidSearchDestination("en", "argentina", "importacion-maquinaria-usa")).toBeNull();
    expect(getPaidSearchDestination("ru", "argentina", "importacion-maquinaria-usa")).toBeNull();
  });
});

describe("static params (ROUTE-004)", () => {
  it("dynamic [slug]/[segment] returns the 8 non-Argentina combos", () => {
    const params = getPaidSearchStaticParams();
    expect(params).toHaveLength(8);
    expect(params.every((p) => p.slug !== "argentina")).toBe(true);
  });

  it("argentina/[segment] returns the 2 Argentina segments", () => {
    const params = getArgentinaPaidSearchStaticParams();
    expect(params).toHaveLength(2);
    expect(params.map((p) => p.segment).sort()).toEqual(
      ["flete-cosechadoras-usa", "importacion-maquinaria-usa"],
    );
  });

  it("dynamic + argentina static params together cover all 10 routes exactly once", () => {
    const dyn = getPaidSearchStaticParams().map((p) => `${p.slug}/${p.segment}`);
    const ar = getArgentinaPaidSearchStaticParams().map((p) => `argentina/${p.segment}`);
    const all = [...dyn, ...ar].sort();
    const expected = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey).sort();
    expect(all).toEqual(expected);
  });
});
