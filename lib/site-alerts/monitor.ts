export type SiteAlertCheck = {
  name: string;
  path: string;
  requiredText?: string;
  expectJsonOk?: boolean;
  expectedStatus?: number;
  timeoutMs?: number;
};

export type SiteAlertCheckResult = SiteAlertCheck & {
  ok: boolean;
  status?: number;
  durationMs: number;
  error?: string;
};

export type SiteAlertRunResult = {
  baseUrl: string;
  startedAt: string;
  finishedAt: string;
  attempts: number;
  checks: SiteAlertCheckResult[];
};

export type SiteAlertEmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SiteAlertContact = {
  from: string;
  to: string;
};

type MonitorEvaluation = {
  ok: boolean;
  error?: string;
};

type Fetcher = typeof fetch;

export const SITE_ALERT_RUNBOOK_PATH = "docs/runbooks/production-site-alerts.md";
export const SITE_ALERT_DEFAULT_BASE_URL = "https://meridianexport.com";

export const DEFAULT_SITE_ALERT_CHECKS: SiteAlertCheck[] = [
  {
    name: "Health canary",
    path: "/api/health",
    expectJsonOk: true,
  },
  {
    name: "Paraguay blog runtime page",
    path: "/es/blog/paraguay-import-guide",
    requiredText: "Paraguay",
  },
  {
    name: "Argentina destination page",
    path: "/es/destinations/argentina",
    requiredText: "Argentina",
  },
  {
    name: "Freight calculator",
    path: "/pricing/calculator",
    requiredText: "Freight Calculator",
  },
  {
    name: "Shipping schedule",
    path: "/schedule",
    requiredText: "Shipping Schedule",
  },
  {
    name: "Homepage control",
    path: "/",
    requiredText: "Meridian Freight",
  },
];

