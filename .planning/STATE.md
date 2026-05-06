# State

**Last updated:** 2026-05-05
**Last activity:** 2026-05-05 — Completed quick task 260505-pal: tracking event renames + hreflang alternates for LatAm hubs (P1-1, P1-2, P1-4)

## Current Position

- **Active milestone:** v1.1 — **COMPLETE** (all 4 phases shipped)
- **Active phase:** none — milestone closeout in flight
- **Active workstream:** none
- **Active branch:** `chore/v1.1-milestone-complete` (this branch — milestone retro paperwork)
- **Open PR:** none (PR #114 milestone-close pending)

## What's Done

### v1.0 Cleanup (PR #107)
Codebase map + v1/v2 calculator decommission + PII guard + 308 redirects + CLAUDE.md docs + ESLint pin fix.

### v1.1 Milestone — Wizard Hardening + Security Audit (4 phases, 5 production PRs)

| Phase | PR | Date | What |
|---|---|---|---|
| **1** Scaffolding + globe boundary | #108 | 2026-05-04 | `wizard/state.ts` reducer + tests, `wizard/types.ts` step prop interfaces, `wizard/copy.ts` extracted COPY dict, `route-globe-v3.tsx` lazy boundary. ~1.58 MB three.js excluded from initial paint. |
| **2** Orchestrator slim-down | #110 + #111 | 2026-05-05 | `calculator-v3-wizard.tsx`: 1,621 → 497 lines. Step components extracted (equipment/specs/route/estimate-card) + helpers + shell. 18 `useState` → `useReducer(wizardReducer)`. Every `wizard/*` file ≤500 lines. Tracking-call guard verified (zero hits in reducer body). |
| **3** V3 wizard tests | #113 | 2026-05-05 | RTL + jsdom setup. 5 component tests (3 happy + 2 edge). 5 server-action tests covering Zod gates + honeypot + stale rateBookSignature. Reducer tests expanded 5 → 16. Total: 117 → 138 (+21 tests). |
| **4** Dependabot vuln audit | #112 | 2026-05-05 | postcss XSS patched (override → `^8.5.0`, all instances at 8.5.14). uuid pinned to `^11.0.0` (latest stable). Residual uuid advisory documented as accepted (no v14 exists upstream; vulnerable code path unreachable — uuid is transitive via svix via resend, no webhook usage in this codebase). Audit doc at `.planning/security/v1.1-vuln-audit.md`. |

### Verified at meridianexport.com (production)

- `/pricing/calculator` → 200 OK
- `/pricing/calculator-v2` → 308 → `/pricing/calculator`
- `/pricing/calculator-v3` → 308 → `/pricing/calculator`
- `/es/pricing/calculator` → 200 OK
- `/ru/pricing/calculator` → 200 OK
- Initial HTML for `/pricing/calculator` contains zero `react-globe` references
- Three.js (~1.58 MB) loads only when route step mounts the globe

## What's Next

v1.1 is complete. Reasonable next-milestone candidates (NOT scoped here):

1. **v1.2 Polish** — REQ-05 (replace 3 `useRef<any>` with proper types), residual map of medium concerns from `.planning/codebase/CONCERNS.md`
2. **Auto-merge config audit** — `.github/workflows/auto-merge-dependabot.yml` merged PR #105 (ESLint 10 bump) with FAILING CI on April 27. Filed as session follow-up; needs the auto-merge action to actually require `Lint, Build & Test: SUCCESS` before merging.
3. **Lighthouse re-audit** — measure the bundle perf win from Phase 1 quantitatively (LCP / TBT improvement on `/pricing/calculator`)
4. **eslint-config-next ESLint 10 support** — track upstream; unpin ESLint when supported
5. **Track `uuid` upstream** — when v14 ships or `svix` migrates to `crypto.randomUUID()`, drop the override

## Open Threads

- None blocking. The 2 Dependabot moderate alerts are now: 1 closed (postcss), 1 documented residual (uuid).
- Should-have requirements from v1.1 — REQ-05 not done, can roll into v1.2.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260505-pal | Tracking event renames + hreflang alternates for LatAm hubs (P1-1, P1-2, P1-4) | 2026-05-05 | 91394da | [260505-pal-tracking-event-renames-hreflang-alternat](./quick/260505-pal-tracking-event-renames-hreflang-alternat/) |

## Notes

- Codebase map at `.planning/codebase/` remains the authoritative reference doc.
- Pattern mapper, plan checker, verifier still enabled per `config.json`.
- TDD mode still disabled. Tests written alongside, not via strict gates.
- v1.1 ran with mixed tooling tiers per the right-tier-discipline lesson:
  - Phase 1 + 2: full `/gsd-plan-phase` + `/gsd-execute-phase` pipelines (state-machine migration justified the ceremony)
  - Phase 3: lightweight `/gsd-quick`-style — 1-page plan + executor, skipped researcher/checker
  - Phase 4: `/gsd-fast`-style — manual lightweight execution (`npm overrides` + audit doc + PR)
- Lesson: match tooling to risk profile. Full pipeline for state machines, fast tier for dependency patches.
