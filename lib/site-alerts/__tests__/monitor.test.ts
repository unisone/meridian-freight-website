import { describe, expect, it } from "vitest";

import {
  DEFAULT_SITE_ALERT_CHECKS,
  evaluateMonitorResponse,
  formatFailureEmail,
  formatFailureSlackMessage,
  formatRecoveryEmail,
  formatRecoverySlackMessage,
  getNotificationIntent,
  getPersistedMonitorStatus,
  type SiteAlertRunResult,
} from "@/lib/site-alerts/monitor";

const BASE_URL = "https://meridianexport.com";

function failedRun(overrides: Partial<SiteAlertRunResult> = {}): SiteAlertRunResult {
  return {
    baseUrl: BASE_URL,
    startedAt: "2026-05-20T15:00:00.000Z",
    finishedAt: "2026-05-20T15:00:35.000Z",
    attempts: 3,
    checks: [
      {
        name: "Health canary",
        path: "/api/health",
        ok: false,
        status: 500,
        durationMs: 142,
        error: "HTTP 500",
      },
      {
        name: "Argentina destination page",
        path: "/es/destinations/argentina",
        ok: true,
        status: 200,
        durationMs: 88,
      },
    ],
    ...overrides,
  };
}

describe("DEFAULT_SITE_ALERT_CHECKS", () => {
  it("checks runtime-sensitive routes and treats homepage as a control route", () => {
    expect(DEFAULT_SITE_ALERT_CHECKS.map((check) => check.path)).toEqual([
      "/api/health",
      "/es/blog/paraguay-import-guide",
      "/es/destinations/argentina",
      "/pricing/calculator",
      "/schedule",
      "/",
    ]);
    expect(DEFAULT_SITE_ALERT_CHECKS[0]).toMatchObject({
      name: "Health canary",
      expectJsonOk: true,
    });
    expect(DEFAULT_SITE_ALERT_CHECKS.at(-1)).toMatchObject({
      name: "Homepage control",
      requiredText: "Meridian Freight",
    });
  });
});

describe("evaluateMonitorResponse", () => {
  it("accepts a healthy JSON canary response", () => {
    expect(
      evaluateMonitorResponse(
        { name: "Health canary", path: "/api/health", expectJsonOk: true },
        200,
        JSON.stringify({ ok: true, service: "meridian-freight-website" }),
      ),
    ).toEqual({ ok: true });
  });

  it("rejects 5xx responses even when the body contains expected text", () => {
    expect(
      evaluateMonitorResponse(
        { name: "Argentina destination page", path: "/es/destinations/argentina", requiredText: "Argentina" },
        500,
        "Argentina",
      ),
    ).toEqual({ ok: false, error: "HTTP 500" });
  });

  it("rejects 200 responses with the wrong body", () => {
    expect(
      evaluateMonitorResponse(
        { name: "Calculator", path: "/pricing/calculator", requiredText: "Freight Calculator" },
        200,
        "Authentication required",
      ),
    ).toEqual({ ok: false, error: 'Missing required text "Freight Calculator"' });
  });

  it("rejects invalid JSON for the health canary", () => {
    expect(
      evaluateMonitorResponse(
        { name: "Health canary", path: "/api/health", expectJsonOk: true },
        200,
        "<html>not json</html>",
      ),
    ).toEqual({ ok: false, error: "Invalid JSON health response" });
  });
});

describe("alert formatting", () => {
  it("formats Slack failure alerts with failed route details and runbook pointer", () => {
    const message = formatFailureSlackMessage(failedRun());

    expect(message).toContain(":rotating_light: *Meridian production site monitor FAILED*");
    expect(message).toContain("Base URL: https://meridianexport.com");
    expect(message).toContain("Attempts: 3");
    expect(message).toContain("- `/api/health` Health canary -> HTTP 500");
    expect(message).toContain("Runbook: `docs/runbooks/production-site-alerts.md`");
  });

  it("formats Resend email failure payloads to alex.z", () => {
    const email = formatFailureEmail(failedRun(), {
      from: "Meridian Freight <contact@meridianexport.com>",
      to: "alex.z@meridianexport.com",
    });

    expect(email.to).toBe("alex.z@meridianexport.com");
    expect(email.subject).toContain("[ALERT] Meridian production site monitor failed");
    expect(email.text).toContain("/api/health Health canary -> HTTP 500");
    expect(email.html).toContain("<table");
    expect(email.html).toContain("docs/runbooks/production-site-alerts.md");
  });

  it("formats recovery notifications separately from failure alerts", () => {
    const healthyRun = failedRun({
      checks: failedRun().checks.map((check) => ({
        ...check,
        ok: true,
        status: 200,
        error: undefined,
      })),
    });
    const slack = formatRecoverySlackMessage(healthyRun);
    const email = formatRecoveryEmail(healthyRun, {
      from: "Meridian Freight <contact@meridianexport.com>",
      to: "alex.z@meridianexport.com",
    });

    expect(slack).toContain(":white_check_mark: *Meridian production site monitor healthy*");
    expect(slack).toContain("Checked routes: 2");
    expect(email.subject).toContain("[RECOVERY] Meridian production site monitor healthy");
  });
});

describe("getNotificationIntent", () => {
  it("sends a failure alert when production first becomes unhealthy", () => {
    expect(getNotificationIntent(failedRun(), "healthy")).toBe("failure");
    expect(getNotificationIntent(failedRun(), undefined)).toBe("failure");
  });

  it("does not repeat failure alerts while production remains unhealthy", () => {
    expect(getNotificationIntent(failedRun(), "failed")).toBe("none");
  });

  it("only sends recovery after the previous state was failed", () => {
    const healthyRun = failedRun({
      checks: failedRun().checks.map((check) => ({
        ...check,
        ok: true,
        status: 200,
        error: undefined,
      })),
    });

    expect(getNotificationIntent(healthyRun, "failed")).toBe("recovery");
    expect(getNotificationIntent(healthyRun, "healthy")).toBe("none");
    expect(getNotificationIntent(healthyRun, undefined)).toBe("none");
  });
});

describe("getPersistedMonitorStatus", () => {
  it("marks failed only after the first failure alert is delivered", () => {
    expect(
      getPersistedMonitorStatus({
        runStatus: "failed",
        previousStatus: "healthy",
        notificationIntent: "failure",
        notificationStatus: "sent",
      }),
    ).toBe("failed");

    expect(
      getPersistedMonitorStatus({
        runStatus: "failed",
        previousStatus: "healthy",
        notificationIntent: "failure",
        notificationStatus: "failed",
      }),
    ).toBe("healthy");
  });

  it("keeps recovery retryable when the recovery notification fails", () => {
    expect(
      getPersistedMonitorStatus({
        runStatus: "healthy",
        previousStatus: "failed",
        notificationIntent: "recovery",
        notificationStatus: "failed",
      }),
    ).toBe("failed");

    expect(
      getPersistedMonitorStatus({
        runStatus: "healthy",
        previousStatus: "failed",
        notificationIntent: "recovery",
        notificationStatus: "sent",
      }),
    ).toBe("healthy");
  });
});
