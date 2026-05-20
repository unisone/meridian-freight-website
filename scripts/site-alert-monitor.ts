import { appendFile } from "node:fs/promises";

import {
  DEFAULT_SITE_ALERT_CHECKS,
  SITE_ALERT_DEFAULT_BASE_URL,
  formatFailureEmail,
  formatFailureSlackMessage,
  formatRecoveryEmail,
  formatRecoverySlackMessage,
  getNotificationIntent,
  getPersistedMonitorStatus,
  hasFailedChecks,
  runSiteAlertChecks,
  sendResendEmail,
  sendSlackMessage,
  type SiteAlertNotificationIntent,
  type SiteAlertNotificationStatus,
  type SiteAlertCheck,
  type SiteAlertPreviousStatus,
  type SiteAlertRunResult,
  type SiteAlertRunStatus,
} from "@/lib/site-alerts/monitor";

const DEFAULT_FROM = "Meridian Freight <contact@meridianexport.com>";
const DEFAULT_TO = "alex.z@meridianexport.com";
const DEFAULT_CHANNEL = "C0B4X51JH9R";

type CliOptions = {
  dryRun: boolean;
  skipNotify: boolean;
  forceFailure: boolean;
};

function parseCliOptions(argv: string[]): CliOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    skipNotify: argv.includes("--skip-notify"),
    forceFailure: argv.includes("--force-failure"),
  };
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readPreviousStatus(): SiteAlertPreviousStatus {
  const raw = process.env.SITE_ALERT_PREVIOUS_STATUS?.trim().toLowerCase();
  return raw === "healthy" || raw === "failed" ? raw : undefined;
}

function buildChecks(forceFailure: boolean): SiteAlertCheck[] {
  if (!forceFailure) return DEFAULT_SITE_ALERT_CHECKS;
  return [
    {
      name: "Forced test failure",
      path: "/__site-alert-forced-failure__",
      requiredText: "this text should never exist",
    },
  ];
}

function formatConsoleSummary(result: SiteAlertRunResult): string {
  const lines = [
    `Meridian production site monitor: ${hasFailedChecks(result) ? "FAILED" : "healthy"}`,
    `Base URL: ${result.baseUrl}`,
    `Attempts: ${result.attempts}`,
    `Window: ${result.startedAt} -> ${result.finishedAt}`,
    "",
    "| Path | Check | Result | Duration |",
    "| --- | --- | --- | ---: |",
    ...result.checks.map((check) => {
      const status = check.status ? `HTTP ${check.status}` : "no status";
      const outcome = check.ok ? status : check.error ?? status;
      return `| \`${check.path}\` | ${check.name} | ${check.ok ? "OK" : "FAIL"}: ${outcome} | ${check.durationMs}ms |`;
    }),
  ];

  return lines.join("\n");
}

async function appendGitHubSummary(summary: string): Promise<void> {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  await appendFile(summaryPath, `## Meridian Production Site Monitor\n\n${summary}\n\n`);
}

async function appendGitHubOutputs(outputs: Record<string, string>): Promise<void> {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
  await appendFile(outputPath, `${lines.join("\n")}\n`);
}

async function sendNotifications(result: SiteAlertRunResult, intent: "failure" | "recovery"): Promise<void> {
  const slackToken = process.env.SITE_ALERT_SLACK_BOT_TOKEN?.trim();
  const slackChannel = process.env.SITE_ALERT_SLACK_CHANNEL_ID?.trim() || DEFAULT_CHANNEL;
  const resendApiKey = process.env.SITE_ALERT_RESEND_API_KEY?.trim();
  const emailFrom = process.env.SITE_ALERT_EMAIL_FROM?.trim() || DEFAULT_FROM;
  const emailTo = process.env.SITE_ALERT_EMAIL_TO?.trim() || DEFAULT_TO;

  if (!slackToken || !resendApiKey) {
    const missing = [
      !slackToken ? "SITE_ALERT_SLACK_BOT_TOKEN" : null,
      !resendApiKey ? "SITE_ALERT_RESEND_API_KEY" : null,
    ].filter(Boolean);
    throw new Error(`Missing alert secret(s): ${missing.join(", ")}`);
  }

  const slackText =
    intent === "failure"
      ? formatFailureSlackMessage(result)
      : formatRecoverySlackMessage(result);
  const email =
    intent === "failure"
      ? formatFailureEmail(result, { from: emailFrom, to: emailTo })
      : formatRecoveryEmail(result, { from: emailFrom, to: emailTo });

  const outcomes = await Promise.allSettled([
    sendSlackMessage({
      token: slackToken,
      channel: slackChannel,
      text: slackText,
    }),
    sendResendEmail({
      apiKey: resendApiKey,
      email,
    }),
  ]);
  const failures = outcomes
    .map((outcome, index) => {
      if (outcome.status === "fulfilled") return null;
      const label = index === 0 ? "Slack" : "Resend";
      const message = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason);
      return `${label}: ${message}`;
    })
    .filter((failure): failure is string => failure !== null);

  if (failures.length > 0) {
    throw new Error(`Alert notification failure(s): ${failures.join("; ")}`);
  }
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const previousStatus = readPreviousStatus();
  const result = await runSiteAlertChecks({
    baseUrl: process.env.SITE_ALERT_BASE_URL?.trim() || SITE_ALERT_DEFAULT_BASE_URL,
    checks: buildChecks(options.forceFailure),
    attempts: readPositiveInt("SITE_ALERT_ATTEMPTS", options.forceFailure ? 1 : 3),
    retryDelayMs: readPositiveInt("SITE_ALERT_RETRY_DELAY_MS", options.forceFailure ? 1 : 30_000),
    timeoutMs: readPositiveInt("SITE_ALERT_TIMEOUT_MS", 15_000),
  });

  const summary = formatConsoleSummary(result);
  console.log(summary);
  await appendGitHubSummary(summary);

  const runStatus: SiteAlertRunStatus = hasFailedChecks(result) ? "failed" : "healthy";
  const intent: SiteAlertNotificationIntent = getNotificationIntent(result, previousStatus);
  let notificationStatus: SiteAlertNotificationStatus = "not_needed";
  let notificationError: Error | null = null;

  if (intent !== "none") {
    if (options.dryRun || options.skipNotify) {
      notificationStatus = "skipped";
      console.log(`Notification intent: ${intent} (not sent: ${options.dryRun ? "dry-run" : "skip-notify"})`);
    } else {
      try {
        await sendNotifications(result, intent);
        notificationStatus = "sent";
        console.log(`Notification sent: ${intent}`);
      } catch (error) {
        notificationStatus = "failed";
        notificationError = error instanceof Error ? error : new Error(String(error));
      }
    }
  } else {
    console.log("Notification intent: none");
  }

  const persistedStatus = getPersistedMonitorStatus({
    runStatus,
    previousStatus,
    notificationIntent: intent,
    notificationStatus,
  });
  await appendGitHubOutputs({
    run_status: runStatus,
    notification_intent: intent,
    notification_status: notificationStatus,
    persisted_status: persistedStatus,
  });

  if (notificationError) {
    throw notificationError;
  }

  if (hasFailedChecks(result)) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`site-alert-monitor failed: ${message}`);
  process.exitCode = 1;
});
