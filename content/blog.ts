import { latamImportGuidesEn } from "./latam-import-guides";

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt: string; // ISO date "2026-03-19"
  updatedAt?: string;
  author: string;
  excerpt: string;
  content: string; // Simple markdown (##, ###, **, - lists, [links](url))
  category: string;
  readingTimeMinutes: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "import-farm-machinery-united-states-paraguay",
    title: "How to Import Farm Machinery from the United States to Paraguay",
    metaTitle: "Import U.S. Farm Machinery to Paraguay",
    metaDescription:
      "Learn how Paraguayan buyers can import U.S. farm machinery with less confusion: machine checks, Ley 7565/2025, routes, documents, and scope.",
    keywords: [
      "how to import farm machinery from USA to Paraguay",
      "import used agricultural machinery Paraguay",
      "ship farm equipment from USA to Paraguay",
      "Ley 7565 machinery Paraguay",
      "Paraguay farm machinery import guide",
      "Paranaguá farm machinery shipping Paraguay",
      "Asunción Villeta farm machinery import",
      "used combine harvester import Paraguay",
    ],
    publishedAt: "2026-05-12",
    author: "Meridian Freight Team",
    excerpt:
      "A practical pre-purchase guide for Paraguayan buyers evaluating U.S. tractors, combines, planters, sprayers, and headers without guessing the route or responsibilities.",
    category: "Destinations",
    readingTimeMinutes: 9,
    content: `## Start With the Real Question

Most Paraguayan buyers do not hesitate because they dislike U.S. farm machinery. They hesitate because the process feels unclear: the machine is far away, the route has more than one option, the law changed, and it is not obvious which costs belong to the seller, the freight company, the broker, or the buyer.

That hesitation is reasonable. A tractor, combine, sprayer, planter, or header should not be bought first and figured out later. Importing from the United States becomes easier when the route, documents, machine eligibility, and buyer responsibilities are clear before you buy.

This guide is written for Paraguayan farmers, cooperatives, dealers, and importers comparing U.S. equipment. It is not a substitute for a Paraguayan customs broker. It is a pre-purchase map for knowing what to check, who confirms each part, and where Meridian Freight can help.

## Can Used Farm Machinery Be Imported Into Paraguay?

Paraguay's agricultural economy depends on reliable equipment for soybeans, corn, wheat, rice, and livestock operations. Trade.gov notes that tractors, harvesting machinery, bulldozers, backhoes, and excavators are usually in high demand in Paraguay, and that Paraguay is one of the few Latin American markets that permits imports of used machinery.

The United States is useful because the market has deep inventory: late-model tractors, high-capacity combines, precision planters, self-propelled sprayers, draper headers, GPS packages, monitors, duals, and parts. The point is not that every U.S. machine is the right purchase. Local dealers can be the better choice when they have the right unit, warranty, financing, service, and immediate availability.

U.S. import makes sense to compare when the exact configuration is hard to find locally, the condition and hours are attractive, the seller documentation is clear, and the total route can be checked before funds move.

## The Five Decisions to Make Before You Buy

A good import plan is not complicated when it is handled in the right order. Before sending money to a seller or auction, answer these five questions:

- **Does the machine qualify?** Check manufacturing year, serial number, hours, structural condition, and whether it can meet Paraguay's current used-machinery rules.
- **Can it be cleaned and documented?** Soil, plant residue, pests, missing certificates, or unclear inspection history can turn a good-looking unit into a problem.
- **How will it be packed or moved?** Some tractors, planters, headers, and smaller implements may fit container workflows. Larger combines and sprayers often need flatrack or oversize planning.
- **Which route is the right handoff?** Paraguay is landlocked, so Asunción/Villeta, Paranaguá, and Montevideo are different responsibility models, not just different port names.
- **Who owns the Paraguay-side work?** The buyer, importer, and customs broker must confirm import registration, DNIT/SENAVE handling, taxes, port costs, and final delivery.

This is the core idea: do the pre-purchase work first. It is much easier to reject a risky machine before you bid than to solve route, legal, or cleaning problems after the machine is already paid for.

## Ley 7565/2025: The Compliance Checkpoint

Paraguay's Ley 7565/2025 regulates the entry of used agricultural machinery, equipment, and implements. For buyers, the practical takeaway is simple: age, cleaning, certification, and inspection are not details to handle at the end.

Before bidding on a machine, confirm:

- **Manufacturing year:** the law sets a five-year age limit for used agricultural machinery entering Paraguay.
- **Clean condition:** the machine must be free of soil, plant residue, pests, and contamination risk.
- **Origin certification:** cleaning, treatment, phytosanitary, or inspection documents may be required before shipment.
- **Technical condition:** engine, hour meter, serial number, structural condition, and rollover history matter.
- **Importer readiness:** the Paraguay importer and customs broker should confirm registration, prior license, DNIT, SENAVE, taxes, and destination-side handling.

Meridian can help organize the U.S. export-side documents and preparation, but the Paraguay importer and broker must confirm how the law applies to the specific machine.

## Which Route Is Best for Shipping Machinery to Paraguay?

Paraguay has no ocean port, so the route is not a minor detail. Trade.gov describes the Paraguay-Paraná waterway as a central corridor for Paraguayan trade, carrying nearly 80 percent of the country's trade. For machinery buyers, the route question is really a handoff question: where does Meridian's export scope end, and where does the buyer's local scope begin?

### Route Option 1: Asunción or Villeta River-Port Handoff

Asunción or Villeta can be the clearest option when the shipment is planned toward a Paraguay river-port handoff. This can fit containerized machinery or supported through-route cases where the buyer wants the international movement to end inside Paraguay.

It can be a good fit when:

- The buyer wants the international freight scope to end at a Paraguay river port.
- The equipment fits the container or routing model available for Paraguay.
- The buyer's customs broker is ready for destination clearance, taxes, inspection, and local pickup.

This is still not the same as final farm delivery. The buyer must confirm the movement from river port to farm, yard, cooperative, workshop, or dealership unless that local leg is separately quoted in writing.

### Route Option 2: Paranaguá, Brazil + Paraguay Trucking

Paranaguá, Brazil can be a practical comparison route for many flatrack or oversize machinery cases, especially when the final destination is in Paraguay's eastern agricultural region.

The advantage is control and simplicity on the ocean side. The caution is scope: a quote to a Brazil port is not the same as delivery to a farm in Paraguay. Brazil port handling, transit through Brazil, border coordination, Paraguay customs, local trucking, and unloading must be confirmed by the buyer's local team, broker, or selected carrier.

This route can work well when the local leg is confirmed separately. It should not be treated as cheaper or easier unless the missing local responsibilities are written down.

### Route Option 3: Montevideo Pickup or Buyer-Controlled Inland Movement

Montevideo can make sense when the buyer already has a regional logistics setup and wants to control the movement from Uruguay onward. This is most useful for buyers with their own trucks, customs support, or established partners.

The important distinction: Montevideo is a port handoff, not Paraguay delivery. A port quote to Montevideo leaves the buyer responsible for Montevideo-to-Paraguay movement, import handling, taxes, and final delivery unless those services are separately quoted.

## What a Real Budget Should Separate

A useful budget is not one number. It is a set of cost buckets that can be checked and compared:

- **Equipment price:** what the buyer pays the dealer, auction, or private seller.
- **U.S. inland transport:** moving the machine from origin to the packing point or port.
- **Dismantling, cleaning, packing, and loading:** driven by the machine, attachments, and route.
- **Ocean or multimodal freight:** container, flatrack, river leg, or port handoff depending on route.
- **Documents and certificates:** export filings, inspection support, certificates, and route-specific paperwork.
- **Insurance:** optional or required depending on the transaction and risk tolerance.
- **Paraguay customs and taxes:** confirmed by the Paraguay broker, not guessed from a generic freight quote.
- **Local trucking and final delivery:** river-port pickup, Brazil-to-Paraguay movement, or Montevideo onward movement if not included.

This separation protects the buyer from comparing incomplete quotes. A low port quote can become expensive if the local leg, taxes, inspection, storage, or unloading were never included.

## What Meridian Handles and What Your Broker Handles

Meridian handles the U.S. export-side workflow: reviewing the unit information, coordinating with the seller, scheduling pickup, arranging inland transport, planning dismantling and packing, preparing export documentation, booking freight, and comparing route options before the machine moves.

Your Paraguay importer, customs broker, or local team handles the Paraguay-side workflow: import registration, prior license requirements, DNIT and SENAVE coordination, IVA and other taxes or fees, destination inspection, port or terminal charges, local customs clearance, and final delivery unless a separate local service is quoted.

That split is what makes the process easier to understand. The buyer does not need to guess everything alone, but each party should own the part they are qualified to confirm.

## Pre-Purchase Checklist: What to Send Before You Bid

Before asking for a serious route check, send:

- Listing or auction link
- Make, model, manufacturing year, serial number, and engine hours
- Exact pickup location in the United States, including ZIP code
- Photos of the full machine, tires or tracks, cab, engine area, undercarriage, serial plate, and attachments
- Dimensions and weight if available
- Accessories included: headers, drapers, GPS receivers, monitors, dual wheels, toolboxes, or spare parts
- Final destination in Paraguay: Asunción, Villeta, Itapúa, Alto Paraná, Canindeyú, or another city or department
- Name of the importer or Paraguay customs broker if already selected

With that information, Meridian can screen the export side and route options before the buyer commits to the machine.

## Common Mistakes to Avoid

- Buying before checking the five-year age limit and import eligibility.
- Treating a U.S. auction invoice as the full Paraguay document package.
- Comparing Asunción/Villeta, Paranaguá, and Montevideo without separating local responsibilities.
- Forgetting headers, drapers, dual wheels, GPS monitors, and spare parts in the packing plan.
- Assuming a dirty machine will clear inspection normally.
- Treating an ocean quote as a full landed-cost estimate.
- Waiting until the machine reaches port before involving the Paraguay broker.

## How Meridian Freight Helps Before You Buy

The best time to contact Meridian is before you buy. Send the listing, year, hours, pickup ZIP code, photos, attachments, and intended destination in Paraguay. We can help identify the export-side questions, compare the route options, and separate Meridian's scope from what your Paraguay broker or local carrier must confirm.

If the machine looks workable, the next step is a quote built around the actual unit, not a generic promise. If the machine has a compliance, route, cleaning, or packing problem, it is better to know that before the purchase becomes expensive to unwind.

You can also review our [Paraguay buyer hub](/es/destinations/paraguay), [agricultural machinery export service](/services/agricultural), [assisted equipment purchase service](/services/equipment-sales), and [freight calculator](/pricing/calculator).

## Sources

- [Trade.gov: Paraguay agricultural sectors](https://www.trade.gov/country-commercial-guides/paraguay-agricultural-sectors)
- [Trade.gov: Paraguay-Paraná waterway system](https://www.trade.gov/country-commercial-guides/paraguay-paraguay-parana-waterway-system)
- [Trade.gov: Paraguay customs regulations](https://www.trade.gov/country-commercial-guides/paraguay-customs-regulations)
- [Trade.gov: Paraguay import requirements and documentation](https://www.trade.gov/country-commercial-guides/paraguay-import-requirements-documentation)
- [BACN: Ley Nº 7565/2025](https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados)
- [ABC Rural: Importación de maquinarias usadas en alza](https://www.abc.com.py/negocios/abc-campo/2026/01/24/importacion-de-maquinarias-usadas-en-alza/)`,
  },
  ...latamImportGuidesEn,
  {
    slug: "complete-guide-shipping-farm-equipment-usa",
    title: "Complete Guide to Shipping Farm Equipment from the USA",
    metaTitle:
      "Complete Guide to Shipping Farm Equipment from the USA | Meridian Freight",
    metaDescription:
      "Step-by-step guide to exporting farm equipment from the USA — from equipment pickup and dismantling to container packing, documentation, and ocean shipping. Covers costs, timelines, and what to look for in a freight forwarder.",
    keywords: [
      "shipping farm equipment from USA",
      "export agricultural machinery",
      "how to ship tractor overseas",
      "farm equipment freight forwarder",
      "John Deere export shipping",
      "Case IH international shipping",
    ],
    publishedAt: "2026-03-19",
    author: "Meridian Freight Team",
    excerpt:
      "Everything you need to know about exporting farm equipment from the United States — from finding the right machine to watching it roll off the vessel at its destination port.",
    category: "Guides",
    readingTimeMinutes: 8,
    content: `## Why US and Canadian Farm Equipment Is in Demand Worldwide

American and Canadian agricultural machinery is built for large-scale, high-output farming. Brands like **John Deere**, **Case IH**, **Kinze**, **AGCO**, and **New Holland** produce equipment that is engineered for thousands of hours of field work in some of the toughest conditions on earth. That durability, combined with a massive secondary market of well-maintained used machines, makes the USA and Canada the top source countries for agricultural equipment buyers in Latin America, the Middle East, Eastern Europe, and Central Asia.

In many destination countries, the same equipment — a John Deere S780 combine, a Case IH Magnum 340 tractor, or a Kinze 3660 planter — would cost 30-50% more if purchased new through a local dealer, assuming it is even available. Used equipment from North America often has lower hours, better maintenance records, and more advanced technology (GPS guidance, yield monitors, variable-rate application) than anything available locally.

The result: a steady, growing flow of farm machinery leaving US ports every month, bound for farms in Brazil, Turkey, the UAE, Kazakhstan, Ukraine, Nigeria, and dozens of other countries.

## How the Export Process Works

Shipping a combine harvester or tractor overseas is not the same as shipping a pallet of auto parts. These are large, heavy, complex machines that require specialized handling at every stage. Here is the process from start to finish.

### Step 1: Equipment Pickup and Inland Transport

Once you have purchased your equipment — whether from a dealer, auction, or private seller — it needs to get from its current location to the correct export handoff point. For container-fit machinery that is usually a packing facility; for oversize flatrack machinery it is the departure port. In either case, that leg usually means trucking it on a lowboy trailer or driving it onto a step-deck.

**Typical costs:** Current customer quotes use a standard planning rate of **$7 per road mile** for U.S. inland transport. Container-fit machinery usually routes to our Albion, IA packing workflow and then Chicago for ocean loading, while oversize flatrack machinery moves directly to the departure port with port-side preparation bundled into the sea freight line. A tractor sitting on a farm in Iowa might still cost $1,500-$3,000 in inland transport depending on distance; a combine in North Dakota can run materially higher because it moves as oversize freight to port.

### Step 2: Dismantling and Preparation

Most farm equipment does not fit into a standard shipping container fully assembled. A combine harvester with its header attached can be 35-40 feet wide. Even a large tractor may exceed container height limits with its cab and exhaust stack.

Professional dismantling includes:

- **Removing headers, augers, and attachments** — each piece is tagged with a numbered label and photographed
- **Draining fluids** — fuel, hydraulic oil, coolant, and DEF are drained to comply with shipping regulations and prevent leaks
- **Disconnecting electronics** — GPS receivers, monitors, and wiring harnesses are carefully removed and packed separately
- **Lowering or removing the cab** on equipment that exceeds container height limits
- **Cleaning and washing** — many destination countries require equipment to be free of soil and plant material (phytosanitary compliance)

Every bolt, bracket, and hardware bag is labeled with matching assembly points so the buyer's team can reassemble the machine on the other end.

### Step 3: Container Packing and Securing

With the machine disassembled and cleaned, it goes into the container. For most agricultural equipment, that means a **40ft high-cube container** (interior height: 9'6"). Larger machines may require a **flat rack** or **open top** container.

Inside the container:

- Heavy components go in first, positioned for balanced weight distribution
- **Blocking and bracing** — wooden beams and steel brackets prevent any lateral or longitudinal movement
- **Tie-downs and chains** — ratchet straps and chain binders secure the load to container tie-down points
- Smaller components, hardware bags, and electronics are packed in crates or on shelves inside the container
- A **detailed packing list** with photos is created, showing every item and its location in the container

### Step 4: Export Documentation

This is where many first-time exporters get tripped up. You need:

- **Commercial Invoice** — value, description, and terms of sale
- **Packing List** — weight, dimensions, and description of every item in the container
- **Bill of Lading** — the shipping contract between you and the ocean carrier
- **Certificate of Title** — proof of ownership (required for used equipment)
- **AES/EEI Filing** — electronic export information filed with US Customs (mandatory for shipments over $2,500)
- **Phytosanitary Certificate** — issued by USDA/APHIS, certifying the equipment is free of soil and pests (required by most agricultural destination countries)
- **Shipper's Letter of Instruction** — authorizes your freight forwarder to act on your behalf

A single missing or incorrect document can hold your container at port for days or weeks, racking up demurrage and storage charges.

### Step 5: Ocean Freight and Delivery

The container is trucked or railed to an export port — typically **Savannah, Houston, Los Angeles, or Newark** depending on the destination. Transit times vary:

- **Brazil (Port Santos):** 25-30 days
- **Turkey (Mersin/Istanbul):** 28-35 days
- **UAE (Jebel Ali):** 30-40 days
- **Kazakhstan (via Poti, Georgia):** 35-45 days

Major carriers like **Hapag-Lloyd**, **Maersk**, and **CMA CGM** handle most machinery shipments. Your freight forwarder negotiates rates and books space.

## Timeline: How Long Does It Take?

From the day you purchase equipment to the day it arrives at the destination port, expect **6-10 weeks** total:

- Inland transport: 3-7 days
- Dismantling and packing: 3-5 days
- Documentation: 2-5 days (can run in parallel with packing)
- Port processing: 2-3 days
- Ocean transit: 20-45 days depending on route
- Destination customs clearance: 3-10 days

## What Does It Cost?

Total export costs for a single piece of farm equipment typically range from **$10,000 to $25,000**, depending on the size of the machine, the origin location, and the destination. Here is a rough breakdown:

- **Inland transport:** $1,500-$4,500
- **Dismantling, packing, and loading:** $3,000-$8,000
- **Ocean freight:** $3,000-$7,000
- **Documentation and compliance:** $500-$1,500
- **Insurance:** $300-$800 (typically 1-2% of equipment value)

For a detailed cost estimate tailored to your specific equipment and destination, use our [freight calculator](/pricing/calculator) or [contact us](/contact) for a free quote.

## What to Look for in a Freight Forwarder

Not all freight forwarders handle heavy machinery. Look for:

- **Specialization in agricultural and construction equipment** — generic freight forwarders may not know how to dismantle a combine or which phytosanitary certificates your destination requires
- **In-house packing crews** — companies that subcontract packing lose control over quality
- **Photo documentation** — you should receive photos of every stage: dismantling, packing, container loading, and container sealing
- **Experience with your destination country** — customs requirements vary dramatically by country
- **Transparent pricing** — no hidden fees for "fuel surcharges" or "documentation processing"
- **References from other equipment buyers** — ask for contacts you can call

At Meridian Freight, we have completed over 1,000 machinery exports from the USA and Canada. We handle everything in-house — from picking up your equipment to delivering a sealed, documented container to the port. [Get a free quote](/contact) and see why buyers across 30+ countries trust us with their equipment.`,
  },
  {
    slug: "how-much-cost-export-combine-harvester",
    title: "How Much Does It Cost to Export a Combine Harvester?",
    metaTitle:
      "How Much Does It Cost to Export a Combine Harvester? | Meridian Freight",
    metaDescription:
      "Detailed cost breakdown for exporting a combine harvester from the USA — inland transport, dismantling, container packing, ocean freight, and documentation. Total range $10K-$25K.",
    keywords: [
      "combine harvester export cost",
      "shipping combine overseas price",
      "cost to export farm equipment",
      "combine harvester shipping quote",
      "machinery export pricing",
    ],
    publishedAt: "2026-03-19",
    author: "Meridian Freight Team",
    excerpt:
      "A transparent, line-by-line breakdown of what it actually costs to export a combine harvester from the United States to an overseas destination.",
    category: "Pricing",
    readingTimeMinutes: 4,
    content: `## The Short Answer

Exporting a combine harvester from the USA typically costs between **$10,000 and $25,000** all-in, depending on the machine's size, your pickup location, and the destination country. Below, we break down every cost component so you know exactly where your money goes.

## Cost Component 1: Inland Transport

Your combine needs to get from its current location to the departure port. Most combines ship on lowboy trailers and follow the flatrack workflow rather than the Albion, IA 40HC packing path.

- **Rate:** Current customer quotes use **$7 per road mile** for U.S. inland transport
- **Port-side prep:** For flatrack combines, dismantling, loading, bracing, NCB, and marine insurance are typically bundled into one customer-facing **Sea Freight & Loading** line instead of broken out separately
- **Typical inland range:** $1,500-$4,500 depending on distance

**Example:** A John Deere S780 sitting on a farm in central Iowa and routing to Houston or Savannah can have a relatively short inland leg. The same machine sitting in Ohio or the Northern Plains will usually run much higher because it is moving oversize all the way to port.

## Cost Component 2: Dismantling, Packing, and Loading

This is the most labor-intensive part of the process. A combine harvester cannot ship fully assembled — the header, unloading auger, chopper, and often the cab or exhaust stack must be removed to fit inside a container.

- **Dismantling and preparation:** Includes fluid drainage, component removal, tagging, photography, and cleaning
- **Container packing:** Blocking, bracing, tie-downs, and hardware bagging inside a 40ft high-cube or flat rack
- **Typical range:** **$3,000-$8,000** depending on machine size and complexity

Larger, more complex machines cost more. A Class 7 combine with a 12-row corn header requires more labor and more container space than a Class 5 with a 20-foot grain header. Machines that need cab removal or have extensive precision agriculture electronics add to the cost.

## Cost Component 3: Ocean Freight

Ocean freight rates fluctuate with fuel prices, carrier capacity, and seasonal demand. Here are typical ranges by destination:

- **Brazil (Santos):** $4,000-$6,000 for a 40ft HC
- **Turkey (Mersin):** $3,500-$5,500
- **UAE (Jebel Ali):** $3,500-$5,000
- **East Africa (Mombasa):** $4,500-$7,000
- **Central Asia (via Poti):** $4,000-$6,500

These rates include the base ocean freight plus destination port charges. We negotiate directly with **Hapag-Lloyd**, **Maersk**, and **CMA CGM** and always book the most cost-effective carrier for your route.

**Flat rack shipments** — needed for very large combines that cannot be disassembled enough to fit in a standard container — typically cost **20-40% more** than a standard 40ft HC.

## Cost Component 4: Documentation and Compliance

- **Export documentation:** Commercial Invoice, Packing List, Bill of Lading, AES/EEI filing — **$500-$1,000**
- **Phytosanitary Certificate:** USDA/APHIS inspection and certification — **$200-$500**
- **Total documentation range:** **$500-$1,500**

Phytosanitary certification is mandatory for agricultural equipment entering most countries. The equipment must be thoroughly cleaned of all soil and plant material before inspection.

## Cost Component 5: Insurance

For flat rack combine quotes, marine insurance is often bundled inside the customer-facing **Sea Freight & Loading** line instead of appearing as a separate charge. When insurance is modeled separately, use it as a planning item rather than a guaranteed public line.

## Putting It All Together

Here is a realistic example for a mid-size combine (like a Case IH 8250 or John Deere S770) shipping from Iowa to Santos, Brazil:

- Inland transport (local): $500
- Sea Freight & Loading: $10,900
- Documentation and compliance: $900
- **Total: approximately $12,300**

For a larger combine shipping from the East Coast to Central Asia, the total could reach $20,000-$25,000.

## Get an Exact Quote

Every shipment is different. Machine size, pickup location, destination, and current freight rates all affect pricing. Use our [freight calculator](/pricing/calculator) for an instant estimate, or [contact us](/contact) for a detailed quote within 24 hours. No obligation, no hidden fees.`,
  },
  {
    slug: "export-documentation-checklist",
    title: "Export Documentation Checklist: What Paperwork Do You Need?",
    metaTitle:
      "Export Documentation Checklist for Machinery | Meridian Freight",
    metaDescription:
      "Complete checklist of documents needed to export machinery from the USA — Commercial Invoice, Bill of Lading, AES/EEI filing, Phytosanitary Certificate, and more.",
    keywords: [
      "export documentation checklist",
      "machinery export paperwork",
      "bill of lading heavy equipment",
      "AES EEI filing machinery",
      "phytosanitary certificate farm equipment",
      "export compliance documents",
    ],
    publishedAt: "2026-03-19",
    author: "Meridian Freight Team",
    excerpt:
      "A complete checklist of every document you need to export machinery from the United States, with explanations of what each one is and why it matters.",
    category: "Documentation",
    readingTimeMinutes: 5,
    content: `## Why Documentation Matters

Missing or incorrect paperwork is the **number one cause of export delays**. A single error on a Commercial Invoice or a missing phytosanitary certificate can hold your container at port for days — sometimes weeks — while you scramble to correct it. Every day of delay costs money in demurrage, storage fees, and lost productivity for the buyer waiting on the other end.

This checklist covers every document you need to export machinery from the USA. Whether you are shipping a combine harvester to Brazil or an excavator to the UAE, these are the papers that make it happen.

## 1. Commercial Invoice

**What it is:** The primary document describing the transaction between buyer and seller. It establishes the value of the goods for customs purposes.

**What it must include:**
- Full names and addresses of buyer (consignee) and seller (shipper)
- Detailed description of the equipment (make, model, year, serial number, hours)
- Declared value and currency
- Terms of sale (Incoterm — typically FOB, CIF, or EXW)
- Country of origin
- Harmonized Tariff Schedule (HTS) code

**Who prepares it:** The seller or their freight forwarder.

## 2. Packing List

**What it is:** A detailed inventory of everything inside the container — every component, hardware bag, and accessory.

**What it must include:**
- Item-by-item description of all contents
- Weight and dimensions of each item
- Total gross weight and total number of packages
- Container number
- Corresponding Commercial Invoice number

**Why it matters:** Customs officials at the destination use this to verify that what is in the container matches what was declared. Discrepancies trigger inspections and delays.

## 3. Bill of Lading (B/L)

**What it is:** The contract between the shipper and the ocean carrier. It serves three purposes: receipt of goods, evidence of the shipping contract, and document of title.

**Types:**
- **Master B/L** — issued by the ocean carrier (Maersk, Hapag-Lloyd, etc.)
- **House B/L** — issued by the freight forwarder to the shipper

**Key details:** Shipper, consignee, notify party, port of loading, port of discharge, container number, seal number, description of goods, weight, and freight terms (prepaid or collect).

## 4. Certificate of Title

**What it is:** Proof of ownership for the equipment being exported. Required for used machinery to verify that the seller has the legal right to sell and export the equipment.

**How to obtain it:** Varies by equipment type. Vehicles and certain machinery have formal titles issued by state DMVs. For equipment without formal titles, a **Bill of Sale** with notarized signatures may be accepted.

## 5. AES/EEI Filing (Automated Export System / Electronic Export Information)

**What it is:** A mandatory electronic filing with US Customs and Border Protection (CBP) for any export shipment valued over **$2,500** or requiring an export license.

**Key details:**
- Filed through the Automated Commercial Environment (ACE) system
- Must be filed **at least 24 hours** before the cargo is delivered to the port
- Generates an **Internal Transaction Number (ITN)** that must appear on the Bill of Lading
- Failure to file is a federal violation with penalties up to **$10,000 per occurrence**

**Who files it:** Your freight forwarder or a licensed customs broker.

## 6. USDA Phytosanitary Certificate

**What it is:** A certificate issued by the US Department of Agriculture (USDA) through APHIS (Animal and Plant Health Inspection Service) confirming that the equipment is free of soil, plant material, and pests.

**When it is required:** Almost always required for **agricultural equipment** — combines, tractors, planters, tillage equipment. Many countries also require it for construction equipment that has been used outdoors.

**Process:**
- Equipment must be **thoroughly cleaned and washed** before inspection
- APHIS inspector examines the equipment on-site
- If it passes, a phytosanitary certificate is issued (valid for 14 days)
- If it fails, the equipment must be re-cleaned and re-inspected

**Cost:** $200-$500 depending on the number of pieces inspected.

## 7. Shipper's Letter of Instruction (SLI)

**What it is:** A document from the shipper (you) authorizing your freight forwarder to act on your behalf in all export-related matters — booking ocean freight, filing AES, preparing documentation.

**Why it matters:** Without it, your freight forwarder cannot legally represent you in the export process.

## 8. Insurance Certificate

**What it is:** Proof that the shipment is covered by marine cargo insurance during transit.

**Coverage types:**
- **All Risk** — the broadest coverage, recommended for machinery
- **Free of Particular Average (FPA)** — more limited, covers total loss and major casualties only

**Why you need it:** Ocean carriers' liability is limited to approximately **$500 per package** under the Carriage of Goods by Sea Act. For a combine worth $50,000, that is essentially no coverage. A separate marine cargo policy covers the full declared value.

## Optional / Country-Specific Documents

Depending on the destination, you may also need:

- **Certificate of Origin** — proves the equipment was manufactured in the USA (required for preferential tariff treatment under certain trade agreements)
- **Import Permit** — some countries require the buyer to obtain an import permit before the shipment leaves the USA
- **Fumigation Certificate** — required by some countries in addition to the phytosanitary certificate
- **ANVISA / IBAMA clearance** — specific to Brazil for certain types of equipment
- **Conformity Certificate** — required by some Middle Eastern and African countries

## Let Us Handle the Paperwork

At Meridian Freight, documentation is included in every shipment. We prepare all export documents, coordinate USDA inspections, file AES/EEI, and handle any country-specific requirements. You focus on buying the right equipment — we handle getting it there. [Contact us](/contact) for a free consultation.`,
  },
  {
    slug: "container-types-heavy-machinery",
    title:
      "40ft HC vs Flat Rack vs Open Top: Which Container for Your Machinery?",
    metaTitle:
      "40ft HC vs Flat Rack vs Open Top: Container Guide for Machinery | Meridian Freight",
    metaDescription:
      "Compare 40ft high-cube, flat rack, and open top containers for shipping heavy machinery. Dimensions, weight limits, costs, and when to use each type.",
    keywords: [
      "container types heavy machinery",
      "flat rack container machinery",
      "40ft high cube container dimensions",
      "open top container equipment",
      "shipping container for excavator",
      "heavy equipment container loading",
    ],
    publishedAt: "2026-03-19",
    author: "Meridian Freight Team",
    excerpt:
      "Not sure which container type is right for your machinery shipment? Here is a straightforward comparison of 40ft high-cube, flat rack, and open top containers — with dimensions, weight limits, costs, and recommendations.",
    category: "Guides",
    readingTimeMinutes: 4,
    content: `## Three Container Types, Three Different Use Cases

Choosing the right container for your machinery shipment comes down to three factors: **dimensions**, **weight**, and **budget**. Each container type has trade-offs, and picking the wrong one can mean paying for a flat rack when a standard container would have worked — or worse, discovering at the loading facility that your equipment does not fit.

Here is a clear comparison of the three container types most commonly used for machinery export.

## 40ft High-Cube (HC) Container

The **40ft high-cube** is the workhorse of machinery shipping. It is a standard enclosed steel container with extra height, offering more vertical clearance than a standard 40ft box.

**Interior dimensions:**
- Length: 39'5" (12.03 m)
- Width: 7'8" (2.35 m)
- Height: **8'10" (2.69 m)** — one foot taller than a standard 40ft
- Door opening: 7'6" x 8'5"

**Maximum payload:** 58,450 lbs (26,510 kg)

**Best for:**
- Combines (disassembled), tractors, planters, and smaller construction equipment
- Equipment that can be partially dismantled to fit within dimensions
- Shipments where you want **maximum security** — enclosed on all sides, sealed, weatherproof

**Pros:**
- Lowest ocean freight rate of the three options
- Full weather protection during transit
- Easiest to handle at ports — standard equipment, no special cranes needed
- Can be stacked on vessel (standard stowage)

**Cons:**
- Height and width limitations require dismantling large equipment
- Door opening constrains what can be driven or rolled in
- Cannot handle equipment wider than 7'6" without disassembly

**Typical ocean freight rate:** $3,000-$6,000 depending on route

## Flat Rack Container

A **flat rack** is essentially a container floor with two foldable end walls and no sides or roof. It is designed for oversized and heavy cargo that does not fit in a standard box.

**Dimensions (40ft flat rack):**
- Length: 39'7" (12.06 m)
- Width: 7'3" (2.22 m) between stanchions — but cargo can extend beyond
- Height: No limit (subject to vessel stowage)
- **No side walls or roof** — cargo is secured with chains and straps

**Maximum payload:** 97,000 lbs (44,000 kg) — significantly more than an HC

**Best for:**
- Large excavators, bulldozers, wheel loaders, and cranes
- Equipment that cannot be disassembled enough to fit in a standard container
- Very heavy single pieces (over 58,000 lbs)
- Equipment with irregular shapes

**Pros:**
- Handles oversized and overweight cargo
- No height or width restrictions (within vessel limits)
- Can load from top and sides with cranes
- Higher weight capacity

**Cons:**
- **20-40% more expensive** than a standard 40ft HC in ocean freight
- No weather protection — equipment is exposed to salt spray and rain during transit
- Requires special stowage on vessel (on-deck or underdeck placement)
- Limited availability at some ports
- Equipment must be thoroughly protected against corrosion

**Typical ocean freight rate:** $4,500-$9,000 depending on route and dimensions

## Open Top Container

An **open top** container has standard steel walls and a floor, but the roof is replaced with a removable tarpaulin or is left open entirely. Think of it as a middle ground between a standard HC and a flat rack.

**Interior dimensions (40ft open top):**
- Length: 39'5" (12.03 m)
- Width: 7'8" (2.35 m)
- Height: 7'10" (2.39 m) walls — but cargo can extend above
- Door opening: 7'6" x 7'6"

**Maximum payload:** 57,750 lbs (26,200 kg)

**Best for:**
- Equipment that fits within standard width but exceeds container height
- Machines that need to be loaded by crane from above
- Cargo that is slightly too tall for an HC but does not need a full flat rack

**Pros:**
- Top-loading capability — cranes can place equipment directly in
- Walls provide lateral protection
- Less expensive than a flat rack
- Better availability than flat racks at most ports

**Cons:**
- Top is exposed — tarps provide limited weather protection
- Still has width constraints (same as standard container)
- Slightly lower payload than a standard HC
- Less common than HC containers, so booking may require more lead time

**Typical ocean freight rate:** $3,500-$7,000 depending on route

## Quick Comparison Table

- **40ft HC** — Best rate, full protection, requires dismantling, payload 58,450 lbs
- **Flat Rack** — Highest rate, no size limits, no weather protection, payload 97,000 lbs
- **Open Top** — Mid-range rate, top-loading, partial protection, payload 57,750 lbs

## How We Help You Choose

At Meridian Freight, we assess every machine before recommending a container type. We measure the equipment, calculate what needs to be dismantled, compare the cost of dismantling versus the premium for a flat rack, and give you a clear recommendation with pricing for each option.

Sometimes the answer is obvious — a 30-ton excavator ships on a flat rack, a compact tractor fits in an HC. But often, there is a cost-effective middle ground that requires experience to identify.

[Get a free quote](/contact) and we will recommend the best container option for your specific machinery and destination.`,
  },
  {
    slug: "shipping-machinery-to-brazil",
    title: "Shipping Machinery to Brazil: What Every Buyer Needs to Know",
    metaTitle:
      "Shipping Machinery to Brazil: Customs, Ports & Requirements | Meridian Freight",
    metaDescription:
      "Everything you need to know about shipping machinery from the USA to Brazil — Port Santos, customs clearance, ANVISA/IBAMA requirements, transit times, and common equipment shipped.",
    keywords: [
      "shipping machinery to Brazil",
      "export equipment to Brazil",
      "Port Santos machinery import",
      "Brazil customs heavy equipment",
      "farm equipment export Brazil",
      "ANVISA IBAMA machinery clearance",
    ],
    publishedAt: "2026-03-19",
    author: "Meridian Freight Team",
    excerpt:
      "Brazil is one of the top destinations for US agricultural and construction equipment. Here is what you need to know about ports, customs, transit times, and the import requirements that trip up first-time shippers.",
    category: "Destinations",
    readingTimeMinutes: 4,
    content: `## Brazil: A Top Destination for US Machinery

Brazil is one of the world's largest agricultural producers and one of the top importers of used farm and construction equipment from the United States. The country's massive farming operations — particularly in soybean, corn, sugarcane, and cotton — drive steady demand for high-capacity combines, large-frame tractors, planters, and sprayers. Construction and mining activity across South America further fuels demand for excavators, loaders, and bulldozers.

At Meridian Freight, Brazil is one of our most active shipping lanes. We export combines, tractors, planters, and construction equipment to Brazilian buyers year-round.

## Primary Port: Santos

**Port of Santos** (Porto de Santos), located in São Paulo state, is Brazil's largest and busiest port. It handles roughly **25% of all Brazilian foreign trade** and is the primary entry point for imported machinery.

**Key facts about Santos:**
- Located about 70 km from São Paulo city
- Connected to Brazil's interior by an extensive highway and rail network
- Has dedicated terminals for breakbulk, containers, and project cargo
- Customs processing is well-established but can be slow without proper documentation

Other ports that receive machinery imports include **Paranaguá** (Paraná state, common for agricultural equipment heading to southern Brazil), **Itajaí/Navegantes** (Santa Catarina), and **Suape** (Pernambuco, for shipments to the northeast).

## Transit Times from US Ports

Transit times from major US export ports to Santos:

- **Houston, TX → Santos:** 22-26 days
- **Savannah, GA → Santos:** 18-22 days
- **Newark, NJ → Santos:** 20-25 days
- **Los Angeles, CA → Santos:** 30-35 days (via Panama Canal or transshipment)

The most common routing is **Houston or Savannah to Santos**, with direct services from **Hapag-Lloyd**, **CMA CGM**, **MSC**, and **Maersk**. Direct services (no transshipment) are faster and reduce the risk of delays or container damage at intermediate ports.

## What Equipment Gets Shipped to Brazil

The most commonly exported equipment categories:

- **Combines:** John Deere S-Series (S770, S780, S790), Case IH 7250/8250, AGCO Gleaner — Brazil's large-scale grain operations need high-capacity machines
- **Tractors:** John Deere 8R/9R Series, Case IH Magnum and Steiger, New Holland T8/T9 — for heavy tillage and planting in large fields
- **Planters:** Kinze 3660, John Deere 1775NT, Case IH 2150 — precision planting is increasingly important in Brazilian agriculture
- **Sprayers:** John Deere R-Series, Case IH Patriot — self-propelled sprayers for crop protection
- **Construction:** CAT excavators and loaders, John Deere construction equipment, Komatsu

## Brazil Customs Requirements

Importing machinery into Brazil involves several regulatory requirements beyond standard export documentation. This is where many shipments get delayed.

### Import License (LI)

Brazilian importers must obtain an **Import License (Licença de Importação)** before the goods leave the USA. This is processed through Brazil's **Siscomex** system (Sistema Integrado de Comércio Exterior). For used machinery, the license requires detailed information about the equipment's condition, age, and intended use.

### ANVISA Clearance

**ANVISA** (Agência Nacional de Vigilância Sanitária) is Brazil's health regulatory agency. While primarily focused on food and pharmaceuticals, ANVISA has authority over imported goods that may carry biological contaminants. Agricultural equipment that has been in contact with soil or crops typically requires ANVISA clearance.

### IBAMA Clearance

**IBAMA** (Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis) is Brazil's environmental agency. Equipment containing certain materials (asbestos, specific refrigerants, etc.) or equipment that will be used in environmentally sensitive areas may require IBAMA review and approval.

### Phytosanitary Requirements

Brazil is strict about phytosanitary compliance. All agricultural equipment must be:

- **Thoroughly cleaned** of all soil, plant material, seeds, and biological residue
- **Inspected and certified** by USDA/APHIS before export (Phytosanitary Certificate)
- Subject to **re-inspection at Santos** by Brazilian agricultural inspectors (MAPA — Ministério da Agricultura, Pecuária e Abastecimento)

Failure to meet phytosanitary standards results in the equipment being held at port for cleaning at the importer's expense — or in extreme cases, return to origin.

### Import Duties and Taxes

Brazil has some of the highest import duties in the world. Expect:

- **Import Duty (II):** 14-20% depending on the equipment category and HTS code
- **IPI (Industrialized Products Tax):** 0-15%
- **ICMS (State VAT):** 4-18% depending on the destination state
- **PIS/COFINS (Federal contributions):** ~9.25% combined

The total tax burden can reach **40-60% of the declared equipment value**. This is why many Brazilian buyers focus on used equipment from the USA — even with duties, a well-maintained used machine can cost significantly less than buying new locally.

## Tips for a Smooth Brazil Shipment

- **Start documentation early** — the Import License process can take 2-4 weeks
- **Clean equipment thoroughly** — Brazil's phytosanitary inspections are strict and delays are expensive
- **Work with a Brazilian customs broker** — import clearance in Brazil is complex and benefits from local expertise
- **Declare accurate values** — undervaluation is aggressively audited by Brazilian customs (Receita Federal)
- **Use direct ocean services** — transshipment adds time and risk

## We Ship to Brazil Every Month

Brazil is one of Meridian Freight's core shipping lanes. We know the ports, the documentation requirements, and the carrier schedules. Our team coordinates with Brazilian customs brokers to ensure smooth clearance at Santos, Paranaguá, or whichever port your equipment is destined for.

[Get a free quote](/contact) for your Brazil-bound shipment, or use our [freight calculator](/pricing/calculator) for an instant cost estimate.`,
  },
];

// ── Locale-aware accessors ──────────────────────────────────────────────────
import { blogPostsEs } from "./blog-es";
import { blogPostsRu } from "./blog-ru";

const blogPostsByLocale: Record<string, BlogPost[]> = {
  en: blogPosts,
  es: blogPostsEs,
  ru: blogPostsRu,
};

function getPostsForLocale(locale: string): BlogPost[] {
  return blogPostsByLocale[locale] ?? blogPosts;
}

export function getBlogPostBySlug(slug: string, locale: string = "en"): BlogPost | undefined {
  return getPostsForLocale(locale).find((p) => p.slug === slug);
}

export function getRecentPosts(limit = 5, locale: string = "en"): BlogPost[] {
  return [...getPostsForLocale(locale)]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getAllBlogPosts(locale: string = "en"): BlogPost[] {
  return getPostsForLocale(locale);
}
