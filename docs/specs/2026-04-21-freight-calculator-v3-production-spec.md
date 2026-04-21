# Freight Calculator V3 Production Spec

Date: 2026-04-21
Status: Production default
Owner: Meridian Freight website

## Production State

`/pricing/calculator` is the production freight calculator and uses V3:

- Page: `app/[locale]/pricing/calculator/page.tsx`
- UI: `components/freight-calculator-v3/calculator-v3-wizard.tsx`
- Data action: `app/actions/calculator-v3-data.ts`
- Submit action: `app/actions/calculator-v3.ts`
- Engine: `lib/calculator-v3/engine.ts`
- Contracts: `lib/calculator-v3/contracts.ts`
- Policy data: `lib/calculator-v3/policy.ts`
- Route catalog: `lib/calculator-v3/routes.ts`
- Route health: `lib/calculator-v3/route-health.ts`
- Import-cost profiles: `lib/calculator-v3/import-cost.ts` and `lib/calculator-v3/landed-cost-profiles.ts`

Rollback routes:

- `/pricing/calculator-v2` keeps the old V2 calculator available as the operational rollback route.
- `/pricing/calculator-v2` must stay `noindex, nofollow`.
- `/pricing/calculator-v3` remains a noindex preview/debug route for the V3 surface.

The public default calculator must remain indexed with canonical URL `https://meridianexport.com/pricing/calculator`.

## Product Contract

V3 is an instant freight-to-destination-port estimate. It may show compliance prep and import-cost context, but those are separate from the freight total.

The customer-facing model has three buckets:

1. Estimated freight to destination shown
2. Compliance prep
3. Indicative import-cost estimate

The headline amount is always freight only.

## Freight Formula

The invariant is:

```text
freightTotal =
  included U.S. inland transport
  + packing and loading
  + ocean or sea freight
```

No compliance prep, treatment, wash, fumigation, import duty, VAT, broker fee, destination handling, or post-port inland delivery may enter `freightTotal`.

### Inland Transport

When a U.S. pickup ZIP is provided:

- 40HC routes calculate inland transport from pickup ZIP to Albion, IA.
- Flatrack routes calculate inland transport from pickup ZIP to the selected U.S. origin port.
- Distance uses the existing V2 ZIP/road-mile estimate path.
- V3 uses `STANDARD_INLAND_DELIVERY_RATE` from `lib/freight-policy.ts`.

When pickup ZIP is missing:

- `usInlandTransport` is `null`.
- `totalExcludesInland` is `true`.
- The estimate can still show the supported route and sea/ocean portion, but the UI must clearly mark inland as excluded.

### 40HC

40HC routes:

- Must originate from Chicago, IL in the normalized route catalog.
- Use live Supabase `ocean_freight_rates` rows only after route normalization.
- Customer-facing line items are U.S. inland transport, packing/loading, and ocean freight.
- Packing/loading is separate and visible.
- Non-Chicago 40HC rows are quarantined as unsupported direct 40HC rows.

### Flatrack

Flatrack routes:

- Use the selected U.S. origin port.
- Customer-facing packing/loading is 0 because port loading is bundled into sea freight.
- The public freight line is `Sea freight and loading`.
- Internal flatrack bundle and insurance calculations may affect freight, but internal component names must not be exposed to the public UI.

## Route Catalog

The UI must never render raw Supabase route strings directly.

`buildRouteCatalog()` must normalize ocean rows into `RouteOption` records and quarantine rows with:

- missing country
- missing cost
- missing transit
- unknown origin
- unknown destination
- impossible origin
- unsupported direct 40HC
- invalid container type

Route sorting:

- Default sort is cheapest eligible route.
- Fastest sort uses known transit times.
- If fastest cannot be supported, the system falls back safely rather than inventing transit data.

Transit time must come from:

1. Supabase `transit_time_days`, or
2. an explicit reviewed fallback in `lib/calculator-v3/route-transit-fallbacks.ts`.

Rows with neither source are not eligible for automatic customer quotes.

## Compliance Prep

Compliance prep is a separate estimate/status section.

