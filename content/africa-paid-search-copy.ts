// Africa Wave-1 paid-search copy — ENGLISH, reviewed + de-slop rewrite 2026-07-02
// (post-audit). Grounded ONLY in the approved Ghana positioning + country plan:
//   meridian-marketing-brain/wiki/deliverables/Africa Market Entry - *.md
//   docs/plans/africa-wave1/EXECUTION-PLAN.md (Phase 2)
//
// Hard copy rules (binding):
//   - Gate H1 self-deselects local buyers: "we import from the USA, we are not a dealer".
//     H1s are pinned by the live ads — do not edit them.
//   - Include BOTH differentiators: we clear your customs / we inspect the used machine
//     at origin.
//   - The broker/duty disclaimer lives ONCE in complianceBody (plus one short mention in
//     scopeExcluded) per page — never in heroBody, processIntro, quoteIntro or the CTA.
//   - Compliance caveat defers the exact duty line + used-age admissibility to a licensed
//     in-country broker/agent per shipment; zero-rated ag-machinery duty (Ghana) is
//     verify-before-quoting.
//   - Proof points are GLOBAL + verifiable only (1,000+ machines to 40+ countries since
//     2013, near-perfect first-time customs clearance, EN/ES/RU/AR + WhatsApp, US
//     dealer/auction network).
//   - NEVER cite a specific African shipment (no accessible African deal history).
//   - NO trademark names (John Deere/Caterpillar) in visible copy — keyword-only elsewhere.
//   - WhatsApp prefill keeps the {{whatsapp_ref}} placeholder verbatim (client-interpolated).

import type { PaidSearchCopy } from "@/content/latam-paid-search-copy";

