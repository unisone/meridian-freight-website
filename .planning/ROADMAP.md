# Roadmap: Meridian Freight Marketing Website

## Milestones

- ✅ **v1.0 Cleanup** — codebase map + v1/v2 calculator decommission + PII guard (shipped via PR #107, merged 2026-05-04)
- ✅ **v1.1 Wizard Hardening + Security Audit** — All 4 phases shipped (2026-05-04 to 2026-05-05)

## Overview

After v1.0 cleared the v1/v2 calculator noise from the codebase, v1.1 addressed the medium-priority debt the codebase map surfaced: a 2,030-line monolithic wizard, missing test coverage on the v3 wizard, and 2 Dependabot moderate vulnerabilities on `main`. Each phase shipped as its own PR per CLAUDE.md SOP.

## Phases

- [x] **Phase 1: Wizard scaffolding + globe boundary** — `wizard/state.ts` + `types.ts` + `copy.ts` + `route-globe-v3.tsx` + reducer tests. ~1.58 MB three.js excluded from initial bundle. (Shipped: PR #108, 2026-05-04)
- [x] **Phase 2: Wizard orchestrator slim-down** — Step JSX extracted (equipment/specs/route/estimate-card/helpers/shell). Orchestrator migrated to `useReducer`. Down from 1,621 → 497 lines. Every `wizard/*` file ≤500 lines. (Shipped: PR #110 + #111, 2026-05-05)
- [x] **Phase 3: V3 wizard tests** — RTL + jsdom infrastructure. 5 component tests (3 happy + 2 edge), 5 server-action tests, reducer tests 5 → 16. Total 117 → 138 tests. (Shipped: PR #113, 2026-05-05)
- [x] **Phase 4: Dependabot vuln audit** — postcss XSS patched via override. uuid pinned to `^11.0.0`; residual advisory documented as accepted (no v14 exists upstream; vulnerable code path unreachable). (Shipped: PR #112, 2026-05-05)

## Phase Details

### Phase 1: Wizard scaffolding + globe boundary
**Goal**: Lay the wizard module foundation (`wizard/state.ts` reducer + tests, `wizard/types.ts` step prop interfaces, `wizard/copy.ts` extracted COPY dictionary) and lift `RouteGlobe` to a `next/dynamic({ssr:false})` boundary at the wizard's import site. Pure additive + a one-line import swap. ~1.58MB three.js excluded from `/pricing/calculator` initial bundle.
**Depends on**: PR #107 merged to main
**Requirements**: REQ-02 (full), REQ-01 (partial — scaffolding only)
**Success Criteria** (what must be TRUE):
  1. `components/freight-calculator-v3/wizard/` exists with `state.ts`, `types.ts`, `copy.ts`, plus tests
  2. `components/freight-calculator-v3/route-globe-v3.tsx` exists; wizard imports it via `./route-globe-v3`
  3. `react-globe.gl` and `three.js` NOT in `.next/build-manifest.json` `rootMainFiles`
  4. Calculator funnel still renders and submits end-to-end
  5. All existing tests pass; type-check, lint, build all green; reducer tests added (≥5 new tests)
**Plans**: 01-01-PLAN.md (Tasks 1-4 executed). SHIPPED via PR #108 on 2026-05-04.

Plans:
- [x] 01-01: Wizard scaffolding + globe boundary (Tasks 1-4 of original plan)

### Phase 2: Wizard orchestrator slim-down
**Goal**: Extract Section 1/2/3 JSX into per-step components (`step-equipment.tsx`, `step-specs.tsx`, `step-route.tsx`), extract the estimate card UI into `estimate-card.tsx`, and migrate the orchestrator from 18 individual `useState` calls to the `wizardReducer` already tested in Phase 1. Brings orchestrator below 500 lines.
**Depends on**: Phase 1
**Requirements**: REQ-01 (full)
**Success Criteria** (what must be TRUE):
  1. Every file in `components/freight-calculator-v3/wizard/` is ≤500 lines
  2. The orchestrator `calculator-v3-wizard.tsx` is ≤500 lines and delegates step rendering via `<StepEquipment ... />` etc.
  3. Orchestrator state is a single `useReducer(wizardReducer)` — no individual `useState` for wizard fields. Tracking calls MUST stay in event handlers, NEVER inside the reducer body
  4. `submittingRef` guard preserved
  5. Calculator funnel still renders and submits identically (browser-verified)
  6. All tests still pass; type-check, lint, build all green
**Plans**: 02-01-PLAN.md (Tasks 1-8 executed). SHIPPED via PR #110 on 2026-05-05.

Plans:
- [x] 02-01: Wizard orchestrator slim-down (Tasks 5-8 of original plan, executed as Tasks 1-8 of Phase 2)

### Phase 3: V3 wizard tests
**Goal**: Add component/integration tests for the now-modular v3 wizard covering the funnel happy path + edge cases. Bundle in server-action tests for `app/actions/calculator-v3.ts` while we are in the testing context.
**Depends on**: Phase 2
**Requirements**: REQ-03, REQ-06
**Success Criteria** (what must be TRUE):
  1. ≥3 happy-path tests covering equipment selection, country selection, ZIP+email submission with rendered estimate
  2. ≥2 edge-case tests covering at least missing ZIP fallback, declined cookie consent path
  3. Server-action tests for `submitCalculatorV3` validate Zod rejection, honeypot block, refresh-on-rate-mismatch
  4. Total test count rises by ≥5; coverage report shows wizard files exercised
  5. All tests pass; type-check, lint, build all green
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Dependabot vuln audit
**Goal**: Audit the 2 moderate Dependabot advisories on `main` and patch them — directly if root deps, by pinning transitives if not. Document unpatchable advisories with explicit mitigation rationale.
**Depends on**: Nothing (independent of Phases 1-3; can run in parallel)
**Requirements**: REQ-04
**Success Criteria** (what must be TRUE):
  1. `npm audit --audit-level=moderate` reports 0 vulnerabilities
  2. GitHub Dependabot dashboard shows 0 moderate alerts on `main`
  3. `.planning/security/v1.1-vuln-audit.md` documents each advisory + remediation
  4. No test/build/lint regressions
  5. No new runtime dependencies added (only patches and pins)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Wizard scaffolding + globe boundary | 1/1 | Complete | 2026-05-04 |
| 2. Wizard orchestrator slim-down | 1/1 | Complete | 2026-05-05 |
| 3. V3 wizard tests | 0/TBD | Not started | - |
| 4. Dependabot vuln audit | 0/TBD | Not started | - |
