/**
 * Shared destination/origin parsing helpers used by both the sync pipeline
 * and the public schedule contract.
 */

const COUNTRY_MAP: Record<string, string> = {
  kazakhstan: "KZ",
  brazil: "BR",
  uruguay: "UY",
  argentina: "AR",
  colombia: "CO",
  chile: "CL",
  peru: "PE",
  ecuador: "EC",
  mexico: "MX",
  "south africa": "ZA",
  australia: "AU",
  "new zealand": "NZ",
  nigeria: "NG",
  ghana: "GH",
  kenya: "KE",
  tanzania: "TZ",
  uganda: "UG",
  ethiopia: "ET",
  mozambique: "MZ",
  zambia: "ZM",
  thailand: "TH",
  vietnam: "VN",
  indonesia: "ID",
  philippines: "PH",
  malaysia: "MY",
  turkey: "TR",
  georgia: "GE",
  uzbekistan: "UZ",
  kyrgyzstan: "KG",
  kyrgystan: "KG",
  tajikistan: "TJ",
  turkmenistan: "TM",
  mongolia: "MN",
  paraguay: "PY",
  bolivia: "BO",
  guatemala: "GT",
  ukraine: "UA",
  france: "FR",
  russia: "RU",
  romania: "RO",
  poland: "PL",
  egypt: "EG",
  lithuania: "LT",
  germany: "DE",
  belgium: "BE",
  netherlands: "NL",
  italy: "IT",
  spain: "ES",
  "united kingdom": "GB",
  china: "CN",
  japan: "JP",
  "south korea": "KR",
  india: "IN",
  pakistan: "PK",
  bangladesh: "BD",
  novorossiysk: "RU",
  новороссийск: "RU",
  kokshetau: "KZ",
  кокшетау: "KZ",
  kostanai: "KZ",
  костанай: "KZ",
  almaty: "KZ",
  алматы: "KZ",
  aktau: "KZ",
  актау: "KZ",
  bishkek: "KG",
  бишкек: "KG",
  batumi: "GE",
  батуми: "GE",
  poti: "GE",
  поти: "GE",
  odessa: "UA",
  одесса: "UA",
  gdynia: "PL",
  alexandria: "EG",
  constanta: "RO",
  istanbul: "TR",
  стамбул: "TR",
  казахстан: "KZ",
  бразилия: "BR",
  уругвай: "UY",
  аргентина: "AR",
  колумбия: "CO",
  чили: "CL",
  перу: "PE",
  эквадор: "EC",
  мексика: "MX",
  "южная африка": "ZA",
  австралия: "AU",
  нигерия: "NG",
  кения: "KE",
  гана: "GH",
  турция: "TR",
  грузия: "GE",
  узбекистан: "UZ",
  кыргызстан: "KG",
  парагвай: "PY",
  боливия: "BO",
  украина: "UA",
  франция: "FR",
  россия: "RU",
  румыния: "RO",
  польша: "PL",
  египет: "EG",
  германия: "DE",
};

const US_STATE_CODES = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

const US_PORT_CITIES = new Set([
  "houston",
  "savannah",
  "norfolk",
  "baltimore",
  "charleston",
  "tacoma",
  "los angeles",
  "long beach",
  "new york",
  "newark",
  "jacksonville",
  "miami",
  "new orleans",
  "oakland",
  "seattle",
  "minneapolis",
  "st louis",
  "st. louis",
  "albion",
]);

export function isUSLocation(destination: string): boolean {
  const trimmed = destination.trim();
  if (!trimmed) return false;

  const stateMatch = trimmed.match(/,\s*([A-Z]{2})$/);
  if (stateMatch && US_STATE_CODES.has(stateMatch[1])) return true;

  const lower = trimmed.toLowerCase();
  for (const city of US_PORT_CITIES) {
    if (lower.includes(city)) return true;
  }

  return false;
}

export function extractCountryCode(destination: string): string | null {
  const lower = destination.toLowerCase().trim();
  const entries = Object.entries(COUNTRY_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [name, code] of entries) {
    if (lower.includes(name)) return code;
  }

  const isoMatch = destination.match(/\b([A-Z]{2})$/);
  if (isoMatch && !US_STATE_CODES.has(isoMatch[1])) {
    return isoMatch[1];
  }

  return null;
}
