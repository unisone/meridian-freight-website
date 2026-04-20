# Freight Calculator V3 Core Design

Date: 2026-04-20
Status: Approved for implementation planning
Scope: Core calculator architecture, rate accuracy, compliance treatment, and edge-case behavior before UI rebuild

## Decision

Rebuild Freight Calculator V3 core in the website as a parallel versioned calculator instead of patching the current V3 implementation.

The calculator must separate three different estimates:

1. Estimated freight to port
2. Compliance prep estimate
3. Import or landed-cost estimate

The headline amount remains estimated freight to port. Compliance prep and import costs may be shown near it, but they must not mutate the freight subtotal.

## Source Of Truth

Use this source hierarchy:

1. Supabase `equipment_packing_rates` and `ocean_freight_rates` for live equipment and ocean freight data.
2. `mf-chatbot-ui/docs/reference/rate-sheet-routing.md` for the canonical freight interpretation rules.
3. `mf-chatbot-ui/openclaw/workspace/mark-freight/TOOLS.md` for quote behavior and customer-facing freight line rules.
4. `mf-chatbot-ui/lib/landed-cost/*` for the import or landed-cost profile/snapshot architecture.
5. Official public country sources for regulatory notes, not service pricing.

The prior `mf-chatbot-ui` landed-cost architecture remains valid, but only for import or landed-cost profiles. It should not replace the freight engine. Freight must continue to follow the Mark rate-sheet routing model: equipment `container_type` determines the rate source and customer-facing line items.

## Core Architecture

### RateBookSnapshot

Fetch raw Supabase rows and produce a validated snapshot with:

- Source timestamps
- Rate-book signature
- Valid equipment profiles
- Valid route catalog
- Quarantined rows with reasons
- Warnings for stale or incomplete data

The UI must not render raw Supabase port strings directly.

### RouteCatalog

Normalize `ocean_freight_rates` into stable route options.

Quarantine rows when:

- `destination_country` is missing
- Required cost fields are missing
- A 40HC route is not from Chicago
- The origin port is impossible or dirty, such as `Savannah, TX`
- The destination cannot be mapped to the target country
- The container type is unsupported for the selected equipment mode

Alias typo values only through an explicit alias table with an audit reason. For example, a `Chili` destination spelling can be normalized only when the country is Chile and the alias is listed in policy data.

### FreightEngine

Calculate estimated freight only.

Invariant:

```text
estimatedFreightTotal =
  inlandTransport
  + packingAndLoading
  + oceanOrSeaFreight
```

Flatrack:

- Inland trucking is dealer to selected U.S. port.
- Public line is `Sea Freight & Loading`.
- `packingAndLoading` is always 0 customer-facing.
- Internal bundle components must not be surfaced to customers.

40HC:

- Inland trucking is dealer to the Iowa packing yard.
- Packing and loading is a separate customer-facing line.
- Ocean freight includes the 40HC route cost from Chicago.

No optional service, compliance prep, import duty, VAT, broker fee, or destination-local cost may be included in `estimatedFreightTotal`.

### CompliancePrepEngine

Calculate a separate compliance prep section.

Each policy line has:

- `status`: `required`, `recommended`, `case_by_case`, `broker_confirm`, or `unknown`
- `serviceType`: wash, cleaning, fumigation, treatment, inspection, certificate, or other
- `amountStatus`: `priced`, `quote_confirmed`, or `not_applicable`
- `amountUsd` only when source-backed and approved for public display
- Official source metadata where applicable
- Customer-facing note

Approved public-pricing rule:

Show dollar amounts only when the source explicitly supports public pricing. Otherwise show `quote-confirmed`. Internal service amounts may still be stored and sent to owner notifications, but they should not be shown publicly unless approved.

### ImportCostEngine

Reuse the `mf-chatbot-ui` landed-cost profile pattern.

The result must be:

- `complete`: active profile exists and required inputs are present
- `partial`: active profile exists, but required inputs are missing
- `unsupported`: no active vetted profile exists

Initial numeric import-cost scope should be narrow. Based on current shared Supabase data, the only confirmed active profile is Argentina combine flatrack. Countries or equipment without a vetted profile must show no numeric customs amount.

## Compliance Country Policy

### Argentina

Used machinery must be clean and free of soil and plant residue. SENASA verifies AFIDI requirements and corresponding phytosanitary treatment.

UI behavior:

- Show cleaning or wash as required compliance prep.
- Show treatment or fumigation as broker-confirmed unless a public-safe price is approved.
- Asterisk: exact treatment and documentation must be confirmed by AFIDI, broker, or importer.

Source: https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de

### Chile

Used machinery is subject to SAG phytosanitary import, temporary admission, and transit requirements. Machinery must be clean and free of soil, plant residue, and regulated pests.

UI behavior:

- Show cleaning or wash as required compliance prep.
- Show fumigation or treatment as broker/SAG-confirmed unless a public-safe price is approved.

