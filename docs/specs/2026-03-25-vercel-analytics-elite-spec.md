# Vercel Analytics Elite Configuration Spec

**Date:** 2026-03-25
**Project:** meridian-freight-website (meridianexport.com)
**Vercel Plan:** Pro (unisone team)
**Next.js:** 16.1.7 | React 19.2 | @vercel/analytics 2.0.1 | @vercel/speed-insights 2.0.0

---

## Executive Summary

The site has a solid multi-layer analytics stack (GA4 + Meta Pixel + CAPI + Vercel Analytics + Speed Insights), but Vercel Analytics is underutilized — only basic pageviews are tracked. Seven specific gaps prevent elite-level observability. This spec addresses all of them in 5 phases.

**Estimated total effort:** 6-8 hours
**Cost impact:** Negligible ($0.00003/event on Pro; ~20 daily visitors = pennies)

---

## Current State Assessment

### What's Working Well

| Layer | Status | Details |
|-------|--------|---------|
| Vercel Web Analytics | Pageviews only | `<Analytics />` in layout — tracks page visits |
| Vercel Speed Insights | Active | `<SpeedInsights />` — Core Web Vitals collection |
| GA4 (G-W661JN5ED4) | Excellent | Consent Mode v2, 12 content groups, 10+ custom events |
| Meta Pixel | Excellent | Consent-first (revoke/grant), PageView/Lead/Contact |
| Meta CAPI | Good | Server-side Lead events with hashed PII |
| Attribution | Good | UTM + gclid/fbclid/msclkid to 30-day cookie |
| GA4 Custom Events | Rich | generate_lead, contact_*, calculator_*, video_play, etc. |

### Verified Gaps

| # | Gap | Impact | Evidence |
|---|-----|--------|----------|
| G1 | Wrong import: `@vercel/analytics/react` instead of `@vercel/analytics/next` | Route detection degraded | layout.tsx:6, Vercel docs say `/next` for App Router |
| G2 | Zero Vercel Analytics custom events | Dashboard shows "No custom events" | Screenshot; `track()` from `@vercel/analytics` never imported |
| G3 | No server-side Vercel Analytics | Lead events only in GA4/CAPI | `@vercel/analytics/server` never imported |
| G4 | No `after()` background processing | 1-3s wasted blocking on best-effort calls | Both server actions `await` 4 sequential best-effort calls |
| G5 | No structured logging | Unstructured `console.error` only | grep confirmed no JSON.stringify logging pattern |
| G6 | No error tracking (Sentry) | Silent failures in lead pipeline | No `@sentry/nextjs` in package.json |
| G7 | No locale normalization in Analytics | `/es/about` and `/about` tracked separately | No `beforeSend` on `<Analytics>` component |

---

## Phase 1: Fix Analytics Import + Locale Normalization

**Effort:** 15 minutes | **Impact:** High | **Risk:** None

### 1.1 Fix Import Path

**File:** `app/[locale]/layout.tsx`

**Why:** The official Vercel docs explicitly state: for Next.js App Router, use `@vercel/analytics/next`. The `/react` import is for Create React App and lacks Next.js-specific route detection, which means Vercel Analytics may not properly attribute pageviews to App Router routes.

**Source:** https://vercel.com/docs/analytics/quickstart (Next.js App Router section)

```diff
- import { Analytics } from "@vercel/analytics/react";
+ import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
```

### 1.2 Add `beforeSend` Locale Normalization

**File:** `app/[locale]/layout.tsx`

**Why:** The site supports 3 locales (en, es, ru). Without normalization, Vercel Analytics tracks `/es/about` and `/ru/about` as separate pages from `/about`. This fragments your pageview data across 3x the expected page count.

**Source:** https://vercel.com/docs/analytics/package#beforesend

Replace the `<Analytics />` component with:

```tsx
<Analytics
  beforeSend={(event: BeforeSendEvent) => {
    // Normalize locale-prefixed paths: /es/about -> /about, /ru/contact -> /contact
    const url = new URL(event.url);
    url.pathname = url.pathname.replace(/^\/(es|ru)(\/|$)/, '/');
    return { ...event, url: url.toString() };
  }}
/>
```

This ensures all locales aggregate under the same page in Vercel Analytics, while GA4 still sees the locale via its own `locale` config parameter.

---

## Phase 2: Vercel Analytics Custom Events

**Effort:** 1-2 hours | **Impact:** Very High | **Risk:** None

### 2.1 Client-Side Custom Events

**File:** `lib/tracking.ts`

**Why:** The site fires 10+ custom events to GA4 but zero to Vercel Analytics. Adding `track()` calls lights up the Events panel and UTM Parameters tab in the Vercel dashboard, and correlates business metrics with deployment events.

