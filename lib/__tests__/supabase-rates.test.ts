import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchLandedCostProfilesV3 } from "@/lib/supabase-rates";

const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function restoreEnv(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY", value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function landedCostProfileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    country_code: "UY",
    country_name: "Uruguay",
    landed_equipment_class: "combine",
    shipping_mode: "flatrack",
    profile_name: "Uruguay combine flatrack",
    source_label: "Broker reference 2026-06-12",
    source_kind: "broker_reference",
    source_url: null,
    source_reference: "Broker reference 2026-06-12",
    retrieved_at: "2026-06-12",
    reviewed_at: "2026-06-12",
    reviewed_by: "Meridian operations",
    owner: "Meridian operations",
    confidence: "medium",
    is_active: true,
    currency: "USD",
    schema_version: 1,
    rules_hash: "uy-combine-flatrack-2026-06-12",
    assumptions_json: {
      approximateOnly: true,
      manualOverridesAllowed: false,
      roundingMode: "nearest_dollar",
      disclaimer: "Indicative landed-cost estimate.",
      disclaimerKey: "landed.uy.combine",
      notes: [],
    },
    rules_json: [
      {
        code: "equipment_value",
        labelKey: "landed.input.equipment",
        label: "Equipment value",
        kind: "input",
        group: "equipment",
        paymentBucket: "dealer_payment",
        inputKey: "equipment_value",
        recoverable: false,
        customerVisible: true,
        sortOrder: 10,
      },
    ],
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  restoreEnv("SUPABASE_URL", originalSupabaseUrl);
  restoreEnv("SUPABASE_SERVICE_ROLE_KEY", originalSupabaseKey);
});

describe("fetchLandedCostProfilesV3", () => {
  it("parses broker profiles that use marine insurance as a derived input", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    const argentinaRow = landedCostProfileRow({
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      country_code: "AR",
      country_name: "Argentina",
      rules_json: [
        {
          code: "marine_insurance",
          labelKey: "landed.input.marine_insurance",
          label: "Marine insurance",
          kind: "input",
          group: "origin_logistics",
          paymentBucket: "meridian_invoice",
          inputKey: "marine_insurance",
          recoverable: false,
          customerVisible: true,
          sortOrder: 10,
        },
      ],
    });
    const validRow = landedCostProfileRow();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([argentinaRow, validRow]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const profiles = await fetchLandedCostProfilesV3();

    expect(profiles).toHaveLength(2);
    expect(profiles.map((profile) => profile.countryCode)).toEqual(["AR", "UY"]);
    expect(
      profiles[0]?.rules.find((rule) => rule.code === "marine_insurance")?.inputKey,
    ).toBe("marine_insurance");
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("skips genuinely unsupported landed-cost profiles without dropping valid rows", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    const invalidRow = landedCostProfileRow({
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      country_code: "AR",
      country_name: "Argentina",
      rules_json: [
        {
          code: "unsupported_adjustment",
          labelKey: "landed.input.unsupported_adjustment",
          label: "Unsupported adjustment",
          kind: "input",
          group: "origin_logistics",
          paymentBucket: "meridian_invoice",
          inputKey: "unsupported_adjustment",
          recoverable: false,
          customerVisible: true,
          sortOrder: 10,
        },
      ],
    });
    const validRow = landedCostProfileRow();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([invalidRow, validRow]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const profiles = await fetchLandedCostProfilesV3();

    expect(profiles).toHaveLength(1);
    expect(profiles[0]?.id).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(profiles[0]?.countryCode).toBe("UY");
    expect(errorSpy).toHaveBeenCalledWith(
      "Skipping invalid landed cost profile:",
      expect.objectContaining({
        id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        country_code: "AR",
        landed_equipment_class: "combine",
        shipping_mode: "flatrack",
      }),
    );
  });
});
