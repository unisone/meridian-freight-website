// Step prop interfaces for the v3 wizard. Pure types — NO JSX, NO React.
//
// The COPY object slice (`t`) is typed structurally so step components can read
// the keys they need without importing the full COPY definition (which lives
// in wizard/copy.ts).

import type { CalculatorV3Result } from "@/app/actions/calculator-v3";
import type {
  CalculatorDataV3,
  CalculatorLocale,
  EquipmentQuoteMode,
  EquipmentQuoteProfile,
  FreightEstimateV3,
  RouteOption,
  RoutePreference,
  ShippingMode,
} from "@/lib/calculator-v3/contracts";

// COPY[locale] returns this shape. Defined as a structural alias so the step
// components don't need to import the COPY object directly.
export type WizardCopy = Record<string, string>;

export interface StepEquipmentProps {
  visibleProfiles: EquipmentQuoteProfile[];
  profileId: string;
  showAllProfiles: boolean;
  profileCount: number;
  onSelectProfile: (profile: EquipmentQuoteProfile) => void;
  onShowAll: () => void;
  locale: CalculatorLocale;
  t: WizardCopy;
}

export interface StepSpecsProps {
  profile: EquipmentQuoteProfile | null;
  modeId: ShippingMode;
  quantity: number;
  equipmentValueUsd: number | null;
  enabledMode: EquipmentQuoteMode | null;
  hasRequiredValue: boolean;
  locale: CalculatorLocale;
  t: WizardCopy;
  onSelectMode: (mode: EquipmentQuoteMode) => void;
  onSetQuantity: (quantity: number) => void;
  onSetEquipmentValue: (value: number | null) => void;
  onResetEstimate: () => void;
}

export interface StepRouteProps {
  data: CalculatorDataV3 | null;
  profile: EquipmentQuoteProfile | null;
  enabledMode: EquipmentQuoteMode | null;
  eligibleCountries: string[];
  activeDestinationCountry: string;
  zipCode: string;
  routePreference: RoutePreference;
  showPortTabs: boolean;
  destinationPortKeys: string[];
  selectedDestinationPortKey: string | null;
  routesForCountry: RouteOption[];
  routeOptions: RouteOption[];
  selectedRoute: RouteOption | null;
  preview: FreightEstimateV3 | null;
  step2Done: boolean;
  hasRequiredValue: boolean;
  quantity: number;
  equipmentValueUsd: number | null;
  locale: CalculatorLocale;
  t: WizardCopy;
  onSetDestinationCountry: (country: string) => void;
  onSetDestinationPortKey: (portKey: string) => void;
  onSetRoutePreference: (preference: RoutePreference) => void;
  onSelectRoute: (route: RouteOption) => void;
  onSetZip: (zip: string) => void;
  onResetEstimate: () => void;
}

// Mirrors the existing CalculatorV3EstimateCardProps interface from the
// pre-refactor wizard (lines 1478-1503) verbatim — every prop is pass-through.
export interface EstimateCardProps {
  locale: CalculatorLocale;
  preview: FreightEstimateV3 | null;
  result: CalculatorV3Result | null;
  profile: EquipmentQuoteProfile | null;
  mode: EquipmentQuoteMode | null;
  destinationCountry: string;
  selectedRoute: RouteOption | null;
  isComplete: boolean;
  email: string;
  onEmailChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  company: string;
  onCompanyChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  preferredContact: "email" | "whatsapp";
  onPreferredContactChange: (value: "email" | "whatsapp") => void;
  website: string;
  onWebsiteChange: (value: string) => void;
  isSubmitting: boolean;
  error: string;
  onSubmit: () => void;
  onReset: () => void;
}