**Source:** https://vercel.com/docs/analytics/custom-events

**API constraints (verified):**
- Max 255 chars for event name, key, or value
- Values: `string`, `number`, `boolean`, `null` only — no nested objects
- Pro plan: charges $0.00003/event (negligible at current traffic)

Add import at top of `lib/tracking.ts`:

```ts
import { track } from "@vercel/analytics";
```

Add Vercel `track()` calls alongside existing GA4 calls in these functions:

```ts
// In trackContactClick():
track("contact_click", { type, location });

// In trackCtaClick():
track("cta_click", { location, text: text.slice(0, 100), destination });

// In trackCalcFunnel():
track(`calculator_${step}`, params);
```

Additionally, fire Vercel events from the components that track `generate_lead`:

**File:** `components/contact-form.tsx` — on successful form submission:
```ts
import { track } from "@vercel/analytics";
// After successful submit:
track("generate_lead", { source: "contact_form", value: 500 });
```

**File:** `components/freight-calculator/calculator-wizard.tsx` — on email gate submit:
```ts
import { track } from "@vercel/analytics";
// After successful submit:
track("generate_lead", { source: "calculator", value: 300 });
```

### 2.2 Strategic Event Selection

**Only mirror HIGH-VALUE events to Vercel Analytics.** Keep micro-events (faq_expand, video_play) in GA4 only to avoid unnecessary cost.

| Event | GA4 | Vercel Analytics | Reason |
|-------|-----|-----------------|--------|
| `generate_lead` | Yes | **Yes** | Core business metric |
| `contact_whatsapp/phone/email` | Yes | **Yes** | Revenue-driving actions |
| `cta_click` | Yes | **Yes** | Conversion funnel |
| `calculator_start/step/complete` | Yes | **Yes** | Lead magnet funnel |
| `video_play` | Yes | No | Engagement only, no revenue signal |
| `faq_expand` | Yes | No | Engagement only |

### 2.3 Server-Side Custom Events

**Files:** `app/actions/contact.ts`, `app/actions/calculator.ts`

**Why:** Server-side events are immune to ad blockers. If a user's browser blocks `@vercel/analytics` client-side, the server-side `track()` still fires. This ensures 100% capture of lead events.

**Source:** https://vercel.com/docs/analytics/custom-events#tracking-a-server-side-event

Add to both server actions (after the critical owner email succeeds, inside the `after()` block — see Phase 3):

```ts
import { track } from "@vercel/analytics/server";

// In submitContactForm, inside after():
await track("lead_submitted", {
  source: "contact_form",
  locale,
});

// In submitCalculator, inside after():
await track("lead_submitted", {
  source: "calculator",
  equipment: data.equipmentType,
  destination: data.destinationCountry,
  container: data.containerType,
  estimate_total: estimate.estimatedTotal,
});
```

---

## Phase 3: Background Processing with `after()`

**Effort:** 1-2 hours | **Impact:** High (UX performance) | **Risk:** Low

### 3.1 Why `after()` and Not `waitUntil`

**Source:** https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#usage-with-nextjs

> "If you're using Next.js 15.1 or above, we recommend using the built-in `after()` function from `next/server` instead of `waitUntil()`."

The project is on **Next.js 16.1.7**, so `after()` is the correct API. Key benefits:
- Works in Server Components, Server Actions, and Middleware
- Does NOT cause a route to become dynamic
- No extra dependency (`next/server` is built-in)

### 3.2 Contact Form Refactor

**File:** `app/actions/contact.ts`

**Current flow (sequential, all awaited):**
```
Validate → Honeypot → Supabase INSERT → Owner Email → Auto-reply → Slack → CAPI → Return
                                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                       These 3 calls block the response
                                                       for ~1-3 seconds unnecessarily
```

**Proposed flow with `after()`:**
```
Validate → Honeypot → Supabase INSERT → Owner Email → Return response
                                                           |
                                                           after() → Auto-reply + Slack + CAPI + Vercel track()
```