Country policy lives in `COMPLIANCE_POLICIES` in `lib/calculator-v3/policy.ts`.

Public pricing rule:

- Show a dollar amount only when `amountStatus` is `priced`, `publicAmount` is `true`, and `amountUsd` is present.
- Otherwise show quote/broker confirmation language.
- Compliance lines must always have `includedInFreight: false`.

Current country stance:

| Country | Public behavior |
| --- | --- |
| Argentina | Clean used machinery is required; AFIDI/broker/importer confirms treatment case by case. |
| Chile | SAG requirements apply; broker/SAG confirms treatment case by case. |
| Uruguay | Cleaning/wash is required; DGSA may require treatment after inspection. |
| Paraguay | No automatic charge is added; broker/importer confirmation is required. |
| Bolivia | Broker/importer confirmation is required; no automatic used-machinery-specific treatment profile is confirmed. |

Unknown countries must not be treated as free or not required. They show conservative broker-confirmation language.

## Import-Cost Estimate

Import costs are indicative only and separate from freight.

Numeric public output requires an active vetted landed-cost profile with:

- country
- equipment class
- shipping mode
- source label
- source URL or approved internal source reference
- retrieved or reviewed date
- confidence
- active status
- rules hash/source version

If those fields are missing, or no matching profile exists, public output must be `unsupported` or `partial` with no guessed numeric customs amount.

Unsupported import-cost profiles do not block the freight quote.

## Lead And Analytics Contract

Calculator V3 lead submissions must include structured metadata for operations:

- calculator version
- rate-book signature
- policy version
- equipment profile and mode
- route ID
- origin and destination labels
- transit range
- freight line items
- compliance status and amount status
- import-cost status
- warnings
- preferred contact
- source page and attribution

Analytics and CAPI payloads must stay PII-free except where the existing Lead event explicitly hashes contact fields for CAPI matching.

## Public Copy Rules

Do not expose internal/system language in the customer UI, including:

- raw route IDs
- hashes or policy signatures
- `source on file`
- DB row IDs
- quarantine reasons
- internal bundle names
- implementation versions

Use customer-facing language:

- `Final pricing is confirmed by Meridian before booking.`
- `Broker/importer confirmation required.`
- `Not calculated online for this selection.`
- `Enter a U.S. pickup ZIP to include inland transport.`

## Quality Gates

Before shipping calculator changes:

```bash
npm run type-check
npm run lint
npm test
npm run build
npm run audit:calculator-v3
```

Browser QA must cover:

- `/pricing/calculator`
- `/es/pricing/calculator`
- `/ru/pricing/calculator`
- `/pricing/calculator-v2`
- `/pricing/calculator-v3`

Scenario QA must include:

- Argentina combine whole and container
- Chile cheapest/fastest and destination ports
- Uruguay compliance note
- Paraguay broker confirmation with no automatic charge
- Bolivia broker confirmation
- Kazakhstan reference case
- Header quantity 1 and 4
- Unsupported import-cost profile
- Missing ZIP
- No route/manual quote path

## Launch Verification Snapshot

Launch verification completed on 2026-04-20:

- `npm run type-check` passed.
- `npm run lint` passed.
- `npm test` passed with 148 tests.
- `npm run build` passed.
- `npm run audit:calculator-v3` passed.
- Route health reported 115 eligible routes, 100% transit coverage, and 0 critical issues.
- Production browser smoke passed on desktop and mobile for `/pricing/calculator`.
- Default route was indexed with canonical `https://meridianexport.com/pricing/calculator`.
- V2 rollback route was live and noindexed.
- No public internal strings, console errors, page errors, or layout overflow were found in the checked production scenarios.

## Rollback Plan

Use the fastest safe rollback available for the severity:

1. Vercel rollback to the previous known-good production deployment for critical live issues.
2. App-level rollback by switching `app/[locale]/pricing/calculator/page.tsx` back from `CalculatorV3Wizard` to the existing V2 `CalculatorWizard`.
3. Keep `/pricing/calculator-v2` available and noindexed for at least one deploy cycle after V3 launch.
4. Monitor lead submissions, Vercel runtime logs, Sentry, and customer feedback after any calculator release.
