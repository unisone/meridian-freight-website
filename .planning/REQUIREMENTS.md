# Requirements

## v1.1 Requirements — Wizard Hardening + Security Audit

### Must-Have

- **[x] REQ-01** — Split `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines) into per-step modules with shared state. Each step (origin/equipment/destination/contact/result) lives in its own file. Source: CONCERNS.md ("calculator-v3-wizard.tsx is 2,030 lines"). **Shipped via PR #110 (Phase 2). Final orchestrator: 497 lines; every wizard/* file ≤500 lines.**
- **[x] REQ-02** — Lift `RouteGlobe` to a sibling component dynamically loaded via `next/dynamic({ssr:false})` from the v3 wizard, so three.js never enters the main client bundle by default. Source: CONCERNS.md ("v3 wizard does not appear to use the same dynamic-loaded globe boundary"). **Shipped via PR #108 (Phase 1); regression-guarded in Phase 2 via forbidden-import grep + bundle gate.**
- **REQ-03** — Add component/integration tests for the v3 wizard covering: equipment-category selection, country selection, ZIP entry → freight estimate render, email-gate submission. Target ≥3 happy-path tests + ≥2 edge cases. Source: CONCERNS.md ("No component or e2e tests for the v3 wizard").
- **REQ-04** — Audit and patch the 2 Dependabot moderate vulnerabilities flagged on `main`. Pin transitive dependencies if root-level patch unavailable; document any unpatchable advisories with mitigation rationale. Source: GitHub Dependabot alerts surfaced on PR #107 push.

### Should-Have (can slip to v1.2)

- **REQ-05** — Replace 3 `useRef<any>` cases with minimal interfaces for `react-globe.gl` and `motion`'s `MarginType`. Source: CONCERNS.md ("ESLint config disables nothing project-wide, but 4 inline disables exist").
- **REQ-06** — Add server-action tests for `app/actions/calculator-v3.ts` matching the coverage v2 had before deletion. Source: CONCERNS.md ("No tests for server actions other than the legacy three").

### Out of Scope (v1.2+)

- Resolving the 5 orphaned ES translation keys with diacritics (CONCERNS.md MEDIUM — needs translator review)
- Audit screenshot/visual-regression hygiene tooling (CONCERNS.md MEDIUM — separate infrastructure investment)
- CSP `'unsafe-inline'` removal (CONCERNS.md LOW — needs broader analytics audit)
- Empty-catch error handling pattern audit (CONCERNS.md LOW — pervasive, separate effort)

## v1.0 Requirements — Cleanup (SHIPPED via PR #107)

<details>
<summary>Completed in PR #107: codebase map, v1+v2 calculator decommission, PII guard</summary>

- Generate `.planning/codebase/` map (7 docs)
- Delete v1 freight-engine (dead code)
- Decouple v3 from v2 (formatDollar, estimateRoadMiles)
- Delete v2 calculator implementation entirely
- 308-redirect legacy `/pricing/calculator-v2` and `/pricing/calculator-v3` → canonical `/pricing/calculator`
- Add `.githooks/pre-commit` PII guard
- Ignore `output/` in gitignore
- Document Next.js 16 `proxy.ts` convention in CLAUDE.md
- Refresh CLAUDE.md calculator section for v3-only engine

</details>
