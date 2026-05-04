import { describe, expect, it } from "vitest";

import {
  initialWizardState,
  wizardReducer,
  type WizardAction,
  type WizardState,
} from "../state";

// Helper — produce a fully-populated state to verify cascade resets.
function populatedState(): WizardState {
  return {
    ...initialWizardState,
    profileId: "profile-old",
    modeId: "container",
    quantity: 5,
    equipmentValueUsd: 75000,
    showAllProfiles: true,
    destinationCountry: "DE",
    destinationPortKey: "DEHAM",
    routePreference: "fastest",
    routeId: "route-x",
    zipCode: "50005",
    email: "user@example.com",
    name: "Old Name",
    company: "Acme",
    phone: "+1-555-0100",
    preferredContact: "whatsapp",
    website: "",
    isSubmitting: false,
    error: "stale error",
    result: null,
    mobileSheetOpen: false,
  };
}

describe("wizardReducer", () => {
  it("SELECT_PROFILE replaces profile and clears 6 downstream fields plus result/error", () => {
    const next = wizardReducer(populatedState(), {
      type: "SELECT_PROFILE",
      profileId: "p1",
      modeId: "whole",
      quantity: 1,
    });

    expect(next.profileId).toBe("p1");
    expect(next.modeId).toBe("whole");
    expect(next.quantity).toBe(1);
    // Cascade-reset fields:
    expect(next.equipmentValueUsd).toBeNull();
    expect(next.destinationCountry).toBe("");
    expect(next.destinationPortKey).toBeNull();
    expect(next.routeId).toBeNull();
    expect(next.zipCode).toBe("");
    expect(next.result).toBeNull();
    expect(next.error).toBe("");
  });

  it("SELECT_MODE clears equipmentValueUsd, destinationCountry/Port, routeId, result, error", () => {
    const next = wizardReducer(populatedState(), {
      type: "SELECT_MODE",
      modeId: "whole",
    });

    expect(next.modeId).toBe("whole");
    expect(next.equipmentValueUsd).toBeNull();
    expect(next.destinationCountry).toBe("");
    expect(next.destinationPortKey).toBeNull();
    expect(next.routeId).toBeNull();
    expect(next.result).toBeNull();
    expect(next.error).toBe("");
  });

  it("RESET_ALL preserves loaded data + rateBookSignature; clears every input field", () => {
    // Simulate a state where data has been loaded
    const stateWithData: WizardState = {
      ...populatedState(),
      // pretend data is non-null
      data: { rateBookSignature: "sig-123" } as WizardState["data"],
      rateBookSignature: "sig-123",
    };
    const next = wizardReducer(stateWithData, { type: "RESET_ALL" });

    // Inputs cleared
    expect(next.profileId).toBe("");
    expect(next.modeId).toBe("whole");
    expect(next.quantity).toBe(1);
    expect(next.destinationCountry).toBe("");
    expect(next.destinationPortKey).toBeNull();
    expect(next.routePreference).toBe("cheapest");
    expect(next.routeId).toBeNull();
    expect(next.zipCode).toBe("");
    expect(next.equipmentValueUsd).toBeNull();
    expect(next.email).toBe("");
    expect(next.name).toBe("");
    expect(next.company).toBe("");
    expect(next.phone).toBe("");
    expect(next.preferredContact).toBe("email");
    expect(next.website).toBe("");
    expect(next.error).toBe("");
    expect(next.result).toBeNull();
    expect(next.mobileSheetOpen).toBe(false);
    expect(next.showAllProfiles).toBe(false);
    // Loaded data preserved
    expect(next.data).toBe(stateWithData.data);
    expect(next.rateBookSignature).toBe("sig-123");
    expect(next.loading).toBe(false);
  });

  it("RESET_ESTIMATE clears result and error only; everything else preserved", () => {
    const populated = populatedState();
    const withResult: WizardState = {
      ...populated,
      result: { success: true } as WizardState["result"],
      error: "oops",
    };

    const next = wizardReducer(withResult, { type: "RESET_ESTIMATE" });

    expect(next.result).toBeNull();
    expect(next.error).toBe("");
    // Other fields untouched
    expect(next.profileId).toBe(populated.profileId);
    expect(next.modeId).toBe(populated.modeId);
    expect(next.destinationCountry).toBe(populated.destinationCountry);
    expect(next.routeId).toBe(populated.routeId);
    expect(next.email).toBe(populated.email);
  });

  it("Unknown action type returns the same state reference (exhaustive switch fallthrough)", () => {
    const populated = populatedState();
    // Cast to bypass discriminated-union narrowing — we want to verify the
    // default branch returns the input state unchanged.
    const unknown = { type: "UNKNOWN_DOES_NOT_EXIST" } as unknown as WizardAction;
    const next = wizardReducer(populated, unknown);
    expect(next).toBe(populated);
  });
});
