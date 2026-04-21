# Kazakhstan Buyer Hub Design

## Decision

Build Option B: a RU-first custom Kazakhstan buyer hub on the existing URL `/ru/destinations/kazakhstan`.

The implementation must branch inside the existing dynamic destination route instead of adding a static `app/[locale]/destinations/kazakhstan/page.tsx`. This preserves the current generic English and Spanish Kazakhstan destination pages while replacing only the Russian buyer experience with a stronger market-specific hub.

## Current-State Inventory

- Route: `app/[locale]/destinations/[slug]/page.tsx` renders all generic destination pages, including Kazakhstan.
- Current Russian page: `/ru/destinations/kazakhstan` returns generic destination copy focused on Aktau, 40-50 days, multimodal routing, generic FAQ, and a broad contact CTA.
- Current metadata source: `content/destinations.ts`, including Russian keywords such as `доставка техники в Казахстан` and `экспорт техники в Казахстан`.
- Current schema: generic `Service` and optional `FAQPage`; schema URL is built from the non-localized destination path in the generic page.
- Current sitemap: `app/sitemap.ts` emits destination pages from English destination content with `en/es/ru` alternates and priority `0.7`.
- Live proof source: `fetchScheduleContainersWithBookingData()` in `lib/supabase-containers.ts` returns browser-safe public schedule DTOs for `/schedule`.
- Verified schedule snapshot on 2026-04-21: the raw public schedule table contained 18 Kazakhstan-coded rows, while the website schedule feed applies its recent-row cutoff and displays the current KZ count dynamically. At verification time it exposed 1 bookable/open-capacity Kazakhstan row with 22.8 CBM available. This is operational proof, but should be displayed as live schedule context, not as fabricated project history.
- Existing first-party public project content contains Kazakhstan examples in `content/projects.ts`. Because this page is a high-trust SEO hub, Phase 1 should prefer live schedule proof and link to the project library instead of re-telling detailed project claims inside the hub.

## Buyer And SEO Strategy

- Primary buyer: Russian-speaking Kazakhstan agricultural buyer, dealer, importer, or intermediary sourcing used U.S. agricultural equipment and needing a practical execution partner.
- Primary search theme: `доставка сельхозтехники из США в Казахстан`.
- Secondary themes: `купить комбайн из США в Казахстан`, `импорт трактора из США в Казахстан`, `доставка жатки из США`, `контейнер из США в Казахстан`, `Актау`, `Костанай`, `Астана`, `Алматы`, `Кокшетау`.
- Buyer stage: mid-to-high intent. The user may already know the machine, listing, auction, or dealer and needs confirmation on scope, route, container fit, cost stack, and timeline.
- Conversion path: WhatsApp first, calculator/schedule second. Kazakhstan buyers often need scope clarification and handoff boundaries, not only a freight number.
- Strategic positioning: Meridian is the execution partner from U.S. seller pickup to export route toward Kazakhstan: pickup, dismantling, packing, loading, export documentation, booking, and schedule coordination.

## Source And Claim Table

| Claim | Evidence | Public-copy decision |
| --- | --- | --- |
| Kazakhstan has real demand for modern agricultural machinery, especially grain equipment, tractors, sprayers, and reapers. | Trade.gov Kazakhstan Agricultural Sector guide notes machinery modernization, regional machinery demand, and U.S. equipment categories. | Use as market context; do not overstate that every U.S. machine is cheaper or better. |
| Machinery renewal is a national priority and the fleet remains large. | KazAgroFinance reported 139,000 tractors and 31,000 combines as of 2025-01-01, with 5.5% renewal in 2024. | Use only in strategy/spec or subdued page context if needed; avoid cluttering buyer copy with government-style stats. |
| Tractors and grain harvesters are priority purchase categories. | KazAgroFinance leasing-market update lists tractors first and grain harvesters second, with North Kazakhstan, Akmola, and Kostanay as demand centers. | Use to prioritize equipment sections: combines, high-hp tractors, headers/drapers, sprayers, and parts. |
| Local John Deere production exists in Kostanay. | Government of Kazakhstan Prime Minister site announced localized John Deere production in Kostanay. | Use as a guardrail: do not claim the U.S. is always the cheaper/default answer. Position U.S. sourcing for specific models, availability, condition, and deal execution. |
| Meridian has Kazakhstan operational activity. | Live public schedule data contains Kazakhstan-coded rows and bookable capacity. | Show a live lane board/card with actual schedule data; avoid claiming all rows are delivered projects. |
| Meridian can complete Kazakhstan customs/tax clearance. | Not verified as a Meridian-controlled service. | Do not claim. Say import customs, duties, VAT, certification, and inland Kazakhstan handoff must be confirmed with the buyer's broker/declarant or quoted separately. |

Primary external sources:

- Trade.gov: https://www.trade.gov/country-commercial-guides/kazakhstan-agricultural-sector
- KazAgroFinance machinery renewal: https://www.kaf.kz/en/media/news/82902/
- KazAgroFinance leasing-market categories: https://www.kaf.kz/en/media/news/83260/
- Kazakhstan Prime Minister John Deere localization: https://primeminister.kz/en/news/localisation-in-machine-building-john-deere-launches-production-of-agricultural-machinery-in-kostanay-29889

## Design Direction

