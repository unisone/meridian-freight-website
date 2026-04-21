# Freight Calculator Trust And CEO Feedback Closeout Design

Date: 2026-04-20
Branch: `codex/calculator-trust-closeout`
Status: Implemented and production default
Production spec: `docs/specs/2026-04-21-freight-calculator-v3-production-spec.md`

## Decision

The CEO feedback should not be implemented as a literal feature checklist. It should be used as a product signal: the calculator must feel local-aware, accurate, and trustworthy, while avoiding unsupported promises.

The calculator positioning is:

> Instant freight-to-destination-port estimate, with compliance and import costs shown separately when Meridian has vetted data.

The freight total remains freight only. Compliance prep, customs duties, VAT, broker fees, destination handling, inland delivery after port, and local treatment/wash requirements do not enter the freight total.

Implementation outcome: the closeout shipped without a broad UI redesign. The production calculator route now uses the V3 trust model, keeps the existing production visual structure, keeps the route globe, and preserves V2 at `/pricing/calculator-v2` as the rollback route.

## Product Principles

- Show freight confidently when live route rates support it.
- Show transit only from the rate table or documented fallback evidence.
- Show compliance prep as a separate status, not bundled freight.
- Show numeric customs/import costs only from vetted profiles with source metadata.
- When data is missing, say "not calculated online" or "broker/importer confirmation required"; do not guess.
- Preserve the current production calculator UI structure. No redesign and no equipment-image selector in this phase.
- Keep internal IDs, hashes, raw DB strings, source labels, and policy versions out of the public UI.

## CEO Feedback Treatment

### Keep

- Public equipment choices use business-friendly categories such as "Combines" instead of model-level combine lists.
- Combines, tractors, and sprayers can expose whole-unit and containerized options where a safe freight profile exists.
- Combines in containers are priced as two 40HC containers, with copy explaining the 1 1/3-container footprint and remaining compatible cargo space.
- Headers use shared-container math where four compatible headers fit in one 40HC and show a dedicated-container comparison.
- Destination port/route choice, route cards, cheapest/fastest selection, transit time, and visible origin/destination labels are important.
- Country-specific compliance notes are useful if they are conservative and source-backed.
- Import-cost estimates are useful only when they are clearly separate from freight and source-backed.
- Optional WhatsApp handoff and preferred contact capture should remain.

### Modify

- Argentina, Chile, Uruguay, Paraguay, and Bolivia compliance should be stated as policy/status plus confirmation needs. Numeric wash or fumigation charges are public only when Meridian approves the amount.
- Paraguay should not be represented as "nothing required." The public stance is "no automatic charge is added; broker/importer confirmation required."
- Bolivia should not receive a default wash/fumigation charge. It should remain broker/importer confirmed unless a stronger used-machinery-specific profile is approved.
- Construction, forestry, and other oversized equipment should be manual quote unless the route profile is strong enough for public automatic quoting.

### Reject For This Phase

- Do not add equipment photos to the selector. The current icon-based production layout is cleaner and lower-maintenance.
- Do not bundle compliance, treatment, fumigation, or customs into the headline freight estimate.
- Do not expand numeric customs to unsupported countries.
- Do not rebuild the wizard UI.

## Customer-Facing Model

The estimate card should have three separate conceptual buckets:

1. Freight to destination shown
   - U.S. inland transport when ZIP is provided.
   - Packing/loading when containerized through Albion.
   - Sea freight and loading for flatrack routes.
   - Ocean freight/drayage for 40HC routes.

2. Compliance prep
   - Required, case-by-case, broker-confirmed, quote-confirmed, or not applicable.
   - Public amount only when approved.
   - Otherwise show "broker confirmation required" or "quote confirmation required."

3. Indicative import-cost estimate
   - Complete only when a vetted profile exists and required inputs are present.
   - Partial when a vetted profile exists but required customer inputs are missing.
   - Unsupported when no vetted profile exists.
   - Unsupported never blocks the freight estimate.

## Country Compliance Direction

### Argentina

Show used machinery must be clean and that AFIDI/local broker review determines treatment. Do not automatically price fumigation without an approved Meridian service amount.

