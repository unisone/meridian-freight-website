# SEV 2026-05-19 — MIDDLEWARE_INVOCATION_FAILED (@swc/helpers ESM)

## Summary

| | |
|---|---|
| **Severity** | SEV — site-wide 500s |
| **Detected** | 2026-05-19 ~10:43 EDT |
| **Mitigated** | 2026-05-19 ~10:46 EDT (rollback) |
| **Fully resolved** | 2026-05-19 ~14:50 EDT (PR #136) |
| **User-visible duration** | ~3 min (between first 500 and rollback) |
| **Investigation duration** | ~4 h (rollback-protected) |

## Impact

Every request to `meridianexport.com` returned HTTP 500 with `MIDDLEWARE_INVOCATION_FAILED`. Underlying lambda runtime error: `Cannot find module '/var/task/node_modules/@swc/helpers/esm/_interop_require_default.js'`.

User-visible only between the first broken deploy auto-promoting and the rollback (~3 min). All investigation occurred under the rollback safety net.

## Root cause

**Vercel platform regression** in the Next.js 16 `proxy.ts` middleware compilation path. The compiled Node-runtime middleware lambda does runtime `require()` for `@swc/helpers/esm/_interop_require_default.js`, but Vercel's NFT (Node File Tracing) ships only the **CJS** variants. Result: missing-module crash at lambda cold start → `MIDDLEWARE_INVOCATION_FAILED`.

A second, separate manifestation of the same NFT gap affected dynamic page lambdas and API route handlers — same missing-file class, same fix shape.

## Trigger

Identical source commit (`2c680b9`) re-deployed by Vercel in a ~4-hour window:

- 2026-05-18 14:20 EDT → `n2cuoqj3u` (works)
- 2026-05-18 19:02 EDT → `h08hubxm9` (broken)

No code, lockfile, or dependency change between deploys. Platform change isolated to that window.

## Fix

| Layer | Fix | PR |
|---|---|---|
| Middleware lambda | `git mv proxy.ts middleware.ts` — routes through old Edge-runtime bundler that inlines `@swc/helpers` | #135 |
| Page + API lambdas | `outputFileTracingIncludes: { "/*","/**/*","/api/**/*" → "node_modules/@swc/helpers/**/*" }` | #136 |
| CI guard | `scripts/verify-lambda-tracing.ts` runs after `next build`, fails the PR if any page/route lambda NFT trace is missing the canary helper. Smoke test extended to probe the dynamic routes (locales, blog slug, API) that 500'd. | #137 |

## What didn't work (kept for future reference)

| Attempt | Why it failed | PR |
|---|---|---|
| `outputFileTracingIncludes` only | Doesn't apply to middleware lambda | #132 |
| Force `next build --webpack` | Vercel built with webpack but middleware lambda still crashed | #133 |
| Revert dependabot bumps | Bug is platform-level, not dependency-level | #134 |
| `serverExternalPackages: ['@swc/helpers']` | No effect — missing-file require still occurs at startup | (tested in #133) |

## Lessons

1. **For platform bugs, search first.** Vercel Community thread #41956 documented this exact bug 5 days before we hit it. I spent ~2 hours theorising and writing failing patches before doing actual research — the answer (rename) was on page 1 of search results. **Memorialised in feedback memory.**
2. **The static homepage is a lying canary.** It stayed 200 via edge cache throughout the SEV. Probing `/`, `/about`, `/services` would have told us the site was fine. The actual signal lived on the dynamic locale + blog + API routes. The CI smoke test now probes those.
3. **Rollback is free — use it first.** Rollback to `n2cuoqj3u` took 3 seconds and bought 4 hours of unimpacted investigation time. Done before any deep diagnosis.

## Follow-up

- `community-reply-draft.md` — text prepared for posting at the Vercel community thread to add corroborating data points
- Once Vercel fixes the upstream `proxy.ts` bundler bug: revert `middleware.ts` → `proxy.ts` and re-apply the dependabot bumps from PR #130

## Refs

- [Vercel Community thread #41956 — original SEV report (same bug, 5 days earlier)](https://community.vercel.com/t/iddleware-invocation-failed-middleware-lambda-missing-swc-helpers-on-next-16-2-4/41956)
- [Vercel MIDDLEWARE_INVOCATION_FAILED docs](https://vercel.com/docs/errors/MIDDLEWARE_INVOCATION_FAILED)
- [Next.js v16 proxy.ts upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