Domain vocabulary:

- Dispatch board
- Container lane
- Grain belt
- Route manifest
- 40HC capacity
- Seller pickup
- Kazakhstan broker handoff

Color world:

- Meridian sky blue for primary actions and proof accents.
- Slate/navy hero for freight control-room tone.
- Wheat/amber for Kazakhstan grain-sector warmth.
- Steel/zinc for machinery and container surfaces.
- Caspian blue for route/lane accents.
- Muted map-paper background for route context.

Signature element:

- A "Kazakhstan lane board" in the hero or proof section using live schedule DTOs, showing real project numbers, origin/destination display, departure/ETA, container type, and open CBM when available.

Template defaults replaced:

- Replace generic country hero with buyer-specific Russian copy.
- Replace generic stats/proof cards with live Kazakhstan schedule context.
- Replace broad "we ship to Kazakhstan" language with explicit scope: what Meridian includes and what remains with the importer/broker.
- Replace generic FAQ with buyer objections around final cost, customs handoff, Aktau/Kazakhstan routing, 40HC/shared capacity, and buying from U.S. sellers.

## Page Structure

1. Dark hero with RU buyer headline, scope summary, WhatsApp CTA, schedule/calculator secondary CTA, and compact live Kazakhstan lane board.
2. "Почему Казахстан требует отдельного подхода" market context: demand exists, but the best U.S. fit is model/condition/availability specific.
3. "Что берет на себя Meridian" vs "Что остается на стороне импортера": clear scope split.
4. "Какая техника чаще всего имеет смысл из США": combines first, then high-hp tractors, headers/drapers, sprayers, and parts.
5. "Живой маршрут в Казахстан": schedule-backed card/list with link to `/ru/schedule?country=KZ`.
6. "Как работает процесс": five steps from machine/listing to Kazakhstan route handoff.
7. FAQ: final cost, customs, route/timing, buying from dealer/auction, shared container capacity, parts/headers.
8. Final CTA: WhatsApp first, calculator second, schedule link optional.

## Copy Rules

- Use professional Russian with direct B2B language and `вы`, not slang.
- Use terms: `сельхозтехника`, `комбайн`, `жатка`, `платформа draper`, `40HC`, `декларант`, `таможенное оформление`, `Актау`, `Костанай`, `Астана`, `Алматы`, `Кокшетау`.
- Do not use unsupported guarantees around customs, duties, VAT, certification, final landed cost, or delivery to farm.
- Do not frame U.S. sourcing as universally cheaper. Use "имеет смысл, когда..." and "нужно сравнить конкретную машину, комплектацию, состояние и логистику".
- Do not fabricate shipment proof. Schedule rows are schedule rows; project examples remain in the existing project gallery unless separately verified.
- Do not mention Russia activity on this page unless compliance and positioning are reviewed separately. Kazakhstan deserves its own focused buyer page.

## Implementation Requirements

- Add a typed content contract, likely `content/kazakhstan-market.ts`.
- Add a server component, likely `components/destinations/kazakhstan-market-page.tsx`.
- In `app/[locale]/destinations/[slug]/page.tsx`, branch on `locale === "ru" && slug === "kazakhstan"` for custom metadata and page rendering.
- Use `fetchScheduleContainersWithBookingData()` and filter `destination_country === "KZ"`; handle null data gracefully.
- Reuse existing Meridian Horizon components: `PageHero`, `TrustBar`, `DarkCta`, shadcn `Card`/`Badge`, `FaqAccordion`, `TrackedContactLink`, and `TrackedCtaLink`.
- Emit `WebPage` or `Service`, `BreadcrumbList`, and `FAQPage` JSON-LD with correct localized URL `/ru/destinations/kazakhstan`.
- Add page-specific CTA locations: `kazakhstan_hero_whatsapp`, `kazakhstan_schedule_whatsapp`, `kazakhstan_final_whatsapp`, `kazakhstan_hero_schedule`, `kazakhstan_final_calculator`.
- Add internal links from the Russian combines and tractors equipment pages via existing related-destination behavior and/or copy, and from sitemap via a special priority for the Kazakhstan destination.

## QA Plan

- Content QA: read rendered Russian page for buyer clarity, no editorial/internal language, no fabricated proof, and no customs/tax guarantees.
- SEO QA: metadata, canonical `/ru/destinations/kazakhstan`, hreflang behavior, sitemap priority, JSON-LD, FAQ schema matching rendered FAQ.
- Design QA: desktop and mobile layout, dark hero contrast, schedule board readability, CTA hierarchy, no new design language.
- Tracking QA: WhatsApp and internal CTAs use tracking helpers with page-specific locations.
- Technical gates: `npm run type-check`, `npm run lint`, `npm run build`.
- Preview QA before user review: page 200, English/Spanish Kazakhstan pages still render, `/ru/schedule?country=KZ` link resolves, no obvious console errors.

## Deferred Work

- Dedicated Kazakh-language version.
- Separate English dealer-facing Kazakhstan article.
- Kazakhstan equipment cluster pages for combines, tractors, headers, and sprayers.
- Customs/tariff calculator for Kazakhstan. This needs broker-verified rules before public copy.
- Paid landing-page variant for KZ ads. This should wait until the organic hub is live and can inform ad landing-page copy.
