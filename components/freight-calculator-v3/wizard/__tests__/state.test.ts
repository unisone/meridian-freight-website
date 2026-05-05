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

  it("DATA_LOADED stores data + signature, clears loading + dataError", () => {
    const start: WizardState = {
      ...initialWizardState,
      loading: true,
      dataError: true,
    };
    const payload = {
      rateBookSignature: "sig-fresh",
      profiles: [],
      countries: [],
    } as unknown as NonNullable<WizardState["data"]>;

    const next = wizardReducer(start, { type: "DATA_LOADED", payload });

    expect(next.data).toBe(payload);
    expect(next.rateBookSignature).toBe("sig-fresh");
    expect(next.loading).toBe(false);
    expect(next.dataError).toBe(false);
  });

  it("DATA_ERROR sets dataError true and stops loading", () => {
    const start: WizardState = { ...initialWizardState, loading: true };
    const next = wizardReducer(start, { type: "DATA_ERROR" });
    expect(next.dataError).toBe(true);
    expect(next.loading).toBe(false);
  });

  it("SET_DESTINATION_COUNTRY clears port + route + result + error", () => {
    const populated = populatedState();
    const next = wizardReducer(populated, {
      type: "SET_DESTINATION_COUNTRY",
      country: "AR",
    });

    expect(next.destinationCountry).toBe("AR");
    expect(next.destinationPortKey).toBeNull();
    expect(next.routeId).toBeNull();
    expect(next.result).toBeNull();
    expect(next.error).toBe("");
    // Other fields preserved
    expect(next.profileId).toBe(populated.profileId);
    expect(next.modeId).toBe(populated.modeId);
    expect(next.zipCode).toBe(populated.zipCode);
  });

  it("SET_ZIP updates zip + clears routeId + result + error (forces route reselection)", () => {
    const populated = populatedState();
    const next = wizardReducer(populated, { type: "SET_ZIP", zip: "50005" });

    expect(next.zipCode).toBe("50005");
    expect(next.routeId).toBeNull();
    expect(next.result).toBeNull();
    expect(next.error).toBe("");
    // Country / port preserved (zip is a refinement, not a destination switch)
    expect(next.destinationCountry).toBe(populated.destinationCountry);
    expect(next.destinationPortKey).toBe(populated.destinationPortKey);
  });

  it("SUBMIT_START sets isSubmitting=true and clears error", () => {
    const populated: WizardState = { ...populatedState(), error: "old error" };
    const next = wizardReducer(populated, { type: "SUBMIT_START" });

    expect(next.isSubmitting).toBe(true);
    expect(next.error).toBe("");
  });

  it("SUBMIT_SUCCESS stores result + updates rateBookSignature when server returns one", () => {
    const populated: WizardState = {
      ...populatedState(),
      isSubmitting: true,
      rateBookSignature: "old-sig",
    };
    const result = { success: true } as WizardState["result"];

    const next = wizardReducer(populated, {
      type: "SUBMIT_SUCCESS",
      result: result!,
      currentRateBookSignature: "new-sig",
    });

    expect(next.isSubmitting).toBe(false);
    expect(next.result).toBe(result);
    expect(next.rateBookSignature).toBe("new-sig");
    expect(next.error).toBe("");
  });

  it("SUBMIT_SUCCESS without currentRateBookSignature preserves existing signature", () => {
    const populated: WizardState = {
      ...populatedState(),
      rateBookSignature: "kept-sig",
    };
    const result = { success: true } as WizardState["result"];

    const next = wizardReducer(populated, {
      type: "SUBMIT_SUCCESS",
      result: result!,
    });

    expect(next.rateBookSignature).toBe("kept-sig");
  });

  it("SUBMIT_ERROR stores error + result, clears isSubmitting (rate-book-changed flow)", () => {
    const populated: WizardState = { ...populatedState(), isSubmitting: true };
    const result = {
      success: false,
      rateBookChanged: true,
    } as WizardState["result"];

    const next = wizardReducer(populated, {
      type: "SUBMIT_ERROR",
      error: "rate book changed",
      result: result!,
    });

    expect(next.isSubmitting).toBe(false);
    expect(next.error).toBe("rate book changed");
    expect(next.result).toBe(result);
  });

  it("TOGGLE_MOBILE_SHEET flips the mobileSheetOpen flag", () => {
    const closed = wizardReducer(initialWizardState, {
      type: "TOGGLE_MOBILE_SHEET",
      open: true,
    });
    expect(closed.mobileSheetOpen).toBe(true);

    const reopened = wizardReducer(closed, {
      type: "TOGGLE_MOBILE_SHEET",
      open: false,
    });
    expect(reopened.mobileSheetOpen).toBe(false);
  });

  it("SHOW_ALL_PROFILES sets the showAllProfiles flag (one-shot expansion)", () => {
    const next = wizardReducer(initialWizardState, { type: "SHOW_ALL_PROFILES" });
    expect(next.showAllProfiles).toBe(true);
  });

  it("Contact-info setters (SET_EMAIL, SET_NAME, SET_PHONE, SET_PREFERRED_CONTACT) do not clear estimate result", () => {
    const populated: WizardState = {
      ...populatedState(),
      result: { success: true } as WizardState["result"],
    };

    const afterEmail = wizardReducer(populated, {
      type: "SET_EMAIL",
      email: "new@example.com",
    });
    expect(afterEmail.email).toBe("new@example.com");
    expect(afterEmail.result).toBe(populated.result);

    const afterPhone = wizardReducer(populated, {
      type: "SET_PHONE",
      phone: "+1-555-0199",
    });
    expect(afterPhone.phone).toBe("+1-555-0199");
    expect(afterPhone.result).toBe(populated.result);

    const afterContact = wizardReducer(populated, {
      type: "SET_PREFERRED_CONTACT",
      contact: "whatsapp",
    });
    expect(afterContact.preferredContact).toBe("whatsapp");
    expect(afterContact.result).toBe(populated.result);
  });
});
