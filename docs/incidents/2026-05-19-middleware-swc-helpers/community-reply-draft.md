# Vercel Community Reply Draft

**Where to post:** https://community.vercel.com/t/iddleware-invocation-failed-middleware-lambda-missing-swc-helpers-on-next-16-2-4/41956

**Title field (if needed for a fresh reply):** Confirming — second-team report, same root cause, same workaround

---

## Reply body (paste below)

Independent corroboration from a different team — we hit the **identical bug** on May 18 2026 (5 days after your initial report). All your data points reproduce on our stack, and the rename workaround you mentioned is the only thing that fixed it for us as well. Posting concrete deployment IDs and version data in case it helps Vercel triage.

### Our stack (close match to yours)

| | Value |
|---|---|
| Next.js | 16.2.6 |
| next-intl | 4.11.2 → 4.12.0 (both broken) |
| @sentry/nextjs | 10.52.0 → 10.53.1 (both broken) |
| Node lambda runtime | nodejs22.x |
| Middleware file | `proxy.ts` (broken) → renamed `middleware.ts` (works) |
| next-intl matcher | `"/((?!api|_next|_vercel|.*\\..*).*)"` |

### Timeline (all on commit `2c680b9`, zero source changes between the two builds)

- **2026-05-18 14:20:02 EDT** — Vercel deploy `dpl_G7zD7BMqaB5QATNynM1ukcJkb7LV` (`n2cuoqj3u`) — production target — **works**, all routes 200
- **2026-05-18 19:02:36 EDT** — Vercel deploy `dpl_HamunC7Jqj1GzuQWjCE4eSaprUEJ` (`h08hubxm9`) — production target — **broken**, every URL returns HTTP 500 with `MIDDLEWARE_INVOCATION_FAILED`, runtime log: `Cannot find module '/var/task/node_modules/@swc/helpers/esm/_interop_require_default.js'`

That is a **~4h 42min gap with no code, lockfile, or dependency change on our side** and zero deploys in between. Strongly suggests the regression came from a build-platform change in that window.

### Workarounds tested (all failed for middleware lambda)

| Attempt | Result |
|---|---|
| `outputFileTracingIncludes: { "/*", "/**/*": ["node_modules/@swc/helpers/**/*"] }` | Page lambdas got 438 helper files including `esm/_interop_require_default.js`. **Middleware lambda unaffected** — `outputFileTracingIncludes` does not apply to middleware. |
| `serverExternalPackages: ['@swc/helpers']` | No change — the missing-file require still occurs at startup. |
| Force `next build --webpack` (skip Turbopack) | Vercel build log confirms `▲ Next.js 16.2.6 (webpack)` — same MIDDLEWARE_INVOCATION_FAILED. |
| Revert dependabot bumps (`@sentry/nextjs` 10.53.1 → 10.52.0, `next-intl` 4.12.0 → 4.11.2) | No effect — same crash. |

### What actually worked

`git mv proxy.ts middleware.ts` — single file rename, no other changes.

**Why** (verified via local `vercel build` inspection of `.vercel/output`):

- With `proxy.ts`: produces `_middleware.func` (`runtime: nodejs22.x`, Node Lambda) whose compiled bundle does runtime `require()` for `node_modules/@swc/helpers/esm/_interop_require_default.js`, but the lambda's `filePathMap` ships only the **CJS** variants (`cjs/_interop_require_default.cjs`). The ESM `.js` is absent → ModuleNotFoundError at startup → MIDDLEWARE_INVOCATION_FAILED.
- With `middleware.ts`: produces `middleware.func` (`runtime: edge`, `deploymentTarget: v8-worker`). The middleware is bundled into a single ~402 KB inline `index.js` with **zero external `@swc/helpers/*` require calls**. No `/var/task` filesystem lookup at all.

Same source code, two completely different Vercel build code paths.

### Net status

- Middleware lambda: fixed by rename
- Page + API route lambdas (Node-runtime): **separately** affected by the same `@swc/helpers` ESM tracing gap; for those, `outputFileTracingIncludes` for `node_modules/@swc/helpers/**/*` does work and is sufficient. (For the original reporter: this is likely why the WhatsApp-tracking API endpoint behaved differently than the homepage during your outage — different lambda classes, different fixes.)

### Asks for Vercel

1. Can someone from the bundler team confirm the `proxy.ts` Node-runtime compilation is intentionally requiring `@swc/helpers/esm/*.js` files that the NFT doesn't trace? It looks like a tracer/compiler mismatch — either NFT should include them, or the compiler shouldn't reference them.
2. Is there a build-platform change between 2026-05-18 14:20 and 19:02 EDT that would explain identical commits producing identical-but-different binaries?
3. Once fixed, what's the recommended path for teams that already migrated to `proxy.ts` per the v16 upgrade guide? Going back to `middleware.ts` works but contradicts the migration docs.

Happy to share full `.vc-config.json` filePathMap diffs between the working and broken builds if helpful.
