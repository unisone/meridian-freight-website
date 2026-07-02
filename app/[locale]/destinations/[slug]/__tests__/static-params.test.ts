import { describe, expect, it } from "vitest";
import {
  destinations,
  getDestinationStaticParams,
} from "@/content/destinations";

// Guards the destinations soft-404 fix (same bug class as blog PR #180): the
// destinations [slug] route prerenders each country ONLY in the locales it exists in
// (paired with `dynamicParams = false` on the route, so every other destination URL
// returns a true 404 instead of a streamed 200 soft-404). This tests the param source;
// the 404 status itself is verified at runtime against the running server.
describe("getDestinationStaticParams (locale-qualified, no soft-404)", () => {
  const params = getDestinationStaticParams();
  const has = (locale: string, slug: string) =>
    params.some((p) => p.locale === locale && p.slug === slug);

  it("prerenders the EN-only Africa hubs in en ONLY (no phantom es/ru)", () => {
    for (const slug of ["ghana", "kenya", "tanzania"]) {
      expect(has("en", slug)).toBe(true);
      expect(has("es", slug)).toBe(false);
      expect(has("ru", slug)).toBe(false);
    }
  });

  it("does not emit params for slugs that exist in no locale (bogus slug → 404)", () => {
    expect(params.some((p) => p.slug === "zzz-nope")).toBe(false);
  });

  it("does not emit argentina — it is owned by the static argentina/ folder", () => {
    expect(params.some((p) => p.slug === "argentina")).toBe(false);
  });

  it("emits exactly the real (locale, slug) pairs — nothing missing, nothing extra", () => {
    const expected = new Set<string>();
    for (const [locale, dests] of Object.entries(destinations)) {
      for (const d of dests) expected.add(`${locale}::${d.slug}`);
    }
    const actual = new Set(params.map((p) => `${p.locale}::${p.slug}`));
    expect(actual).toEqual(expected);
  });

  it("still prerenders the localized pages that ARE real", () => {
    // ES LATAM market slugs render the LatamMarketPage branch and must stay enumerated.
    expect(has("es", "bolivia")).toBe(true);
    expect(has("es", "paraguay")).toBe(true);
    // RU Kazakhstan renders the KazakhstanMarketPage branch (revalidate=900 lane board).
    expect(has("ru", "kazakhstan")).toBe(true);
    // Default locale keeps working.
    expect(has("en", "kazakhstan")).toBe(true);
  });
});
