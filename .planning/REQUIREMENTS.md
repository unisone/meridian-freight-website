# Requirements — v1.1 Wizard Hardening + Security Audit

## Scope

Address medium-priority debt items surfaced by `.planning/codebase/CONCERNS.md` now that v1.0 cleanup has shipped. Focus on three areas: v3 wizard maintainability, v3 wizard test coverage, and dependency security.

## Must-Have (v1.1)

| REQ ID | Requirement | Source |
|---|---|---|
| REQ-1.1 | Split `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines) into per-step modules with shared state. Each step (origin/equipment/destination/contact/result) lives in its own file. | CONCERNS.md HIGH/MEDIUM ("calculator-v3-wizard.tsx is 2,030 lines"), CONCERNS.md MEDIUM ("Bundle bloat risk in v3 calculator client component") |
| REQ-1.2 | Lift `RouteGlobe` to a sibling component dynamically loaded via `next/dynamic({ssr:false})` from the v3 wizard, so three.js never enters the main client bundle by default. | CONCERNS.md MEDIUM ("v3 wizard does not appear to use the same dynamic-loaded globe boundary") |
| REQ-1.3 | Add component/integration tests for the v3 wizard covering: equipment-category selection, country selection, ZIP entry → freight estimate render, email-gate submission. Target ≥3 happy-path tests + ≥2 edge cases. | CONCERNS.md MEDIUM ("No component or e2e tests for the v3 wizard") |
| REQ-1.4 | Audit and patch the 2 Dependabot moderate vulnerabilities flagged on `main`. Pin transitive dependencies if root-level patch unavailable; document any unpatchable advisories with mitigation rationale. | GitHub Dependabot alerts surfaced on PR #107 push |

## Should-Have (v1.1, can slip to v1.2)

| REQ ID | Requirement | Source |
|---|---|---|
| REQ-1.5 | Replace 3 `useRef<any>` cases with minimal interfaces for `react-globe.gl` and `motion`'s `MarginType`. | CONCERNS.md MEDIUM ("ESLint config disables nothing project-wide, but 4 inline disables exist") |
| REQ-1.6 | Add server-action tests for `app/actions/calculator-v3.ts` matching the coverage v2 had before deletion. | CONCERNS.md MEDIUM ("No tests for server actions other than the legacy three") |

## Out of Scope (v1.2+)

- Resolving the 5 orphaned ES translation keys with diacritics (CONCERNS.md MEDIUM — needs translator review)
- Audit screenshot/visual-regression hygiene tooling (CONCERNS.md MEDIUM — separate infrastructure investment)
- CSP `'unsafe-inline'` removal (CONCERNS.md LOW — needs broader analytics audit)
- Empty-catch error handling pattern audit (CONCERNS.md LOW — pervasive, separate effort)

## Success Criteria

- v3 wizard file ≤500 lines per module after split
- `react-globe.gl` not in initial JS bundle on `/pricing/calculator` first paint (verified via `npm run build` bundle analyzer or Network tab)
- ≥5 v3 wizard tests passing
- 0 Dependabot moderate vulns on `main` after merge
- All existing tests still pass (≥112 baseline)
- Type-check, lint, build all green
- Production calculator at `meridianexport.com/pricing/calculator` continues to render and submit successfully

## Anti-Goals

- Do NOT redesign the wizard UX. Visual + interaction model stays identical.
- Do NOT change the freight calculation contract or formulas (those are authoritative per CLAUDE.md).
- Do NOT introduce new dependencies (we're pruning, not expanding).
