// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { CalculatorDataV3 } from "@/lib/calculator-v3/contracts";
import type { FreightEstimateV3 } from "@/lib/calculator-v3/contracts";

const mocks = vi.hoisted(() => ({
  getCalculatorDataV3: vi.fn(),
  submitCalculatorV3: vi.fn(),
  calculateFreightV3: vi.fn(),
  trackCalcFunnel: vi.fn(),
  trackGA4Event: vi.fn(),
  trackGoogleAdsConversion: vi.fn(),
  trackPixelEvent: vi.fn(),
  vercelTrack: vi.fn(),
}));

vi.mock("@/app/actions/calculator-v3-data", () => ({
  getCalculatorDataV3: mocks.getCalculatorDataV3,
}));

vi.mock("@/app/actions/calculator-v3", () => ({
  submitCalculatorV3: mocks.submitCalculatorV3,
}));

vi.mock("@/lib/calculator-v3/engine", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/calculator-v3/engine")>(
      "@/lib/calculator-v3/engine",
    );
  return {
    ...actual,
    calculateFreightV3: mocks.calculateFreightV3,
  };
});

vi.mock("@/lib/tracking", () => ({
  trackCalcFunnel: mocks.trackCalcFunnel,
  trackGA4Event: mocks.trackGA4Event,
  trackGoogleAdsConversion: mocks.trackGoogleAdsConversion,
  trackPixelEvent: mocks.trackPixelEvent,
}));

vi.mock("@vercel/analytics", () => ({
  track: mocks.vercelTrack,
}));

// Stub the heavy globe components — they pull in three.js / WebGL which jsdom
// can't initialize. We mock both the v3 wrapper AND the inner react-globe
// component because the wrapper only defers via next/dynamic at runtime; in
// jsdom it still ends up evaluating the inner module.
vi.mock("@/components/freight-calculator-v3/route-globe-v3", () => ({
  RouteGlobeV3: () => null,
}));
vi.mock("@/components/freight-calculator/route-globe", () => ({
  RouteGlobe: () => null,
}));

// jsdom doesn't ship ResizeObserver — many UI primitives (radix, lucide
// internals) reference it on mount. Provide a no-op stub.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver ?? ResizeObserverStub;

// Stub the i18n Link component (pulls in next-intl which doesn't work cleanly
// in pure jsdom without a NextIntlClientProvider wrapping the tree).
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...rest }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...rest}>{children}</a>
  ),
}));

import { CalculatorV3Wizard } from "../../calculator-v3-wizard";
import { EQUIPMENT_QUOTE_PROFILES } from "@/lib/calculator-v3/policy";

// ---- Canned data fixtures ---------------------------------------------------

function makeCalculatorData(): CalculatorDataV3 {
  // Pick the real "combines" profile so the cascade-reset and quantity logic
  // exactly mirror production. The profile contains both whole + container modes.
  const combines = EQUIPMENT_QUOTE_PROFILES.find((p) => p.id === "combines")!;

  const route = {
    id: "route-houston-buenos-aires",
    sourceRateId: "rate-1",
    containerType: "flatrack" as const,
    origin: { key: "USHOU", label: "Houston, TX", lat: 29.76, lon: -95.36 },
    destination: { key: "ARBUE", label: "Buenos Aires", lat: -34.6, lon: -58.4 },
    destinationCountry: "AR",
    carrier: "Maersk",
    oceanRateUsd: 12000,
    drayageUsd: 0,
    packingDrayageUsd: 4000,
    transitTimeDays: "28-32",
    transitMinDays: 28,
    transitMaxDays: 32,
  };

  return {
    equipment: [],
    profiles: [combines],
    routes: [route],
    importCostProfiles: [],
    quarantinedRateCount: 0,
    countries: ["AR"],
    destinationPortsByCountry: { AR: ["ARBUE"] },
    contractVersion: "calculator-v3.0.0",
    policyVersion: "v3-2026-04-01",
    rateBookSignature: "test-sig-1234567890",
  };
}

