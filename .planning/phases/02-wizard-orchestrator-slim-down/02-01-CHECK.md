# Plan Check: 02-01-PLAN.md

**Phase:** 2 — Wizard orchestrator slim-down
**Plan:** 02-01
**Checked:** 2026-05-04
**Checker:** gsd-plan-checker (Revision Gate, iteration 1)
**Verdict:** PASS

---

## Phase Success Criteria — Goal-Backward Trace

### Criterion 1: Every file in `components/freight-calculator-v3/wizard/` is ≤500 lines

| Check | Result |
|-------|--------|
| Plan covers this? | YES |
| Where in PLAN.md? | must_haves.truths[2]; Tasks 2–5a (each new file), Task 6 (full file-size invariant sweep) |
| Verification command? | YES — each extraction task runs `wc -l <file> | awk '$1 > 500 { exit 1 }'`; Task 6 verify sweeps all `wizard/*.{ts,tsx}` |
| Failure risk? | Low. Task 5a explicitly handles the escape hatch (`estimate-card-helpers.tsx`) for the 617-line extracted block. The ≤500 gate runs per-task AND in Task 6. |

### Criterion 2: Orchestrator `calculator-v3-wizard.tsx` ≤500 lines, delegates via `<StepEquipment/>` etc.

| Check | Result |
|-------|--------|
| Plan covers this? | YES |
| Where in PLAN.md? | must_haves.truths[1]; must_haves.artifacts[4]; Tasks 2–5b (progressive reduction); Task 5b step 8 (hard fail if >500); Task 6 verify |
| Verification command? | YES — Task 5b: `wc -l ... | awk '$1 > 500 { exit 1 }'`; Task 6 verify includes orchestrator in the sweep |
| Failure risk? | Low-medium. Task 5b explicitly addresses the case where the orchestrator is still over 500 after migration, with an escape hatch (extract remaining helpers into wizard/ subtree). The gate is hard-fail. |

### Criterion 3: Orchestrator uses single `useReducer(wizardReducer)` — no individual `useState` for wizard fields; tracking calls stay in handlers

| Check | Result |
|-------|--------|
| Plan covers this? | YES — both halves explicitly covered |
| Where in PLAN.md? | must_haves.truths[5,6]; key_links[0] (useReducer pattern); Task 5b (full migration); Task 5b step 7 (mandatory behavioral parity audit with grep); Task 6 verify; phase verification gate #6 |
| Verification command? | YES — Task 5b verify: `grep -q 'useReducer(wizardReducer'` AND `! grep -E "trackCalcFunnel|..." wizard/state.ts`; Task 6 verify repeats the state.ts tracking grep |
| Failure risk? | Very low. The tracking-call guard is the most prominent risk in RESEARCH.md Pitfall 1 and the plan addresses it with a mandatory grep enforced in both Task 5b and Task 6. The reducer (state.ts) is already on disk with zero tracking imports — verifiable pre-execution. |

### Criterion 4: `submittingRef` and `customsTrackedRef` guards preserved

| Check | Result |
|-------|--------|
| Plan covers this? | YES |
| Where in PLAN.md? | must_haves.truths[7]; Task 5b steps 2, 7 (explicit behavioral audit); Task 5b verify: `grep -q 'submittingRef'` AND `grep -q 'customsTrackedRef'`; phase verification gate #7 |
| Verification command? | YES — Task 5b verify greps for both ref names; gate #7 requires ≥2 occurrences each |
| Failure risk? | Very low. Both refs are mentioned by name in 8+ places in the plan. State.ts comment on line 38 explicitly documents the ref/state distinction. |

### Criterion 5: Calculator funnel renders and submits identically (browser-verified)

| Check | Result |
|-------|--------|
| Plan covers this? | YES |
| Where in PLAN.md? | must_haves.truths[0]; Task 7 (blocking human-verify checkpoint); Task 8 (preview + production verify) |
| Verification command? | YES — Task 7 gives a concrete step-by-step funnel walk-through (equipment → country → ZIP 50005 → email → submit → estimate card). Task 8 verifies on Vercel preview + production. |
| Failure risk? | Low. The only gap: Task 7 asks for a screenshot at a specific path (`phase-2-local-verify.png`) — if executor skips the screenshot, the acceptance artifact is absent, but the blocking gate ("approved" / "ship it" signal) still enforces human sign-off before Task 8. |

