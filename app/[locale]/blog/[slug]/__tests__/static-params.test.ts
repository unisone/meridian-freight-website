import { describe, expect, it } from "vitest";
import { getAllBlogPosts, getBlogStaticParams } from "@/content/blog";

// Guards the soft-404 fix (#179): the blog [slug] route prerenders each post ONLY in the
// locales it exists in (paired with `dynamicParams = false` on the route, so every other
// blog URL returns a true 404 instead of a 200 soft-404). This tests the param source;
// the 404 status itself is verified at runtime against the built server.
describe("getBlogStaticParams (locale-qualified, no soft-404)", () => {
  const params = getBlogStaticParams();
  const has = (locale: string, slug: string) =>
    params.some((p) => p.locale === locale && p.slug === slug);

  it("prerenders the es-only import pillar in es ONLY (no phantom en/ru)", () => {
    expect(has("es", "importar-maquinaria-agricola-usa")).toBe(true);
    expect(has("en", "importar-maquinaria-agricola-usa")).toBe(false);
    expect(has("ru", "importar-maquinaria-agricola-usa")).toBe(false);
  });

  it("emits exactly the real (locale, slug) pairs — nothing missing, nothing extra", () => {
    const expected = new Set<string>();
    for (const locale of ["en", "es", "ru"]) {
      for (const p of getAllBlogPosts(locale)) expected.add(`${locale}::${p.slug}`);
    }
    const actual = new Set(params.map((p) => `${p.locale}::${p.slug}`));
    expect(actual).toEqual(expected);
  });

  it("still prerenders real EN posts (route works for the default locale)", () => {
    expect(params.some((p) => p.locale === "en")).toBe(true);
  });
});