function makeFreightEstimate(): FreightEstimateV3 {
  const data = makeCalculatorData();
  const route = data.routes[0];
  const combines = data.profiles[0];
  const wholeMode = combines.modes.find((m) => m.id === "whole")!;

  return {
    version: "calculator-v3.0.0",
    equipmentProfileId: "combines",
    equipmentDisplayName: combines.label,
    quantity: 1,
    mode: wholeMode,
    containerType: "flatrack",
    pricedContainerCount: 1,
    dedicatedContainerCount: 1,
    routePreference: "cheapest",
    route,
    lineItems: [
      {
        id: "us_inland",
        label: "U.S. inland transport",
        amountUsd: null,
        note: "Enter ZIP for inland transport estimate.",
        includedInTotal: false,
      },
      {
        id: "packing_loading",
        label: "Packing & loading",
        amountUsd: 0,
        note: null,
        includedInTotal: true,
      },
      {
        id: "ocean_freight",
        label: "Sea freight & loading",
        amountUsd: 16150,
        note: null,
        includedInTotal: true,
      },
    ],
    usInlandTransport: null,
    packingAndLoading: 0,
    oceanFreight: 16150,
    compliancePrep: {
      status: "broker_confirm",
      amountUsd: null,
      amountStatus: "quote_confirmed",
      lines: [],
      sourceLabel: null,
      sourceUrl: null,
      note: null,
    },
    complianceServices: 0,
    freightTotal: 16150,
    freightPlusComplianceTotal: null,
    dedicatedContainerFreightTotal: null,
    totalExcludesInland: true,
    distanceMiles: null,
    deliveryRatePerMile: 8,
    compliancePolicy: null,
    importCost: {
      status: "unsupported",
      available: false,
      amountUsd: null,
      grossCashRequiredUsd: null,
      netAfterRecoverableUsd: null,
      recoverableCreditsUsd: null,
      dutyUsd: null,
      taxUsd: null,
      hsCode: null,
      dutyRatePct: null,
      taxRatePct: null,
      confidence: null,
      sourceLabel: null,
      sourceUrl: null,
      sourceReference: null,
      retrievedAt: null,
      reviewedBy: null,
      active: null,
      sourceVersion: null,
      profileName: null,
      missingInputs: [],
      lineItems: [],
      note: null,
    },
    notes: [],
    warnings: [],
  };
}

// Build a container-mode (40HC) variant of the canned fixtures. Combines'
// default whole-mode is flatrack which requires an equipment value, so we
// switch to container mode for the funnel tests where the value is not the
// behavior under test.
function setupContainerModeFixtures() {
  const data = makeCalculatorData();
  data.routes[0] = {
    ...data.routes[0],
    id: "route-chi-buenos-aires-40hc",
    sourceRateId: "rate-2",
    containerType: "fortyhc",
    origin: { key: "USCHI", label: "Chicago, IL", lat: 41.85, lon: -87.65 },
    drayageUsd: 650,
    packingDrayageUsd: 0,
  };
  const estimate = makeFreightEstimate();
  estimate.containerType = "fortyhc";
  estimate.route = data.routes[0];
  estimate.mode = data.profiles[0].modes.find((m) => m.id === "container")!;
  mocks.getCalculatorDataV3.mockResolvedValue(data);
  mocks.calculateFreightV3.mockReturnValue(estimate);
  mocks.submitCalculatorV3.mockResolvedValue({
    success: true,
    estimate,
    eventId: "evt-test",
    currentRateBookSignature: "test-sig-1234567890",
  });
}

// ---- Tests ------------------------------------------------------------------