export const AFRICA_PAID_SEARCH_COPY: Record<string, PaidSearchCopy> = {
  "ghana/farm-tractors-usa": {
    seoTitle: "Import Farm Tractors from the USA to Ghana",
    seoDescription:
      "Ghana can zero-rate duty on qualifying farm tractors. We source used US units, inspect at origin, ship to Tema and clear GRA customs. Importer, not dealer.",
    eyebrow: "Used farm tractors from the USA · Ghana",
    h1: "Import Farm Tractors from the USA to Ghana — We Don't Sell, We Import",
    heroBody:
      "Ghana can zero-rate import duty on qualifying agricultural machinery, which is part of why a used US tractor pencils out. We import tractors to Tema; we don't sell them and hold no stock in Ghana. Our difference: we inspect the actual machine at origin before you pay, then clear it at Tema instead of dropping it at the port.",
    heroBullets: [
      "US-wide sourcing across dealers and auctions, matched to horsepower and implements",
      "Origin inspection and phyto cleaning before the tractor is paid for",
      "USDA APHIS phytosanitary certificate and full export documentation",
      "Ocean freight to Tema and GRA clearance through a licensed broker",
      "English-language WhatsApp support from quote to release",
    ],
    scopeIncluded: [
      "Sourcing the used tractor across the US dealer and auction network",
      "Origin inspection of the specific tractor prior to purchase",
      "Export documentation plus USDA APHIS phytosanitary certificate where required",
      "Ocean-freight booking to Tema and Ghana customs clearance via a licensed broker",
    ],
    scopeExcluded: [
      "The final landed price until a Ghana broker verifies the duty line for your unit",
      "Used-age admissibility for the specific tractor (broker-checked per shipment)",
      "GRA import duty, VAT, NHIL/GETFund levies and any GSA conformity fees",
      "Inland delivery beyond Tema and on-arrival GSA/GRA inspection outcomes",
    ],
    processIntro:
      "Every shipment runs in the same order: confirm the tractor, inspect it, move it. Horsepower, implements and phyto cleaning are settled before the freight is booked, so nothing stalls at Tema.",
    processSteps: [
      {
        title: "Send us the tractor",
        body: "Give us a listing link or the make, model, year, hours and US location. If you only know the horsepower class and implements you need, we search the dealer and auction network for candidates.",
      },
      {
        title: "We inspect at origin",
        body: "We put eyes on the machine: condition, hours, completeness, and whether the implements match the listing. We also have it cleaned of soil and plant debris so phytosanitary checks don't stall it later.",
      },
      {
        title: "Export, freight and documents",
        body: "Export docs, the USDA APHIS phytosanitary certificate where required, and an ocean booking to Tema in a container or on a flat rack, whichever the tractor's size calls for.",
      },
      {
        title: "Cleared at Tema",
        body: "A licensed broker files the Ghana entry with the GRA and takes the tractor through clearance. Handover happens after customs, not before it.",
      },
    ],
    quoteIntro:
      "These details let us shortlist, inspect and price the leg to Tema around a real machine instead of a guess.",
    quoteFields: [
      "Listing link, or make, model and year of the tractor",
      "Engine hours and condition, if known",
      "Preferred US region or budget, if you don't have a specific unit yet",
      "Destination in Ghana (Tema, Kumasi, Tamale or other) and target timing",
      "Whether you already have a Ghana customs broker",
      "Intended use (farm operation, cooperative, resale) so we can advise honestly",
    ],
    complianceHeading: "Duty and admissibility: the Ghana broker's lane",
    complianceBody:
      "The US side is ours; the Ghana figures are not. A licensed Ghana customs broker confirms the exact duty line and used-age admissibility for your specific tractor against the current Ghana Revenue Authority (GRA) tariff before you commit funds. Agricultural machinery can qualify for zero-rated import duty, but that is verified per machine, and VAT, NHIL and GETFund levies may still apply. Used machinery may also need conformity assessment under the Ghana Standards Authority (GSA) import-inspection program.",
    localResponsibility:
      "Meridian owns sourcing, origin inspection, export documents and freight. Your licensed Ghana broker owns the GRA entry: classification, duty and admissibility.",
    faq: [
      {
        question: "Are you a tractor dealer in Ghana?",
        answer:
          "No. We hold no stock and sell nothing. You pick the tractor, or we shortlist one, and we import it: sourcing, origin inspection, freight to Tema and customs clearance through a licensed broker.",
      },
      {
        question: "How do I know the used tractor matches the listing?",
        answer:
          "We inspect the actual machine at origin before you pay: condition, hours, implements and completeness. You're not buying a photo. That discipline has backed 1,000+ machines exported to 40+ countries since 2013.",
      },
      {
        question: "Will there be import duty on my tractor in Ghana?",
        answer:
          "Possibly not: Ghana can zero-rate agricultural machinery. The rate depends on how the GRA classifies your specific tractor, though, and VAT, NHIL and GETFund levies can still apply. Your broker gives you the final line per shipment; we don't quote landed costs on assumptions.",
      },
      {
        question: "Is there an age limit on used tractors into Ghana?",
        answer:
          "Admissibility is checked per shipment against current GRA rules rather than promised up front, and used machinery can also fall under GSA import inspection. We flag both before you buy a specific unit.",
      },
      {
        question: "Do you actually clear customs, or just drop it at the port?",
        answer:
          "We clear it. The GRA entry is filed and your tractor leaves Tema as cleared cargo, not as a problem waiting at the port. Port drop-off has never been where our job ends.",
      },
    ],
    ctaHeading: "Send the tractor. We'll land it in Ghana.",
    ctaDescription:
      "Share a listing or your horsepower and implement needs. We source, inspect at origin and clear at Tema — one company from US yard to released cargo.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import a used farm tractor from the USA to Ghana. Machine: [make/model/year]. Destination: [city in Ghana]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
  "ghana/heavy-equipment-usa": {
    seoTitle: "Import Heavy Equipment from the USA to Ghana",
    seoDescription:
      "Flat rack, RoRo or container to Tema: used US heavy equipment imported to Ghana, verified at origin and cleared through customs. We import, we don't sell.",
    eyebrow: "Used heavy equipment from the USA · Ghana",
    h1: "Import Heavy Equipment from the USA to Ghana — We Don't Sell, We Import",
    heroBody:
      "An excavator or dozer ships to Tema on a flat rack, by RoRo or in a container; the machine's true weight and dimensions decide which. We import used US heavy equipment to Ghana — we sell nothing and hold no stock. Every unit is verified at origin before purchase, then cleared through Tema rather than left at it.",
    heroBullets: [
      "Excavators, loaders, dozers and graders sourced across the US network",
      "Origin verification: hours, undercarriage, completeness and true measurements",
      "Flat rack, RoRo or container, chosen by weight and dimensions, not habit",
      "Tema clearance handled through a licensed broker, not a port drop",
      "One English WhatsApp thread across the whole move",
    ],
    scopeIncluded: [
      "Sourcing the used machine across the US dealer and auction network",
      "Pre-purchase verification of the machine at origin",
      "Export documentation and oversize/heavy-lift handling at origin",
      "Ocean-freight booking to Tema and Ghana customs clearance via a licensed broker",
    ],
    scopeExcluded: [
      "The final landed price until a Ghana broker verifies the duty line for your machine",
      "Used-age admissibility for the specific machine (broker-checked per shipment)",
      "GRA import duty, VAT and levies, plus any GSA conformity fees",
      "Inland delivery beyond Tema port and on-arrival GSA/GRA inspection outcomes",
    ],
    processIntro:
      "Heavy equipment is planned from the tape measure out. We confirm the machine, verify it at origin, then match it to flat rack, RoRo or container space for the Tema sailing.",
    processSteps: [
      {
        title: "Send us the machine",
        body: "Listing or spec sheet, plus weight and dimensions if you have them. Excavator, loader, dozer or grader: the measurements matter more than the model name.",
      },
      {
        title: "We verify it at origin",
        body: "Condition, hours, undercarriage wear and completeness get checked on the ground before any money moves. Oversize units are measured for the load plan at the same visit.",
      },
      {
        title: "Load format and freight",
        body: "Flat rack, RoRo or container: the machine's true weight and dimensions decide it, along with any dismantling. We book the Tema sailing to match.",
      },
      {
        title: "Cleared through the GRA",
        body: "The entry is filed by a licensed broker and the machine comes out of Tema cleared. Port drop-off is not the end of our job; clearance is.",
      },
    ],
    quoteIntro:
      "Measurements first: with the true weight and dimensions we can price the Tema leg and the load format without padding for the unknown.",
    quoteFields: [
      "Listing link, or make, model and year of the machine",
      "Weight and dimensions (length, width, height), if known",
      "Engine hours and condition, if known",
      "Destination in Ghana (Tema, Kumasi, Takoradi or other) and target timing",
      "Whether a Ghana broker is already engaged on your side",
      "Intended use (site work, mining, resale) so we can advise honestly",
    ],
    complianceHeading: "Duty and admissibility on the Ghana side",
    complianceBody:
      "Meridian's scope ends where Ghana's tariff begins. A licensed Ghana customs broker confirms the exact duty line and used-age admissibility for your specific machine against the current Ghana Revenue Authority (GRA) tariff before you commit funds. Some machinery categories attract reduced or zero-rated duty; VAT, NHIL and GETFund levies may still apply, and used machinery can require conformity assessment under the Ghana Standards Authority (GSA) import-inspection program.",
    localResponsibility:
      "Meridian covers sourcing, origin verification, export paperwork and the ocean leg. The GRA entry, classification and every Ghana-side figure belong to your licensed broker.",
    faq: [
      {
        question: "Are you an equipment dealer in Ghana?",
        answer:
          "No. We import machines we don't own: you choose the excavator, loader or dozer, we verify it at origin, ship it to Tema and clear Ghana customs through a licensed broker.",
      },
      {
        question: "How do you decide between flat rack, RoRo and container?",
        answer:
          "By the machine's true weight and dimensions and whether it self-propels or needs dismantling. That's why we ask for measurements before quoting: load format is most of the freight price.",
      },
      {
        question: "Will there be import duty on my machine in Ghana?",
        answer:
          "It depends on classification. Some machinery categories attract reduced or zero-rated duty in Ghana; VAT, NHIL and GETFund levies may still apply. The GRA line for your unit comes from your broker per shipment, not from a website.",
      },
      {
        question: "What about the machine's condition — hours, undercarriage?",
        answer:
          "Checked at origin before any money moves: hours, undercarriage wear, completeness and general condition. Since 2013 we've exported 1,000+ machines to 40+ countries on the back of that origin check.",
      },
      {
        question: "Do you clear Ghana customs or just deliver to the port?",
        answer:
          "We clear. A licensed broker files the GRA entry and the machine is released from Tema cleared. Our near-perfect first-time clearance record exists because clearance is the job, not an add-on.",
      },
    ],
    ctaHeading: "Your machine, measured, moved and cleared at Tema",
    ctaDescription:
      "Send the model and measurements. We verify the unit at origin, book the right deck to Tema and handle Ghana clearance end to end.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import used heavy equipment from the USA to Ghana. Machine: [make/model/year]. Weight/size: [weight/dimensions]. Destination: [city in Ghana]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
  "kenya/farm-tractors-usa": {
    seoTitle: "Import Farm Tractors from the USA to Kenya",
    seoDescription:
      "KEBS PVoC Route A checks conformity at origin, where we already inspect. Used US farm tractors imported to Mombasa and cleared through the KRA.",
    eyebrow: "Used farm tractors from the USA · Kenya",
    h1: "Import Farm Tractors from the USA to Kenya — We Don't Sell, We Import",
    heroBody:
      "Kenya checks a used tractor's conformity at origin: KEBS Route A runs its inspection in the country the machine ships from, before it sails for Mombasa. That's where we already work. We import US farm tractors to Kenya; we don't sell them or hold stock. Our check and the conformity step share one origin window, before you pay.",
    heroBullets: [
      "Tractor sourcing across US dealers and auctions, sized to your fields and implements",
      "One origin window: our machine check plus Kenya's Route A conformity inspection",
      "Phyto cleaning and USDA APHIS certificate where required",
      "Freight to Mombasa and KRA clearance via a licensed clearing agent",
      "WhatsApp updates in English at every stage",
    ],
    scopeIncluded: [
      "Shortlisting used tractors from the US dealer and auction network",
      "Origin inspection of the tractor, aligned with the conformity window",
      "Export documents and the USDA APHIS phytosanitary certificate where needed",
      "Ocean-freight booking to Mombasa and Kenya customs clearance coordination",
    ],
    scopeExcluded: [
      "The final landed price until your Kenyan agent verifies the duty line",
      "Used-age admissibility for the specific tractor (agent-checked per shipment)",
      "KRA import duty, import VAT and Kenya-side conformity fees",
      "Inland delivery beyond Mombasa and on-arrival KEBS/KRA inspection outcomes",
    ],
    processIntro:
      "From listing to Mombasa in four steps. The origin visit does double duty: our pre-purchase check and Kenya's conformity verification happen where the tractor sits, before it sails.",
    processSteps: [
      {
        title: "Start with the tractor",
        body: "Share the listing, or the horsepower range and implements you're after, and we shortlist units from the US dealer and auction network.",
      },
      {
        title: "One origin visit, two jobs",
        body: "We check condition, hours and completeness, and the KEBS conformity inspection is coordinated in the same pre-shipment window. Soil and plant debris come off before loading.",
      },
      {
        title: "Documents and the Mombasa booking",
        body: "Export documentation, the USDA APHIS phytosanitary certificate where required, and ocean freight to Mombasa sized to the tractor.",
      },
      {
        title: "Cleared through the KRA",
        body: "Your entry is filed with the KRA by a licensed clearing agent, who takes the tractor through Mombasa clearance and settles the final figures for your unit.",
      },
    ],
    quoteIntro:
      "Send what you know and we build the Mombasa plan from it, including the origin inspection scheduling.",
    quoteFields: [
      "A listing link, or the tractor's make, model and year",
      "Hours and general condition, if you have them",
      "US region or budget range if you're still choosing the unit",
      "Destination in Kenya (Nairobi, Nakuru, Eldoret or other) and target timing",
      "Whether you already have a Kenyan clearing agent",
      "What the tractor will do — farm operation, cooperative or resale",
    ],
    complianceHeading: "Duty, age limits and conformity: confirmed in Kenya",
    complianceBody:
      "Kenya-side figures are confirmed in Kenya. A licensed Kenyan clearing agent confirms the exact duty line and used-age admissibility for your specific tractor against the current Kenya Revenue Authority (KRA) tariff before you commit funds. Imports must meet Kenya Bureau of Standards (KEBS) requirements under the PVoC program: Route A verifies conformity by inspection in the country of origin, and a Certificate of Conformity is required to clear. A roughly 8-year age limit applies to some vehicle categories, and import VAT and other charges may apply.",
    localResponsibility:
      "Meridian runs the US leg end to end. The KRA entry, classification and Kenya-side costs sit with your licensed agent, as does the conformity certificate at clearance.",
    faq: [
      {
        question: "Are you a tractor dealer in Kenya?",
        answer:
          "No. We don't sell tractors or hold stock in Kenya. We import the unit you choose: sourced in the US, inspected at origin, shipped to Mombasa and cleared through the KRA by a licensed agent.",
      },
      {
        question: "How does origin inspection fit Kenya's conformity rules?",
        answer:
          "KEBS Route A verifies used machinery by inspection in the country of origin, so the conformity step happens in the same pre-shipment window as our own check on the tractor. The Certificate of Conformity is issued under the KEBS program and your agent uses it to clear at Mombasa.",
      },
      {
        question: "Is there an age limit on used tractors into Kenya?",
        answer:
          "A roughly 8-year age limit applies to some vehicle categories in Kenya, so admissibility for a specific tractor is checked per shipment against current KRA and KEBS rules before you buy it — not assumed.",
      },
      {
        question: "How do I know the tractor matches the listing?",
        answer:
          "We inspect it at origin: hours, condition, implements, completeness. If the unit doesn't check out, you walk away before money moves. That check has run on 1,000+ machine exports to 40+ countries since 2013.",
      },
      {
        question: "Do you clear Kenya customs or stop at Mombasa?",
        answer:
          "We take it through clearance. A licensed agent files the KRA entry and releases the tractor from Mombasa; inland delivery beyond the port sits outside the standard scope.",
      },
    ],
    ctaHeading: "Start the Mombasa plan for your tractor",
    ctaDescription:
      "One WhatsApp message starts it: sourcing, origin inspection with the conformity step built in, freight to Mombasa and KRA clearance.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import a used farm tractor from the USA to Kenya. Machine: [make/model/year]. Destination: [city in Kenya]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
  "kenya/heavy-equipment-usa": {
    seoTitle: "Import Heavy Equipment from the USA to Kenya",
    seoDescription:
      "Weight and dimensions set the plan: used US excavators, loaders and dozers shipped to Mombasa, verified at origin, cleared in Kenya. Importer, not dealer.",
    eyebrow: "Used heavy equipment from the USA · Kenya",
    h1: "Import Heavy Equipment from the USA to Kenya — We Don't Sell, We Import",
    heroBody:
      "Weight and dimensions rule a heavy-equipment move to Mombasa: they pick flat rack, RoRo or container, and set most of the freight bill. We import used US machines to Kenya and sell none of them — no stock, no showroom. Each unit is verified at origin, where KEBS PVoC Route A expects used-machinery conformity checked anyway.",
    heroBullets: [
      "Heavy units verified at origin: hours, undercarriage, condition, dimensions",
      "Conformity inspection coordinated at origin, where KEBS expects it for used machinery",
      "RoRo, flat rack or container to Mombasa, decided by the machine's real numbers",
      "KRA entry and Mombasa clearance included in scope",
      "English support over WhatsApp, US yard to port release",
    ],
    scopeIncluded: [
      "Sourcing across the US dealer and auction network for the machine you specify",
      "Pre-purchase origin verification, including measurements",
      "Oversize and heavy-lift handling at origin, plus export documentation",
      "Ocean-freight booking to Mombasa and Kenya clearance via a licensed clearing agent",
    ],
    scopeExcluded: [
      "The final landed price until your Kenyan agent verifies the duty line for the machine",
      "Used-age admissibility for the specific machine (agent-checked per shipment)",
      "KRA import duty, import VAT and any Kenya-side conformity fees",
      "Inland delivery beyond Mombasa port and on-arrival KEBS/KRA inspection outcomes",
    ],
    processIntro:
      "Four steps from the US yard to Mombasa. Weight and dimensions come first, because they decide the load format, the handling and most of the freight bill.",
    processSteps: [
      {
        title: "Start with the numbers",
        body: "The listing plus weight, length, width and height. With those four numbers we can plan the move; without them, nobody can price it honestly.",
      },
      {
        title: "Origin check and measurements",
        body: "Undercarriage, hours, condition and completeness, verified where the machine sits. The same visit window covers Kenya's origin-based conformity step.",
      },
      {
        title: "Flat rack, RoRo or container",
        body: "The real dimensions pick the format. We handle oversize and heavy-lift arrangements at origin and book the Mombasa sailing accordingly.",
      },
      {
        title: "KRA entry and clearance",
        body: "A licensed clearing agent files with the KRA and walks the machine through Mombasa. You get the machine after clearance, not a storage bill at the port.",
      },
    ],
    quoteIntro:
      "With the machine's real numbers we can commit to a load format and a Mombasa price rather than a range that protects us, not you.",
    quoteFields: [
      "A listing link, or the machine's make, model and year",
      "Weight plus length, width and height, if measured",
      "Hours and general condition, if you have them",
      "Destination in Kenya (Nairobi, Mombasa, Nakuru or other) and target timing",
      "Whether a clearing agent in Kenya is already on board",
      "The job it's for — site work, mining or resale",
    ],
    complianceHeading: "What gets confirmed on the Kenya side",
    complianceBody:
      "The Kenya figures never come from us. A licensed Kenyan clearing agent confirms the exact duty line and used-age admissibility for your specific machine against the current Kenya Revenue Authority (KRA) tariff before you commit funds. Imports must meet Kenya Bureau of Standards (KEBS) requirements under the PVoC program, with conformity verified by inspection in the country of origin and a Certificate of Conformity required to clear. A roughly 8-year age limit applies to some vehicle categories, and import VAT and other charges may apply.",
    localResponsibility:
      "Meridian handles the machine until it clears the vessel at Mombasa. Entry, classification and every Kenya-side cost stay with your licensed agent.",
    faq: [
      {
        question: "Are you an equipment dealer in Kenya?",
        answer:
          "No — we're the importer. You pick the machine; we verify it at origin, book the freight to Mombasa and have it cleared through the KRA. No stock, no showroom, no resale agenda.",
      },
      {
        question: "How does PVoC apply to heavy equipment?",
        answer:
          "Used machinery imported into Kenya needs a Certificate of Conformity, verified under KEBS Route A by inspection at origin before shipment. Because we already handle the machine on the ground in the US, that inspection slots into the export window instead of becoming a separate project.",
      },
      {
        question: "How is the freight method chosen?",
        answer:
          "Weight, dimensions, and whether the machine drives on its own decide between RoRo, flat rack and container. Send the measurements and you get a real number; without them any quote is a guess.",
      },
      {
        question: "Is there an age limit on used machines into Kenya?",
        answer:
          "Some vehicle categories carry a roughly 8-year age limit, so we have admissibility for your specific machine checked against current KRA and KEBS requirements per shipment, before you buy.",
      },
      {
        question: "Do you handle oversize and heavy-lift machines?",
        answer:
          "Yes. Oversize and heavy-lift handling at origin is part of scope: route permits, specialized inland transport in the US, dismantling when needed, and secure loading for the Mombasa sailing.",
      },
    ],
    ctaHeading: "Get a real number for a real machine: Mombasa, cleared",
    ctaDescription:
      "Send weight and dimensions with the listing. We confirm the load format, verify the machine at origin and deliver it through Kenyan customs.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import used heavy equipment from the USA to Kenya. Machine: [make/model/year]. Weight/size: [weight/dimensions]. Destination: [city in Kenya]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
  "tanzania/farm-tractors-usa": {
    seoTitle: "Import Farm Tractors from the USA to Tanzania",
    seoDescription:
      "TBS verifies conformity before shipment. We inspect your used US tractor at origin, ship to Dar es Salaam and clear TRA customs. Importer, not a dealer.",
    eyebrow: "Used farm tractors from the USA · Tanzania",
    h1: "Import Farm Tractors from the USA to Tanzania — We Don't Sell, We Import",
    heroBody:
      "Dar es Salaam is East and Central Africa's working gateway, and Tanzania's TBS rules verify a used tractor's conformity before it ships — at origin, not at the quay. We import US farm tractors to Tanzania; we don't sell machines or keep stock. We verify your tractor where it stands in the US, then walk it through TRA clearance.",
    heroBullets: [
      "Used tractors sourced US-wide and matched to the job, not just the listing",
      "Origin verification plus phyto cleaning of soil and plant debris",
      "TBS conformity verified pre-shipment, with documents ready for Dar es Salaam",
      "TRA clearance through a licensed clearing agent",
      "The whole shipment managed over one English WhatsApp thread",
    ],
    scopeIncluded: [
      "US-wide tractor sourcing through dealer and auction channels",
      "Verification of the actual tractor at origin",
      "Export paperwork, including the APHIS phytosanitary certificate where required",
      "Ocean-freight booking to Dar es Salaam and Tanzania clearance coordination",
    ],
    scopeExcluded: [
      "The final landed price until your Tanzanian agent verifies the duty line",
      "Used-age admissibility for the specific tractor (agent-checked per shipment)",
      "TRA import duty, import VAT and Tanzania-side conformity fees",
      "Inland delivery beyond Dar es Salaam and on-arrival TBS/TRA inspection outcomes",
    ],
    processIntro:
      "The route to Dar es Salaam is sequenced so the paperwork lands before the tractor does: machine confirmed, inspected, cleaned, documented, then cleared on arrival.",
    processSteps: [
      {
        title: "Pick the tractor",
        body: "A link, or the make, model and hours you want. Tell us the work it will do; we advise on horsepower and implements from the units actually available.",
      },
      {
        title: "Inspected and cleaned at origin",
        body: "We verify the tractor where it stands and have it cleaned of soil and plant debris. Tanzania verifies conformity before shipment, so this origin stage is where compliance happens too.",
      },
      {
        title: "Paperwork and the Dar es Salaam booking",
        body: "Export documents, the phytosanitary certificate where required, and a container or flat-rack booking to Dar es Salaam.",
      },
      {
        title: "Cleared through the TRA",
        body: "A licensed clearing agent lodges the entry with the TRA and clears the tractor at Dar es Salaam. We stay on the file until it's released.",
      },
    ],
    quoteIntro:
      "This is everything we need to source and price the Dar es Salaam leg on a specific tractor.",
    quoteFields: [
      "The listing URL, or the tractor's make, model and year",
      "Known hours and condition",
      "Your budget or preferred US region if no unit is picked yet",
      "Destination in Tanzania (Dar es Salaam, Arusha, Mwanza or other) and target timing",
      "Whether you already have a Tanzanian clearing agent",
      "Intended use, so advice is honest: farm work, cooperative or resale",
    ],
    complianceHeading: "Duty and conformity: confirmed on the Tanzania side",
    complianceBody:
      "Tanzanian figures come from Tanzania. A licensed Tanzanian clearing agent confirms the exact duty line and used-age admissibility for your specific tractor against the current Tanzania Revenue Authority (TRA) tariff before you commit funds. TBS Pre-Shipment Verification of Conformity (PVoC) is mandatory: conformity is verified before the machine ships, and a Certificate of Conformity is needed to clear at Dar es Salaam. Import VAT and other charges may apply.",
    localResponsibility:
      "Meridian handles everything on US soil and the ocean leg. The TRA entry, classification and Tanzania-side costs belong to your licensed agent.",
    faq: [
      {
        question: "Are you a tractor dealer in Tanzania?",
        answer:
          "No. Nothing here is for sale — we import. Your chosen tractor is sourced in the US, verified at origin, shipped to Dar es Salaam and cleared through the TRA by a licensed agent.",
      },
      {
        question: "How does origin inspection fit Tanzania's import rules?",
        answer:
          "TBS PVoC is mandatory for imports into Tanzania and conformity is verified before shipment, so the checking happens at origin — where the machine already is and where we already work. The Certificate of Conformity then travels with the shipment for clearance.",
      },
      {
        question: "Is there an age limit on used tractors into Tanzania?",
        answer:
          "We treat admissibility as a per-shipment check against current TRA and TBS requirements, done before you buy the unit, rather than a blanket rule quoted from a website.",
      },
      {
        question: "How do I know the tractor is as described?",
        answer:
          "It gets verified at origin (hours, condition, implements, completeness) before any funds move. That verification step has run on more than 1,000 machines exported to 40+ countries since 2013.",
      },
      {
        question: "Do you clear Tanzania customs or leave it at the port?",
        answer:
          "We see it through clearance. The TRA entry is lodged by a licensed agent and the tractor is released from Dar es Salaam cleared; the port is a step in the process, not the finish line.",
      },
    ],
    ctaHeading: "From a US listing to a cleared tractor in Dar es Salaam",
    ctaDescription:
      "Tell us the tractor and the work it's for. We verify it at origin, ship it and lodge the TRA entry — released cargo, not paperwork surprises.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import a used farm tractor from the USA to Tanzania. Machine: [make/model/year]. Destination: [city in Tanzania]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
  "tanzania/heavy-equipment-usa": {
    seoTitle: "Import Heavy Equipment from the USA to Tanzania",
    seoDescription:
      "Used US heavy equipment to Dar es Salaam on flat rack, RoRo or container. Verified at origin, TRA clearance included. We're the importer, not a dealer.",
    eyebrow: "Used heavy equipment from the USA · Tanzania",
    h1: "Import Heavy Equipment from the USA to Tanzania — We Don't Sell, We Import",
    heroBody:
      "Machinery bound for East and Central Africa moves through Dar es Salaam, and the port handles every load format. Which one your machine needs — flat rack, RoRo or container — comes down to weight and dimensions. We import used US heavy equipment to Tanzania and sell nothing. Verification happens at origin; clearance through the TRA is part of the job.",
    heroBullets: [
      "Sourcing across US dealer and auction channels for excavators, loaders and dozers",
      "Hours, undercarriage and measurements verified at origin",
      "Flat rack, RoRo or container into Dar es Salaam, sized to the machine",
      "Pre-shipment conformity supported at origin; TRA entry filed by a licensed agent",
      "English WhatsApp support throughout",
    ],
    scopeIncluded: [
      "Locating the used machine in the US dealer and auction market",
      "Origin verification of hours, condition and dimensions",
      "Export documentation and origin heavy-lift arrangements",
      "Ocean-freight booking to Dar es Salaam and TRA clearance via a licensed agent",
    ],
    scopeExcluded: [
      "The final landed price until your Tanzanian agent verifies the duty line for the machine",
      "Used-age admissibility for the specific machine (agent-checked per shipment)",
      "TRA import duty, import VAT and any Tanzania-side conformity fees",
      "Inland delivery beyond Dar es Salaam port and on-arrival TBS/TRA inspection outcomes",
    ],
    processIntro:
      "We plan a Dar es Salaam heavy move around the machine's true footprint: verify it at origin, lock the load format, then ship with clearance already arranged.",
    processSteps: [
      {
        title: "Spec the machine",
        body: "Model, year, hours, weight and dimensions. If the unit needs dismantling for transport, we plan that from the start rather than discovering it at the port.",
      },
      {
        title: "Verified at origin",
        body: "Condition, hours and undercarriage checked in person before purchase. TBS conformity is verified pre-shipment, and the origin stage is where we support it.",
      },
      {
        title: "The right deck for the machine",
        body: "Flat rack for the oversize, RoRo where it drives, container where it fits. Weight and dimensions make the call, and the Dar es Salaam booking follows.",
      },
      {
        title: "TRA entry and release",
        body: "A licensed clearing agent files with the TRA and takes the machine through Dar es Salaam clearance. The job ends at release, not at the quay.",
      },
    ],
    quoteIntro:
      "The more of this you have, the tighter the Dar es Salaam quote; dimensions and weight matter most.",
    quoteFields: [
      "Link to the machine, or its make, model and year",
      "The machine's weight and dimensions, as listed or measured",
      "Operating hours and overall condition, if available",
      "Destination in Tanzania (Dar es Salaam, Arusha, Mwanza, other) and timing",
      "Whether an agent in Tanzania is already appointed",
      "What the machine will do: site work, mining or resale",
    ],
    complianceHeading: "The Tanzania side: duty, conformity, admissibility",
    complianceBody:
      "We quote the international leg; Tanzania prices the entry. A licensed Tanzanian clearing agent confirms the exact duty line and used-age admissibility for your specific machine against the current Tanzania Revenue Authority (TRA) tariff before you commit funds. Imports must also satisfy Tanzania Bureau of Standards (TBS) rules: conformity is verified before shipment and a Certificate of Conformity accompanies the entry at Dar es Salaam. Import VAT and other charges may apply.",
    localResponsibility:
      "Meridian delivers a verified, documented machine to Dar es Salaam. Your licensed agent owns the TRA entry, the classification and the Tanzania-side bill.",
    faq: [
      {
        question: "Are you an equipment dealer in Tanzania?",
        answer:
          "No — importer only. We source the machine you specify, verify it at origin, ship it to Dar es Salaam and have it cleared through the TRA. We never hold stock in Tanzania.",
      },
      {
        question: "Which shipping method will my machine use?",
        answer:
          "The one its weight and dimensions demand: flat rack for oversize, RoRo where it can drive on, container where it fits. Dismantling is planned up front if the unit needs it.",
      },
      {
        question: "How does TBS conformity work for heavy equipment?",
        answer:
          "Tanzania requires PVoC (pre-shipment verification of conformity), so the machine is checked before it sails and the Certificate of Conformity accompanies the entry at Dar es Salaam. Our origin handling is where that verification is supported.",
      },
      {
        question: "Is there an age limit on used machines into Tanzania?",
        answer:
          "Admissibility is confirmed per shipment against current TRA and TBS requirements, before purchase rather than after arrival. We don't promise blanket rules.",
      },
      {
        question: "Do you clear customs at Dar es Salaam?",
        answer:
          "Yes. A licensed agent files the TRA entry and takes the machine through to release. Dropping cargo at the quay and walking away is precisely what we don't do.",
      },
    ],
    ctaHeading: "Heavy equipment to Dar es Salaam, planned from the measurements",
    ctaDescription:
      "Share the specs and destination city. We check the machine at origin, pick flat rack, RoRo or container, and see it through TRA clearance.",
    whatsappPrefill:
      "#FRT_EN Hello, I want to import used heavy equipment from the USA to Tanzania. Machine: [make/model/year]. Weight/size: [weight/dimensions]. Destination: [city in Tanzania]. I'm a buyer, not a dealer. Ref: {{whatsapp_ref}}",
  },
};
