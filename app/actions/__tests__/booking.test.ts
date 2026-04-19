import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(async (callback: () => Promise<void>) => {
    await callback();
  }),
  resendSend: vi.fn(),
  fetchContainerById: vi.fn(),
  countRecentRequests: vi.fn(),
  countPendingRequests: vi.fn(),
  insertBookingRequest: vi.fn(),
  notifySlack: vi.fn(),
  sendCAPIEvent: vi.fn(),
  track: vi.fn(),
  generateRefCode: vi.fn(() => "MF-TEST"),
  storeWaAttribution: vi.fn(),
  buildBookingConfirmationEmail: vi.fn(() => ({
    subject: "Confirmation",
    html: "<p>ok</p>",
  })),
}));

vi.mock("next/server", () => ({
  after: mocks.after,
}));

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: mocks.resendSend,
      },
    };
  }),
}));

vi.mock("@/lib/supabase-containers", () => ({
  fetchContainerById: mocks.fetchContainerById,
  countRecentRequests: mocks.countRecentRequests,
  countPendingRequests: mocks.countPendingRequests,
  insertBookingRequest: mocks.insertBookingRequest,
}));

vi.mock("@/lib/slack", () => ({
  notifySlack: mocks.notifySlack,
}));

vi.mock("@/lib/meta-capi", () => ({
  sendCAPIEvent: mocks.sendCAPIEvent,
}));

vi.mock("@vercel/analytics/server", () => ({
  track: mocks.track,
}));

vi.mock("@/lib/wa-attribution", () => ({
  generateRefCode: mocks.generateRefCode,
  storeWaAttribution: mocks.storeWaAttribution,
}));

vi.mock("@/lib/emails/booking-confirmation", () => ({
  buildBookingConfirmationEmail: mocks.buildBookingConfirmationEmail,
}));

import { submitBookingRequest } from "@/app/actions/booking";
import type { BookingRequestData } from "@/lib/schemas";
import type { SharedContainer } from "@/lib/types/shared-shipping";

async function flushDeferredSideEffects(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function localDatePlusDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeContainer(overrides: Partial<SharedContainer> = {}): SharedContainer {
  return {
    id: "5f0c9119-b880-4aae-ab6a-b1e58dd8f0ba",
    project_number: "MF-2026-001",
    origin: "ROLLED Albion,IA",
    destination: "TBD",
    destination_country: "KZ",
    departure_date: localDatePlusDays(7),
    eta_date: localDatePlusDays(37),
    container_type: "40HC",
    total_capacity_cbm: 76,
    available_cbm: 30,
    status: "available",
    notes: null,
    source: "google_sheets",
    sheet_row_number: 1,
    raw_space_value: "30",
    container_count: 1,
    synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function makePayload(overrides: Partial<BookingRequestData> = {}): BookingRequestData {
  return {
    name: "Jane Buyer",
    email: "jane@example.com",
    phone: "+1 555 000 0000",
    cargoDescription: "Two tractor attachments",
    containerId: "5f0c9119-b880-4aae-ab6a-b1e58dd8f0ba",
    projectNumber: "MF-2026-001",
    website: "",
    source_page: "https://meridianexport.com/es/schedule?foo=bar",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "spring",
    ...overrides,
  };
}

describe("submitBookingRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    mocks.resendSend.mockResolvedValue({ error: null });
    mocks.fetchContainerById.mockResolvedValue(makeContainer());
    mocks.countRecentRequests.mockResolvedValue(0);
    mocks.countPendingRequests.mockResolvedValue(2);
    mocks.insertBookingRequest.mockResolvedValue({ ok: true });
    mocks.notifySlack.mockResolvedValue(undefined);
    mocks.sendCAPIEvent.mockResolvedValue(undefined);
    mocks.track.mockResolvedValue(undefined);
    mocks.storeWaAttribution.mockResolvedValue(undefined);
  });

  it("accepts a valid booking and runs async side effects with localized attribution", async () => {
    const result = await submitBookingRequest(makePayload(), "es");
    await flushDeferredSideEffects();

    expect(result.success).toBe(true);
    expect(result.waRefCode).toBe("MF-TEST");
    expect(mocks.insertBookingRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        container_id: "5f0c9119-b880-4aae-ab6a-b1e58dd8f0ba",
        project_number: "MF-2026-001",
      }),
    );
    expect(mocks.resendSend).toHaveBeenCalledTimes(2);
    expect(mocks.buildBookingConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "es",
        container: expect.objectContaining({
          origin: "Albion, IA",
          destination: "Destination pending",
        }),
      }),
    );
    expect(mocks.storeWaAttribution).toHaveBeenCalledWith(
      expect.objectContaining({
        source_page: "/es/schedule#MF-2026-001",
      }),
    );
  });

  it("rejects full containers before insert or email side effects", async () => {
    mocks.fetchContainerById.mockResolvedValue(
      makeContainer({ status: "full", available_cbm: 0 }),
    );

    const result = await submitBookingRequest(makePayload());

    expect(result).toEqual({
      success: false,
      error: "CONTAINER_FULL",
    });
    expect(mocks.countRecentRequests).not.toHaveBeenCalled();
    expect(mocks.insertBookingRequest).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });

  it("rejects departed containers before insert or email side effects", async () => {
    mocks.fetchContainerById.mockResolvedValue(
      makeContainer({
        status: "departed",
        departure_date: localDatePlusDays(-1),
      }),
    );

    const result = await submitBookingRequest(makePayload());

    expect(result).toEqual({
      success: false,
      error: "CONTAINER_DEPARTED",
    });
    expect(mocks.insertBookingRequest).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });

  it("rejects mismatched project numbers before dedupe runs", async () => {
    const result = await submitBookingRequest(
      makePayload({ projectNumber: "MF-2026-999" }),
    );

    expect(result).toEqual({
      success: false,
      error: "CONTAINER_MISMATCH",
    });
    expect(mocks.countRecentRequests).not.toHaveBeenCalled();
    expect(mocks.insertBookingRequest).not.toHaveBeenCalled();
  });

  it("preserves idempotent dedupe after eligibility passes", async () => {
    mocks.countRecentRequests.mockResolvedValue(1);

    const result = await submitBookingRequest(makePayload());

    expect(result).toEqual({ success: true });
    expect(mocks.insertBookingRequest).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });
});
