# Validation Plan: Phase 1 — Wizard Split + Globe Boundary

**Date:** 2026-05-04
**Phase:** 01
**Plan:** 01-01
**Source:** Extracted from `01-RESEARCH.md` § Validation Architecture (lines 547–586) per Nyquist Validation Dimension 8 Check 8e.

---

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` (environment: `node`, no jsdom) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |
| Type-check command | `npm run type-check` |
| Lint command | `npm run lint` |
| Build command | `npm run build` |

## Phase Requirements → Validation Map

| Req ID | Behavior | Validation Type | Automated Command | Coverage Source |
|--------|----------|-----------------|-------------------|-----------------|
| REQ-01 | All existing tests still pass after split | regression | `npm test` | Existing 13-file / 112-test suite (`lib/__tests__/`, `app/actions/__tests__/`) |
| REQ-01 | Type-check passes with new types | type | `npm run type-check` | `tsc --noEmit` against new wizard module structure |
| REQ-01 | Lint passes (no new `any`, no barrel imports) | lint | `npm run lint` | ESLint config + project rules |
| REQ-01 | Build succeeds with new file structure | build | `npm run build` | Next.js production build |
| REQ-01 | `wizard-reducer` cascade-reset behavior is correct | unit | `npm test components/freight-calculator-v3/wizard/state.test.ts` | New test file added in Task 2 |
| REQ-02 | `react-globe.gl` absent from initial calculator chunk | bundle | Automated chunk inspection (see below) | New verification command in Task 9 |
| REQ-02 | Globe renders correctly after dynamic load | smoke | Local browser test on `npm run start` + production preview | Task 10 human gate |
| REQ-02 | Wizard funnel still submits end-to-end | functional | Browser-verify equipment → country → ZIP → email → estimate | Task 10 human gate |

## Bundle Separation Check (REQ-02 Core Gate)

**Why automated:** REQ-02 is the bundle-bloat fix. Manual inspection of `.next/build-manifest.json` is insufficient — it requires the executor to remember to look. The plan-checker flagged this as a warning. Phase 1 must enforce machine-verification.

**Approach:**

1. After `npm run build`, read `.next/build-manifest.json` to find the JS chunks for the calculator route (`/[locale]/pricing/calculator`).
2. For each initial-chunk filename listed for that route, grep its content for `react-globe`.
3. Fail if any initial chunk contains `react-globe`. Pass if `react-globe` only appears in async chunks.

**Reference command (executor will inline this in Task 9):**

```bash
node -e '
  const fs = require("fs");
  const path = require("path");
  const manifest = JSON.parse(fs.readFileSync(".next/build-manifest.json", "utf8"));
  const route = manifest.pages["/[locale]/pricing/calculator"] || manifest.pages["/pricing/calculator"];
  if (!route) { console.error("Calculator route not found in build manifest"); process.exit(2); }
  const offending = route.filter(f => {
    try { return fs.readFileSync(path.join(".next", f), "utf8").includes("react-globe"); }
    catch { return false; }
  });
  if (offending.length) {
    console.error("react-globe found in initial chunk(s) for /pricing/calculator:");
    offending.forEach(f => console.error("  " + f));
    process.exit(1);
  }
  console.log("OK: react-globe excluded from initial chunks");
'
```

**Pass criterion:** exit code 0, output `OK: react-globe excluded from initial chunks`.
**Fail criterion:** exit code 1 with the offending chunk filenames listed.

## Sampling Rate

| Frequency | Validation |
|---|---|
| Per task commit | `npm run type-check && npm run lint` |
| Per wave merge | `npm test && npm run build` |
| Phase gate (before PR ship) | Full chain: `npm run type-check && npm run lint && npm test && npm run build && bundle-separation-check` + manual browser smoke test of calculator funnel |
| Production gate (after merge) | Browser-verify `meridianexport.com/pricing/calculator` + `/pricing/calculator-v2` 308 redirect (already covered by PR #107) |

## Wave 0 Test File Gaps

| Wave | Required New Test Files | Status |
|------|------------------------|--------|
| 0 | `components/freight-calculator-v3/wizard/state.test.ts` (reducer pure-function tests) | Created in Task 2 |
| 0 | None for REQ-02 | RTL + jsdom is Phase 2 (REQ-03) |

## Out of Scope for This Validation Plan

- **Component-level tests** (RTL + jsdom) — Phase 2 (REQ-03)
- **Server-action tests** for `submitCalculatorV3` — Phase 2 (REQ-06)
- **End-to-end browser tests** (Playwright) — out of scope for v1.1 entirely; existing Playwright infra in `output/playwright/` is exploratory, not committed to CI

## Risk: What Validation Cannot Catch

The existing `npm test` suite tests pure-TS engine logic (`lib/calculator-v3/`, `app/actions/`). It does NOT exercise the wizard's React state machine. After the split:

- A subtle reducer bug (e.g., cascade-reset firing in wrong order) might pass `tsc` + `npm test` + `npm run build` but break the funnel UX.
- Mitigation: Task 2 unit tests for the reducer + Task 10 mandatory human browser-verify gate before PR ship.

## Pass/Fail Decision Tree

```
phase passes if all of:
  ✓ npm run type-check exit 0
  ✓ npm run lint exit 0
  ✓ npm test exit 0 (≥112 tests passing — baseline preserved + new reducer tests)
  ✓ npm run build exit 0
  ✓ bundle-separation-check exit 0
  ✓ wc -l on every wizard/* file ≤ 500
  ✓ wc -l on calculator-v3-wizard.tsx ≤ 500
  ✓ Task 10 human verify checkpoint signed "ship it"
otherwise fail with specific failing gate
```
