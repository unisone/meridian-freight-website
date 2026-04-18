import type { ContainerType, OceanFreightRate } from '@/lib/types/calculator';

export const CALCULATOR_CONTRACT_VERSION = '2026-04-18';

export interface CountryAvailability {
  fortyhc: string[];
  flatrack: string[];
}

const EMPTY_COUNTRY_AVAILABILITY: CountryAvailability = {
  fortyhc: [],
  flatrack: [],
};

export function buildCountryAvailability(
  oceanRates: OceanFreightRate[],
): CountryAvailability {
  const availability = new Map<ContainerType, Set<string>>([
    ['fortyhc', new Set<string>()],
    ['flatrack', new Set<string>()],
  ]);

  for (const rate of oceanRates) {
    const countryCode = rate.destination_country?.trim().toUpperCase();
    if (!countryCode) continue;
    availability.get(rate.container_type)?.add(countryCode);
  }

  return {
    fortyhc: [...(availability.get('fortyhc') ?? [])].sort(),
    flatrack: [...(availability.get('flatrack') ?? [])].sort(),
  };
}

export function getSupportedCountriesForContainer(
  countryAvailability: CountryAvailability | null | undefined,
  containerType: ContainerType | null | undefined,
): string[] {
  if (!countryAvailability || !containerType) return [];
  return countryAvailability[containerType] ?? EMPTY_COUNTRY_AVAILABILITY[containerType];
}

export function isSupportedCountryForContainer(
  countryAvailability: CountryAvailability | null | undefined,
  containerType: ContainerType | null | undefined,
  destinationCountry: string | null | undefined,
): boolean {
  const normalizedCountry = destinationCountry?.trim().toUpperCase();
  if (!normalizedCountry || !containerType || !countryAvailability) return false;
  return getSupportedCountriesForContainer(
    countryAvailability,
    containerType,
  ).includes(normalizedCountry);
}
