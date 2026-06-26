import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/constants";

/**
 * Global hreflang invariants for the whole sitemap. These lock the contract for
 * EVERY section (static, services, equipment, destinations, hubs, paid-search,
 * blog), so a future edit to any one of them can't silently reintroduce a
 * one-directional annotation, a phantom alternate, a double `/es/es` prefix, or
 * a missing x-default.
 */
describe("sitemap hreflang invariants", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  const urlSet = new Set(urls);

  it("emits no duplicate <loc> URLs", () => {
    expect(urls.length).toBe(urlSet.size);
  });

  it("only emits canonical apex https URLs with no double locale prefix", () => {
    for (const url of urls) {
      expect(url.startsWith(`${SITE.url}`)).toBe(true);
      expect(url).not.toMatch(/\/(es|ru)\/(es|ru)\//); // e.g. /es/es/... or /es/ru/...
    }
  });

  it("gives every entry a languages cluster with an x-default", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages;
      expect(languages, `missing languages for ${entry.url}`).toBeDefined();
      expect(languages?.["x-default"], `missing x-default for ${entry.url}`).toBeDefined();
    }
  });

  it("is fully reciprocal: every hreflang target is itself an emitted <loc>", () => {
    for (const entry of entries) {
      const languages = (entry.alternates?.languages ?? {}) as Record<string, string>;
      for (const [key, target] of Object.entries(languages)) {
        // x-default may legitimately point at a locale that is one of the
        // emitted siblings; for both locale keys and x-default the target must
        // be a real, emitted URL in the sitemap.
        expect(
          urlSet.has(target),
          `${entry.url} declares hreflang "${key}" -> ${target}, which is not an emitted <loc>`,
        ).toBe(true);
      }
    }
  });

  it("makes every entry a member of its own language cluster (self-reference)", () => {
    for (const entry of entries) {
      const languages = (entry.alternates?.languages ?? {}) as Record<string, string>;
      const localeTargets = Object.entries(languages)
        .filter(([key]) => key !== "x-default")
        .map(([, target]) => target);
      expect(
        localeTargets.includes(entry.url),
        `${entry.url} is not listed in its own language cluster`,
      ).toBe(true);
    }
  });

  it("shares one identical languages object across all siblings of a group", () => {
    // Group entries by their cluster signature; every URL inside a cluster must
    // see the exact same set of alternates (the reciprocity guarantee).
    const bySelf = new Map<string, Record<string, string>>();
    for (const entry of entries) {
      bySelf.set(entry.url, (entry.alternates?.languages ?? {}) as Record<string, string>);
    }
    for (const entry of entries) {
      const languages = (entry.alternates?.languages ?? {}) as Record<string, string>;
      for (const [key, target] of Object.entries(languages)) {
        if (key === "x-default") continue;
        // The sibling at `target` must advertise the identical cluster.
        expect(bySelf.get(target)).toEqual(languages);
      }
    }
  });
});
