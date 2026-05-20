const MONITOR_MARKER = "MFX_UPTIME_MONITOR_V1";
const FAILED = "FAILED";
const RECOVERED = "RECOVERED";

const DEFAULT_TARGETS = [
  {
    id: "health",
    path: "/api/health",
    expectedStatus: 200,
    expectedJson: {
      ok: true,
      service: "meridian-freight-website",
    },
  },
  {
    id: "home",
    path: "/",
    expectedStatus: 200,
    expectedText: "Meridian",
  },
  {
    id: "calculator",
    path: "/pricing/calculator",
    expectedStatus: 200,
    expectedText: "Calculator",
  },
  {
    id: "schedule",
    path: "/schedule",
    expectedStatus: 200,
    expectedText: "Schedule",
  },
  {
    id: "paraguay-guide-es",
    path: "/es/blog/paraguay-import-guide",
    expectedStatus: 200,
    expectedText: "Paraguay",
  },
  {
    id: "argentina-destination-es",
    path: "/es/destinations/argentina",
    expectedStatus: 200,
    expectedText: "Argentina",
  },
];

function requiredEnv(env, key) {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalInteger(value, fallback) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getConfig(env = process.env) {
  const baseUrl = (env.MONITOR_BASE_URL ?? "https://meridianexport.com").trim().replace(/\/+$/, "");
  const slackChannelId = (
    env.SLACK_ALERT_CHANNEL_ID ??
    env.SITE_ALERT_SLACK_CHANNEL_ID ??
    env.SLACK_CHANNEL_ID ??
    ""
  ).trim();

  if (!slackChannelId) {
    throw new Error(
      "Missing Slack alert channel. Set SLACK_ALERT_CHANNEL_ID to the #mfexport-site-alerts channel ID.",
    );
  }

  return {
    baseUrl,
    cronSecret: requiredEnv(env, "CRON_SECRET"),
    slackBotToken: requiredEnv(env, "SLACK_BOT_TOKEN"),
    slackChannelId,
    resendApiKey: requiredEnv(env, "RESEND_API_KEY"),
    emailTo: requiredEnv(env, "ALERT_EMAIL_TO"),
    emailFrom: (env.ALERT_EMAIL_FROM ?? "Meridian Freight Alerts <contact@meridianexport.com>").trim(),
    timeoutMs: optionalInteger(env.MONITOR_TIMEOUT_MS, 10000),
    retryAttempts: optionalInteger(env.MONITOR_RETRY_ATTEMPTS, 2),
    retryDelayMs: optionalInteger(env.MONITOR_RETRY_DELAY_MS, 750),
    reminderMinutes: optionalInteger(env.ALERT_REMINDER_MINUTES, 30),
    targets: parseTargets(env.MONITOR_TARGETS_JSON, baseUrl),
  };
}

function parseTargets(rawTargets, baseUrl) {
  if (!rawTargets?.trim()) {
    return DEFAULT_TARGETS.map((target) => normalizeTarget(target, baseUrl));
  }

  const parsed = JSON.parse(rawTargets);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("MONITOR_TARGETS_JSON must be a non-empty JSON array.");
  }

  return parsed.map((target) => normalizeTarget(target, baseUrl));
}

function normalizeTarget(target, baseUrl) {
  if (!target?.id) {
    throw new Error("Every monitor target must include an id.");
  }

  const url = target.url ?? `${baseUrl}${target.path?.startsWith("/") ? target.path : `/${target.path ?? ""}`}`;

  return {
    id: String(target.id),
    url,
    expectedStatus: target.expectedStatus ?? 200,
    expectedText: target.expectedText,
    expectedJson: target.expectedJson,
  };
}

function isAuthorized(request, cronSecret) {
  const authorization = request.headers.authorization ?? request.headers.Authorization ?? "";
  return authorization === `Bearer ${cronSecret}`;
}

function getQueryValue(request, key) {
  const rawUrl = request.url ?? "/";
  const host = request.headers.host ?? "localhost";
  const url = new URL(rawUrl, `https://${host}`);
  return url.searchParams.get(key);
}

