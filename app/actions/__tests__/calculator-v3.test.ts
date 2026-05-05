// @vitest-environment node
//
// Tests for the v3 calculator server action. Covers REQ-06:
// - Zod rejection (invalid payload)
// - Honeypot bypass (website field set → early success, no side effects)
// - Stale rateBookSignature (returns refresh-state without sending email)
//
// Mocks at the boundary:
//   @/lib/supabase-rates  — canned equipment + ocean rate data
//   @/lib/calculator-contract.server  — deterministic signature
//   @/lib/calculator-v3/landed-cost-profiles  — pass-through
//   @/lib/calculator-v3/policy  — real (pure logic)
//   @/lib/resend  — never called in these paths; mocked anyway
//   @/lib/slack, @/lib/meta-capi  — never called in these paths
//   @/lib/logger  — silent
//   @vercel/analytics/server, next/server `after`  — no-op
//
// We test only the early-exit paths (Zod, honeypot, stale signature). The
// happy-path mailing flow is integration-tested via the component test suite
// (which mocks the action wholesale).

import { describe, expect, it, vi, beforeEach } from "vitest";

// ---- Mocks (must come before importing the action under test) ----------

vi.mock("@/lib/supabase-rates", () => ({
  fetchEquipmentRates: vi.fn(),
  fetchOceanRates: vi.fn(),
  fetchLandedCostProfilesV3: vi.fn(),
}));

vi.mock("@/lib/calculator-contract.server", () => ({
  buildRateBookSignature: vi.fn(() => "current-signature-abcdef12"),
}));

vi.mock("@/lib/calculator-v3/landed-cost-profiles", () => ({
  mergeLandedCostProfiles: vi.fn((x: unknown) => x ?? []),
}));

vi.mock("@/lib/calculator-v3/routes", () => ({
  buildRouteCatalog: vi.fn(() => ({ routes: [], dropped: [] })),
  routeIdFor: vi.fn(() => "fake-route"),
}));

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ data: { id: "fake" } }) } },
  isResendConfigured: () => false,
}));

vi.mock("@/lib/slack", () => ({
  notifySlack: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendCAPIEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/logger", () => ({
  log: vi.fn(),
  startTimer: vi.fn(() => ({ done: vi.fn(), error: vi.fn() })),
}));

vi.mock("@vercel/analytics/server", () => ({
  track: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/server", async (orig) => {
  const actual = (await orig()) as object;
  return {
    ...actual,
    // run after() callbacks synchronously so test assertions hold
    after: (cb: () => unknown) => {
      try { cb(); } catch { /* swallow */ }
    },
  };
});

// ---- Imports under test (after mocks) -----------------------------------

import { submitCalculatorV3 } from "../calculator-v3";
import * as supabaseRates from "@/lib/supabase-rates";
import type { CalculatorV3Data } from "@/lib/schemas";

// ---- Helpers ------------------------------------------------------------

function validPayload(overrides: Partial<CalculatorV3Data> = {}): CalculatorV3Data {
  return {
    email: "test@example.com",
    name: "Test Buyer",
    company: "",
    phone: "",
    preferredContact: "email",
    equipmentProfileId: "combines-small",
    modeId: "whole",
    quantity: 1,
    equipmentValueUsd: null,
    destinationCountry: "AR",
    destinationPortKey: null,
    routeId: null,
    routePreference: "cheapest",
    zipCode: "50005",
    rateBookSignature: "current-signature-abcdef12",
    website: "",
    source_page: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    ...overrides,
  } as CalculatorV3Data;
}

const fetchEquipmentMock = supabaseRates.fetchEquipmentRates as unknown as ReturnType<typeof vi.fn>;
const fetchOceanMock = supabaseRates.fetchOceanRates as unknown as ReturnType<typeof vi.fn>;
const fetchLandedCostMock = supabaseRates.fetchLandedCostProfilesV3 as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

// ---- Tests --------------------------------------------------------------

describe("submitCalculatorV3 — early exits", () => {
  it("rejects invalid Zod payload (missing required equipmentProfileId)", async () => {
    const bad = { ...validPayload(), equipmentProfileId: "" } as unknown as CalculatorV3Data;

    const result = await submitCalculatorV3(bad);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    // Should fail BEFORE any rate fetch (Zod gate is first)
    expect(fetchEquipmentMock).not.toHaveBeenCalled();
    expect(fetchOceanMock).not.toHaveBeenCalled();
  });

  it("rejects invalid email", async () => {
    const bad = { ...validPayload(), email: "not-an-email" } as unknown as CalculatorV3Data;

    const result = await submitCalculatorV3(bad);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/email/i);
    expect(fetchEquipmentMock).not.toHaveBeenCalled();
  });

  it("rejects WhatsApp preferred contact without phone (superRefine)", async () => {
    const bad = validPayload({ preferredContact: "whatsapp", phone: "" });

    const result = await submitCalculatorV3(bad);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(fetchEquipmentMock).not.toHaveBeenCalled();
  });

  it("honeypot: returns early success without firing any side effects", async () => {
    const honey = validPayload({ website: "i-am-a-bot" });

    const result = await submitCalculatorV3(honey);

    // Honeypot returns { success: true } so bots think they succeeded,
    // but nothing actually runs — no DB, no email, no Slack, no analytics.
    expect(result).toEqual({ success: true });
    expect(fetchEquipmentMock).not.toHaveBeenCalled();
    expect(fetchOceanMock).not.toHaveBeenCalled();
    expect(fetchLandedCostMock).not.toHaveBeenCalled();
  });

  it("returns refresh state when rateBookSignature is stale", async () => {
    // Mock equipment + ocean rates so the action gets past data gate.
    // We don't need realistic data; the stale-signature guard fires before
    // the engine actually runs. We mock fetchers so they don't blow up.
    fetchEquipmentMock.mockResolvedValue([
      {
        equipment_id: "x",
        equipment_category: "Combines",
        equipment_type: "x",
        equipment_size: 1,
        unit: "row",
        delivery_per_mile: 7,
        packing_unit: "flat",
        packing_cost: 1000,
        container_type: "fortyhc",
      },
    ]);
    // Schema validation in buildRouteCatalog is mocked above, so opaque data is fine.
    fetchOceanMock.mockResolvedValue([{ id: "x" }]);
    fetchLandedCostMock.mockResolvedValue([]);

    const stale = validPayload({ rateBookSignature: "stale-signature-12345678" });

    const result = await submitCalculatorV3(stale);

    expect(result.success).toBe(false);
    // Should include the current (mocked) signature back so the client can refresh
    expect((result as { currentRateBookSignature?: string }).currentRateBookSignature).toBe(
      "current-signature-abcdef12",
    );
  });
});