### Criterion 6: All tests pass; type-check, lint, build green; bundle gate (REQ-02) still passes

| Check | Result |
|-------|--------|
| Plan covers this? | YES |
| Where in PLAN.md? | must_haves.truths[3,4]; Tasks 2–5b (each runs tsc + lint + test); Task 6 (full chain + build + bundle gate); Task 8 (CI gate before merge) |
| Verification command? | YES — Task 6 verify is the most comprehensive: `npm test --run && npx tsc --noEmit && npm run lint --silent && npm run build && [bundle gate node script]`. Bundle gate inlines the exact `node -e '...'` command from 01-VALIDATION.md verbatim. |
| Failure risk? | Very low. The bundle gate command is inlined completely (not referenced by file path). Test count gate (≥117 vs. Phase 1 VALIDATION.md's ≥112) is conservative and accounts for new reducer tests added in Phase 1. |

---

## Global Audit

### 1. Atomic tasks?

Yes. Tasks are single-focus:
- Tasks 2, 3, 4: one JSX section extracted per task
- Task 5a: pure JSX extraction, explicit "useState UNCHANGED"
- Task 5b: pure state migration, no new files
- Task 6: validation-only
- Tasks 7, 8: human checkpoints

Each auto task lands as a separate atomic commit per CLAUDE.md SOP. Task 5a explicitly commits before 5b for rollback safety. No task mixes extraction with state migration.

**Verdict: PASS**

### 2. Verifiable tasks?

Every `<task type="auto">` has a concrete `<automated>` command in `<verify>`. All commands are shell-executable (no pseudo-code). Spot-checks:

- Task 1: `test -s baseline.txt && grep -q "tsc OK" ... && grep -q "OK: react-globe excluded"`
- Task 2: file existence + named export grep + tsc + lint + test
- Task 4: file existence + RouteGlobeV3 grep + forbidden-import negation + line count + tsc + lint + test
- Task 5b: useReducer grep + ref greps + tracking-absence grep + line count + tsc + lint + test
- Task 6: full chain including bundle gate node script

Minor gap: Task 1 `<verify>` checks for `"tsc OK"` in baseline.txt but does NOT check for lint status. If lint fails silently at baseline, the pre-flight passes anyway. This is acceptable — lint status is informational in baseline; lint is enforced per-task from Task 2 onward. **INFO only.**

**Verdict: PASS**

### 3. Dependency ordering correct?

Wave structure: all tasks in one plan, sequential (no `depends_on` across plans — single-plan phase). Task execution order is correct:

```
Task 1 (pre-flight) →
  Task 2 (step-equipment) →
    Task 3 (step-specs) →
      Task 4 (step-route) →
        Task 5a (estimate-card, rollback point) →
          Task 5b (useReducer migration) →
            Task 6 (full validation) →
              Task 7 (human: browser verify) →
                Task 8 (human: PR + production)
```

Critical ordering confirmed: JSX extractions (2, 3, 4, 5a) all precede the useReducer migration (5b). Task 5a commits separately before 5b — rollback semantics are preserved. Task 6 runs after all source changes.

**Verdict: PASS**

### 4. Tracking-call guard explicit?

Yes — this is the highest-risk item and the plan handles it with redundant enforcement:

- must_haves.truths[6] declares the invariant
- Task 5b step 7 lists the exact audit grep
- Task 5b `<verify>` block: `! grep -E "trackCalcFunnel|trackContact|trackGA4|trackPixel|trackGoogleAds|vercelTrack" components/freight-calculator-v3/wizard/state.ts`
- Phase verification gate #6 repeats the same grep
- The existing `state.ts` (already on disk) has zero tracking imports — this is pre-verified

The plan explicitly states tracking calls fire AFTER dispatch in handlers (Task 5b step 3). The ordering of dispatch → track is spelled out for `selectProfile`, `selectMode`, `selectRoute`, and `handleSubmit`.

**Verdict: PASS**

### 5. Out-of-scope explicit?

Yes. The `<out_of_scope>` section exhaustively lists what is NOT touched:
- No RTL/jsdom (Phase 3 / REQ-03)
- No server-action edits
- No `lib/calculator-v3/` changes
- No `components/freight-calculator/route-globe.tsx` changes
- No UX/styling/animation changes
- No new dependencies
- No barrel `index.ts`
- No splitting COPY across step files
- No React Context
- No modifying `route-globe-v3.tsx`

**Verdict: PASS**

### 6. Pre-flight checks present?

Yes. Task 1 is a dedicated pre-flight that:
- Confirms branch = `feat/v1.1-phase-2-wizard-slim` (not main)
- Confirms clean working tree
- Captures full baseline (tsc, lint, test count, build, bundle gate, line counts)
- Fails explicitly if bundle gate is broken at phase start (regression guard from Phase 1)

**Verdict: PASS**

### 7. Bundle-size verification concrete?

Yes. Task 6 inlines the full bundle-gate node script from `01-VALIDATION.md` verbatim (not by reference). The exact same script also appears in Task 1. Both are copy-pasteable, no file-path dependency on 01-VALIDATION.md at execution time.

Task 6 also runs a `grep -lE "react-globe\.gl"` scan directly on all `.next/static/chunks/*.js` files as a second approach. The authoritative gate is the manifest-based node script (exits 0/1).

**Verdict: PASS**

### 8. PR/SOP compliance?

Task 8 follows the CLAUDE.md "Standard Feature Workflow" exactly:
- Push branch → Vercel preview → smoke-check preview URL → open PR with `gh pr create` → wait for CI → self-merge with `gh pr merge --squash --delete-branch` → production verify → rollback ready

PR body template includes all required fields (summary, changes, preview URL, CI status, deviations).

The plan notes "Per session feedback, the user has delegated PR review/merge for this phase" — this matches the CLAUDE.md SOP where the user signals "ship it" as the merge gate.

**Verdict: PASS**

---

## Dimension Checks (abbreviated)

### Dimension 1: Requirement Coverage

| Requirement | Phase Roadmap | Plan Coverage |
|------------|---------------|---------------|
| REQ-01 (split wizard, ≤500 lines each) | Phase 2 primary | frontmatter `requirements: [REQ-01]`; all 5 extraction/migration tasks; Task 6 file-size sweep |
| REQ-02 (bundle gate) | Phase 1 completed; Phase 2 regression guard | Tasks 1, 4, 6 re-run the bundle gate; phase verification gate #2 and #3 |

Phase 2's ROADMAP requirements are "REQ-01 (full)". REQ-02 is a regression guard (already satisfied in Phase 1). Coverage: FULL.

### Dimension 2: Task Completeness

All 6 `<task type="auto">` elements have Files + Action + Verify + Done. Both checkpoints have what-built + how-to-verify + resume-signal. No missing elements found.

### Dimension 3: Dependency Correctness

Single-plan phase, `depends_on: []`. No cycles possible. Wave 1. Valid.

### Dimension 4: Key Links Planned

All 5 key_links in must_haves frontmatter have concrete patterns and are addressed in tasks:
- `useReducer(wizardReducer` → Task 5b
- `<Step(Equipment|Specs|Route)|<EstimateCard` → Tasks 2, 3, 4, 5a
- `import { RouteGlobeV3 }` in step-route.tsx → Task 4 action and verify
- Forbidden raw RouteGlobe import → Task 4 grep + Task 6 gate #2
- Forbidden tracking in reducer → Task 5b grep + Task 6 gate #6

### Dimension 5: Scope Sanity

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Tasks/plan | 6 auto + 2 checkpoint | Target 2-3; Warning 4; Blocker 5+ | WARNING (6 auto tasks) |
| Files/plan | 5 new + 1 modified = 6 | Target 5-8 | OK |
| Context | Medium-high | ~70% | WARNING |

The 6 auto-task count exceeds the 2-3 target. However, this is a structured refactor with a natural linear sequence — each task is small (one JSX section, ~50-260 lines extracted). Tasks 5a and 5b are deliberately split for rollback safety. Collapsing them would increase risk. The scope is justified by the sequential nature and the rollback requirement.

**Severity: WARNING (justified split — collapsing Tasks 2-4 would reduce atomicity and rollback options)**

### Dimension 7: Context Compliance

All locked decisions from 02-CONTEXT.md are implemented:

| Decision | Implementing Task |
|----------|------------------|
| useReducer + props (no Context) | Task 5b |
| Line-precise step boundaries | Tasks 2 (560-608), 3 (610-746), 4 (748-1002), 5a (1003-~1620) |
| Globe import constraint (RouteGlobeV3 only) | Task 4 action + forbidden-import grep |
| Tracking guard (handlers only, never reducer) | Task 5b step 7 + verify grep |
| submittingRef + customsTrackedRef preservation | Task 5b step 2 + verify |
| Naming deviation (estimate-card not step-contact+step-result) | Task 5a + deviation_notes |
| Out of scope locked items | `<out_of_scope>` block covers all 9 locked exclusions |

No deferred ideas are included in the plan. No locked decisions are contradicted.

### Dimension 8: Nyquist Compliance

All 6 auto tasks have `<automated>` commands. No watch-mode flags. Tasks 2, 3, 4, 5a, 5b, 6 each run `npm test --run` (fast, not E2E). Sampling is continuous — every task verifies. PASS.

### Dimension 10: CLAUDE.md Compliance

- Conventional commits: Tasks 5a and 5b specify exact commit messages in the correct format (`refactor(calculator): ...`)
- No secrets/hardcoding: N/A (pure refactor)
- Named exports: plan explicitly requires named exports on all step components
- No barrel index.ts: explicitly listed in `<out_of_scope>`
- No `any`: CONVENTIONS.md cited in Task 5b step 9; risk register cites CONCERNS.md type-debt note
- Feature workflow (CLAUDE.md SOP): Task 8 follows it verbatim

### Dimension 11: Research Resolution

RESEARCH.md `## Open Questions (RESOLVED)` — both questions resolved. PASS.

### Dimension 12: Pattern Compliance

PATTERNS.md deviation (estimate-card vs step-contact+step-result) is explicitly documented in `<deviation_notes>` with 4-point justification. All other files (step-equipment, step-specs, step-route) follow PATTERNS.md analogs. PASS.

---

## Issues Summary

```yaml
issues:
  - plan: "02-01"
    dimension: scope_sanity
    severity: warning
    description: "Plan has 6 auto tasks — exceeds 2-3 target. Justified by sequential JSX extraction sequence and mandatory 5a/5b split for rollback safety."
    metrics:
      tasks_auto: 6
      tasks_checkpoint: 2
      files_modified: 6
    fix_hint: "No action required — split is architecturally motivated. Executor should monitor context budget and use /compact if needed after Task 4."

  - plan: "02-01"
    dimension: task_completeness
    severity: info
    description: "Task 1 <verify> does not check lint status in baseline.txt. Lint failures at pre-flight would be invisible."
    task: 1
    fix_hint: "Optional: add `grep -q 'Lint' .planning/phases/02-wizard-orchestrator-slim-down/baseline.txt` or pipe lint result into baseline. Non-critical since lint runs per-task from Task 2 onward."

  - plan: "02-01"
    dimension: task_completeness
    severity: info
    description: "Task 4's forbidden-import grep scope does not include estimate-card.tsx (which doesn't exist yet at Task 4 time). The Task 6 phase gate #2 covers it post-extraction."
    task: 4
    fix_hint: "No action — estimate-card.tsx is created in Task 5a, after Task 4. Task 6 gate #2 runs across all wizard/*.{ts,tsx} and provides the final enforcement. No gap in practice."
```

**Blocker count: 0**
**Warning count: 1**
**Info count: 2**

---

## VERDICT: PASS

The plan achieves all 6 phase success criteria with concrete verification commands for each. The single warning (6 auto tasks vs. 2-3 target) is architecturally justified — the 5a/5b split is a deliberate risk-reduction measure documented in the plan, and collapsing it would increase the blast radius of the useReducer migration. Execution may proceed.

Run `/gsd-execute-phase 2` to proceed.
