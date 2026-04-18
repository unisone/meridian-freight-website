/**
 * V2 Freight Calculation Engine
 *
 * Customer-facing freight estimator aligned to the canonical Meridian contract.
 *
 * 40HC Container: ZIP -> Albion, IA (packing) -> Chicago -> ocean
 *   Total = US Inland + Packing & Loading + Ocean Freight
 *
 * Flatrack: ZIP -> nearest US port -> ocean
 *   Total = US Inland + Sea Freight & Loading
 *   NO separate packing cost — flatrack prep is bundled inside the sea line
 */

import type {
  CalculateFreightParams,
  FreightEstimateV2,
  ContainerType,
  PackingUnit,
  OceanFreightRate,
} from "@/lib/types/calculator";
import {
  FLATRACK_INSURANCE_MIN_USD,
  FLATRACK_INTERNAL_BUNDLE_USD,
  FLATRACK_NCB_BY_POL,
  FORTYHC_ORIGIN_PORT,
  STANDARD_INLAND_DELIVERY_RATE,
  getFlatrackInsuranceUsd,
  resolveQuoteContainerType,
} from "@/lib/freight-policy";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROAD_FACTOR = 1.3;

const ALBION_IA = { lat: 42.1172, lon: -92.9835 };

export const FLATRACK_PORTS: Record<string, { lat: number; lon: number }> = {
  "Houston, TX": { lat: 29.7604, lon: -95.3698 },
  "Savannah, GA": { lat: 32.0809, lon: -81.0912 },
  "Baltimore, MD": { lat: 39.2904, lon: -76.6122 },
  "Charleston, SC": { lat: 32.7765, lon: -79.9311 },
};

const CARRIER_PREFERENCE = ["HAPAG", "Maersk", "CMA"];

// ---------------------------------------------------------------------------
// ZIP Prefix -> Coordinate Mapping
// ---------------------------------------------------------------------------

const ZIP_3DIGIT_COORDS: Record<string, [number, number]> = {
  // Iowa — critical (Albion warehouse at 50005)
  "500": [41.59, -93.62],
  "501": [41.73, -93.72],
  "502": [42.03, -93.62],
  "503": [42.5, -92.33],
  "504": [41.66, -91.53],
  "505": [42.49, -96.4],
  "506": [42.5, -94.17],
  "507": [41.26, -91.06],
  "508": [40.81, -91.11],
  "510": [41.26, -95.86],
  "511": [41.01, -94.37],
  "512": [42.03, -93.62],
  "513": [42.49, -90.67],
  "514": [40.73, -93.1],
  "515": [41.59, -93.62],
  "520": [42.5, -92.33],
  "521": [42.03, -92.91],
  "524": [41.98, -91.67],
  "525": [40.41, -91.38],
  "527": [42.47, -92.33],
  "528": [42.03, -91.64],
  // Illinois
  "604": [40.7, -89.65],
  "610": [41.51, -90.58],
  "617": [40.12, -88.24],
  "619": [38.63, -90.24],
  "627": [39.8, -89.64],
  // Indiana
  "460": [39.77, -86.16],
  "469": [40.42, -86.91],
  "479": [41.68, -86.25],
  // Kansas
  "666": [39.05, -95.68],
  "670": [37.69, -97.34],
  // Nebraska
  "680": [41.26, -95.94],
  "681": [40.81, -96.7],
  "688": [40.92, -98.34],
  // Minnesota
  "550": [44.98, -93.27],
  "560": [44.16, -93.99],
  "561": [45.56, -94.16],
  // North/South Dakota
  "570": [43.55, -96.73],
  "580": [46.88, -96.79],
  // Wisconsin
  "537": [43.07, -89.4],
  // Missouri
  "640": [39.1, -94.58],
  "650": [38.63, -90.24],
  // Texas
  "750": [32.78, -96.8],
  "770": [29.76, -95.37],
  "787": [30.27, -97.74],
  "794": [31.76, -106.44],
  // Ohio
  "430": [41.5, -81.69],
  "432": [39.96, -82.99],
};

const ZIP_REGION_COORDS: Record<string, [number, number]> = {
  "0": [42.36, -71.06], // New England (Boston)
  "1": [40.71, -74.01], // NY/NJ area
  "2": [38.91, -77.04], // Mid-Atlantic (DC)
  "3": [33.75, -84.39], // Southeast (Atlanta)
  "4": [39.96, -82.99], // Midwest East (Columbus)
  "5": [41.88, -93.1], // Midwest (Des Moines)
  "6": [38.63, -90.24], // Central (St Louis)
  "7": [29.76, -95.37], // South Central (Houston)
  "8": [33.45, -112.07], // Mountain West (Phoenix)
  "9": [37.77, -122.42], // West Coast (San Francisco)
};

