import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import type { PaidSearchLeadData } from "@/lib/schemas";

const h = vi.hoisted(() => ({
  sendMock: vi.fn(async () => ({ error: null })),
  notifySlack: vi.fn(async () => {}),
  sendCAPIEvent: vi.fn(async () => {}),
  track: vi.fn(async () => {}),
}));

vi.mock("next/server", () => ({ after: (cb: () => void | Promise<void>) => void cb() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: h.sendMock };
  },
}));
vi.mock("@vercel/analytics/server", () => ({ track: h.track }));
vi.mock("@/lib/slack", () => ({ notifySlack: h.notifySlack }));
vi.mock("@/lib/meta-capi", () => ({ sendCAPIEvent: h.sendCAPIEvent }));
vi.mock("@/lib/logger", () => ({ startTimer: () => ({ done: vi.fn(), error: vi.fn() }), log: vi.fn() }));

import { submitPaidSearchLead } from "@/app/actions/paid-search-lead";

const FULL_TOUCH = {
  capturedAt: "2026-06-22T00:00:00Z",
  landingUrl: "https://meridianexport.com/es/destinations/argentina/importacion-maquinaria-usa?gclid=G",
  referrer: "https://www.google.com/",
  gclid: "G1", gbraid: "GB1", wbraid: "WB1", fbclid: "FB1",
  utm_source: "google", utm_medium: "cpc", utm_campaign: "C", utm_term: "K", utm_content: "A",
  utm_matchtype: "e", utm_network: "g", utm_device: "m",
};

function baseLead(overrides: Record<string, unknown> = {}): PaidSearchLeadData {
  return {
    routeKey: "argentina/importacion-maquinaria-usa",
    contact_name: "Juan",
    contact_email: "juan@example.com",
    contact_phone: "",
    preferred_contact_method: "whatsapp",
    equipment_type: "cosechadora",
    make_model: "JD 9600",
    year: "2018",
    listing_url: "",
    origin_location: "Des Moines, IA",
    destination_location: "Rosario",
    dimensions: "",
    weight: "",
    purchase_status: "evaluando",
    requested_timing: "",
    buyer_role: "",
    message: "hola",
    consent: true,
    website: "",
    attribution_id: "attr_x",
    whatsapp_ref: "",
    lead_id: "lead-123",
    first_touch: FULL_TOUCH,
    latest_touch: FULL_TOUCH,
    ...overrides,
  } as PaidSearchLeadData;
}

let fetchSpy: MockInstance;

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://db.example.com");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "svc");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  h.sendMock.mockClear();
  h.notifySlack.mockClear();
  h.sendCAPIEvent.mockClear();
  h.track.mockClear();
  fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue({ ok: true, json: async () => [{ id: 1 }], text: async () => "" } as unknown as Response);
});

afterEach(() => {
  vi.unstubAllEnvs();
  fetchSpy.mockRestore();
});

function leadInsertBody(): Record<string, unknown> | null {
  const call = fetchSpy.mock.calls.find((c) => String(c[0]).includes("/rest/v1/leads"));
  return call ? JSON.parse((call[1] as RequestInit).body as string) : null;
}

describe("submitPaidSearchLead", () => {
  it("persists every contract field incl gbraid/wbraid + extended UTMs", async () => {
    const res = await submitPaidSearchLead(baseLead());
    expect(res.success).toBe(true);
    const body = leadInsertBody()!;
    expect(body).toBeTruthy();
    for (const k of [
      "gclid", "gbraid", "wbraid", "fbclid",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "utm_matchtype", "utm_network", "utm_device",
    ]) {
      expect(body[k], k).toBeTruthy();
    }
    expect(body.schema_version).toBe("paid-search-lead-v1");
    expect(body.source_platform).toBe("google_ads");
    expect(body.source_account_id).toBe("3783002123");
    expect(body.idempotency_key).toBe(body.lead_id);
    expect(body.lead_id).toBe("lead-123");
    expect(body.first_touch).toBeTruthy();
    expect(body.latest_touch).toBeTruthy();
  });

  it("rederives route context from routeKey (trust boundary — incl cargo_class + page_route)", async () => {
    await submitPaidSearchLead(baseLead());
    const body = leadInsertBody()!;
    expect(body.country).toBe("AR");
    expect(body.segment).toBe("machinery_import");
    expect(body.cargo_class).toBe("general_machinery");
    expect(body.request_type).toBe("import_coordination_quote");
    expect(body.landing_route).toBe("/es/destinations/argentina/importacion-maquinaria-usa");
    expect(body.page_route).toBe(body.landing_route);
    expect(body.router_tag).toBe("#FRT_ES");
  });

  it("rejects an unsupported route combination", async () => {
    const res = await submitPaidSearchLead(baseLead({ routeKey: "argentina/flete-equipo-pesado-usa" }));
    expect(res.success).toBe(false);
  });

  it("dedupes: a confirmed duplicate skips owner email + all side effects", async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: async () => [], text: async () => "" } as unknown as Response);
    const res = await submitPaidSearchLead(baseLead());
    expect(res.success).toBe(true);
    expect(res.duplicate).toBe(true);
    expect(h.sendMock).not.toHaveBeenCalled();
    expect(h.notifySlack).not.toHaveBeenCalled();
    expect(h.sendCAPIEvent).not.toHaveBeenCalled();
  });

  it("on insert: owner email once, diagnostic emitters fire, NO Google Ads upload", async () => {
    await submitPaidSearchLead(baseLead());
    expect(h.sendMock).toHaveBeenCalledTimes(1);
    expect(h.notifySlack).toHaveBeenCalledTimes(1);
    expect(h.sendCAPIEvent).toHaveBeenCalledTimes(1);
    const adsCall = fetchSpy.mock.calls.find((c) => /googleads|google-analytics|\/ads\b/.test(String(c[0])));
    expect(adsCall).toBeUndefined();
  });

  it("honeypot: a filled website field short-circuits with no insert", async () => {
    const res = await submitPaidSearchLead(baseLead({ website: "bot" }));
    expect(res.success).toBe(true);
    expect(leadInsertBody()).toBeNull();
  });
});