Source: https://www.sag.gob.cl/content/establece-requisitos-fitosanitarios-para-la-importacion-admision-temporal-y-transito-de-maquinaria-usada-que-indica-y-deroga-resolucion-ndeg-2979-de-2001

### Uruguay

DGSA Resolution 98/016 requires cleaning, phytosanitary certificate language, treatment in origin, and inspection for used agricultural, forestry, or gardening machinery.

UI behavior:

- Show cleaning or wash as required compliance prep.
- Show treatment as broker-confirmed or priced only when source-backed.
- Warn that failed certification or inspection can trigger rejection, re-export, or additional treatment evaluation.

Source: https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-98016-1

### Paraguay

Law 7565/2025 establishes sanitary and risk-mitigation requirements for used agricultural machinery, including sanitation, cleaning, treatment/certification, and inspection requirements.

UI behavior:

- Show cleaning or sanitation as required compliance prep.
- Show treatment, certificate, and destination inspection as broker/importer-confirmed.
- Do not show numeric service amounts unless Meridian has a vetted public-safe policy.

Source: https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados

### Bolivia

No used-machinery-specific source equivalent to Argentina, Chile, Uruguay, or Paraguay is confirmed for the calculator policy.

UI behavior:

- Do not show default wash or fumigation prices.
- Show broker/importer confirmation required.
- Explain that cleaning, treatment, or phytosanitary documentation may be required.

Reference starting point: https://www.vuce.gob.bo/es/SENASAG_importacion_fitozanitario_requisitos

## Customer Presentation

The estimate screen should have separate sections:

1. Estimated freight to port
2. Selected route and transit time
3. Freight line items
4. Compliance prep estimate
5. Import-cost estimate
6. Assumptions and next-step handoff

Example summary:

```text
Estimated freight to port: $X
Compliance prep estimate: quote-confirmed
Import-cost estimate: not available for this route yet
```

If compliance prep has public-safe amounts:

```text
Estimated freight to port: $X
Compliance prep estimate: $Y*
Estimated freight + compliance prep: $Z*

* Destination broker/importer must confirm exact sanitary treatment and documentation before shipping.
```

Avoid the word `total` unless it is qualified. Use `Estimated freight`, `Estimated freight + compliance prep`, or `Indicative import-cost estimate`.

## Edge Cases

No route:

- Do not show a fake price.
- Show manual quote CTA.
- Log the equipment, country, mode, and missing route reason.

No pickup ZIP:

- Show partial estimate excluding inland trucking.
- Display inland as `Pickup ZIP required`.
- Explain that inland trucking is estimated at the standard freight policy rate once ZIP is provided.

Dirty or quarantined route:

- Do not show to the customer.
- Include quarantine reason in logs and rate health reports.

No transit time:

- Cheapest route can still be shown.
- Fastest route mode must fall back to cheapest with a warning.

No import-cost profile:

- Show `Import-cost estimate not available yet`.
- Provide manual broker-confirmation CTA.
- Do not infer numbers from generic duty tables.

Low-confidence tariff source:

- Hide numeric import estimates.
- Show source note and broker confirmation.

Landlocked destinations:

- Show port route clearly.
- Explain that inland delivery beyond the port requires broker/importer or manual quote confirmation.

## Tests Required Before UI Work

Unit tests:

- Freight total excludes compliance prep and import costs.
- Flatrack packing is always customer-facing 0.
- 40HC packing is included as a separate line.
- Optional and required compliance lines never mutate freight subtotal.
- Quote-confirmed compliance lines do not show dollar amounts publicly.
- Argentina, Chile, Uruguay, and Paraguay show required compliance prep status.
- Bolivia shows broker-confirmed or unknown status without numeric amount.
- No import-cost profile returns `unsupported`.
- Active landed-cost profile with missing equipment value returns `partial`.
- Dirty routes such as `Savannah, TX` are quarantined.
- Missing country, missing costs, non-Chicago 40HC, and unknown ports are quarantined.
- Fastest route falls back safely when transit data is missing.

Contract tests:

- Policy files validate with Zod.
- Route aliases are explicit and audited.
- All public equipment choices map to valid calculation profiles.
- No customer-facing output exposes raw dirty DB strings.

Server action tests:

- Client estimate is ignored.
- Server refetches rates and recalculates.
- Route and mode tampering are rejected.
- Lead payload includes route ID, policy versions, warnings, and contact preference.

## Implementation Phases

1. Contracts and policy data
2. RateBookSnapshot and RouteCatalog quarantine
3. FreightEngine invariants
4. CompliancePrepEngine
5. ImportCostEngine adapted from `mf-chatbot-ui`
6. Server actions and analytics payloads
7. Preview UI only after engine tests pass
8. Browser QA and production-readiness gates

## Non-Goals

- Do not make V3 the live `/pricing/calculator` route until approved.
- Do not present public customs estimates without active vetted profiles.
- Do not expose internal flatrack bundle components.
- Do not treat official regulatory requirements as Meridian service mandates.
- Do not assume unknown country policies are free or not required.