```ts
import { after } from "next/server";
import { track } from "@vercel/analytics/server";

export async function submitContactForm(raw: ContactFormData, locale: string = "en"): Promise<ContactActionResult> {
  // 1-2. Validate + Honeypot (unchanged)
  // 3. Supabase INSERT (unchanged, kept in critical path)
  // 4. Owner email (unchanged, must succeed)

  // Generate event ID before returning
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 5-7. Move best-effort work to after()
  after(async () => {
    // Auto-reply (best-effort)
    try {
      const replySubject = AUTO_REPLY_SUBJECTS[locale] ?? AUTO_REPLY_SUBJECTS.en;
      const replyBodyFn = AUTO_REPLY_BODY[locale] ?? AUTO_REPLY_BODY.en;
      await resend.emails.send({ /* ...existing auto-reply code... */ });
    } catch (e) {
      console.error(JSON.stringify({ level: "error", msg: "auto_reply_failed", route: "contact", error: String(e) }));
    }

    // Slack (best-effort)
    await notifySlack(slackLines);

    // Meta CAPI (best-effort)
    await sendCAPIEvent({ eventName: "Lead", eventId, email, phone: phone || undefined, /* ... */ });

    // Vercel Analytics server-side (best-effort)
    await track("lead_submitted", { source: "contact_form", locale });
  });

  return { success: true, eventId };
}
```

### 3.3 Calculator Action Refactor

**File:** `app/actions/calculator.ts`

Same pattern — move steps 7-9 (auto-reply, Slack, CAPI) into `after()`, and add Vercel Analytics `track()`.

```ts
import { after } from "next/server";
import { track } from "@vercel/analytics/server";

// After owner email succeeds and estimate is calculated:
after(async () => {
  // Auto-reply to visitor (best-effort)
  try { await resend.emails.send({ /* ... */ }); } catch (e) { /* log */ }

  // Slack notification (best-effort)
  await notifySlack(slackLines);

  // Meta CAPI (best-effort)
  await sendCAPIEvent({ eventName: "Lead", eventId, email: data.email, /* ... */ });

  // Vercel Analytics (best-effort)
  await track("lead_submitted", {
    source: "calculator",
    equipment: data.equipmentType,
    destination: data.destinationCountry,
    container: data.containerType,
    estimate_total: estimate.estimatedTotal,
  });
});

return { success: true, estimate, eventId };
```

### 3.4 Expected Performance Improvement

| Step | Current (ms) | After refactor (ms) |
|------|-------------|---------------------|
| Auto-reply email | ~300-500 | 0 (background) |
| Slack notification | ~200-400 | 0 (background) |
| Meta CAPI | ~200-400 | 0 (background) |
| Vercel track() | N/A (new) | 0 (background) |
| **Total saved** | **~700-1300ms** | **0ms perceived** |

The user sees their response ~1 second faster because background work no longer blocks.

---

## Phase 4: Structured Logging

**Effort:** 1-2 hours | **Impact:** Medium | **Risk:** None

### 4.1 Create Logger Utility

**File:** `lib/logger.ts` (new file)

```ts
/**
 * Structured JSON logger for server-side code.
 * Outputs structured JSON that Vercel's log viewer can parse and filter.
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  msg: string;
  route?: string;
  ms?: number;
  [key: string]: unknown;
}

export function log(entry: LogEntry): void {
  const output = JSON.stringify({ ...entry, ts: new Date().toISOString() });
  if (entry.level === "error") {
    console.error(output);
  } else if (entry.level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

/** Start a timer for a route/action. Returns an object with done() and error() methods. */
export function startTimer(route: string) {
  const start = Date.now();
  log({ level: "info", msg: "start", route });

  return {
    done(extra?: Record<string, unknown>) {
      log({ level: "info", msg: "done", route, ms: Date.now() - start, ...extra });
    },
    error(err: unknown, extra?: Record<string, unknown>) {
      log({
        level: "error",
        msg: "failed",
        route,
        ms: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
        ...extra,
      });
    },
  };
}
```

### 4.2 Apply to Server Actions

**File:** `app/actions/contact.ts`

```ts
import { startTimer } from "@/lib/logger";

export async function submitContactForm(raw: ContactFormData, locale: string = "en") {
  const timer = startTimer("action:contact-form");

  // ... existing validation, email, etc.

  // On success:
  timer.done({ email: data.email, locale });
  return { success: true, eventId };

  // On error (in catch blocks):
  timer.error(err, { email: data.email });
  return { success: false, error: "..." };
}
```

**File:** `app/actions/calculator.ts` — same pattern.

**File:** `app/api/track/route.ts` (WhatsApp click tracking) — same pattern.

### 4.3 Structured Logging in `after()` Block

Replace plain `console.error` calls inside `after()` with structured logging:

```ts
after(async () => {
  // Instead of: console.error("Auto-reply failed:", e);
  // Use:
  log({ level: "error", msg: "auto_reply_failed", route: "action:contact-form", error: String(e) });
});
```

---

## Phase 5: Sentry Error Tracking

**Effort:** 1-2 hours | **Impact:** Very High (safety net) | **Risk:** Low

### 5.1 Why Sentry

The site handles revenue-generating workflows:
- Contact form → lead capture → Resend email → Supabase → Slack
- Calculator → rate fetch → calculation → email → Supabase → Slack → CAPI

