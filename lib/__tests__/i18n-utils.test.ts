import { describe, expect, it } from "vitest";

import { getLocalePathPrefix, localizePath } from "@/lib/i18n-utils";

describe("getLocalePathPrefix", () => {
  it("uses no prefix for English and locale prefixes for translated routes", () => {
    expect(getLocalePathPrefix("en")).toBe("");
    expect(getLocalePathPrefix("es")).toBe("/es");
    expect(getLocalePathPrefix("ru")).toBe("/ru");
  });
});

describe("localizePath", () => {
  it("localizes root and nested paths", () => {
    expect(localizePath("en", "/")).toBe("/");
    expect(localizePath("en", "/schedule")).toBe("/schedule");
    expect(localizePath("es", "/schedule")).toBe("/es/schedule");
    expect(localizePath("ru", "/pricing/calculator")).toBe("/ru/pricing/calculator");
  });

  it("preserves fragments on localized paths", () => {
    expect(localizePath("es", "/schedule#MF-2026-001")).toBe("/es/schedule#MF-2026-001");
  });
});
