/**
 * V2 Freight Calculation Engine
 *
 * Real multi-component pricing ported from the chatbot calculator:
 *   Total = US Inland Transport + Packing & Loading + Ocean Freight
 *
 * 40HC Container: ZIP → Albion, IA (packing) → Chicago (rail) → ocean
 *   Total = US Inland + Packing & Loading + Ocean Freight
 *
 * Flatrack: ZIP → nearest US port → ocean
 *   Total = US Inland + Sea Freight & Loading (packing is inside packing_drayage)
 *   NO separate packing cost — packing_drayage covers port-side packing + drayage
 */

import type {
  CalculateFreightParams,
  FreightEstimateV2,
  ContainerType,
  PackingUnit,
  OceanFreightRate,
} from "@/lib/types/calculator";

// ---------------------------------------------------------------------------
// Constants (mirrored from mf-chatbot-ui/lib/kz-calculator/calculate-freight.ts)
// ---------------------------------------------------------------------------

const ROAD_FACTOR = 1.3;
export const DRAYAGE_CHICAGO = 1_800;

const ALBION_IA = { lat: 42.1172, lon: -92.9835 };

export const FLATRACK_PORTS: Record<string, { lat: number; lon: number }> = {
  "Houston, TX":    { lat: 29.7604, lon: -95.3698 },
  "Savannah, GA":   { lat: 32.0809, lon: -81.0912 },
  "Baltimore, MD":  { lat: 39.2904, lon: -76.6122 },
  "Charleston, SC": { lat: 32.7765, lon: -79.9311 },
};

const CARRIER_PREFERENCE = ["HAPAG", "Maersk", "CMA"];

// ---------------------------------------------------------------------------
// ZIP Prefix → Coordinate Mapping
// ---------------------------------------------------------------------------

const ZIP_3DIGIT_COORDS: Record<string, [number, number]> = {
  // Iowa — critical (Albion warehouse at 50005)
  "500": [41.59, -93.62], "501": [41.73, -93.72], "502": [42.03, -93.62],
  "503": [42.50, -92.33], "504": [41.66, -91.53], "505": [42.49, -96.40],
  "506": [42.50, -94.17], "507": [41.26, -91.06], "508": [40.81, -91.11],
  "510": [41.26, -95.86], "511": [41.01, -94.37], "512": [42.03, -93.62],
  "513": [42.49, -90.67], "514": [40.73, -93.10], "515": [41.59, -93.62],
  "520": [42.50, -92.33], "521": [42.03, -92.91], "524": [41.98, -91.67],
  "525": [40.41, -91.38], "527": [42.47, -92.33], "528": [42.03, -91.64],
  // Illinois
  "604": [40.70, -89.65], "610": [41.51, -90.58], "617": [40.12, -88.24],
  "619": [38.63, -90.24], "627": [39.80, -89.64],
  // Indiana
  "460": [39.77, -86.16], "469": [40.42, -86.91], "479": [41.68, -86.25],
  // Kansas
  "666": [39.05, -95.68], "670": [37.69, -97.34],
  // Nebraska
  "680": [41.26, -95.94], "681": [40.81, -96.70], "688": [40.92, -98.34],
  // Minnesota
  "550": [44.98, -93.27], "560": [44.16, -93.99], "561": [45.56, -94.16],
  // North/South Dakota
  "570": [43.55, -96.73], "580": [46.88, -96.79],
  // Wisconsin
  "537": [43.07, -89.40],
  // Missouri
  "640": [39.10, -94.58], "650": [38.63, -90.24],
  // Texas
  "750": [32.78, -96.80], "770": [29.76, -95.37], "787": [30.27, -97.74],
  "794": [31.76, -106.44],
  // Ohio
  "430": [41.50, -81.69], "432": [39.96, -82.99],
};

const ZIP_REGION_COORDS: Record<string, [number, number]> = {
  "0": [42.36, -71.06],  // New England (Boston)
  "1": [40.71, -74.01],  // NY/NJ area
  "2": [38.91, -77.04],  // Mid-Atlantic (DC)
  "3": [33.75, -84.39],  // Southeast (Atlanta)
  "4": [39.96, -82.99],  // Midwest East (Columbus)
  "5": [41.88, -93.10],  // Midwest (Des Moines)
  "6": [38.63, -90.24],  // Central (St Louis)
  "7": [29.76, -95.37],  // South Central (Houston)
  "8": [33.45, -112.07], // Mountain West (Phoenix)
  "9": [37.77, -122.42], // West Coast (San Francisco)
};

// ---------------------------------------------------------------------------
// Haversine Distance
// ---------------------------------------------------------------------------