// ---------------------------------------------------------------------------
// Haversine Distance
// ---------------------------------------------------------------------------

export function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusMiles = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

export function zipToCoords(zip: string | null): [number, number] | null {
  if (!zip || zip.trim().length === 0) return null;
  const cleaned = zip.replace(/\D/g, "").slice(0, 5);
  if (cleaned.length < 1) return null;
  return (
    ZIP_3DIGIT_COORDS[cleaned.slice(0, 3)] ??
    ZIP_REGION_COORDS[cleaned.charAt(0)] ??
    ZIP_REGION_COORDS["5"]
  );
}

export function estimateRoadMiles(zip: string, destLat: number, destLon: number): number {
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
    flat: null,
    per_row: "rows",
    per_foot: "feet",
    per_shank: "shanks",
    per_bottom: "bottoms",
  };
  return labels[unit];
}

function carrierRank(carrier: string): number {
  const idx = CARRIER_PREFERENCE.findIndex((c) =>
    carrier.toUpperCase().includes(c.toUpperCase()),
  );
  return idx === -1 ? CARRIER_PREFERENCE.length : idx;
}

function getFlatrackSeaBundle(params: {
  rate: Pick<OceanFreightRate, "origin_port" | "ocean_rate" | "packing_drayage">;
  insuranceUsd: number;
}): number {
  return (
    (params.rate.ocean_rate ?? 0) +
    (params.rate.packing_drayage ?? 0) +
    (FLATRACK_NCB_BY_POL[params.rate.origin_port] ?? 0) +
    FLATRACK_INTERNAL_BUNDLE_USD +
    params.insuranceUsd
  );
}

