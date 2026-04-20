# Freight Calculator Trust Closeout Implementation Plan

Date: 2026-04-20
Design: `docs/plans/2026-04-20-calculator-trust-closeout-design.md`
Branch: `codex/calculator-trust-closeout`

## Goal

Close the CEO feedback loop without rebuilding the calculator UI. The work should improve trust, source discipline, route/transit quality, compliance language, import-cost governance, and operational visibility.

## Non-Goals

- No visual redesign.
- No equipment image selector.
- No speculative customs expansion.
- No compliance cost bundled into freight.
- No unsupported numeric wash/fumigation/treatment charges.

## Phase 1: Policy Reconciliation

1. Convert the current V3 compliance policy data into a reviewed country matrix.
2. Ensure every country policy has:
   - source URL,
   - source label,
   - effective/review date,
   - public summary,
   - line-level status,
   - public amount permission.
3. Update copy for:
   - Argentina: clean machinery and AFIDI/broker treatment review.
   - Chile: SAG requirements and broker/SAG treatment review.
   - Uruguay: wash/cleaning required; treatment may be required after inspection.
   - Paraguay: no automatic charge; broker/importer confirmation required.
   - Bolivia: broker/importer confirmation required; no automatic used-machinery-specific wash/fumigation profile.
4. Add tests that assert no compliance line mutates `freightTotal`.

## Phase 2: Route And Transit Health

1. Add a V3 route-health module under `lib/calculator-v3/`.
2. Report:
   - route counts by country/container type,
   - transit coverage,
   - missing-transit rows quarantined from customer automatic quotes,
   - quarantine counts by reason,
   - countries with no eligible automatic route,
   - dirty raw port strings that are quarantined.
3. Add a script such as `npm run audit:calculator-v3` to print the report from live Supabase data.
4. Add unit tests for health summaries using fixtures.
5. Do not add new transit fallbacks unless each has evidence; rows with no approved transit time must stay unavailable for automatic quoting.

## Phase 3: Import-Cost Governance

1. Extend the landed/import-cost profile contract to include review metadata:
   - `sourceUrl` or approved internal source reference,
   - `retrievedAt` or `reviewedAt`,
   - `confidence`,
   - `reviewedBy` or owner,
   - active status.
2. Update `calculateImportCostEstimateV3()` so complete public estimates never return `sourceUrl: null` or `retrievedAt: null` when a numeric amount is shown.
3. Keep unsupported countries as `unsupported` with no amount.
4. Keep partial profiles as `partial` when equipment value or freight inputs are missing.
5. Move static Kazakhstan profiles toward versioned seed data or Supabase-backed profiles if schema support exists; otherwise add explicit review metadata to the static profiles as an interim step.

## Phase 4: Equipment Scope Cleanup

1. Review public equipment profiles against the approved scope.
2. Keep:
   - combines: whole and container where routes exist,
   - tractors: container and whole where safe,
   - sprayers: whole and container where safe,
   - headers: shared container and dedicated comparison,
   - planters/seeders/tillage/balers: container-first where profiled.
3. Change construction/forestry/oversized equipment to manual quote unless a reliable automatic profile exists.
4. Add tests that public equipment choices have supported labels, modes, and safe route behavior.

## Phase 5: Public Copy And Localization

1. Audit all V3 public copy for internal/system language.
2. Replace with customer-facing wording:
   - "Estimated freight to destination shown."
   - "Final pricing is confirmed by Meridian before booking."
   - "Broker/importer confirmation required."
   - "Not calculated online for this selection."
3. Verify Spanish and Russian strings for the same behavior.
4. Verify route metadata/title behavior for:
   - `/pricing/calculator`,
   - `/es/pricing/calculator`,
   - `/ru/pricing/calculator`,
   - `/pricing/calculator-v3` noindex preview,
   - `/pricing/calculator-v2` noindex rollback.

## Phase 6: Lead And Analytics Payloads

1. Check whether the existing `leads` table can store structured calculator metadata.
2. If not, add a JSON metadata field or a dedicated calculator lead details table.
3. Persist:
   - calculator version,
   - equipment profile/mode,
   - route ID,
   - origin/destination labels,
   - transit range,
   - freight line items,
   - compliance status,
   - import-cost status,
   - rate-book signature,
   - policy version,
   - warnings,
   - preferred contact.
4. Keep analytics events PII-free.

## Phase 7: Verification

Run mandatory local gates:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Run browser QA on desktop and mobile for:

- Argentina combine whole and container.
- Chile multi-port fastest/cheapest.
- Uruguay wash/treatment note.
- Paraguay no automatic charge with broker confirmation.
- Bolivia broker confirmation.
- Kazakhstan reference case.
- Header quantity 1 and 4.
- Unsupported import-cost profile.
- Missing transit.
- Missing ZIP.

## Rollout

1. Develop on a dedicated branch.
2. Open a PR against `main`.
3. Verify Vercel preview with browser automation.
4. Present preview and scenario evidence.
5. Ship only after approval.
6. Verify production calculator routes after merge.

## Ship Criteria

- Freight total is freight only.
- No unsupported customs number is shown.
- No public internal IDs/hashes/source internals are visible.
- Compliance copy is conservative and source-backed.
- Route/transit health report exists.
- Existing production UI structure is preserved.
- All mandatory gates pass.