export function haversineMiles(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function zipToCoords(zip: string | null): [number, number] | null {
  if (!zip || zip.trim().length === 0) return null;
  const cleaned = zip.replace(/\D/g, "").slice(0, 5);
  if (cleaned.length < 1) return null;
  return (
    ZIP_3DIGIT_COORDS[cleaned.slice(0, 3)] ??
    ZIP_REGION_COORDS[cleaned.charAt(0)] ??
    ZIP_REGION_COORDS["5"] // Midwest fallback
  );
}

export function estimateRoadMiles(
  zip: string,
  destLat: number,
  destLon: number,
): number {
  const origin = zipToCoords(zip);
  if (!origin) return 0;
  const straight = haversineMiles(origin[0], origin[1], destLat, destLon);
  return Math.round(straight * ROAD_FACTOR);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function adjustForUnit(
  baseCost: number,
  unit: PackingUnit,
  size: number | null,
): number {
  if (unit === "flat" || size === null || size <= 0) return baseCost;
  return baseCost * size;
}

export function getUnitLabel(unit: PackingUnit): string | null {
  const labels: Record<PackingUnit, string | null> = {
    flat: null, per_row: "rows", per_foot: "feet",
    per_shank: "shanks", per_bottom: "bottoms",
  };
  return labels[unit];
}

function carrierRank(carrier: string): number {
  const idx = CARRIER_PREFERENCE.findIndex((c) =>
    carrier.toUpperCase().includes(c.toUpperCase())
  );
  return idx === -1 ? CARRIER_PREFERENCE.length : idx;
}

export function findBestOceanRate(
  rates: OceanFreightRate[],
  containerType: ContainerType,
  destinationCountry: string,
): OceanFreightRate | null {
  const matching = rates.filter(
    (r) =>
      r.container_type === containerType &&
      r.destination_country?.toUpperCase() === destinationCountry.toUpperCase()
  );

  if (matching.length === 0) return null;

  // Sort: carrier preference first, then cheapest effective cost.
  // 40HC uses ocean_rate + drayage; flatrack uses ocean_rate + packing_drayage.
  matching.sort((a, b) => {
    const rankDiff = carrierRank(a.carrier) - carrierRank(b.carrier);
    if (rankDiff !== 0) return rankDiff;
    const costA = (a.ocean_rate ?? 0) + (containerType === "flatrack" ? (a.packing_drayage ?? 0) : (a.drayage ?? 0));
    const costB = (b.ocean_rate ?? 0) + (containerType === "flatrack" ? (b.packing_drayage ?? 0) : (b.drayage ?? 0));
    return costA - costB;
  });

  return matching[0];
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

export function formatDollar(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ---------------------------------------------------------------------------
// Core Calculator
// ---------------------------------------------------------------------------

export function calculateFreightV2(
  params: CalculateFreightParams,
): FreightEstimateV2 | null {
  const { equipment, equipmentSize, destinationCountry, zipCode, oceanRates } = params;
  const containerType = equipment.container_type;
  const notes: string[] = [];

  // ── Packing ──
  // For 40HC: packing is a separate cost (done at Albion, IA)
  // For Flatrack: packing is INCLUDED in packing_drayage (done at port) — no separate charge
  const isFlatrack = containerType === "flatrack";
  const packingAndLoading = isFlatrack
    ? 0
    : adjustForUnit(equipment.packing_cost, equipment.packing_unit, equipmentSize);

  let packingBreakdown: string | null = null;
  if (!isFlatrack) {
    const unitLabel = getUnitLabel(equipment.packing_unit);
    const unitSingular: Record<string, string> = {
      rows: "row", feet: "foot", shanks: "shank", bottoms: "bottom",
    };
    if (unitLabel && equipmentSize && equipmentSize > 0) {
      const singular = unitSingular[unitLabel] ?? unitLabel;
      packingBreakdown = `${formatDollar(equipment.packing_cost)}/${singular} × ${equipmentSize} ${unitLabel} = ${formatDollar(packingAndLoading)}`;
    }
  }

  // ── Ocean Freight ──
  let oceanFreight = 0;
  let carrier = "";
  let transitTimeDays: string | null = null;
  let originPort = "";
  let destinationPort = "";

  if (containerType === "fortyhc") {
    // 40HC: always from Chicago
    const bestRate = findBestOceanRate(oceanRates, "fortyhc", destinationCountry);
    if (!bestRate) return null;
    oceanFreight = (bestRate.ocean_rate ?? 0) + (bestRate.drayage ?? 0);
    carrier = bestRate.carrier;
    transitTimeDays = bestRate.transit_time_days;
    originPort = "Chicago, IL";
    destinationPort = bestRate.destination_port;
  } else {
    // Flatrack: find best port (cheapest total including local transport)
    if (zipCode) {
      let bestTotal = Infinity;
      let bestRate: OceanFreightRate | null = null;
      let bestPortName = "";
      let bestDistance = 0;
      let bestCarrierRank = Infinity;

      for (const [portName, portCoord] of Object.entries(FLATRACK_PORTS)) {
        const portRates = oceanRates.filter(
          (r) =>
            r.container_type === "flatrack" &&
            r.destination_country?.toUpperCase() === destinationCountry.toUpperCase() &&
            r.origin_port.toLowerCase().includes(portName.split(",")[0].toLowerCase())
        );

        for (const rate of portRates) {
          const miles = estimateRoadMiles(zipCode, portCoord.lat, portCoord.lon);
          const localCost = miles * equipment.delivery_per_mile;
          const seaCost = (rate.ocean_rate ?? 0) + (rate.packing_drayage ?? 0);
          const total = localCost + seaCost;
          const rank = carrierRank(rate.carrier);
          // Cheapest total wins; carrier preference breaks ties
          if (total < bestTotal || (total === bestTotal && rank < bestCarrierRank)) {
            bestTotal = total;
            bestRate = rate;
            bestPortName = portName;
            bestDistance = miles;
            bestCarrierRank = rank;
          }
        }
      }

      if (!bestRate) {
        // No port-specific rates found, try general flatrack rates
        const generalRate = findBestOceanRate(oceanRates, "flatrack", destinationCountry);
        if (!generalRate) return null;
        oceanFreight = (generalRate.ocean_rate ?? 0) + (generalRate.packing_drayage ?? 0);
        carrier = generalRate.carrier;
        transitTimeDays = generalRate.transit_time_days;
        originPort = generalRate.origin_port;
        destinationPort = generalRate.destination_port;

        // Calculate inland to the rate's origin port
        const portCoord = Object.entries(FLATRACK_PORTS).find(([name]) =>
          generalRate.origin_port.toLowerCase().includes(name.split(",")[0].toLowerCase())
        );
        const inlandMiles = portCoord
          ? estimateRoadMiles(zipCode, portCoord[1].lat, portCoord[1].lon)
          : 0;
        const inlandCost = inlandMiles * equipment.delivery_per_mile;

        return {
          containerType,
          equipmentDisplayName: equipment.display_name_en,
          usInlandTransport: Math.round(inlandCost),
          packingAndLoading,
          packingBreakdown,
          oceanFreight,
          carrier,
          transitTimeDays,
          originPort,
          destinationPort,
          destinationCountry,
          estimatedTotal: Math.round(inlandCost + packingAndLoading + oceanFreight),
          totalExcludesInland: false,
          distanceMiles: inlandMiles,
          deliveryRatePerMile: equipment.delivery_per_mile,
          notes,
        };
      }

      oceanFreight = (bestRate.ocean_rate ?? 0) + (bestRate.packing_drayage ?? 0);
      carrier = bestRate.carrier;
      transitTimeDays = bestRate.transit_time_days;
      originPort = bestPortName;
      destinationPort = bestRate.destination_port;

      const inlandCost = bestDistance * equipment.delivery_per_mile;

      return {
        containerType,
        equipmentDisplayName: equipment.display_name_en,
        usInlandTransport: Math.round(inlandCost),
        packingAndLoading,
        packingBreakdown,
        oceanFreight,
        carrier,
        transitTimeDays,
        originPort,
        destinationPort,
        destinationCountry,
        estimatedTotal: Math.round(inlandCost + packingAndLoading + oceanFreight),
        totalExcludesInland: false,
        distanceMiles: bestDistance,
        deliveryRatePerMile: equipment.delivery_per_mile,
        notes,
      };
    } else {
      // No ZIP: pick cheapest flatrack rate, zero inland
      const bestRate = findBestOceanRate(oceanRates, "flatrack", destinationCountry);
      if (!bestRate) return null;
      oceanFreight = (bestRate.ocean_rate ?? 0) + (bestRate.packing_drayage ?? 0);
      carrier = bestRate.carrier;
      transitTimeDays = bestRate.transit_time_days;
      originPort = bestRate.origin_port;
      destinationPort = bestRate.destination_port;
    }
  }

  // ── US Inland Transport (40HC path) ──
  let usInlandTransport: number | null = null;
  let distanceMiles: number | null = null;
  let totalExcludesInland = false;

  if (containerType === "fortyhc") {
    if (zipCode) {
      const milesToAlbion = estimateRoadMiles(zipCode, ALBION_IA.lat, ALBION_IA.lon);
      distanceMiles = milesToAlbion;
      usInlandTransport = Math.round(milesToAlbion * equipment.delivery_per_mile + DRAYAGE_CHICAGO);
    } else {
      usInlandTransport = DRAYAGE_CHICAGO;
      notes.push("Inland transport includes Chicago drayage only. Enter ZIP for full estimate.");
      totalExcludesInland = false; // Drayage is still included
    }
  } else {
    // Flatrack without ZIP
    usInlandTransport = null;
    totalExcludesInland = true;
    notes.push("Enter US ZIP code for inland transport estimate.");
  }

  const estimatedTotal = Math.round(
    (usInlandTransport ?? 0) + packingAndLoading + oceanFreight
  );

  return {
    containerType,
    equipmentDisplayName: equipment.display_name_en,
    usInlandTransport,
    packingAndLoading,
    packingBreakdown,
    oceanFreight,
    carrier,
    transitTimeDays,
    originPort,
    destinationPort,
    destinationCountry,
    estimatedTotal,
    totalExcludesInland,
    distanceMiles,
    deliveryRatePerMile: equipment.delivery_per_mile,
    notes,
  };
}