export function findBestOceanRate(
  rates: OceanFreightRate[],
  containerType: ContainerType,
  destinationCountry: string,
  flatrackInsuranceUsd: number = FLATRACK_INSURANCE_MIN_USD,
): OceanFreightRate | null {
  const matching = rates.filter(
    (r) =>
      r.container_type === containerType &&
      r.destination_country?.toUpperCase() === destinationCountry.toUpperCase(),
  );

  if (matching.length === 0) return null;

  matching.sort((a, b) => {
    const costA =
      containerType === "flatrack"
        ? getFlatrackSeaBundle({
            rate: a,
            insuranceUsd: flatrackInsuranceUsd,
          })
        : (a.ocean_rate ?? 0) + (a.drayage ?? 0);
    const costB =
      containerType === "flatrack"
        ? getFlatrackSeaBundle({
            rate: b,
            insuranceUsd: flatrackInsuranceUsd,
          })
        : (b.ocean_rate ?? 0) + (b.drayage ?? 0);

    if (costA !== costB) return costA - costB;

    return carrierRank(a.carrier) - carrierRank(b.carrier);
  });

  return matching[0];
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

export function formatDollar(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// ---------------------------------------------------------------------------
// Core Calculator
// ---------------------------------------------------------------------------

export function calculateFreightV2(params: CalculateFreightParams): FreightEstimateV2 | null {
  const {
    equipment,
    equipmentSize,
    equipmentValueUsd = null,
    destinationCountry,
    zipCode,
    oceanRates,
  } = params;
  const { containerType } = resolveQuoteContainerType({
    equipmentType: equipment.equipment_type,
    dbContainerType: equipment.container_type,
  });
  const notes: string[] = [];

  const isFlatrack = containerType === "flatrack";
  const packingAndLoading = isFlatrack
    ? 0
    : adjustForUnit(equipment.packing_cost, equipment.packing_unit, equipmentSize);

  let packingBreakdown: string | null = null;
  if (!isFlatrack) {
    const unitLabel = getUnitLabel(equipment.packing_unit);
    const unitSingular: Record<string, string> = {
      rows: "row",
      feet: "foot",
      shanks: "shank",
      bottoms: "bottom",
    };
    if (unitLabel && equipmentSize && equipmentSize > 0) {
      const singular = unitSingular[unitLabel] ?? unitLabel;
      packingBreakdown = `${formatDollar(equipment.packing_cost)}/${singular} × ${equipmentSize} ${unitLabel} = ${formatDollar(packingAndLoading)}`;
    }
  }

  let oceanFreight = 0;
  let carrier = "";
  let transitTimeDays: string | null = null;
  let originPort = "";
  let destinationPort = "";
  let usInlandTransport: number | null = null;
  let distanceMiles: number | null = null;
  let totalExcludesInland = false;

  if (containerType === "fortyhc") {
    const chicagoRates = oceanRates.filter((r) =>
      r.origin_port.toLowerCase().includes("chicago"),
    );
    const bestRate = findBestOceanRate(chicagoRates, "fortyhc", destinationCountry);
    if (!bestRate) return null;

    oceanFreight = (bestRate.ocean_rate ?? 0) + (bestRate.drayage ?? 0);
    carrier = bestRate.carrier;
    transitTimeDays = bestRate.transit_time_days;
    originPort = FORTYHC_ORIGIN_PORT;
    destinationPort = bestRate.destination_port;

    if (zipCode) {
      distanceMiles = estimateRoadMiles(zipCode, ALBION_IA.lat, ALBION_IA.lon);
      usInlandTransport = Math.round(distanceMiles * STANDARD_INLAND_DELIVERY_RATE);
    } else {
      totalExcludesInland = true;
      notes.push("Enter ZIP for inland transport estimate.");
    }
  } else {
    const flatrackInsuranceUsd = getFlatrackInsuranceUsd(equipmentValueUsd);
    let bestTotal = Infinity;
    let bestRate: OceanFreightRate | null = null;
    let bestPortName = "";
    let bestCarrierRank = Infinity;

    for (const [portName, portCoord] of Object.entries(FLATRACK_PORTS)) {
      const portRates = oceanRates.filter(
        (r) =>
          r.container_type === "flatrack" &&
          r.destination_country?.toUpperCase() === destinationCountry.toUpperCase() &&
          r.origin_port.toLowerCase().includes(portName.split(",")[0].toLowerCase()),
      );

      for (const rate of portRates) {
        const miles = zipCode ? estimateRoadMiles(zipCode, portCoord.lat, portCoord.lon) : 0;
        const inlandCost = miles * STANDARD_INLAND_DELIVERY_RATE;
        const seaBundle = getFlatrackSeaBundle({
          rate: {
            origin_port: portName,
            ocean_rate: rate.ocean_rate,
            packing_drayage: rate.packing_drayage,
          },
          insuranceUsd: flatrackInsuranceUsd,
        });
        const total = inlandCost + seaBundle;
        const rank = carrierRank(rate.carrier);
        if (total < bestTotal || (total === bestTotal && rank < bestCarrierRank)) {
          bestTotal = total;
          bestRate = rate;
          bestPortName = portName;
          bestCarrierRank = rank;
          distanceMiles = zipCode ? miles : null;
        }
      }
    }

    if (!bestRate) {
      const generalRate = findBestOceanRate(
        oceanRates,
        "flatrack",
        destinationCountry,
        flatrackInsuranceUsd,
      );
      if (!generalRate) return null;

      const matchedPort = Object.keys(FLATRACK_PORTS).find((portName) =>
        generalRate.origin_port.toLowerCase().includes(portName.split(",")[0].toLowerCase()),
      );

      if (zipCode && matchedPort) {
        distanceMiles = estimateRoadMiles(
          zipCode,
          FLATRACK_PORTS[matchedPort].lat,
          FLATRACK_PORTS[matchedPort].lon,
        );
        usInlandTransport = Math.round(distanceMiles * STANDARD_INLAND_DELIVERY_RATE);
      } else {
        totalExcludesInland = true;
        notes.push("Enter ZIP for inland transport estimate.");
      }

      oceanFreight = Math.round(
        getFlatrackSeaBundle({
          rate: {
            origin_port: matchedPort ?? generalRate.origin_port,
            ocean_rate: generalRate.ocean_rate,
            packing_drayage: generalRate.packing_drayage,
          },
          insuranceUsd: flatrackInsuranceUsd,
        }),
      );
      carrier = generalRate.carrier;
      transitTimeDays = generalRate.transit_time_days;
      originPort = generalRate.origin_port;
      destinationPort = generalRate.destination_port;
    } else {
      oceanFreight = Math.round(
        getFlatrackSeaBundle({
          rate: {
            origin_port: bestPortName,
            ocean_rate: bestRate.ocean_rate,
            packing_drayage: bestRate.packing_drayage,
          },
          insuranceUsd: flatrackInsuranceUsd,
        }),
      );
      carrier = bestRate.carrier;
      transitTimeDays = bestRate.transit_time_days;
      originPort = bestPortName;
      destinationPort = bestRate.destination_port;
      if (distanceMiles !== null) {
        usInlandTransport = Math.round(distanceMiles * STANDARD_INLAND_DELIVERY_RATE);
      } else {
        totalExcludesInland = true;
        notes.push("Enter ZIP for inland transport estimate.");
      }
    }
  }

  const estimatedTotal = Math.round(
    (usInlandTransport ?? 0) + packingAndLoading + oceanFreight,
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
    deliveryRatePerMile: STANDARD_INLAND_DELIVERY_RATE,
    notes,
  };
}
