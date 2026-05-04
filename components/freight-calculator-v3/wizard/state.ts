// Wizard state machine for the v3 freight calculator.
//
// Pure module: NO React, NO side effects, NO tracking. Reducer can be
// unit-tested in the Vitest node environment without jsdom.

import type { CalculatorV3Result } from "@/app/actions/calculator-v3";
import type {
  CalculatorDataV3,
  RoutePreference,
  ShippingMode,
} from "@/lib/calculator-v3/contracts";

export interface WizardState {
  // data layer
  data: CalculatorDataV3 | null;
  loading: boolean;
  dataError: boolean;
  rateBookSignature: string;
  // equipment step
  profileId: string;
  modeId: ShippingMode;
  quantity: number;
  equipmentValueUsd: number | null;
  showAllProfiles: boolean;
  // route step
  destinationCountry: string;
  destinationPortKey: string | null;
  routePreference: RoutePreference;
  routeId: string | null;
  zipCode: string;
  // contact / email gate
  email: string;
  name: string;
  company: string;
  phone: string;
  preferredContact: "email" | "whatsapp";
  website: string; // honeypot
  // submission state (UI display only — the double-submit guard is a useRef in the orchestrator)
  isSubmitting: boolean;
  error: string;
  result: CalculatorV3Result | null;
  // mobile UI
  mobileSheetOpen: boolean;
}

export type WizardAction =
  | { type: "DATA_LOADED"; payload: CalculatorDataV3 }
  | { type: "DATA_ERROR" }
  | {
      type: "SELECT_PROFILE";
      profileId: string;
      modeId: ShippingMode;
      quantity: number;
    }
  | { type: "SELECT_MODE"; modeId: ShippingMode }
  | { type: "SET_QUANTITY"; quantity: number }
  | { type: "SET_EQUIPMENT_VALUE"; value: number | null }
  | { type: "SET_DESTINATION_COUNTRY"; country: string }
  | { type: "SET_DESTINATION_PORT"; portKey: string | null }
  | { type: "SET_ROUTE_PREFERENCE"; preference: RoutePreference }
  | { type: "SELECT_ROUTE"; routeId: string }
  | { type: "SET_ZIP"; zip: string }
  | { type: "SET_EMAIL"; email: string }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_COMPANY"; company: string }
  | { type: "SET_PHONE"; phone: string }
  | { type: "SET_PREFERRED_CONTACT"; contact: "email" | "whatsapp" }
  | { type: "SET_WEBSITE"; website: string }
  | { type: "SUBMIT_START" }
  | {
      type: "SUBMIT_SUCCESS";
      result: CalculatorV3Result;
      currentRateBookSignature?: string;
    }
  | { type: "SUBMIT_ERROR"; error: string; result?: CalculatorV3Result }
  | { type: "RESET_ESTIMATE" }
  | { type: "RESET_ALL" }
  | { type: "TOGGLE_MOBILE_SHEET"; open: boolean }
  | { type: "SHOW_ALL_PROFILES" };

export const initialWizardState: WizardState = {
  data: null,
  loading: true,
  dataError: false,
  rateBookSignature: "",
  profileId: "",
  modeId: "whole",
  quantity: 1,
  equipmentValueUsd: null,
  showAllProfiles: false,
  destinationCountry: "",
  destinationPortKey: null,
  routePreference: "cheapest",
  routeId: null,
  zipCode: "",
  email: "",
  name: "",
  company: "",
  phone: "",
  preferredContact: "email",
  website: "",
  isSubmitting: false,
  error: "",
  result: null,
  mobileSheetOpen: false,
};

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "DATA_LOADED":
      return {
        ...state,
        data: action.payload,
        rateBookSignature: action.payload.rateBookSignature,
        loading: false,
        dataError: false,
      };
    case "DATA_ERROR":
      return { ...state, dataError: true, loading: false };
    case "SELECT_PROFILE":
      // Cascade reset — mirrors selectProfile() lines 690-705 of the original wizard.
      return {
        ...state,
        profileId: action.profileId,
        modeId: action.modeId,
        quantity: action.quantity,
        equipmentValueUsd: null,
        destinationCountry: "",
        destinationPortKey: null,
        routeId: null,
        zipCode: "",
        result: null,
        error: "",
      };
    case "SELECT_MODE":
      // Cascade reset — mirrors selectMode() lines 707-725 of the original wizard.
      return {
        ...state,
        modeId: action.modeId,
        equipmentValueUsd: null,
        destinationCountry: "",
        destinationPortKey: null,
        routeId: null,
        result: null,
        error: "",
      };
    case "SET_QUANTITY":
      return { ...state, quantity: action.quantity, result: null, error: "" };
    case "SET_EQUIPMENT_VALUE":
      return { ...state, equipmentValueUsd: action.value, result: null, error: "" };
    case "SET_DESTINATION_COUNTRY":
      return {
        ...state,
        destinationCountry: action.country,
        destinationPortKey: null,
        routeId: null,
        result: null,
        error: "",
      };
    case "SET_DESTINATION_PORT":
      return {
        ...state,
        destinationPortKey: action.portKey,
        routeId: null,
        result: null,
        error: "",
      };
    case "SET_ROUTE_PREFERENCE":
      return {
        ...state,
        routePreference: action.preference,
        routeId: null,
        result: null,
        error: "",
      };
    case "SELECT_ROUTE":
      return { ...state, routeId: action.routeId, result: null, error: "" };
    case "SET_ZIP":
      return {
        ...state,
        zipCode: action.zip,
        routeId: null,
        result: null,
        error: "",
      };
    case "SET_EMAIL":
      return { ...state, email: action.email };
    case "SET_NAME":
      return { ...state, name: action.name };
    case "SET_COMPANY":
      return { ...state, company: action.company };
    case "SET_PHONE":
      return { ...state, phone: action.phone };
    case "SET_PREFERRED_CONTACT":
      return { ...state, preferredContact: action.contact };
    case "SET_WEBSITE":
      return { ...state, website: action.website };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: "" };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        result: action.result,
        rateBookSignature:
          action.currentRateBookSignature ?? state.rateBookSignature,
        error: "",
      };
    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        error: action.error,
        result: action.result ?? state.result,
      };
    case "RESET_ESTIMATE":
      return { ...state, result: null, error: "" };
    case "RESET_ALL":
      // Preserve loaded data + rate book signature — only the inputs reset.
      return {
        ...initialWizardState,
        data: state.data,
        loading: false,
        dataError: state.dataError,
        rateBookSignature: state.rateBookSignature,
      };
    case "TOGGLE_MOBILE_SHEET":
      return { ...state, mobileSheetOpen: action.open };
    case "SHOW_ALL_PROFILES":
      return { ...state, showAllProfiles: true };
    default:
      return state;
  }
}
