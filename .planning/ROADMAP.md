# Roadmap — v1.1 Wizard Hardening + Security Audit

**Milestone goal:** ship the four must-have requirements (REQ-1.1 through REQ-1.4) cleanly, each as its own PR per CLAUDE.md SOP. Should-haves (REQ-1.5, REQ-1.6) slip to v1.2 if effort overruns.

## Phase Sequence

### Phase 1 — Wizard split (REQ-1.1, REQ-1.2)

Split the 2,030-line `calculator-v3-wizard.tsx` into per-step modules and lift the globe to a `next/dynamic` boundary. This is the riskiest phase — it touches the production calculator UX. Treat it as a pure refactor: no behavioral change, just file reorganization.

**Deliverables:**
- `components/freight-calculator-v3/wizard/` directory with per-step components: `step-equipment.tsx`, `step-route.tsx`, `step-contact.tsx`, `step-review.tsx`, `route-globe-v3.tsx` (or reuse the existing route-globe via `next/dynamic`)
- A thin `calculator-v3-wizard.tsx` that orchestrates state and delegates rendering to the step modules
- Bundle-size verification: `react-globe.gl` not in initial chunk
- All existing rendering preserved; verified via local browser test + the upcoming v3 wizard tests

**Dependencies:** PR #107 must be merged so the v2 noise is out of the way.

**Verification:** type-check, lint, build, browser-test calculator funnel end-to-end (select equipment → country → ZIP → submit), bundle-size check.

### Phase 2 — V3 wizard tests (REQ-1.3)

Now that the wizard is modular, add component/integration tests. Target ≥3 happy-path tests covering the funnel + ≥2 edge cases.

**Deliverables:**
- `components/freight-calculator-v3/wizard/__tests__/calculator-v3-wizard.test.tsx` (or split per step)
- `app/actions/__tests__/calculator-v3.test.ts` (REQ-1.6 should-have, bundled here for efficiency)
- React Testing Library + Vitest setup verified

**Dependencies:** Phase 1 (split makes testing dramatically easier).

**Verification:** all tests pass, ≥5 new tests added, coverage report shows wizard files exercised.

### Phase 3 — Dependabot vuln patching (REQ-1.4)

Audit the 2 moderate vulns flagged on `main`. Patch directly if root deps; pin transitives if not. Document any unpatchable advisories with mitigation rationale.

**Deliverables:**
- `package.json` / `package-lock.json` updates
- `.planning/security/v1.1-vuln-audit.md` capturing each advisory + remediation
- 0 Dependabot moderate vulns on `main` after merge

**Dependencies:** Independent of Phases 1 and 2 — can run in parallel via a separate branch if desired.

**Verification:** `npm audit` clean for moderate+ severity, GitHub Dependabot dashboard clean, no test/build regressions.

## Out of Scope (Slipping to v1.2)

- REQ-1.5 (`any` type elimination) — small effort but cosmetic; bundle into next milestone.
- ES translation orphans — needs translator collaboration.
- Audit screenshot tooling — separate infrastructure investment.

## Branching

Per CLAUDE.md SOP: each phase ships as its own PR off `main`. Branch names: `feat/v1.1-wizard-split`, `feat/v1.1-wizard-tests`, `chore/v1.1-vuln-audit`.
