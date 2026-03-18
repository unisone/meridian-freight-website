/**
 * Lat/lon coordinates for origin and destination ports used by the freight calculator.
 * These power the interactive route globe visualization.
 */

// Origin ports (from lib/freight-engine-v2.ts)
export const PORT_COORDINATES: Record<string, [lat: number, lon: number]> = {
  // US origins
  "Chicago, IL": [41.88, -87.63],
  "Houston, TX": [29.76, -95.37],
  "Savannah, GA": [32.08, -81.09],
  "Baltimore, MD": [39.29, -76.61],
  "Charleston, SC": [32.78, -79.93],

  // South America
  Montevideo: [-34.88, -56.17],
  "Buenos Aires": [-34.6, -58.38],
  Santos: [-23.96, -46.33],
  Paranagua: [-25.52, -48.51],
  Buenaventura: [3.88, -77.02],
  Cartagena: [10.39, -75.51],
  "San Antonio": [-33.59, -71.62],
  Valparaiso: [-33.05, -71.63],
  Callao: [-12.07, -77.15],
  Guayaquil: [-2.2, -79.9],
  Arica: [-18.48, -70.33],
  Asuncion: [-25.26, -57.58],

  // Central America & Caribbean
  Manzanillo: [19.05, -104.31],
  Veracruz: [19.19, -96.13],
  "Lazaro Cardenas": [17.96, -102.18],
  Colon: [9.35, -79.9],
  "Puerto Limon": [10.0, -83.03],
  "Puerto Quetzal": [13.92, -90.79],
  "Puerto Cortes": [15.83, -87.95],
  Acajutla: [13.59, -89.83],
  "Santo Domingo": [18.47, -69.88],
  "Caucedo": [18.43, -69.63],
  "La Guaira": [10.6, -66.93],
  "Point Lisas": [10.4, -61.47],
  "Port of Spain": [10.65, -61.52],
  Kingston: [17.97, -76.79],
  "San Juan": [18.46, -66.1],
  Nassau: [25.06, -77.35],
  "Port-au-Prince": [18.56, -72.34],

  // Africa
  Durban: [-29.87, 31.03],
  "Cape Town": [-33.92, 18.42],
  Mombasa: [-4.04, 39.67],
  "Dar es Salaam": [-6.82, 39.28],
  Tema: [5.62, -0.02],
  Lagos: [6.45, 3.39],
  Apapa: [6.45, 3.36],
  Dakar: [14.69, -17.44],
  Algiers: [36.77, 3.06],
  Alexandria: [31.2, 29.92],
  "Walvis Bay": [-22.96, 14.51],

  // Europe & Central Asia
  Aktau: [43.65, 51.15],
  Batumi: [41.64, 41.64],
  Poti: [42.15, 41.67],
  Mersin: [36.8, 34.63],
  Constanta: [44.17, 28.65],
  Varna: [43.19, 27.92],

  // Asia & Oceania
  Busan: [35.1, 129.04],
  Shanghai: [31.23, 121.47],
  "Hong Kong": [22.32, 114.17],
  Vladivostok: [43.12, 131.88],
  "Jebel Ali": [25.01, 55.06],
  Melbourne: [-37.82, 144.95],
};

/**
 * Fallback: country code → approximate capital/major city coordinates.
 * Used when the destination port name isn't found in PORT_COORDINATES.
 */
export const COUNTRY_COORDINATES: Record<string, [lat: number, lon: number]> = {
  UY: [-34.88, -56.17],
  AR: [-34.6, -58.38],
  BR: [-23.55, -46.63],
  CO: [4.71, -74.07],
  CL: [-33.45, -70.67],
  PE: [-12.05, -77.04],
  EC: [-2.17, -79.92],
  MX: [19.43, -99.13],
  BO: [-16.5, -68.15],
  PY: [-25.26, -57.58],
  PA: [9.0, -79.52],
  CR: [9.93, -84.08],
  GT: [14.63, -90.51],
  HN: [14.07, -87.19],
  SV: [13.69, -89.19],
  DO: [18.47, -69.88],
  VE: [10.49, -66.88],
  TT: [10.65, -61.51],
  JM: [18.0, -76.79],
  PR: [18.47, -66.12],
  BS: [25.05, -77.34],
  HT: [18.54, -72.34],
  ZA: [-33.92, 18.42],
  KE: [-1.29, 36.82],
  TZ: [-6.79, 39.28],
  GH: [5.56, -0.19],
  NG: [6.52, 3.38],
  SN: [14.72, -17.47],
  KZ: [43.24, 76.95],
  GE: [41.69, 44.8],
  TR: [41.01, 28.98],
  RO: [44.43, 26.1],
  BG: [42.7, 23.32],
  KR: [37.57, 126.98],
  CN: [31.23, 121.47],
  HK: [22.32, 114.17],
  RU: [55.76, 37.62],
  AE: [25.2, 55.27],
  AU: [-33.87, 151.21],
  DZ: [36.75, 3.04],
  EG: [30.04, 31.24],
  NA: [-22.56, 17.08],
};

/**
 * Resolve port or country to coordinates.
 * Tries port name first, then country code fallback.
 */
export function resolveCoordinates(
  portName: string | null,
  countryCode: string | null
): [number, number] | null {
  if (portName && PORT_COORDINATES[portName]) {
    return PORT_COORDINATES[portName];
  }
  if (countryCode && COUNTRY_COORDINATES[countryCode]) {
    return COUNTRY_COORDINATES[countryCode];
  }
  return null;
}
