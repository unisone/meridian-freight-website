# State

**Last updated:** 2026-05-05

## Current Position

- **Active milestone:** v1.1 — Wizard hardening + security audit
- **Active phase:** Phase 2 (orchestrator slim-down) — **shipped via PR #110, merged to main 2026-05-05**. Phase 3 (V3 wizard tests) queued.
- **Active workstream:** none
- **Active branch:** `chore/v1.1-phase-2-summary` (this branch — Phase 2 retro paperwork)
- **Open PR:** none

## What's Done

- v1.0 cleanup committed and pushed (PR #107): codebase map, v1+v2 calculator decommission, formatDollar/estimateRoadMiles decoupling, 308 redirects for legacy URLs, PII pre-commit guard, output/ gitignore, CLAUDE.md updates.
- GSD project structure bootstrapped: PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, config.json.
- **Phase 1 shipped (PR #108, 2026-05-04):** wizard module foundation + globe lazy-load. `wizard/state.ts` + `types.ts` + `copy.ts` + `route-globe-v3.tsx` landed; ~1.58MB three.js excluded from `/pricing/calculator` initial bundle.
- **Phase 2 shipped (PR #110, 2026-05-05):** orchestrator slim-down + useReducer migration. `calculator-v3-wizard.tsx`: 1,621 → 497 lines. Four step components extracted (`step-equipment.tsx`, `step-specs.tsx`, `step-route.tsx`, `estimate-card.tsx`) plus helpers (`estimate-card-helpers.tsx`) and shell (`wizard-shell.tsx`). Every `wizard/*` file ≤500 lines. 117 tests still passing. REQ-02 globe boundary preserved (post-merge production verification: `meridianexport.com/pricing/calculator` 200, zero `react-globe` references in initial HTML).

## What's Next

1. `/gsd-plan-phase 3` — V3 wizard tests (REQ-03, REQ-06): RTL/jsdom setup, ≥3 happy-path component tests, ≥2 edge-case tests, server-action tests for `submitCalculatorV3`.
2. After Phase 3 ships: `/gsd-plan-phase 4` (Dependabot vuln audit — REQ-04). Phase 4 is independent and can run in parallel if useful.

## Open Threads

- 2 Dependabot moderate vulns flagged on `main` (Phase 4 target).
- Should-have requirements REQ-1.5 and REQ-1.6 may slip to v1.2 if Phase 3+4 effort overruns.

## Notes

- Codebase map at `.planning/codebase/` is the authoritative reference doc.
- Pattern mapper, plan checker, verifier all enabled per `config.json`.
- TDD mode disabled. Tests written alongside, not via strict gates.
- Phase 2 confirmed Phase 1's globe boundary remained intact through the orchestrator slim-down — `step-route.tsx` imports `RouteGlobeV3` from `../route-globe-v3`, never the raw `RouteGlobe`. Phase verification gate #2 enforces this on every future PR via `grep`.
