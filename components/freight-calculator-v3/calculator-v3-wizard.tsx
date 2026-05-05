"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalculatorProgressBar } from "@/components/freight-calculator/calculator-progress-bar";
import { getCalculatorDataV3 } from "@/app/actions/calculator-v3-data";
import {
  submitCalculatorV3,
  type CalculatorV3Result,
} from "@/app/actions/calculator-v3";
import { calculateFreightV3 } from "@/lib/calculator-v3/engine";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import { CONTACT, TRACKING } from "@/lib/constants";
import { formatDollar } from "@/lib/calculator-v3/format";
import {
  trackCalcFunnel,
  trackContactClick,
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
import { StepEquipment } from "./wizard/step-equipment";
import { StepRoute } from "./wizard/step-route";
import { StepSpecs } from "./wizard/step-specs";
import type { EstimateCardProps } from "./wizard/types";
import { Link } from "@/i18n/navigation";
import type {
  CalculatorDataV3,
  EquipmentQuoteMode,
  EquipmentQuoteProfile,
  FreightEstimateV3,
  RouteOption,
  RoutePreference,
  ShippingMode,
} from "@/lib/calculator-v3/contracts";

export function CalculatorV3Wizard({ locale }: { locale: string }) {
  const lang = normalizeLocale(locale);
  const t = COPY[lang];
  const [data, setData] = useState<CalculatorDataV3 | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [modeId, setModeId] = useState<ShippingMode>("whole");
  const [quantity, setQuantity] = useState(1);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationPortKey, setDestinationPortKey] = useState<string | null>(null);
  const [routePreference, setRoutePreference] = useState<RoutePreference>("cheapest");
  const [routeId, setRouteId] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [equipmentValueUsd, setEquipmentValueUsd] = useState<number | null>(null);
  const [rateBookSignature, setRateBookSignature] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "whatsapp">(
    "email",
  );
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorV3Result | null>(null);
  const [showAllProfiles, setShowAllProfiles] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const submittingRef = useRef(false);
  const customsTrackedRef = useRef(new Set<string>());

  useEffect(() => {
    getCalculatorDataV3()
      .then((payload) => {
        if (!payload) {
          setDataError(true);
          return;
        }
        setData(payload);
        setRateBookSignature(payload.rateBookSignature);
      })
      .catch(() => setDataError(true))
      .finally(() => setLoading(false));
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

  function resetEstimateState() {
    setResult(null);
    setError("");
  }

  function selectProfile(nextProfile: EquipmentQuoteProfile) {
    const nextMode = nextProfile.modes.find((candidate) => candidate.enabled);
    setProfileId(nextProfile.id);
    setModeId(nextMode?.id ?? "whole");
    setQuantity(nextProfile.defaultQuantity);
    setEquipmentValueUsd(null);
    setDestinationCountry("");
    setDestinationPortKey(null);
    setRouteId(null);
    setZipCode("");
    resetEstimateState();
    trackCalcFunnel("start", {
      equipment_type: getLocalizedText(nextProfile.label, lang),
      container_type: nextMode?.containerType ?? "unknown",
    });
  }

  function selectMode(nextMode: EquipmentQuoteMode) {
    if (!nextMode.enabled) return;
    setModeId(nextMode.id);
    setEquipmentValueUsd(null);
    setDestinationCountry("");
    setDestinationPortKey(null);
    setRouteId(null);
    resetEstimateState();
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
    setRouteId(route.id);
    resetEstimateState();
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
    setDestinationCountry(country);
    setDestinationPortKey(null);
    setRouteId(null);
    resetEstimateState();
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
      setError(t.validEmailError);
      return;
    }
    if (!profile || !enabledMode || !activeDestinationCountry || !selectedRoute || !preview) {
      setError(t.routeRequired);
      return;
    }
    if (enabledMode.requiresEquipmentValue && !hasRequiredValue) {
      setError(t.valueRequired);
      return;
    }
    if (preferredContact === "whatsapp" && !phone.trim()) {
      setError("Phone or WhatsApp number is required when WhatsApp is selected.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

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

      if (res.currentRateBookSignature) {
        setRateBookSignature(res.currentRateBookSignature);
      }

      if (res.success && res.estimate) {
        setResult(res);
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
        setResult(res);
        setError(res.error || "Something went wrong.");
      }
    } catch {
      setError("Failed to calculate. Please try again.");
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }

  function resetAll() {
    setProfileId("");
    setModeId("whole");
    setQuantity(1);
    setDestinationCountry("");
    setDestinationPortKey(null);
    setRoutePreference("cheapest");
    setRouteId(null);
    setZipCode("");
    setEquipmentValueUsd(null);
    setEmail("");
    setName("");
    setCompany("");
    setPhone("");
    setPreferredContact("email");
    setWebsite("");
    setError("");
    setResult(null);
    setMobileSheetOpen(false);
    setShowAllProfiles(false);
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
          ))}
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-[3] space-y-8">
            <div>
              <Skeleton className="mb-4 h-5 w-48" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="opacity-40">
              <Skeleton className="mb-4 h-5 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="opacity-40">
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="hidden flex-[2] lg:block">
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (dataError || !data) {
    return (
      <Card className="mx-auto max-w-2xl border-primary/20 shadow-xl">
        <CardContent className="space-y-4 p-8 text-center">
          <h3 className="text-lg font-bold text-foreground">
            {t.unavailableTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.unavailableDescription}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              render={<Link href="/contact" />}
              className="bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact us
            </Button>
            <Button
              render={
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackContactClick("whatsapp", "calculator_v3_unavailable")
                  }
                />
              }
              variant="outline"
              className="border-emerald-600 py-5 font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              {t.whatsAppUs}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
    onEmailChange: setEmail,
    name,
    onNameChange: setName,
    company,
    onCompanyChange: setCompany,
    phone,
    onPhoneChange: setPhone,
    preferredContact,
    onPreferredContactChange: setPreferredContact,
    website,
    onWebsiteChange: setWebsite,
    isSubmitting,
    error,
    onSubmit: handleSubmit,
    onReset: resetAll,
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
            onShowAll={() => setShowAllProfiles(true)}
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
            onSetQuantity={setQuantity}
            onSetEquipmentValue={setEquipmentValueUsd}
            onResetEstimate={resetEstimateState}
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
            onSetDestinationPortKey={(key) => {
              setDestinationPortKey(key);
              setRouteId(null);
            }}
            onSetRoutePreference={(preference) => {
              setRoutePreference(preference);
              setRouteId(null);
            }}
            onSelectRoute={selectRoute}
            onSetZip={(zip) => {
              setZipCode(zip);
              setRouteId(null);
            }}
            onResetEstimate={resetEstimateState}
          />

          <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
        </div>

        <div className="hidden flex-[2] lg:block">
          <div className="sticky top-24">
            <EstimateCard {...estimateCardProps} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 shadow-2xl">
            <SheetTrigger
              aria-label={t.viewEstimateDetails}
              className="flex items-center gap-2 text-white"
            >
              {preview ? (
                <>
                  <span className="text-xs text-slate-400">Est.</span>
                  <span className="font-mono text-lg font-bold">
                    {formatDollar(preview.freightTotal)}
                  </span>
                </>
              ) : profile ? (
                <span className="text-sm text-slate-400">
                  {t.selectDestinationForEstimate}
                </span>
              ) : (
                <span className="text-sm text-slate-400">
                  {t.selectEquipmentToBegin}
                </span>
              )}
            </SheetTrigger>
            <Button
              size="sm"
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              disabled={!step3Done}
              onClick={() => setMobileSheetOpen(true)}
            >
              {result?.success ? t.viewEstimate : t.bookThisFreight}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          <SheetContent
            side="bottom"
            className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-0"
            showCloseButton={true}
          >
            <SheetHeader className="bg-muted px-5 py-4">
              <SheetTitle>{t.yourFreightEstimate}</SheetTitle>
            </SheetHeader>
            <div className="p-5">
              <EstimateCard {...estimateCardProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}

