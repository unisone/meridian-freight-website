import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/logger", () => ({ log: vi.fn() }));

import { createWhatsAppRef } from "@/app/actions/whatsapp-ref";

beforeEach(() => {
  // Force the no-DB path so the test never makes a network call.
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createWhatsAppRef", () => {
  it("returns an opaque MF- ref (8 Crockford chars), URL-safe, with lead_id + expiry", async () => {
    const r = await createWhatsAppRef({ routeKey: "argentina/importacion-maquinaria-usa", attribution_id: "attr_x" });
    expect(r.success).toBe(true);
    expect(r.whatsapp_ref).toMatch(/^MF-[0-9A-HJKMNP-TV-Z]{8}$/);
    expect(encodeURIComponent(r.whatsapp_ref!)).toBe(r.whatsapp_ref); // URL-safe, no encoding
    expect((r.whatsapp_ref ?? "").length).toBeLessThanOrEqual(32);
    expect(r.lead_id).toBeTruthy();
    expect(r.expires_at).toBeTruthy();
  });

  it("rejects an unknown route", async () => {
    const r = await createWhatsAppRef({ routeKey: "narnia/nope", attribution_id: "" });
    expect(r.success).toBe(false);
    expect(r.error).toBe("unknown_route");
  });

  it("rejects an invalid country/segment combo (registry-validated)", async () => {
    const r = await createWhatsAppRef({ routeKey: "argentina/flete-equipo-pesado-usa", attribution_id: "" });
    expect(r.success).toBe(false);
  });
});
