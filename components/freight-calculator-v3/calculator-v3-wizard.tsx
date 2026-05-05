"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { track as vercelTrack } from "@vercel/analytics";
import { CalculatorProgressBar } from "@/components/freight-calculator/calculator-progress-bar";
import { getCalculatorDataV3 } from "@/app/actions/calculator-v3-data";
import { submitCalculatorV3 } from "@/app/actions/calculator-v3";
import { calculateFreightV3 } from "@/lib/calculator-v3/engine";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import { TRACKING } from "@/lib/constants";
import {
  trackCalcFunnel,
  trackGA4Event,
  trackGoogleAdsConversion,
  trackPixelEvent,
} from "@/lib/tracking";
import {
  COPY,
  EMAIL_RE,
  countryLabel,
  getRoutes,
  normalizeLocale,
} from "./wizard/copy";
import { EstimateCard } from "./wizard/estimate-card";
import { initialWizardState, wizardReducer } from "./wizard/state";
import { StepEquipment } from "./wizard/step-equipment";
import { StepRoute } from "./wizard/step-route";
import { StepSpecs } from "./wizard/step-specs";
import type { EstimateCardProps } from "./wizard/types";
import {
  WizardLoadingSkeleton,
  WizardMobileSheet,
  WizardUnavailableCard,
} from "./wizard/wizard-shell";
import type {
  EquipmentQuoteMode,
  EquipmentQuoteProfile,
  FreightEstimateV3,
  RouteOption,
} from "@/lib/calculator-v3/contracts";

