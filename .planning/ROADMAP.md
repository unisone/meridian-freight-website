# Roadmap: Meridian Freight Marketing Website

## Milestones

- ✅ **v1.0 Cleanup** — codebase map + v1/v2 calculator decommission + PII guard (shipped via PR #107, awaiting merge)
- 🚧 **v1.1 Wizard Hardening + Security Audit** — Phases 1-3 (in progress)

## Overview

After v1.0 cleared the v1/v2 calculator noise from the codebase, v1.1 addresses the medium-priority debt the codebase map surfaced: a 2,030-line monolithic wizard, missing test coverage on the v3 wizard, and 2 Dependabot moderate vulnerabilities on `main`. Each phase ships as its own PR.

## Phases

- [ ] **Phase 1: Wizard split + globe boundary** — Split the 2,030-line v3 wizard into per-step modules and lift the globe to a `next/dynamic` boundary
- [ ] **Phase 2: V3 wizard tests** — Component/integration tests for the now-modular wizard plus server-action tests
- [ ] **Phase 3: Dependabot vuln audit** — Patch the 2 moderate advisories flagged on `main`

## Phase Details

### Phase 1: Wizard split + globe boundary
**Goal**: Refactor `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines) into per-step modules and lift `RouteGlobe` to a `next/dynamic({ssr:false})` boundary. Pure refactor — no behavioral change. Reduces bundle size on first paint and unblocks Phase 2 testing.
**Depends on**: PR #107 merged to main
**Requirements**: REQ-01, REQ-02
**Success Criteria** (what must be TRUE):
  1. `components/freight-calculator-v3/wizard/` directory exists with per-step component files (origin/equipment/destination/contact/result), each ≤500 lines
  2. The orchestrator `calculator-v3-wizard.tsx` is ≤500 lines and delegates rendering to step modules
  3. `react-globe.gl` is not in the initial client bundle for `/pricing/calculator` (verified via build output or DevTools Network tab)
  4. The calculator funnel still renders and submits successfully end-to-end (equipment → country → ZIP → email → estimate)
  5. All existing tests pass; type-check, lint, build all green
**Plans**: TBD (planner will determine)

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
| 1. Wizard split + globe boundary | 0/TBD | Not started | - |
| 2. V3 wizard tests | 0/TBD | Not started | - |
| 3. Dependabot vuln audit | 0/TBD | Not started | - |
