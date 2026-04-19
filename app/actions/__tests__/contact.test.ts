import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(async (callback: () => Promise<void>) => {
    await callback();
  }),
  resendSend: vi.fn(),
  track: vi.fn(),
  notifySlack: vi.fn(),
  sendCAPIEvent: vi.fn(),
  log: vi.fn(),
  timerError: vi.fn(),
  timerDone: vi.fn(),
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

vi.mock("@vercel/analytics/server", () => ({
  track: mocks.track,
}));

vi.mock("@/lib/slack", () => ({
  notifySlack: mocks.notifySlack,
}));

vi.mock("@/lib/meta-capi", () => ({
  sendCAPIEvent: mocks.sendCAPIEvent,
}));

vi.mock("@/lib/logger", () => ({
  startTimer: () => ({
    error: mocks.timerError,
    done: mocks.timerDone,
  }),
  log: mocks.log,
}));

import { submitContactForm } from "@/app/actions/contact";

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    mocks.resendSend.mockResolvedValue({ error: null });
    mocks.track.mockResolvedValue(undefined);
    mocks.notifySlack.mockResolvedValue(undefined);
    mocks.sendCAPIEvent.mockResolvedValue(undefined);
  });

  it("routes lead notifications to the CEO with alex.z cc and sets auto-replies to both Alex inboxes", async () => {
    const result = await submitContactForm(
      {
        name: "Jane Buyer",
        email: "jane@example.com",
        company: "Buyer Co",
        phone: "+1 555 000 0000",
        equipmentType: "Combine",
        message: "Need export pricing to Argentina.",
        website: "",
        source_page: "/contact",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "argentina",
        utm_term: "",
        utm_content: "",
      },
      "en",
    );

    expect(result.success).toBe(true);
    expect(mocks.resendSend).toHaveBeenCalledTimes(2);
    expect(mocks.resendSend).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: "alex.r@meridianexport.com",
        cc: ["alex.z@meridianexport.com"],
        replyTo: "jane@example.com",
      }),
    );
    expect(mocks.resendSend).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: "jane@example.com",
        replyTo: ["alex.r@meridianexport.com", "alex.z@meridianexport.com"],
      }),
    );
  });
});