export function CalculatorV3Wizard({ locale }: { locale: string }) {
  const lang = normalizeLocale(locale);
  const t = COPY[lang];
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const submittingRef = useRef(false);
  const customsTrackedRef = useRef(new Set<string>());

  const {
    data, loading, dataError, rateBookSignature,
    profileId, modeId, quantity, equipmentValueUsd, showAllProfiles,
    destinationCountry, destinationPortKey, routePreference, routeId, zipCode,
    email, name, company, phone, preferredContact, website,
    isSubmitting, error, result, mobileSheetOpen,
  } = state;

  useEffect(() => {
    getCalculatorDataV3()
      .then((payload) => {
        if (!payload) {
          dispatch({ type: "DATA_ERROR" });
          return;
        }
        dispatch({ type: "DATA_LOADED", payload });
      })
      .catch(() => dispatch({ type: "DATA_ERROR" }));
  }, []);

  const profile = useMemo(
    () => data?.profiles.find((candidate) => candidate.id === profileId) ?? null,
    [data, profileId],
  );
  const mode = useMemo(
    () => profile?.modes.find((candidate) => candidate.id === modeId) ?? null,
    [profile, modeId],
  );
  const enabledMode = mode?.enabled ? mode : null;
  const visibleProfiles =
    data && !showAllProfiles && data.profiles.length > 8
      ? data.profiles.slice(0, 8)
      : data?.profiles ?? [];
  const hasRequiredValue =
    !enabledMode?.requiresEquipmentValue ||
    (equipmentValueUsd !== null &&
      Number.isFinite(equipmentValueUsd) &&
      equipmentValueUsd > 0);
  const step1Done = Boolean(profile);
  const step2Done = Boolean(profile && enabledMode && quantity > 0 && hasRequiredValue);

  const eligibleCountries = useMemo(() => {
    if (!data || !enabledMode) return [];
    return data.countries
      .filter((country) =>
        data.routes.some(
          (route) =>
            route.destinationCountry === country &&
            route.containerType === enabledMode.containerType,
        ),
      )
      .sort((a, b) => countryLabel(a).localeCompare(countryLabel(b)));
  }, [data, enabledMode]);

  const activeDestinationCountry =
    destinationCountry && eligibleCountries.includes(destinationCountry)
      ? destinationCountry
      : "";

  const routesForCountry = useMemo(() => {
    if (!data || !enabledMode || !activeDestinationCountry) return [];
    return data.routes.filter(
      (route) =>
        route.containerType === enabledMode.containerType &&
        route.destinationCountry === activeDestinationCountry,
    );
  }, [data, enabledMode, activeDestinationCountry]);

  const destinationPortKeys = useMemo(
    () => [...new Set(routesForCountry.map((route) => route.destination.key))].sort(),
    [routesForCountry],
  );
  const showPortTabs = destinationPortKeys.length > 1;
  const selectedDestinationPortKey = showPortTabs
    ? destinationPortKey && destinationPortKeys.includes(destinationPortKey)
      ? destinationPortKey
      : destinationPortKeys[0] ?? null
    : null;

  const routeOptions = useMemo(
    () =>
      getRoutes({
        data,
        mode: enabledMode,
        destinationCountry: activeDestinationCountry,
        destinationPortKey: selectedDestinationPortKey,
        preference: routePreference,
        quantity,
        equipmentValueUsd,
        zipCode: zipCode || null,
      }),
    [
      data,
      enabledMode,
      activeDestinationCountry,
      selectedDestinationPortKey,
      routePreference,
      quantity,
      equipmentValueUsd,
      zipCode,
    ],
  );

  const selectedRoute = useMemo(() => {
    if (routeId) {
      const exact = routeOptions.find((route) => route.id === routeId);
      if (exact) return exact;
    }
    return routeOptions[0] ?? null;
  }, [routeId, routeOptions]);

  const preview = useMemo<FreightEstimateV3 | null>(() => {
    if (!data || !profile || !enabledMode || !activeDestinationCountry || !step2Done) {
      return null;
    }
    return calculateFreightV3({
      equipmentRates: data.equipment,
      routes: data.routes,
      importCostProfiles: data.importCostProfiles,
      equipmentProfileId: profile.id,
      modeId: enabledMode.id,
      quantity,
      equipmentValueUsd,
      destinationCountry: activeDestinationCountry,
      destinationPortKey: selectedDestinationPortKey,
      routeId: selectedRoute?.id ?? null,
      routePreference,
      zipCode: zipCode || null,
    });
  }, [
    data,
    profile,
    enabledMode,
    activeDestinationCountry,
    selectedDestinationPortKey,
    selectedRoute,
    routePreference,
    quantity,
    equipmentValueUsd,
    zipCode,
    step2Done,
  ]);

  useEffect(() => {
    if (!preview?.importCost.available) return;
    const key = `${preview.equipmentProfileId}:${preview.route.destinationCountry}`;
    if (customsTrackedRef.current.has(key)) return;
    customsTrackedRef.current.add(key);
    trackGA4Event("calculator_customs_viewed", {
      equipment_profile: preview.equipmentProfileId,
      destination_country: preview.route.destinationCountry,
      confidence: preview.importCost.confidence ?? "none",
    });
    vercelTrack("calculator_customs_viewed", {
      equipment_profile: preview.equipmentProfileId,
      destination_country: preview.route.destinationCountry,
    });
  }, [preview]);

  const step3Done =
    step2Done && activeDestinationCountry !== "" && preview !== null;
  const step4Done = result?.success === true;
  const completedSteps =
    (step1Done ? 1 : 0) +
    (step2Done ? 1 : 0) +
    (step3Done ? 1 : 0) +
    (step4Done ? 1 : 0);

  function selectProfile(nextProfile: EquipmentQuoteProfile) {
    const nextMode = nextProfile.modes.find((candidate) => candidate.enabled);
    dispatch({
      type: "SELECT_PROFILE",
      profileId: nextProfile.id,
      modeId: nextMode?.id ?? "whole",
      quantity: nextProfile.defaultQuantity,
    });
    trackCalcFunnel("start", {
      equipment_type: getLocalizedText(nextProfile.label, lang),
      container_type: nextMode?.containerType ?? "unknown",
    });
  }

  function selectMode(nextMode: EquipmentQuoteMode) {
    if (!nextMode.enabled) return;
    dispatch({ type: "SELECT_MODE", modeId: nextMode.id });
    trackGA4Event("calculator_mode_selected", {
      equipment_profile: profileId,
      shipping_mode: nextMode.id,
      container_type: nextMode.containerType,
    });
    vercelTrack("calculator_mode_selected", {
      equipment_profile: profileId,
      shipping_mode: nextMode.id,
      container_type: nextMode.containerType,
    });
  }

  function selectRoute(route: RouteOption) {
    dispatch({ type: "SELECT_ROUTE", routeId: route.id });
    trackGA4Event("calculator_route_selected", {
      equipment_profile: profileId,
      destination_country: route.destinationCountry,
      route_preference: routePreference,
      container_type: route.containerType,
    });
    vercelTrack("calculator_route_selected", {
      equipment_profile: profileId,
      destination_country: route.destinationCountry,
      route_preference: routePreference,
    });
  }

  function selectDestinationCountry(country: string) {
    dispatch({ type: "SET_DESTINATION_COUNTRY", country });
    if (country && profile && enabledMode) {
      trackCalcFunnel("step", {
        step_number: "3",
        step_name: "destination",
        destination_country: country,
      });
      trackCalcFunnel("complete", {
        equipment_type: getLocalizedText(profile.label, lang),
        destination_country: country,
        container_type: enabledMode.containerType,
      });
    }
  }

  async function handleSubmit() {
    if (website || submittingRef.current) return;
    if (!EMAIL_RE.test(email)) {
      dispatch({ type: "SUBMIT_ERROR", error: t.validEmailError });
      return;
    }
    if (!profile || !enabledMode || !activeDestinationCountry || !selectedRoute || !preview) {
      dispatch({ type: "SUBMIT_ERROR", error: t.routeRequired });
      return;
    }
    if (enabledMode.requiresEquipmentValue && !hasRequiredValue) {
      dispatch({ type: "SUBMIT_ERROR", error: t.valueRequired });
      return;
    }
    if (preferredContact === "whatsapp" && !phone.trim()) {
      dispatch({
        type: "SUBMIT_ERROR",
        error: "Phone or WhatsApp number is required when WhatsApp is selected.",
      });
      return;
    }

    submittingRef.current = true;
    dispatch({ type: "SUBMIT_START" });

    try {
      const params = new URLSearchParams(window.location.search);
      const res = await submitCalculatorV3(
        {
          email,
          name,
          company,
          phone,
          preferredContact,
          equipmentProfileId: profile.id,
          modeId: enabledMode.id,
          quantity,
          equipmentValueUsd,
          destinationCountry: activeDestinationCountry,
          destinationPortKey: selectedDestinationPortKey,
          routeId: selectedRoute.id,
          routePreference,
          zipCode,
          rateBookSignature,
          website,
          source_page: window.location.pathname,
          utm_source: params.get("utm_source") || "",
          utm_medium: params.get("utm_medium") || "",
          utm_campaign: params.get("utm_campaign") || "",
          utm_term: params.get("utm_term") || "",
          utm_content: params.get("utm_content") || "",
        },
        lang,
      );

      if (res.success && res.estimate) {
        dispatch({
          type: "SUBMIT_SUCCESS",
          result: res,
          currentRateBookSignature: res.currentRateBookSignature,
        });
        trackGA4Event("generate_lead", {
          event_category: "calculator",
          lead_source: "freight_calculator_v3",
          value: 300,
          currency: "USD",
        });
        trackGA4Event("calculator_lead_submitted", {
          equipment_profile: profile.id,
          shipping_mode: enabledMode.id,
          destination_country: activeDestinationCountry,
          route_preference: routePreference,
        });
        trackGoogleAdsConversion(TRACKING.gadsLeadLabel, 300);
        vercelTrack("generate_lead", { source: "calculator_v3", value: 300 });
        vercelTrack("calculator_lead_submitted", {
          equipment_profile: profile.id,
          shipping_mode: enabledMode.id,
          destination_country: activeDestinationCountry,
        });
        if (res.eventId) {
          trackPixelEvent(
            "Lead",
            { content_name: "freight_calculator_v3" },
            res.eventId,
          );
        }
      } else {
        dispatch({
          type: "SUBMIT_ERROR",
          error: res.error || "Something went wrong.",
          result: res,
        });
      }
    } catch {
      dispatch({
        type: "SUBMIT_ERROR",
        error: "Failed to calculate. Please try again.",
      });
    } finally {
      submittingRef.current = false;
    }
  }

  if (loading) return <WizardLoadingSkeleton />;
  if (dataError || !data) return <WizardUnavailableCard t={t} />;

  const estimateCardProps = {
    locale: lang,
    preview,
    result,
    profile,
    mode: enabledMode,
    destinationCountry: activeDestinationCountry,
    selectedRoute,
    isComplete: step3Done,
    email,
    onEmailChange: (email: string) => dispatch({ type: "SET_EMAIL", email }),
    name,
    onNameChange: (name: string) => dispatch({ type: "SET_NAME", name }),
    company,
    onCompanyChange: (company: string) => dispatch({ type: "SET_COMPANY", company }),
    phone,
    onPhoneChange: (phone: string) => dispatch({ type: "SET_PHONE", phone }),
    preferredContact,
    onPreferredContactChange: (contact: "email" | "whatsapp") =>
      dispatch({ type: "SET_PREFERRED_CONTACT", contact }),
    website,
    onWebsiteChange: (website: string) => dispatch({ type: "SET_WEBSITE", website }),
    isSubmitting,
    error,
    onSubmit: handleSubmit,
    onReset: () => dispatch({ type: "RESET_ALL" }),
  } satisfies EstimateCardProps;

  return (
    <div>
      <CalculatorProgressBar completedSteps={completedSteps} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-[3] space-y-8">
          <StepEquipment
            visibleProfiles={visibleProfiles}
            profileId={profileId}
            showAllProfiles={showAllProfiles}
            profileCount={data.profiles.length}
            onSelectProfile={selectProfile}
            onShowAll={() => dispatch({ type: "SHOW_ALL_PROFILES" })}
            locale={lang}
            t={t}
          />

          <StepSpecs
            profile={profile}
            modeId={modeId}
            quantity={quantity}
            equipmentValueUsd={equipmentValueUsd}
            enabledMode={enabledMode}
            hasRequiredValue={hasRequiredValue}
            locale={lang}
            t={t}
            onSelectMode={selectMode}
            onSetQuantity={(quantity) => dispatch({ type: "SET_QUANTITY", quantity })}
            onSetEquipmentValue={(value) => dispatch({ type: "SET_EQUIPMENT_VALUE", value })}
            onResetEstimate={() => dispatch({ type: "RESET_ESTIMATE" })}
          />

          <StepRoute
            data={data}
            profile={profile}
            enabledMode={enabledMode}
            eligibleCountries={eligibleCountries}
            activeDestinationCountry={activeDestinationCountry}
            zipCode={zipCode}
            routePreference={routePreference}
            showPortTabs={showPortTabs}
            destinationPortKeys={destinationPortKeys}
            selectedDestinationPortKey={selectedDestinationPortKey}
            routesForCountry={routesForCountry}
            routeOptions={routeOptions}
            selectedRoute={selectedRoute}
            preview={preview}
            step2Done={step2Done}
            hasRequiredValue={hasRequiredValue}
            quantity={quantity}
            equipmentValueUsd={equipmentValueUsd}
            locale={lang}
            t={t}
            onSetDestinationCountry={selectDestinationCountry}
            onSetDestinationPortKey={(portKey) => dispatch({ type: "SET_DESTINATION_PORT", portKey })}
            onSetRoutePreference={(preference) => dispatch({ type: "SET_ROUTE_PREFERENCE", preference })}
            onSelectRoute={selectRoute}
            onSetZip={(zip) => dispatch({ type: "SET_ZIP", zip })}
            onResetEstimate={() => dispatch({ type: "RESET_ESTIMATE" })}
          />

          <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
        </div>

        <div className="hidden flex-[2] lg:block">
          <div className="sticky top-24">
            <EstimateCard {...estimateCardProps} />
          </div>
        </div>
      </div>

      <WizardMobileSheet
        open={mobileSheetOpen}
        onOpenChange={(open) => dispatch({ type: "TOGGLE_MOBILE_SHEET", open })}
        preview={preview}
        profile={profile}
        result={result}
        step3Done={step3Done}
        t={t}
        estimateCard={<EstimateCard {...estimateCardProps} />}
      />

      <div className="h-16 lg:hidden" />
    </div>
  );
}
