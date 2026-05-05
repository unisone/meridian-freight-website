import { describe, expect, it } from "vitest";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-json-ld";
import { SITE } from "@/lib/constants";

describe("Breadcrumb JSON-LD", () => {
  it("emits one locale-correct BreadcrumbList model for Spanish LATAM pages", () => {
    const jsonLd = buildBreadcrumbJsonLd({
      locale: "es",
      currentPath: "/destinations/paraguay",
      homeLabel: "Inicio",
      items: [
        { label: "Destinos", href: "/destinations" },
        { label: "Paraguay" },
      ],
    });

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement.at(-1)?.item).toBe(
      `${SITE.url}/es/destinations/paraguay`,
    );
  });
});