If any step fails silently (Supabase down, Resend rate-limited, CAPI token expired), **leads are lost**. Without error tracking, you won't know until a customer complains. Sentry provides:
- Automatic error capture with stack traces
- Performance monitoring (transaction timing)
- Source map upload (automatic on Vercel deploy)
- Slack/email alerts on new errors

### 5.2 Installation Steps

```bash
# 1. Install via Vercel Marketplace (auto-configures env vars)
vercel integration add sentry

# 2. Run Sentry's Next.js wizard (creates instrumentation files)
cd /Users/zaytsev/Projects/meridian-freight-website
npx @sentry/wizard@latest -i nextjs

# The wizard creates:
# - sentry.client.config.ts
# - sentry.server.config.ts
# - sentry.edge.config.ts
# - instrumentation.ts (Next.js 16 server initialization)
# - Wraps next.config.ts with withSentryConfig
```

### 5.3 Manual Configuration (if wizard doesn't fully configure)

**File:** `instrumentation.ts` (project root, created by wizard)

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```

### 5.4 Environment Variables

The `vercel integration add sentry` command auto-provisions:
- `SENTRY_DSN` — data source name
- `SENTRY_ORG` — organization slug
- `SENTRY_PROJECT` — project slug
- `SENTRY_AUTH_TOKEN` — for source map uploads during build

### 5.5 Sentry in after() Blocks

Once Sentry is installed, replace manual `console.error` calls with Sentry capture:

```ts
import * as Sentry from "@sentry/nextjs";

after(async () => {
  try {
    await sendCAPIEvent({ /* ... */ });
  } catch (e) {
    Sentry.captureException(e, { tags: { route: "contact-form", step: "capi" } });
    log({ level: "error", msg: "capi_failed", route: "action:contact-form", error: String(e) });
  }
});
```

---

## Implementation Order

| Phase | Priority | Effort | Depends On |
|-------|----------|--------|------------|
| Phase 1: Fix import + beforeSend | P0 | 15 min | None |
| Phase 2: Custom events | P0 | 1-2 hrs | Phase 1 (same file) |
| Phase 3: `after()` background | P1 | 1-2 hrs | Phase 2 (server-side track) |
| Phase 4: Structured logging | P1 | 1-2 hrs | None (parallel with Phase 3) |
| Phase 5: Sentry | P1 | 1-2 hrs | None (parallel with Phase 3-4) |

**Phases 3, 4, 5 can be implemented in parallel.**

---

## Verification Checklist

After implementation, verify:

- [ ] Vercel Analytics dashboard shows custom events (Events panel)
- [ ] UTM Parameters tab populates when visiting with `?utm_source=test`
- [ ] `/es/about` and `/about` aggregate under `/about` in Vercel Analytics
- [ ] Server action response time improved by ~700-1300ms (test with browser DevTools Network tab)
- [ ] Structured JSON logs appear in Vercel Runtime Logs (Vercel dashboard > Logs)
- [ ] Sentry captures test errors (throw intentional error in dev, verify in Sentry dashboard)
- [ ] `@vercel/analytics/next` import in layout (not `/react`)

---

## Items Considered and Rejected

| Item | Reason for Rejection |
|------|---------------------|
| Log Drains | No external destination (Datadog, etc.) configured. Sentry covers error tracking. Re-evaluate if/when centralizing logs becomes necessary. |
| OpenTelemetry | Overkill for a marketing site with ~20 daily visitors. No microservice architecture to trace. |
| Datadog/New Relic | Too expensive for current traffic volume. Sentry free tier is sufficient. |
| Vercel Flags integration | No feature flags in use. Not relevant to analytics gap. |
| Web Analytics Plus add-on ($10/mo) | Not needed at current traffic. Consider when exceeding included event limits. |

---

## Documentation Sources (Verified 2026-03-25)

All recommendations verified against official Vercel documentation:

| Topic | URL |
|-------|-----|
| Analytics custom events API | https://vercel.com/docs/analytics/custom-events |
| Analytics package config (beforeSend, import paths) | https://vercel.com/docs/analytics/package |
| Analytics quickstart (correct import for Next.js) | https://vercel.com/docs/analytics/quickstart |
| Analytics pricing/limits | https://vercel.com/docs/analytics/limits-and-pricing |
| Speed Insights overview | https://vercel.com/docs/speed-insights |
| `after()` vs `waitUntil` for Next.js 15.1+ | https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package |
| `@vercel/functions` API reference | https://vercel.com/docs/functions/functions-api-reference |
| Sentry integration | Vercel Marketplace (`vercel integration add sentry`) |