describe("CalculatorV3Wizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCalculatorDataV3.mockResolvedValue(makeCalculatorData());
    mocks.calculateFreightV3.mockReturnValue(makeFreightEstimate());
    mocks.submitCalculatorV3.mockResolvedValue({
      success: true,
      estimate: makeFreightEstimate(),
      eventId: "evt-test",
      currentRateBookSignature: "test-sig-1234567890",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders Step 1 with the equipment category headline after data loads", async () => {
    render(<CalculatorV3Wizard locale="en" />);

    // Wait for the loading skeleton to be replaced with the real wizard.
    expect(
      await screen.findByRole("heading", { name: /select equipment category/i }),
    ).toBeInTheDocument();
    // The "Combines" profile button is rendered.
    expect(
      screen.getByRole("button", { name: /^Combines$/i }),
    ).toBeInTheDocument();
  });

  it("accepts round-dollar equipment values without native step mismatch", async () => {
    const user = userEvent.setup();
    render(<CalculatorV3Wizard locale="en" />);

    await user.click(await screen.findByRole("button", { name: /^Combines$/i }));

    const equipmentValueInput = await screen.findByLabelText(
      /equipment value/i,
    ) as HTMLInputElement;
    await user.type(equipmentValueInput, "125000");

    expect(equipmentValueInput.value).toBe("125000");
    expect(equipmentValueInput.validity.stepMismatch).toBe(false);
    expect(equipmentValueInput.checkValidity()).toBe(true);
  });

  it("completes funnel: equipment -> destination -> opens email gate -> submits", async () => {
    setupContainerModeFixtures();
    const user = userEvent.setup();
    render(<CalculatorV3Wizard locale="en" />);

    // 1. Pick equipment (Combines).
    await user.click(await screen.findByRole("button", { name: /^Combines$/i }));

    // 2. Switch to container mode (does NOT require equipment value).
    const containerModeBtn = (await screen.findAllByRole("button")).find((btn) =>
      /containeriz|^container$|containers/i.test(btn.textContent ?? ""),
    );
    if (containerModeBtn) await user.click(containerModeBtn);

    // 3. Pick destination country.
    const countrySelect = await screen.findByLabelText(/destination country/i);
    await user.selectOptions(countrySelect, "AR");

    // 4. Click "Send detailed estimate" to open the email gate.
    const sendButtons = await screen.findAllByRole("button", {
      name: /send detailed estimate/i,
    });
    // The first one is the gate-opener (disabled until step3 is done).
    const opener = sendButtons.find((btn) => !btn.hasAttribute("disabled"));
    expect(opener).toBeDefined();
    await user.click(opener!);

    // 4. Fill email + click submit.
    const emailInput = await screen.findByLabelText(/^email$/i);
    await user.type(emailInput, "buyer@example.com");

    // After typing, find the submit button (now inside the gate).
    const submitButtons = screen.getAllByRole("button", {
      name: /send detailed estimate/i,
    });
    const submit = submitButtons.find((btn) => !btn.hasAttribute("disabled"));
    expect(submit).toBeDefined();
    await user.click(submit!);

    // 5. Assert the server action was called with the expected payload shape.
    await waitFor(() => {
      expect(mocks.submitCalculatorV3).toHaveBeenCalled();
    });
    const [payload, locale] = mocks.submitCalculatorV3.mock.calls[0];
    expect(locale).toBe("en");
    expect(payload).toMatchObject({
      email: "buyer@example.com",
      equipmentProfileId: "combines",
      destinationCountry: "AR",
      rateBookSignature: "test-sig-1234567890",
    });
  });

  it("renders the success confirmation banner after a successful submit", async () => {
    setupContainerModeFixtures();
    const user = userEvent.setup();
    render(<CalculatorV3Wizard locale="en" />);

    await user.click(await screen.findByRole("button", { name: /^Combines$/i }));

    const containerModeBtn = (await screen.findAllByRole("button")).find((btn) =>
      /containeriz|^container$|containers/i.test(btn.textContent ?? ""),
    );
    if (containerModeBtn) await user.click(containerModeBtn);

    await user.selectOptions(
      await screen.findByLabelText(/destination country/i),
      "AR",
    );

    const opener = (await screen.findAllByRole("button", {
      name: /send detailed estimate/i,
    })).find((btn) => !btn.hasAttribute("disabled"));
    await user.click(opener!);

    await user.type(
      await screen.findByLabelText(/^email$/i),
      "buyer@example.com",
    );

    const submit = screen
      .getAllByRole("button", { name: /send detailed estimate/i })
      .find((btn) => !btn.hasAttribute("disabled"));
    await user.click(submit!);

    // Success banner — "Estimate sent to {email}"
    expect(
      await screen.findByText(/estimate sent to buyer@example\.com/i),
    ).toBeInTheDocument();
  });

  it("shows the inland-excluded ZIP hint when no ZIP is entered (edge case)", async () => {
    setupContainerModeFixtures();
    const user = userEvent.setup();
    render(<CalculatorV3Wizard locale="en" />);

    await user.click(await screen.findByRole("button", { name: /^Combines$/i }));

    const containerModeBtn = (await screen.findAllByRole("button")).find((btn) =>
      /containeriz|^container$|containers/i.test(btn.textContent ?? ""),
    );
    if (containerModeBtn) await user.click(containerModeBtn);

    await user.selectOptions(
      await screen.findByLabelText(/destination country/i),
      "AR",
    );

    // The estimate-card line item carries the zip hint when usInlandTransport
    // is null. In our canned estimate, it shows "Enter ZIP for inland transport
    // estimate." as the line note.
    const hint = await screen.findAllByText(
      /enter zip for inland transport estimate/i,
    );
    expect(hint.length).toBeGreaterThan(0);
  });

  it("invalid email keeps the submit button disabled (Zod-style validation gate)", async () => {
    setupContainerModeFixtures();
    const user = userEvent.setup();
    render(<CalculatorV3Wizard locale="en" />);

    await user.click(await screen.findByRole("button", { name: /^Combines$/i }));

    const containerModeBtn = (await screen.findAllByRole("button")).find((btn) =>
      /containeriz|^container$|containers/i.test(btn.textContent ?? ""),
    );
    if (containerModeBtn) await user.click(containerModeBtn);

    await user.selectOptions(
      await screen.findByLabelText(/destination country/i),
      "AR",
    );

    const opener = (await screen.findAllByRole("button", {
      name: /send detailed estimate/i,
    })).find((btn) => !btn.hasAttribute("disabled"));
    await user.click(opener!);

    const emailInput = await screen.findByLabelText(/^email$/i);
    await user.type(emailInput, "not-an-email");

    // The validation error message should appear next to the invalid email.
    expect(
      await screen.findAllByText(/enter a valid email/i),
    ).not.toHaveLength(0);

    // Attempt to click the visible submit button inside the open gate.
    // Inline lookup: scope to the form container that holds the email input.
    const gatePanel = emailInput.closest("div")?.parentElement;
    expect(gatePanel).toBeTruthy();
    const submitInGate = within(gatePanel!).getByRole("button", {
      name: /send detailed estimate/i,
    });
    expect(submitInGate).toBeDisabled();

    // Even if the user manages to click, the server action must NOT fire.
    await user.click(submitInGate).catch(() => {});
    expect(mocks.submitCalculatorV3).not.toHaveBeenCalled();
  });
});