export function evaluateMonitorResponse(
  check: SiteAlertCheck,
  status: number,
  body: string,
): MonitorEvaluation {
  const expectedStatus = check.expectedStatus ?? 200;
  if (status !== expectedStatus) {
    return { ok: false, error: `HTTP ${status}` };
  }

  if (check.expectJsonOk) {
    try {
      const parsed = JSON.parse(body) as { ok?: unknown };
      if (parsed.ok !== true) {
        return { ok: false, error: "Health response ok is not true" };
      }
    } catch {
      return { ok: false, error: "Invalid JSON health response" };
    }
  }

  if (check.requiredText && !body.includes(check.requiredText)) {
    return { ok: false, error: `Missing required text "${check.requiredText}"` };
  }

  return { ok: true };
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function toAbsoluteUrl(baseUrl: string, path: string): string {
  return `${normalizeBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.name === "AbortError" ? "Request timed out" : error.message;
  }
  return String(error);
}

async function runSingleCheck(
  baseUrl: string,
  check: SiteAlertCheck,
  fetcher: Fetcher,
  defaultTimeoutMs: number,
): Promise<SiteAlertCheckResult> {
  const start = Date.now();
  const timeoutMs = check.timeoutMs ?? defaultTimeoutMs;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(toAbsoluteUrl(baseUrl, check.path), {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "MeridianFreightSiteAlert/1.0",
      },
    });
    const body = await response.text();
    const evaluation = evaluateMonitorResponse(check, response.status, body);
    return {
      ...check,
      ok: evaluation.ok,
      status: response.status,
      durationMs: Date.now() - start,
      error: evaluation.error,
    };
  } catch (error) {
    return {
      ...check,
      ok: false,
      durationMs: Date.now() - start,
      error: errorMessage(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runSiteAlertChecks(options: {
  baseUrl?: string;
  checks?: SiteAlertCheck[];
  attempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  fetcher?: Fetcher;
} = {}): Promise<SiteAlertRunResult> {
  const baseUrl = options.baseUrl ?? SITE_ALERT_DEFAULT_BASE_URL;
  const checks = options.checks ?? DEFAULT_SITE_ALERT_CHECKS;
  const attempts = Math.max(1, options.attempts ?? 3);
  const retryDelayMs = Math.max(0, options.retryDelayMs ?? 30_000);
  const timeoutMs = Math.max(1_000, options.timeoutMs ?? 15_000);
  const fetcher = options.fetcher ?? fetch;
  const startedAt = new Date().toISOString();
  let finalChecks: SiteAlertCheckResult[] = [];
  let attemptsUsed = 0;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    attemptsUsed = attempt;
    finalChecks = await Promise.all(
      checks.map((check) => runSingleCheck(baseUrl, check, fetcher, timeoutMs)),
    );

    if (finalChecks.every((check) => check.ok) || attempt === attempts) break;
    await sleep(retryDelayMs);
  }

  return {
    baseUrl: normalizeBaseUrl(baseUrl),
    startedAt,
    finishedAt: new Date().toISOString(),
    attempts: attemptsUsed,
    checks: finalChecks,
  };
}

export function hasFailedChecks(result: SiteAlertRunResult): boolean {
  return result.checks.some((check) => !check.ok);
}

export type SiteAlertPreviousStatus = "healthy" | "failed" | undefined;
export type SiteAlertNotificationIntent = "failure" | "recovery" | "none";
export type SiteAlertRunStatus = "healthy" | "failed";
export type SiteAlertNotificationStatus = "sent" | "not_needed" | "skipped" | "failed";

export function getNotificationIntent(
  result: SiteAlertRunResult,
  previousStatus: SiteAlertPreviousStatus,
): SiteAlertNotificationIntent {
  if (hasFailedChecks(result)) return previousStatus === "failed" ? "none" : "failure";
  return previousStatus === "failed" ? "recovery" : "none";
}

export function getPersistedMonitorStatus(options: {
  runStatus: SiteAlertRunStatus;
  previousStatus: SiteAlertPreviousStatus;
  notificationIntent: SiteAlertNotificationIntent;
  notificationStatus: SiteAlertNotificationStatus;
}): "healthy" | "failed" {
  if (options.runStatus === "failed") {
    if (
      options.notificationIntent === "failure" &&
      options.notificationStatus === "failed"
    ) {
      return options.previousStatus ?? "healthy";
    }
    return "failed";
  }

  if (
    options.notificationIntent === "recovery" &&
    options.notificationStatus === "failed"
  ) {
    return "failed";
  }

  return "healthy";
}

function failedChecks(result: SiteAlertRunResult): SiteAlertCheckResult[] {
  return result.checks.filter((check) => !check.ok);
}

function successfulCheckCount(result: SiteAlertRunResult): number {
  return result.checks.filter((check) => check.ok).length;
}

function formatCheckLine(check: SiteAlertCheckResult): string {
  const status = check.status ? `HTTP ${check.status}` : "no HTTP status";
  const reason = check.error ? check.error : status;
  return `\`${check.path}\` ${check.name} -> ${reason} (${check.durationMs}ms)`;
}

function formatPlainCheckLine(check: SiteAlertCheckResult): string {
  const status = check.status ? `HTTP ${check.status}` : "no HTTP status";
  const reason = check.error ? check.error : status;
  return `${check.path} ${check.name} -> ${reason} (${check.durationMs}ms)`;
}

export function formatFailureSlackMessage(result: SiteAlertRunResult): string {
  const failed = failedChecks(result);
  const lines = [
    ":rotating_light: *Meridian production site monitor FAILED*",
    `Base URL: ${result.baseUrl}`,
    `Attempts: ${result.attempts}`,
    `Window: ${result.startedAt} -> ${result.finishedAt}`,
    `Healthy checks: ${successfulCheckCount(result)}/${result.checks.length}`,
    "",
    "*Failed checks:*",
    ...failed.map((check) => `- ${formatCheckLine(check)}`),
    "",
    `Runbook: \`${SITE_ALERT_RUNBOOK_PATH}\``,
  ];

  return lines.join("\n");
}

export function formatRecoverySlackMessage(result: SiteAlertRunResult): string {
  return [
    ":white_check_mark: *Meridian production site monitor healthy*",
    `Base URL: ${result.baseUrl}`,
    `Checked routes: ${result.checks.length}`,
    `Attempts: ${result.attempts}`,
    `Finished: ${result.finishedAt}`,
  ].join("\n");
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatFailureHtml(result: SiteAlertRunResult): string {
  const rows = failedChecks(result)
    .map(
      (check) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb"><code>${escapeHtml(check.path)}</code></td>
          <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(check.name)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(check.error ?? (check.status ? `HTTP ${check.status}` : "Unknown failure"))}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${check.durationMs}ms</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;color:#111827">
      <h1 style="font-size:20px;color:#b91c1c">Meridian production site monitor failed</h1>
      <p><strong>Base URL:</strong> ${escapeHtml(result.baseUrl)}</p>
      <p><strong>Attempts:</strong> ${result.attempts}</p>
      <p><strong>Window:</strong> ${escapeHtml(result.startedAt)} -> ${escapeHtml(result.finishedAt)}</p>
      <p><strong>Healthy checks:</strong> ${successfulCheckCount(result)}/${result.checks.length}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border:1px solid #e5e7eb">Path</th>
            <th align="left" style="padding:8px;border:1px solid #e5e7eb">Check</th>
            <th align="left" style="padding:8px;border:1px solid #e5e7eb">Failure</th>
            <th align="left" style="padding:8px;border:1px solid #e5e7eb">Duration</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:16px"><strong>Runbook:</strong> <code>${SITE_ALERT_RUNBOOK_PATH}</code></p>
    </div>`;
}

export function formatFailureEmail(
  result: SiteAlertRunResult,
  contact: SiteAlertContact,
): SiteAlertEmailPayload {
  const failed = failedChecks(result);
  const text = [
    "Meridian production site monitor failed.",
    `Base URL: ${result.baseUrl}`,
    `Attempts: ${result.attempts}`,
    `Window: ${result.startedAt} -> ${result.finishedAt}`,
    `Healthy checks: ${successfulCheckCount(result)}/${result.checks.length}`,
    "",
    "Failed checks:",
    ...failed.map(formatPlainCheckLine),
    "",
    `Runbook: ${SITE_ALERT_RUNBOOK_PATH}`,
  ].join("\n");

  return {
    from: contact.from,
    to: contact.to,
    subject: `[ALERT] Meridian production site monitor failed (${failed.length} route${failed.length === 1 ? "" : "s"})`,
    html: formatFailureHtml(result),
    text,
  };
}

export function formatRecoveryEmail(
  result: SiteAlertRunResult,
  contact: SiteAlertContact,
): SiteAlertEmailPayload {
  const text = [
    "Meridian production site monitor is healthy.",
    `Base URL: ${result.baseUrl}`,
    `Checked routes: ${result.checks.length}`,
    `Attempts: ${result.attempts}`,
    `Finished: ${result.finishedAt}`,
  ].join("\n");

  return {
    from: contact.from,
    to: contact.to,
    subject: `[RECOVERY] Meridian production site monitor healthy (${result.checks.length} routes)`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;color:#111827">
        <h1 style="font-size:20px;color:#047857">Meridian production site monitor healthy</h1>
        <p><strong>Base URL:</strong> ${escapeHtml(result.baseUrl)}</p>
        <p><strong>Checked routes:</strong> ${result.checks.length}</p>
        <p><strong>Attempts:</strong> ${result.attempts}</p>
        <p><strong>Finished:</strong> ${escapeHtml(result.finishedAt)}</p>
      </div>`,
    text,
  };
}

export async function sendSlackMessage(options: {
  token: string;
  channel: string;
  text: string;
  fetcher?: Fetcher;
}): Promise<void> {
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: options.channel,
      text: options.text,
    }),
  });
  const body = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || body.ok !== true) {
    throw new Error(`Slack alert failed: ${body.error ?? response.status}`);
  }
}

export async function sendResendEmail(options: {
  apiKey: string;
  email: SiteAlertEmailPayload;
  fetcher?: Fetcher;
}): Promise<void> {
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.email),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(`Resend alert email failed: ${body.error?.message ?? response.status}`);
  }
}
