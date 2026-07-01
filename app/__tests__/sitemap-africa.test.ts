import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { AFRICA_PAID_SEARCH_DESTINATIONS } from "@/content/africa-paid-search-destinations";
import { SITE } from "@/lib/constants";

describe("Africa Wave-1 sitemap entries", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

  it("includes each Ghana paid-search LP as a standalone en group", () => {
    for (const d of AFRICA_PAID_SEARCH_DESTINATIONS) {
      const url = `${SITE.url}${d.seo.canonicalPath}`;
      const entry = byUrl.get(url);
      expect(entry, `missing sitemap entry for ${url}`).toBeDefined();
      // Standalone en group, self-referential x-default, NOT cross-linked to es/ru.
      expect(entry?.alternates?.languages).toEqual({
        en: url,
        "x-default": url,
      });
    }
  });

  it("uses locale-neutral canonical paths (no /en prefix) for the paid LPs", () => {
    for (const d of AFRICA_PAID_SEARCH_DESTINATIONS) {
      const url = `${SITE.url}${d.seo.canonicalPath}`;
      expect(url).toBe(`${SITE.url}/destinations/${d.country.slug}/${d.segment.slug}`);
      expect(url).not.toContain("/en/destinations");
    }
  });

  it("indexes the Ghana organic hub as en-only (no es/ru variants)", () => {
    const hubUrl = `${SITE.url}/destinations/ghana`;
    const hub = byUrl.get(hubUrl);
    expect(hub).toBeDefined();
    expect(hub?.alternates?.languages).toEqual({
      en: hubUrl,
      "x-default": hubUrl,
    });
    // The es/ru fallback variants must NOT be sitemapped.
    expect(byUrl.get(`${SITE.url}/es/destinations/ghana`)).toBeUndefined();
    expect(byUrl.get(`${SITE.url}/ru/destinations/ghana`)).toBeUndefined();
  });
});
