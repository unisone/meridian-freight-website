import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getConfig, shouldNotify } from "./monitor.mjs";

describe("site uptime monitor config", () => {
  it("loads required production alert destinations", () => {
    const config = getConfig({
      CRON_SECRET: "secret",
      SLACK_BOT_TOKEN: "xoxb-token",
      SLACK_ALERT_CHANNEL_ID: "C0B4X51JH9R",
      RESEND_API_KEY: "re_test",
      ALERT_EMAIL_TO: "alex.z@meridianexport.com",
      MONITOR_BASE_URL: "https://meridianexport.com/",
    });

    assert.equal(config.baseUrl, "https://meridianexport.com");
    assert.equal(config.slackChannelId, "C0B4X51JH9R");
    assert.equal(config.emailTo, "alex.z@meridianexport.com");
    assert.equal(config.targets.length > 0, true);
  });
});

describe("site uptime monitor notification policy", () => {
  it("notifies on first failure", () => {
    const reason = shouldNotify({
      status: "FAILED",
      previous: { status: "UNKNOWN" },
      now: new Date("2026-05-20T17:00:00.000Z"),
      reminderMinutes: 30,
    });

    assert.equal(reason, "new-failure");
  });

  it("suppresses repeated failure before reminder window", () => {
    const reason = shouldNotify({
      status: "FAILED",
      previous: { status: "FAILED", ts: `${Date.parse("2026-05-20T16:50:00.000Z") / 1000}` },
      now: new Date("2026-05-20T17:00:00.000Z"),
      reminderMinutes: 30,
    });

    assert.equal(reason, null);
  });

  it("notifies on recovery after failure", () => {
    const reason = shouldNotify({
      status: "RECOVERED",
      previous: { status: "FAILED", ts: `${Date.parse("2026-05-20T16:50:00.000Z") / 1000}` },
      now: new Date("2026-05-20T17:00:00.000Z"),
      reminderMinutes: 30,
    });

    assert.equal(reason, "recovery");
  });

  it("allows explicit manual test notifications", () => {
    const reason = shouldNotify({
      status: "FAILED",
      previous: { status: "FAILED" },
      now: new Date("2026-05-20T17:00:00.000Z"),
      notify: "always",
      reminderMinutes: 30,
    });

    assert.equal(reason, "manual-test");
  });
});
