# Roadmap: Meridian Freight Marketing Website

## Milestones

- ✅ **v1.0 Cleanup** — codebase map + v1/v2 calculator decommission + PII guard (shipped via PR #107, merged to main 2026-05-04)
- 🚧 **v1.1 Wizard Hardening + Security Audit** — Phases 1a, 1b, 2, 3 (in progress)

## Overview

After v1.0 cleared the v1/v2 calculator noise from the codebase, v1.1 addresses the medium-priority debt the codebase map surfaced: a 2,030-line monolithic wizard, missing test coverage on the v3 wizard, and 2 Dependabot moderate vulnerabilities on `main`. Each phase ships as its own PR.

**Phase 1 split rationale (2026-05-04):** The original Phase 1 plan had 10 atomic tasks and the plan-checker flagged "9 auto tasks/plan" as a WARNING. After execution started, we split into 1a (foundation + bundle perf win) and 1b (orchestrator slim-down). This matches FAANG senior practice: ship the bundle perf win immediately, then do the riskier orchestrator state-machine migration as a focused follow-up. Atomic, reviewable, lower-risk-per-PR.

## Phases

- [ ] **Phase 1a: Wizard scaffolding + globe boundary** — Establish wizard module structure (state.ts, types.ts, copy.ts, route-globe-v3.tsx) and ship the globe lazy-load. ~1.58MB three.js leaves the initial bundle.
- [ ] **Phase 1b: Wizard orchestrator slim-down** — Extract step components (equipment/specs/route/estimate-card) and migrate orchestrator from 18 useState calls to the wizardReducer (already tested in Phase 1a). Brings orchestrator below 500 lines.
- [ ] **Phase 2: V3 wizard tests** — Component/integration tests for the now-modular wizard plus server-action tests
- [ ] **Phase 3: Dependabot vuln audit** — Patch the 2 moderate advisories flagged on `main`

## Phase Details

### Phase 1a: Wizard scaffolding + globe boundary
**Goal**: Lay the wizard module foundation (`wizard/state.ts` reducer + tests, `wizard/types.ts` step prop interfaces, `wizard/copy.ts` extracted COPY dictionary) and lift `RouteGlobe` to a `next/dynamic({ssr:false})` boundary at the wizard's import site. Pure additive + a one-line import swap. Verified: ~1.58MB three.js excluded from `/pricing/calculator` initial bundle.
**Depends on**: PR #107 merged to main
**Requirements**: REQ-02 (full), REQ-01 (partial — scaffolding only)
**Success Criteria** (what must be TRUE):
  1. `components/freight-calculator-v3/wizard/` exists with `state.ts`, `types.ts`, `copy.ts`, plus tests
  2. `components/freight-calculator-v3/route-globe-v3.tsx` exists; wizard imports it via `./route-globe-v3` (not the direct `RouteGlobe` static import)
  3. `react-globe.gl` and `three.js` are NOT in any chunk listed in `.next/build-manifest.json` `rootMainFiles` (the bundle that loads on every page)
  4. The calculator funnel still renders and submits end-to-end (equipment → country → ZIP → email → estimate)
  5. All existing tests pass; type-check, lint, build all green; reducer tests added (≥5 new tests)
**Plans**: 01-01-PLAN.md (Tasks 1-4) executed via `gsd-executor` agent.

### Phase 1b: Wizard orchestrator slim-down
**Goal**: Extract Section 1/2/3 JSX into per-step components (`step-equipment.tsx`, `step-specs.tsx`, `step-route.tsx`), extract the estimate card UI into `estimate-card.tsx`, and migrate the orchestrator from 18 individual `useState` calls to the `wizardReducer` already tested in Phase 1a. Brings orchestrator below 500 lines and makes Phase 2 component testing tractable.
**Depends on**: Phase 1a
**Requirements**: REQ-01 (full)
**Success Criteria** (what must be TRUE):
  1. Every file in `components/freight-calculator-v3/wizard/` is ≤500 lines
  2. The orchestrator `calculator-v3-wizard.tsx` is ≤500 lines and delegates step rendering via `<StepEquipment ... />` etc.
  3. Orchestrator state is a single `useReducer(wizardReducer)` — no individual `useState` for wizard fields. Tracking calls (`trackCalcFunnel`, `trackContactClick`, etc.) MUST stay in event handlers, NEVER inside the reducer
  4. `submittingRef` guard preserved
  5. Calculator funnel still renders and submits identically (browser-verified)
  6. All tests still pass; type-check, lint, build all green

### Phase 2: V3 wizard tests
**Goal**: Add component/integration tests for the now-modular v3 wizard covering the funnel happy path + edge cases. Bundle in server-action tests for `app/actions/calculator-v3.ts` while we're in the testing context.
**Depends on**: Phase 1
**Requirements**: REQ-03, REQ-06
**Success Criteria** (what must be TRUE):
  1. ≥3 happy-path tests covering: equipment selection, country selection, ZIP+email submission with rendered estimate
  2. ≥2 edge-case tests covering at least: missing ZIP fallback, declined cookie consent path
  3. Server-action tests for `submitCalculatorV3` validate Zod rejection, honeypot block, refresh-on-rate-mismatch
  4. Total test count rises by ≥5; coverage report shows wizard files exercised
  5. All tests pass; type-check, lint, build all green
**Plans**: TBD

### Phase 3: Dependabot vuln audit
**Goal**: Audit the 2 moderate Dependabot advisories on `main` and patch them — directly if root deps, by pinning transitives if not. Document unpatchable advisories with explicit mitigation rationale.
**Depends on**: Nothing (independent of Phases 1 and 2; can run in parallel via separate branch)
**Requirements**: REQ-04
**Success Criteria** (what must be TRUE):
  1. `npm audit --audit-level=moderate` reports 0 vulnerabilities
  2. GitHub Dependabot dashboard shows 0 moderate alerts on `main`
  3. `.planning/security/v1.1-vuln-audit.md` documents each advisory + remediation
  4. No test/build/lint regressions
  5. No new runtime dependencies added (only patches and pins)
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1a. Wizard scaffolding + globe boundary | 1/1 | In progress (PR pending) | - |
| 1b. Wizard orchestrator slim-down | 0/TBD | Not started | - |
| 2. V3 wizard tests | 0/TBD | Not started | - |
| 3. Dependabot vuln audit | 0/TBD | Not started | - |
