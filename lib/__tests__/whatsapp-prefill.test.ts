import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, interpolateWhatsAppRef } from "@/lib/whatsapp-prefill";

const TEMPLATE =
  "#FRT_ES Hola, quiero cotizar importación de maquinaria desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ref: {{whatsapp_ref}}";

describe("interpolateWhatsAppRef", () => {
  it("inserts the opaque ref once and leaves no placeholder", () => {
    const out = interpolateWhatsAppRef(TEMPLATE, "MF-A7K29XQ4");
    expect(out).toContain("Ref: MF-A7K29XQ4");
    expect(out).not.toContain("{{whatsapp_ref}}");
  });

  it("strips the Ref tail when no ref is available (fallback)", () => {
    const out = interpolateWhatsAppRef(TEMPLATE);
    expect(out).not.toContain("{{whatsapp_ref}}");
    expect(out).not.toMatch(/Ref:/);
    expect(out).toContain("#FRT_ES");
  });

  it("never contains click-ID or UTM substrings", () => {
    const out = interpolateWhatsAppRef(TEMPLATE, "MF-A7K29XQ4");
    expect(out).not.toMatch(/gclid|gbraid|wbraid|fbclid|utm_/i);
  });
});

describe("buildWhatsAppUrl", () => {
  it("uses digits-only phone and URL-encodes the text", () => {
    const url = buildWhatsAppUrl("+1 (641) 516-1616", "hola #FRT_ES Ref: MF-X");
    expect(url).toBe("https://wa.me/16415161616?text=hola%20%23FRT_ES%20Ref%3A%20MF-X");
  });
});
