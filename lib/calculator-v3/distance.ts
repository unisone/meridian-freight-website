// ---------------------------------------------------------------------------
// Distance / road-mile estimation
//
// Shared with the chatbot KZ calculator (see CLAUDE.md):
//   R = 3959 (haversine)
//   ROAD_FACTOR = 1.3
//   ZIP coord tables (35 three-digit + 10 one-digit region entries)
// ---------------------------------------------------------------------------

const ROAD_FACTOR = 1.3;

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
