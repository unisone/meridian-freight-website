# Phase 1a Summary — Wizard Scaffolding + Globe Boundary

**Date:** 2026-05-04
**Phase:** 01a (split from original Phase 01)
**Plan:** 01-01-PLAN.md (Tasks 1–4 of the original 10-task plan)
**Branch:** `feat/v1.1-wizard-split`
**Status:** Ready for PR

## What Shipped

| Task | Outcome | Commit |
|------|---------|--------|
| 1. Pre-flight + baseline capture | Branch verified clean; baselines captured (112 tests / typecheck / lint / build) | `b1fe714 chore(calculator): capture pre-refactor baseline for phase 1` |
| 2. wizard/state.ts (reducer) + types.ts (step props) + reducer tests | `WizardState` interface + `wizardReducer` + 5 cascade-reset tests; full step prop contracts in `types.ts` | `3a64611 test(calculator): add wizardReducer + step prop types with cascade-reset tests` |
| 3. wizard/copy.ts (COPY dict + helpers) | Lines 74–490 of original wizard extracted as a typed module; orchestrator imports from `./wizard/copy` | `081cf6d refactor(calculator): extract COPY dict + helpers to wizard/copy.ts` |
| 4. route-globe-v3.tsx (lazy boundary) | New thin wrapper using `dynamic(() => import(...).then(m => ({ default: m.RouteGlobe })), { ssr: false })` at module level. Wizard imports from `./route-globe-v3`. | `7919dca perf(calculator): lift RouteGlobe to dynamic boundary (REQ-02)` |

## REQ-02 Bundle Gate: ✅ PASS

```
rootMainFiles (initial bundle on every page): 818.9 KB total
- 0gr8up0ddz39g.js: 16.9 KB
- 0.shi4ni0udmi.js: 33.0 KB
- 0kdgc9wy9gi~l.js: 530.6 KB (Next.js + React runtime)
- 0-2qoeinlri8u.js: 171.9 KB
- 0~xy5mg1e6074.js: 55.8 KB
- turbopack-08b3bj-rnc5la.js: 10.7 KB

NONE of these contain three.js / WebGLRenderer / globe.gl signatures.

three.js library: 1582.8 KB → separate async chunk (06_sk3k-6k40a.js)
WebGLRenderer: 313.7 KB → separate async chunk (0v9vc-5lhi43-.js)

Verdict: react-globe.gl + three.js are excluded from initial paint on
/pricing/calculator. They only load when the route step mounts the globe.
```

## REQ-01: PARTIAL

The original Phase 1 success criteria included "orchestrator ≤500 lines" — not yet met. The orchestrator is currently **1,621 lines** (down from 2,030 thanks to the COPY extraction). The remaining slim-down (step component extractions + `useState`→`useReducer` migration) is sequenced as **Phase 1b**.

This split was a deliberate decision: the plan-checker had flagged the original 9-task plan as a WARNING for scope sanity. Splitting Phase 1 into 1a + 1b matches the plan-checker's recommendation and senior-engineering practice (smaller, atomic, reviewable PRs over one mega-PR with mixed risk profiles).

## Verification Chain

| Gate | Result |
|------|--------|
| `npm run type-check` | ✅ clean |
| `npm run lint` | ✅ 0 errors, 2 pre-existing warnings (unrelated) |
| `npm test` | ✅ 12 files / 117 tests pass (was 11/112 — added 5 reducer tests) |
| `npm run build` | ✅ full route tree, all 3 locales |
| Bundle separation gate | ✅ react-globe / three.js excluded from rootMainFiles |
| Forbidden-import scan (no direct RouteGlobe in v3 territory) | ✅ zero |

## What's Now Tractable That Wasn't Before

- **Phase 1b** — extracting step components is now a mechanical exercise: `wizard/types.ts` has all the prop interfaces; `wizard/state.ts` has the reducer ready to wire
- **Phase 2 (component tests)** — the `wizardReducer` is already test-coverable (5 tests added). Component tests for the step files (after Phase 1b extracts them) will plug into the existing test infrastructure
- **Future Lighthouse perf wins** — the globe-boundary fix is the largest single bundle-size improvement available on the site. Lighthouse scores on `/pricing/calculator` should reflect this on the next audit

## Files Created in Phase 1a

```
.planning/phases/01-wizard-split-globe-boundary/
├── 01-RESEARCH.md       (researcher artifact, 710 lines)
├── 01-PATTERNS.md       (mapper artifact, 499 lines)
├── 01-VALIDATION.md     (Nyquist validation map, 112 lines)
├── 01-01-PLAN.md        (planner artifact, 833 lines)
├── 01-01-CHECK.md       (plan-checker iter 2: PASS, 129 lines)
└── SUMMARY.md           (this file)

components/freight-calculator-v3/
├── route-globe-v3.tsx                          (NEW — 38 lines, dynamic boundary)
├── wizard/
│   ├── state.ts                                (NEW — reducer + WizardState type, 165 lines)
│   ├── types.ts                                (NEW — step prop interfaces, 105 lines)
│   ├── copy.ts                                 (NEW — extracted COPY dict + helpers, 472 lines)
│   └── __tests__/
│       └── state.test.ts                       (NEW — 5 reducer tests)
└── calculator-v3-wizard.tsx                    (MODIFIED — 2,030 → 1,621 lines)
```

## Phase 1b Handoff Notes

Phase 1b should:

1. Extract Section 1 (lines 560–608 of current orchestrator) → `wizard/step-equipment.tsx` using `StepEquipmentProps` from `types.ts`
2. Extract Section 2 (lines 610–746) → `wizard/step-specs.tsx` using `StepSpecsProps`
3. Extract Section 3 (lines 748–1002) → `wizard/step-route.tsx` using `StepRouteProps`. This file imports `RouteGlobeV3` from the parent dir.
4. Extract estimate-card UI (lines 1003–~1620) → `wizard/estimate-card.tsx` using `EstimateCardProps`. Note: PATTERNS.md called for split-by-step (`step-contact.tsx` + `step-result.tsx`); the deviation rationale is in 01-01-PLAN.md `<deviation_notes>`.
5. Migrate orchestrator from 18 useState calls to `useReducer(wizardReducer, initialWizardState)`. Wire all event handlers to dispatch reducer actions. **CRITICAL**: keep all `trackCalcFunnel`, `trackContactClick`, `trackGA4Event`, `vercelTrack` calls in event-handler code paths — NEVER inside the reducer body.
6. Preserve the `submittingRef` and `customsTrackedRef` refs — they're orchestrator-level concerns.
7. Verify orchestrator ≤500 lines, every wizard/* file ≤500 lines.
8. Browser-verify funnel end-to-end on `npm run start` before pushing.
9. Push as `feat/v1.1-wizard-split-1b` and ship via the same SOP.

The plan, research, and patterns docs are already on this branch — Phase 1b doesn't need new planning. It's pure execution against an existing PASS plan.
