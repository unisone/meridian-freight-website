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
  capturedAt: "2026-07-01T00:00:00Z",
  landingUrl: "https://meridianexport.com/destinations/ghana/farm-tractors-usa?gclid=G",
  referrer: "https://www.google.com/",
  gclid: "G1", gbraid: "GB1", wbraid: "WB1", fbclid: "FB1",
  utm_source: "google", utm_medium: "cpc", utm_campaign: "C", utm_term: "K", utm_content: "A",
  utm_matchtype: "e", utm_network: "g", utm_device: "m",
};

function baseLead(overrides: Record<string, unknown> = {}): PaidSearchLeadData {
  return {
    routeKey: "ghana/farm-tractors-usa",
    contact_name: "Kwame",
    contact_email: "kwame@example.com",
    contact_phone: "",
    preferred_contact_method: "whatsapp",
    equipment_type: "tractor",
    make_model: "5075E",
    listing_url: "",
    origin_location: "Des Moines, IA",
    destination_location: "Tema",
    dimensions: "",
    weight: "",
    purchase_status: "evaluando",
    requested_timing: "",
    buyer_role: "",
    message: "",
    consent: true,
    website: "",
    attribution_id: "attr_gh",
    whatsapp_ref: "",
    lead_id: "lead-gh-1",
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

describe("submitPaidSearchLead — Ghana (en) route", () => {
  it("rederives Ghana route context from routeKey with #FRT_EN router tag", async () => {
    const res = await submitPaidSearchLead(baseLead());
    expect(res.success).toBe(true);
    const body = leadInsertBody()!;
    const meta = body.paid_search_metadata as Record<string, unknown>;
    expect(body.country).toBe("GH");
    expect(body.segment).toBe("farm_tractor_import");
    expect(body.cargo_class).toBe("farm_tractor");
    expect(meta.request_type).toBe("farm_tractor_import_quote");
    // Locale-neutral landing route (no /en prefix).
    expect(meta.landing_route).toBe("/destinations/ghana/farm-tractors-usa");
    expect(meta.page_route).toBe(meta.landing_route);
    // en leads carry #FRT_EN (LATAM stays #FRT_ES).
    expect(meta.router_tag).toBe("#FRT_EN");
  });

  it("synthesizes an ENGLISH message when the user leaves it blank", async () => {
    await submitPaidSearchLead(baseLead({ message: "" }));
    const body = leadInsertBody()!;
    expect(body.message).toBe("Quote request (paid-search): tractor → Ghana");
  });

  it("sends an ENGLISH visitor auto-reply for an en lead", async () => {
    await submitPaidSearchLead(baseLead());
    // The visitor auto-reply runs inside after(async () => ...) behind several
    // awaits; flush pending microtasks so its send() registers before asserting.
    await new Promise((r) => setTimeout(r, 0));
    // Owner email (call 0) + English visitor auto-reply (a later call).
    const subjects = (h.sendMock.mock.calls as unknown as Array<[{ subject: string }]>).map(
      (c) => c[0].subject,
    );
    expect(subjects.some((s) => s === "We received your request — Meridian (Ghana)")).toBe(true);
    // No Spanish auto-reply subject leaked in.
    expect(subjects.some((s) => s.startsWith("Recibimos su solicitud"))).toBe(false);
  });

  it("resolves the heavy-equipment segment too", async () => {
    const res = await submitPaidSearchLead(
      baseLead({ routeKey: "ghana/heavy-equipment-usa", lead_id: "lead-gh-2" }),
    );
    expect(res.success).toBe(true);
    const body = leadInsertBody()!;
    expect(body.segment).toBe("heavy_equipment_import");
    expect(body.cargo_class).toBe("heavy_oog");
  });

  it("rejects an unsupported Ghana combo", async () => {
    const res = await submitPaidSearchLead(
      baseLead({ routeKey: "ghana/importacion-maquinaria-usa" }),
    );
    expect(res.success).toBe(false);
  });
});