export async function handleCheckRequest(request, response, env = process.env) {
  const startedAt = new Date();

  try {
    const config = getConfig(env);

    if (!isAuthorized(request, config.cronSecret)) {
      response.status(401).json({ ok: false, error: "Unauthorized" });
      return;
    }

    const force = getQueryValue(request, "force");
    const notify = getQueryValue(request, "notify");
    const result = await runMonitor({ config, now: startedAt, force, notify });

    response.status(result.notificationErrors.length > 0 ? 502 : 200).json(result);
  } catch (error) {
    response.status(500).json({
      ok: false,
      startedAt: startedAt.toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function runMonitor({ config, now = new Date(), force = null, notify = null, fetchImpl = fetch }) {
  const checkedAt = now.toISOString();
  const liveResults = await Promise.all(
    config.targets.map((target) => checkTargetWithRetry({ target, config, fetchImpl })),
  );

  const results =
    force === "fail"
      ? [
          ...liveResults,
          {
            id: "forced-alert-test",
            url: `${config.baseUrl}/__forced_monitor_failure__`,
            ok: false,
            status: null,
            durationMs: 0,
            attempts: 1,
            error: "Forced alert-delivery test failure.",
          },
        ]
      : liveResults;

  const healthy = force === "recover" ? liveResults.every((result) => result.ok) : results.every((result) => result.ok);
  const status = healthy ? RECOVERED : FAILED;
  const previous = await fetchPreviousSlackStatus({ config, fetchImpl });
  const notificationReason = shouldNotify({ status, previous, now, notify, reminderMinutes: config.reminderMinutes });
  const notificationErrors = [];
  const notifications = [];

  if (notificationReason) {
    const payload = buildAlertPayload({ config, status, results, checkedAt, notificationReason });
    const [slackResult, emailResult] = await Promise.allSettled([
      sendSlackAlert({ config, payload, fetchImpl }),
      sendEmailAlert({ config, payload, fetchImpl }),
    ]);

    if (slackResult.status === "fulfilled") {
      notifications.push({ destination: "slack", ok: true, ts: slackResult.value.ts });
    } else {
      notificationErrors.push({ destination: "slack", error: slackResult.reason.message });
    }

    if (emailResult.status === "fulfilled") {
      notifications.push({ destination: "email", ok: true, id: emailResult.value.id });
    } else {
      notificationErrors.push({ destination: "email", error: emailResult.reason.message });
    }
  }

  return {
    ok: notificationErrors.length === 0,
    monitor: "meridianexport.com availability",
    checkedAt,
    siteStatus: status,
    healthy,
    results,
    previous,
    notificationReason,
    notifications,
    notificationErrors,
  };
}

async function checkTargetWithRetry({ target, config, fetchImpl }) {
  const failures = [];

  for (let attempt = 1; attempt <= config.retryAttempts; attempt += 1) {
    const result = await checkTarget({ target, timeoutMs: config.timeoutMs, fetchImpl, attempt });

    if (result.ok) {
      return { ...result, attempts: attempt };
    }

    failures.push(result);

    if (attempt < config.retryAttempts) {
      await delay(config.retryDelayMs);
    }
  }

  const lastFailure = failures.at(-1);
  return {
    ...lastFailure,
    attempts: config.retryAttempts,
    previousFailures: failures.slice(0, -1).map((failure) => ({
      attempt: failure.attempt,
      status: failure.status,
      error: failure.error,
    })),
  };
}

async function checkTarget({ target, timeoutMs, fetchImpl, attempt }) {
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(target.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "MeridianExport-UptimeMonitor/1.0",
        Accept: target.expectedJson ? "application/json,text/plain;q=0.8,*/*;q=0.5" : "text/html,text/plain;q=0.8,*/*;q=0.5",
      },
    });
    const durationMs = Date.now() - started;
    const body = await response.text();
    const base = {
      id: target.id,
      url: target.url,
      status: response.status,
      durationMs,
      attempt,
    };

    if (response.status !== target.expectedStatus) {
      return {
        ...base,
        ok: false,
        error: `Expected HTTP ${target.expectedStatus}, received HTTP ${response.status}.`,
        bodySnippet: compactSnippet(body),
      };
    }

    if (target.expectedText && !body.includes(target.expectedText)) {
      return {
        ...base,
        ok: false,
        error: `Missing expected text: ${target.expectedText}`,
        bodySnippet: compactSnippet(body),
      };
    }

    if (target.expectedJson) {
      const json = JSON.parse(body);
      const mismatch = firstJsonMismatch(target.expectedJson, json);

      if (mismatch) {
        return {
          ...base,
          ok: false,
          error: mismatch,
          bodySnippet: compactSnippet(body),
        };
      }
    }

    return {
      ...base,
      ok: true,
    };
  } catch (error) {
    return {
      id: target.id,
      url: target.url,
      status: null,
      durationMs: Date.now() - started,
      attempt,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function firstJsonMismatch(expected, actual, path = "") {
  for (const [key, expectedValue] of Object.entries(expected)) {
    const currentPath = path ? `${path}.${key}` : key;
    const actualValue = actual?.[key];

    if (expectedValue && typeof expectedValue === "object" && !Array.isArray(expectedValue)) {
      const nestedMismatch = firstJsonMismatch(expectedValue, actualValue, currentPath);
      if (nestedMismatch) {
        return nestedMismatch;
      }
      continue;
    }

    if (actualValue !== expectedValue) {
      return `JSON mismatch at ${currentPath}: expected ${JSON.stringify(expectedValue)}, received ${JSON.stringify(actualValue)}.`;
    }
  }

  return null;
}

function compactSnippet(body) {
  return body.replace(/\s+/g, " ").trim().slice(0, 240);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchPreviousSlackStatus({ config, fetchImpl }) {
  const response = await fetchImpl("https://slack.com/api/conversations.history", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.slackBotToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: config.slackChannelId,
      limit: 50,
    }),
  });
  const data = await response.json();

  if (!data.ok) {
    return {
      status: "UNKNOWN",
      error: data.error ?? "Slack history lookup failed.",
    };
  }

  const message = (data.messages ?? []).find((candidate) => candidate.text?.includes(MONITOR_MARKER));

  if (!message) {
    return {
      status: "UNKNOWN",
    };
  }

  const statusMatch = message.text.match(new RegExp(`${MONITOR_MARKER} status=(${FAILED}|${RECOVERED})`));

  return {
    status: statusMatch?.[1] ?? "UNKNOWN",
    ts: message.ts,
    ageSeconds: Math.max(0, Math.floor(Date.now() / 1000 - Number.parseFloat(message.ts))),
  };
}

export function shouldNotify({ status, previous, now, notify, reminderMinutes }) {
  if (notify === "always") {
    return "manual-test";
  }

  if (status === FAILED) {
    if (previous.status !== FAILED) {
      return "new-failure";
    }

    const ageSeconds = previous.ts ? Math.max(0, Math.floor(now.getTime() / 1000 - Number.parseFloat(previous.ts))) : 0;
    if (ageSeconds >= reminderMinutes * 60) {
      return "failure-reminder";
    }

    return null;
  }

  if (previous.status === FAILED) {
    return "recovery";
  }

  return null;
}

function buildAlertPayload({ config, status, results, checkedAt, notificationReason }) {
  const failedResults = results.filter((result) => !result.ok);
  const healthyResults = results.filter((result) => result.ok);
  const title = status === FAILED ? "Meridian site availability FAILED" : "Meridian site availability RECOVERED";
  const summary =
    status === FAILED
      ? `${failedResults.length} of ${results.length} monitored route(s) failed.`
      : `All ${healthyResults.length} monitored route(s) are healthy.`;

  return {
    markerLine: `${MONITOR_MARKER} status=${status} checkedAt=${checkedAt}`,
    status,
    title,
    summary,
    checkedAt,
    baseUrl: config.baseUrl,
    notificationReason,
    failedResults,
    healthyResults,
    slackText: formatSlackMessage({
      title,
      status,
      summary,
      checkedAt,
      baseUrl: config.baseUrl,
      notificationReason,
      failedResults,
      healthyResults,
    }),
    emailSubject: `[Meridian Site Alert] ${title}`,
  };
}

function formatSlackMessage({ title, status, summary, checkedAt, baseUrl, notificationReason, failedResults, healthyResults }) {
  const prefix = status === FAILED ? ":rotating_light:" : ":white_check_mark:";
  const lines = [
    `${prefix} *${title}*`,
    `Target: <${baseUrl}|${baseUrl}>`,
    `Checked: ${checkedAt}`,
    `Reason: ${notificationReason}`,
    summary,
  ];

  if (failedResults.length > 0) {
    lines.push("", "*Failed checks:*");
    for (const result of failedResults) {
      lines.push(`- \`${result.id}\` ${result.url} -> ${result.error} (${result.durationMs}ms, attempts ${result.attempts ?? result.attempt ?? 1})`);
    }
  }

  if (healthyResults.length > 0) {
    lines.push("", `Healthy checks: ${healthyResults.map((result) => `\`${result.id}\``).join(", ")}`);
  }

  lines.push("", "Runbook: `docs/runbooks/production-site-alerts.md`", `${MONITOR_MARKER} status=${status} checkedAt=${checkedAt}`);
  return lines.join("\n");
}

function formatEmailText(payload) {
  const lines = [
    payload.title,
    "",
    `Target: ${payload.baseUrl}`,
    `Checked: ${payload.checkedAt}`,
    `Reason: ${payload.notificationReason}`,
    payload.summary,
    "",
  ];

  if (payload.failedResults.length > 0) {
    lines.push("Failed checks:");
    for (const result of payload.failedResults) {
      lines.push(`- ${result.id}: ${result.url} -> ${result.error} (${result.durationMs}ms, attempts ${result.attempts ?? result.attempt ?? 1})`);
    }
    lines.push("");
  }

  if (payload.healthyResults.length > 0) {
    lines.push(`Healthy checks: ${payload.healthyResults.map((result) => result.id).join(", ")}`, "");
  }

  lines.push("Runbook: docs/runbooks/production-site-alerts.md", payload.markerLine);
  return lines.join("\n");
}

function formatEmailHtml(payload) {
  const failedList = payload.failedResults
    .map((result) => `<li><code>${escapeHtml(result.id)}</code>: ${escapeHtml(result.url)} - ${escapeHtml(result.error)} (${result.durationMs}ms, attempts ${result.attempts ?? result.attempt ?? 1})</li>`)
    .join("");
  const healthyList = payload.healthyResults.map((result) => `<code>${escapeHtml(result.id)}</code>`).join(", ");

  return [
    `<h1>${escapeHtml(payload.title)}</h1>`,
    `<p><strong>Target:</strong> <a href="${escapeHtml(payload.baseUrl)}">${escapeHtml(payload.baseUrl)}</a></p>`,
    `<p><strong>Checked:</strong> ${escapeHtml(payload.checkedAt)}</p>`,
    `<p><strong>Reason:</strong> ${escapeHtml(payload.notificationReason)}</p>`,
    `<p>${escapeHtml(payload.summary)}</p>`,
    failedList ? `<h2>Failed checks</h2><ul>${failedList}</ul>` : "",
    healthyList ? `<p><strong>Healthy checks:</strong> ${healthyList}</p>` : "",
    "<p>Runbook: <code>docs/runbooks/production-site-alerts.md</code></p>",
    `<p><code>${escapeHtml(payload.markerLine)}</code></p>`,
  ].join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendSlackAlert({ config, payload, fetchImpl }) {
  const response = await fetchImpl("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.slackBotToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: config.slackChannelId,
      text: payload.slackText,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });
  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack alert failed: ${data.error ?? "unknown error"}`);
  }

  return {
    ts: data.ts,
  };
}

async function sendEmailAlert({ config, payload, fetchImpl }) {
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: [config.emailTo],
      subject: payload.emailSubject,
      text: formatEmailText(payload),
      html: formatEmailHtml(payload),
    }),
  });
  const data = await response.json();

  if (!response.ok || data.error) {
    const message = data.error?.message ?? data.message ?? response.statusText;
    throw new Error(`Resend alert failed: ${message}`);
  }

  return {
    id: data.id,
  };
}