Source: SENASA / Argentina.gob.ar.

### Chile

Show SAG used-machinery phytosanitary requirements and broker/SAG confirmation for treatment. Do not automatically price treatment unless approved.

Source: SAG Resolucion 3.103.

### Uruguay

Show wash/cleaning is required and treatment may be required after DGSA inspection. Default public numeric charge stays quote-confirmed.

Source: MGAP DGSA Resolucion 98/016.

### Paraguay

Show no automatic wash/fumigation charge, but do not say "not required." Used agricultural machinery can require cleaning/sanitation, treatment/certification, and inspection. Public copy should say broker/importer confirmation required.

Source: BACN Ley 7565/2025.

### Bolivia

Show broker/importer confirmation required for phytosanitary documentation. No automatic used-machinery-specific wash/fumigation amount is added unless Meridian approves a stronger profile.

Source: Bolivia VUCE/SENASAG import-permit process.

## Data Governance

### Route And Transit Health

Add an internal route-health layer that reports:

- total routes by country and container type,
- missing transit time by country/port/carrier,
- quarantined rows by reason,
- unsupported direct 40HC rows,
- missing cost rows,
- unknown origin/destination rows,
- countries with no eligible automatic route for public equipment choices.

This should be available as a script and covered by tests. It can fail CI for critical conditions, but non-critical drift can be reported as warnings.

### Import-Cost Profiles

Numeric import-cost output requires:

- country,
- landed equipment class,
- shipping mode,
- HS code or explicit profile class,
- source label,
- source URL or approved internal source reference,
- source version or rules hash,
- retrieved/review date,
- confidence,
- reviewer/owner,
- active status.

If those fields are missing, the public output is "not calculated online."

### Lead And Internal Payloads

Lead submissions should preserve structured V3 context for operations:

- calculator version,
- rate-book signature,
- policy version,
- equipment profile and mode,
- route ID,
- origin/destination labels,
- transit range,
- freight line items,
- compliance status,
- import-cost status,
- warnings,
- preferred contact,
- source page and attribution.

If the existing leads table cannot store this cleanly, add a JSON metadata column or a dedicated calculator lead details table.

## UI Direction

Use the current production calculator layout and visual language. The closeout phase should only make minimal changes:

- replace system-ish copy with customer-facing language,
- keep route globe,
- keep icons rather than equipment images,
- ensure Spanish and Russian labels are localized,
- verify metadata/title behavior for unprefixed, Spanish, and Russian routes,
- ensure mobile estimate sheet remains readable.

## Error And Edge Behavior

- No route: show manual quote CTA, not an empty estimate.
- Missing pickup ZIP: show route-only freight and mark U.S. inland as excluded.
- Missing transit: quarantine the rate row from customer automatic quotes; do not show a freight estimate until an approved transit time is present in the rate table or documented fallback evidence.
- Fastest unavailable: fall back to cheapest with a warning.
- Missing customs profile: show "not calculated online"; freight quote still works.
- Missing equipment value where needed: require value only for whole-unit insurance/import-cost cases.
- Stale client rate book: server returns refreshed estimate and asks user to review before submitting.

## Testing And QA Standard

The closeout is complete only when these pass:

- TypeScript, lint, unit tests, and production build.
- Unit tests for route health, compliance policies, import-cost unsupported/partial/complete states, and CEO scenarios.
- Browser QA on desktop and mobile for English, Spanish, and Russian calculator routes.
- Scenario QA:
  - Argentina combine whole and container.
  - Chile multi-port fastest/cheapest.
  - Uruguay wash/treatment note.
  - Paraguay broker confirmation with no automatic charge.
  - Bolivia broker confirmation.
  - Kazakhstan spreadsheet-backed reference case.
  - Header quantity 1 and 4.
  - Unsupported customs profile.
  - Missing transit.
  - Missing ZIP.

## Out Of Scope

- Full calculator redesign.
- Equipment image selector.
- Guaranteed landed-cost quote.
- Numeric customs for every country.
- Automated outbound WhatsApp.
- Freight total that includes compliance, duties, VAT, broker fees, or destination-local charges.
