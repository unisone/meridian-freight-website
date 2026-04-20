"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DollarSign,
  Mail,
  MessageCircle,
  PackageCheck,
  Route,
  Ship,
  Truck,
} from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCalculatorDataV3 } from "@/app/actions/calculator-v3-data";
import {
  submitCalculatorV3,
  type CalculatorV3Result,
} from "@/app/actions/calculator-v3";
import {
  calculateFreightV3,
  compareRoutesForFreightV3,
  getV3RouteFreightSortCost,
} from "@/lib/calculator-v3/engine";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import { getRouteServiceCostUsd } from "@/lib/calculator-v3/routes";
import { CONTACT, TRACKING } from "@/lib/constants";
import { formatDollar } from "@/lib/freight-engine-v2";
import {
  trackContactClick,
  trackGA4Event,
  trackGoogleAdsConversion,
  trackPixelEvent,
} from "@/lib/tracking";
import {
  COUNTRY_NAMES,
  type ContainerType,
} from "@/lib/types/calculator";
import type {
  CalculatorDataV3,
  CalculatorLocale,
  EquipmentQuoteMode,
  EquipmentQuoteProfile,
  FreightEstimateV3,
  RouteOption,
  RoutePreference,
} from "@/lib/calculator-v3/contracts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TARGET_COUNTRIES = new Set(["AR", "CL", "UY", "PY", "BO"]);

const MISSING_INPUT_LABELS: Record<string, Record<CalculatorLocale, string>> = {
  equipment_value: {
    en: "equipment value",
    es: "valor del equipo",
    ru: "стоимость техники",
  },
  local_transport: {
    en: "U.S. ZIP / inland transport",
    es: "ZIP de EE.UU. / transporte interno",
    ru: "ZIP США / внутренний транспорт",
  },
  packing_and_loading: {
    en: "packing and loading",
    es: "embalaje y carga",
    ru: "упаковка и погрузка",
  },
  ocean_freight: {
    en: "ocean freight",
    es: "flete maritimo",
    ru: "морской фрахт",
  },
  broker_confirmation: {
    en: "broker confirmation",
    es: "confirmacion del broker",
    ru: "подтверждение брокера",
  },
};

const COPY = {
  en: {
    unavailableTitle: "Calculator unavailable",
    unavailableBody: "Live rate data is temporarily unavailable. Meridian can still prepare a manual quote.",
    whatsapp: "WhatsApp Meridian",
    stepEquipment: "Equipment",
    stepRoute: "Route",
    stepEstimate: "Estimate",
    stepContact: "Contact",
    shippingMode: "Shipping mode",
    country: "Country",
    destinationPort: "Destination port",
    allPorts: "Best available",
    routePreference: "Route preference",
    cheapest: "Cheapest",
    fastest: "Fastest",
    routeCard: "Route",
    transit: "Transit",
    notPublished: "Not published",
    quantity: "Quantity",
    zip: "U.S. ZIP",
    value: "Equipment value",
    valueHelp: "Required for whole-unit routes and customs estimates.",
    freightTotal: "Estimated freight to port",
    compliancePrep: "Compliance prep",
    freightPlusCompliance: "Freight + compliance prep",
    quoteConfirmed: "Quote-confirmed",
    brokerConfirmed: "Confirm with broker",
    notIncluded: "Not included",
    missingInputs: "Missing inputs",
    importEstimate: "Indicative import-cost estimate",
    unavailable: "Not available",
    lineItems: "Line items",
    dedicated: "Dedicated-container comparison",
    notes: "Notes",
    warnings: "Warnings",
    email: "Email",
    name: "Name",
    company: "Company",
    phone: "Phone / WhatsApp",
    preferredContact: "Preferred contact",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    submit: "Email my estimate",
    submitting: "Sending...",
    success: "Estimate sent. Meridian has the V3 route, policy, and contact details.",
    emailRequired: "Enter a valid email.",
    valueRequired: "Enter equipment value for this mode.",
    routeRequired: "Select a route before submitting.",
    preview: "Preview route",
    modeUnavailable: "Confirm with Meridian",
    policy: "Policy",
  },
  es: {
    unavailableTitle: "Calculadora no disponible",
    unavailableBody: "Las tarifas en vivo no estan disponibles temporalmente. Meridian puede preparar una cotizacion manual.",
    whatsapp: "WhatsApp Meridian",
    stepEquipment: "Equipo",
    stepRoute: "Ruta",
    stepEstimate: "Estimacion",
    stepContact: "Contacto",
    shippingMode: "Modo de envio",
    country: "Pais",
    destinationPort: "Puerto destino",
    allPorts: "Mejor disponible",
    routePreference: "Preferencia de ruta",
    cheapest: "Mas barata",
    fastest: "Mas rapida",
    routeCard: "Ruta",
    transit: "Transito",
    notPublished: "No publicado",
    quantity: "Cantidad",
    zip: "ZIP en EE.UU.",
    value: "Valor del equipo",
    valueHelp: "Requerido para envios completos y estimaciones aduaneras.",
    freightTotal: "Flete estimado al puerto",
    compliancePrep: "Preparacion de cumplimiento",
    freightPlusCompliance: "Flete + preparacion",
    quoteConfirmed: "Confirmar cotizacion",
    brokerConfirmed: "Confirmar con broker",
    notIncluded: "No incluido",
    missingInputs: "Datos faltantes",
    importEstimate: "Estimacion indicativa de importacion",
    unavailable: "No disponible",
    lineItems: "Lineas",
    dedicated: "Comparacion con contenedor dedicado",
    notes: "Notas",
    warnings: "Avisos",
    email: "Email",
    name: "Nombre",
    company: "Empresa",
    phone: "Telefono / WhatsApp",
    preferredContact: "Contacto preferido",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    submit: "Enviar estimacion",
    submitting: "Enviando...",
    success: "Estimacion enviada. Meridian tiene la ruta V3, politica y contacto.",
    emailRequired: "Ingrese un email valido.",
    valueRequired: "Ingrese el valor del equipo para este modo.",
    routeRequired: "Seleccione una ruta antes de enviar.",
    preview: "Ruta preliminar",
    modeUnavailable: "Confirmar con Meridian",
    policy: "Politica",
  },
  ru: {
    unavailableTitle: "Калькулятор недоступен",
    unavailableBody: "Живые тарифы временно недоступны. Meridian подготовит ручной расчет.",
    whatsapp: "WhatsApp Meridian",
    stepEquipment: "Техника",
    stepRoute: "Маршрут",
    stepEstimate: "Расчет",
    stepContact: "Контакт",
    shippingMode: "Способ отправки",
    country: "Страна",
    destinationPort: "Порт назначения",
    allPorts: "Лучший вариант",
    routePreference: "Приоритет маршрута",
    cheapest: "Дешевле",
    fastest: "Быстрее",
    routeCard: "Маршрут",
    transit: "Транзит",
    notPublished: "Не опубликовано",
    quantity: "Количество",
    zip: "ZIP в США",
    value: "Стоимость техники",
    valueHelp: "Нужно для отправки целиком и импортной оценки.",
    freightTotal: "Оценка фрахта до порта",
    compliancePrep: "Подготовка к требованиям",
    freightPlusCompliance: "Фрахт + подготовка",
    quoteConfirmed: "Подтвердить в квоте",
    brokerConfirmed: "Подтвердить с брокером",
    notIncluded: "Не включено",
    missingInputs: "Не хватает данных",
    importEstimate: "Ориентировочная импортная оценка",
    unavailable: "Недоступно",
    lineItems: "Строки расчета",
    dedicated: "Сравнение с отдельным контейнером",
    notes: "Примечания",
    warnings: "Предупреждения",
    email: "Email",
    name: "Имя",
    company: "Компания",
    phone: "Телефон / WhatsApp",
    preferredContact: "Предпочтительный контакт",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    submit: "Отправить расчет",
    submitting: "Отправка...",
    success: "Расчет отправлен. Meridian получил маршрут V3, политику и контакты.",
    emailRequired: "Укажите корректный email.",
    valueRequired: "Укажите стоимость техники для этого способа.",
    routeRequired: "Выберите маршрут перед отправкой.",
    preview: "Предварительный маршрут",
    modeUnavailable: "Подтвердить с Meridian",
    policy: "Политика",
  },
} as const;

function normalizeLocale(locale: string): CalculatorLocale {
  return locale === "es" || locale === "ru" ? locale : "en";
}

function countryLabel(country: string): string {
  return COUNTRY_NAMES[country] ?? country;
}

function routeDestinationLabel(route: RouteOption): string {
  return `${route.destination.label} (${countryLabel(route.destinationCountry)} route)`;
}

function routeCostLabel(input: {
  route: RouteOption;
  mode: EquipmentQuoteMode;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): string {
  if (input.zipCode && input.route.containerType === "flatrack") {
    return formatDollar(getV3RouteFreightSortCost(input));
  }
  return formatDollar(getRouteServiceCostUsd(input.route));
}

function missingInputLabel(key: string, locale: CalculatorLocale): string {
  return MISSING_INPUT_LABELS[key]?.[locale] ?? key.replace(/_/g, " ");
}

function containerLabel(containerType: ContainerType): string {
  return containerType === "fortyhc" ? "40HC" : "Flat rack";
}

function getModeIcon(mode: EquipmentQuoteMode) {
  return mode.containerType === "flatrack" ? Ship : PackageCheck;
}

function getRoutes(input: {
  data: CalculatorDataV3 | null;
  mode: EquipmentQuoteMode | null;
  destinationCountry: string;
  destinationPortKey: string | null;
  preference: RoutePreference;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): RouteOption[] {
  if (!input.data || !input.mode || !input.destinationCountry) return [];
  return input.data.routes
    .filter(
      (route) =>
        route.containerType === input.mode?.containerType &&
        route.destinationCountry === input.destinationCountry &&
        (!input.destinationPortKey || route.destination.key === input.destinationPortKey),
    )
    .sort(
      compareRoutesForFreightV3({
        mode: input.mode,
        quantity: input.quantity,
        equipmentValueUsd: input.equipmentValueUsd,
        zipCode: input.zipCode,
        preference: input.preference,
      }),
    );
}

function getDestinationPortLabel(
  routes: RouteOption[],
  key: string,
): string {
  return routes.find((route) => route.destination.key === key)?.destination.label ?? key;
}

function unavailablePanel(locale: CalculatorLocale) {
  const t = COPY[locale];
  return (
    <div className="border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h2 className="text-lg font-semibold text-amber-950">{t.unavailableTitle}</h2>
          <p className="mt-1 text-sm text-amber-900">{t.unavailableBody}</p>
          <Button
            className="mt-4"
            size="sm"
            render={
              <a
                href={CONTACT.whatsappUrl}
                onClick={() => trackContactClick("whatsapp", "calculator_v3_unavailable")}
              />
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t.whatsapp}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CalculatorV3Wizard({ locale }: { locale: string }) {
  const lang = normalizeLocale(locale);
  const t = COPY[lang];
  const [data, setData] = useState<CalculatorDataV3 | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [modeId, setModeId] = useState<"whole" | "container">("whole");
  const [quantity, setQuantity] = useState(1);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationPortKey, setDestinationPortKey] = useState<string | null>(null);
  const [routePreference, setRoutePreference] = useState<RoutePreference>("cheapest");
  const [routeId, setRouteId] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [equipmentValueUsd, setEquipmentValueUsd] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "whatsapp">("email");
  const [website, setWebsite] = useState("");
  const [rateBookSignature, setRateBookSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorV3Result | null>(null);
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
        const initialProfile = payload.profiles[0];
        if (initialProfile) {
          setProfileId(initialProfile.id);
          setModeId(initialProfile.modes.find((mode) => mode.enabled)?.id ?? "whole");
          setQuantity(initialProfile.defaultQuantity);
        }
        const preferredCountry = payload.countries.find((country) => country === "AR") ?? payload.countries[0] ?? "";
        setDestinationCountry(preferredCountry);
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

  const eligibleCountries = useMemo(() => {
    if (!data || !mode) return [];
    return data.countries.filter((country) =>
      data.routes.some(
        (route) =>
          route.destinationCountry === country &&
          route.containerType === mode.containerType,
      ),
    );
  }, [data, mode]);

  useEffect(() => {
    if (!profile) return;
    if (!profile.modes.some((candidate) => candidate.id === modeId && candidate.enabled)) {
      setModeId(profile.modes.find((candidate) => candidate.enabled)?.id ?? "whole");
    }
    setQuantity((current) =>
      Math.min(Math.max(current || profile.defaultQuantity, 1), profile.maxQuantity),
    );
  }, [profile, modeId]);

  useEffect(() => {
    if (!destinationCountry || eligibleCountries.includes(destinationCountry)) return;
    setDestinationCountry(eligibleCountries[0] ?? "");
    setDestinationPortKey(null);
    setRouteId(null);
  }, [destinationCountry, eligibleCountries]);

  const routesForCountry = useMemo(() => {
    if (!data || !mode || !destinationCountry) return [];
    return data.routes.filter(
      (route) =>
        route.containerType === mode.containerType &&
        route.destinationCountry === destinationCountry,
    );
  }, [data, mode, destinationCountry]);

  const destinationPortKeys = useMemo(
    () => [...new Set(routesForCountry.map((route) => route.destination.key))].sort(),
    [routesForCountry],
  );
  const showPortTabs =
    destinationPortKeys.length > 1 &&
    (TARGET_COUNTRIES.has(destinationCountry) || destinationCountry === "CL" || destinationCountry === "BO");

  useEffect(() => {
    if (!showPortTabs) {
      setDestinationPortKey(null);
      return;
    }
    if (!destinationPortKey || !destinationPortKeys.includes(destinationPortKey)) {
      setDestinationPortKey(destinationPortKeys[0] ?? null);
    }
  }, [destinationPortKey, destinationPortKeys, showPortTabs]);

  const routeOptions = useMemo(
    () =>
      getRoutes({
        data,
        mode,
        destinationCountry,
        destinationPortKey: showPortTabs ? destinationPortKey : null,
        preference: routePreference,
        quantity,
        equipmentValueUsd,
        zipCode: zipCode || null,
      }),
    [
      data,
      mode,
      destinationCountry,
      destinationPortKey,
      routePreference,
      quantity,
      equipmentValueUsd,
      zipCode,
      showPortTabs,
    ],
  );

  const selectedRoute = useMemo(() => {
    if (routeId) {
      const exact = routeOptions.find((route) => route.id === routeId);
      if (exact) return exact;
    }
    return routeOptions[0] ?? null;
  }, [routeId, routeOptions]);

  useEffect(() => {
    if (routeId && !routeOptions.some((route) => route.id === routeId)) {
      setRouteId(null);
    }
  }, [routeId, routeOptions]);

  const preview = useMemo<FreightEstimateV3 | null>(() => {
    if (!data || !profile || !mode || !destinationCountry) return null;
    return calculateFreightV3({
      equipmentRates: data.equipment,
      routes: data.routes,
      importCostProfiles: data.importCostProfiles,
      equipmentProfileId: profile.id,
      modeId: mode.id,
      quantity,
      equipmentValueUsd,
      destinationCountry,
      destinationPortKey: showPortTabs ? destinationPortKey : null,
      routeId: selectedRoute?.id ?? null,
      routePreference,
      zipCode: zipCode || null,
    });
  }, [
    data,
    profile,
    mode,
    destinationCountry,
    destinationPortKey,
    selectedRoute,
    routePreference,
    quantity,
    equipmentValueUsd,
    zipCode,
    showPortTabs,
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

  function selectProfile(nextProfile: EquipmentQuoteProfile) {
    setProfileId(nextProfile.id);
    const nextMode = nextProfile.modes.find((candidate) => candidate.enabled);
    setModeId(nextMode?.id ?? "whole");
    setQuantity(nextProfile.defaultQuantity);
    setRouteId(null);
    setResult(null);
  }

  function selectMode(nextMode: EquipmentQuoteMode) {
    if (!nextMode.enabled) return;
    setModeId(nextMode.id);
    setRouteId(null);
    setResult(null);
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
    setResult(null);
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

  async function handleSubmit() {
    if (website || submittingRef.current) return;
    if (!EMAIL_RE.test(email)) {
      setError(t.emailRequired);
      return;
    }
    if (!profile || !mode || !destinationCountry || !selectedRoute) {
      setError(t.routeRequired);
      return;
    }
    if (mode.requiresEquipmentValue && (equipmentValueUsd == null || equipmentValueUsd <= 0)) {
      setError(t.valueRequired);
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
          modeId: mode.id,
          quantity,
          equipmentValueUsd,
          destinationCountry,
          destinationPortKey: showPortTabs ? destinationPortKey : null,
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
          shipping_mode: mode.id,
          destination_country: destinationCountry,
          route_preference: routePreference,
        });
        trackGoogleAdsConversion(TRACKING.gadsLeadLabel, 300);
        vercelTrack("generate_lead", { source: "calculator_v3", value: 300 });
        vercelTrack("calculator_lead_submitted", {
          equipment_profile: profile.id,
          shipping_mode: mode.id,
          destination_country: destinationCountry,
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

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Skeleton className="h-[680px] w-full" />
        <Skeleton className="h-[680px] w-full" />
      </div>
    );
  }

  if (dataError || !data) {
    return unavailablePanel(lang);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground sm:grid-cols-4">
          {[t.stepEquipment, t.stepRoute, t.stepEstimate, t.stepContact].map((step, index) => (
            <div
              key={step}
              className="flex h-10 items-center justify-center border bg-muted/30 text-center"
            >
              {index + 1}. {step}
            </div>
          ))}
        </div>

        <section className="border bg-background p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t.stepEquipment}</h2>
              {profile && <p className="text-sm text-muted-foreground">{getLocalizedText(profile.description, lang)}</p>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.profiles.map((candidate, index) => {
              const active = candidate.id === profileId;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectProfile(candidate)}
                  className={`group overflow-hidden border text-left transition ${
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={candidate.image}
                      alt={getLocalizedText(candidate.label, lang)}
                      fill
                      priority={index < 4}
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(min-width: 1280px) 220px, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="min-h-28 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-tight">
                        {getLocalizedText(candidate.label, lang)}
                      </h3>
                      {active && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {getLocalizedText(candidate.description, lang)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {profile && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div>
                <Label className="mb-2 block">{t.shippingMode}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {profile.modes.map((candidate) => {
                    const Icon = getModeIcon(candidate);
                    const active = candidate.id === modeId;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        disabled={!candidate.enabled}
                        onClick={() => selectMode(candidate)}
                        className={`flex min-h-28 items-start gap-3 border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          active
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>
                          <span className="block font-semibold">
                            {getLocalizedText(candidate.label, lang)}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {candidate.enabled
                              ? getLocalizedText(candidate.description, lang)
                              : getLocalizedText(candidate.disabledReason ?? candidate.description, lang)}
                          </span>
                          <span className="mt-2 inline-flex text-xs font-medium text-foreground">
                            {candidate.enabled
                              ? containerLabel(candidate.containerType)
                              : t.modeUnavailable}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <Label htmlFor="v3-quantity" className="mb-2 block">
                    {profile ? getLocalizedText(profile.quantityLabel, lang) : t.quantity}
                  </Label>
                  <div className="flex h-10 overflow-hidden border">
                    <button
                      type="button"
                      className="w-10 border-r text-lg disabled:opacity-40"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    >
                      -
                    </button>
                    <Input
                      id="v3-quantity"
                      type="number"
                      min={1}
                      max={profile.maxQuantity}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(
                          Math.min(
                            profile.maxQuantity,
                            Math.max(1, Number.parseInt(event.target.value || "1", 10)),
                          ),
                        )
                      }
                      className="h-10 rounded-none border-0 text-center"
                    />
                    <button
                      type="button"
                      className="w-10 border-l text-lg disabled:opacity-40"
                      disabled={quantity >= profile.maxQuantity}
                      onClick={() =>
                        setQuantity((current) => Math.min(profile.maxQuantity, current + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {getLocalizedText(profile.quantityHelp, lang)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="v3-value" className="mb-2 block">
                    {t.value}
                  </Label>
                  <Input
                    id="v3-value"
                    inputMode="numeric"
                    value={equipmentValueUsd ?? ""}
                    onChange={(event) => {
                      const next = Number(event.target.value.replace(/[^0-9.]/g, ""));
                      setEquipmentValueUsd(Number.isFinite(next) && next > 0 ? next : null);
                    }}
                    placeholder="$125000"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">{t.valueHelp}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="border bg-background p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t.stepRoute}</h2>
              <p className="text-sm text-muted-foreground">
                {preview ? `${preview.route.origin.label} -> ${routeDestinationLabel(preview.route)}` : t.preview}
              </p>
            </div>
            {mode && <Badge variant="outline">{containerLabel(mode.containerType)}</Badge>}
          </div>

          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <div className="space-y-4">
              <div>
                <Label htmlFor="v3-country" className="mb-2 block">{t.country}</Label>
                <select
                  id="v3-country"
                  value={destinationCountry}
                  onChange={(event) => {
                    setDestinationCountry(event.target.value);
                    setDestinationPortKey(null);
                    setRouteId(null);
                    setResult(null);
                  }}
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                >
                  {eligibleCountries.map((country) => (
                    <option key={country} value={country}>
                      {countryLabel(country)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="v3-zip" className="mb-2 block">{t.zip}</Label>
                <Input
                  id="v3-zip"
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                  placeholder="50005"
                  maxLength={10}
                />
              </div>

              <div>
                <Label className="mb-2 block">{t.routePreference}</Label>
                <div className="grid grid-cols-2 border">
                  {(["cheapest", "fastest"] as const).map((preference) => (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => {
                        setRoutePreference(preference);
                        setRouteId(null);
                      }}
                      className={`h-10 text-sm font-medium ${
                        routePreference === preference
                          ? "bg-foreground text-background"
                          : "bg-background text-foreground"
                      }`}
                    >
                      {preference === "cheapest" ? t.cheapest : t.fastest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {showPortTabs && (
                <div>
                  <Label className="mb-2 block">{t.destinationPort}</Label>
                  <div className="flex flex-wrap gap-2">
                    {destinationPortKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setDestinationPortKey(key);
                          setRouteId(null);
                        }}
                        className={`h-9 border px-3 text-sm font-medium ${
                          destinationPortKey === key
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {getDestinationPortLabel(routesForCountry, key)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {routeOptions.slice(0, 4).map((route) => {
                  const active = selectedRoute?.id === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => selectRoute(route)}
                      className={`min-h-36 border p-4 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            {t.routeCard}
                          </span>
                          <p className="mt-1 font-semibold leading-tight">
                            {route.origin.label} {"->"} {route.destination.label}
                          </p>
                        </div>
                        {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-700" />
                          {routeCostLabel({
                            route,
                            mode: mode!,
                            quantity,
                            equipmentValueUsd,
                            zipCode: zipCode || null,
                          })}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-sky-700" />
                          {route.transitTimeDays ?? t.notPublished}
                        </span>
                        <span className="col-span-2 text-xs text-muted-foreground">
                          {route.carrier}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border bg-background">
          <div className="border-b p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Route className="h-4 w-4" />
              V3 preview
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground">{t.freightTotal}</div>
              <div className="mt-1 text-3xl font-bold tracking-tight">
                {preview ? formatDollar(preview.freightTotal) : "--"}
              </div>
              {preview?.totalExcludesInland && (
                <p className="mt-1 text-xs text-amber-700">
                  {preview.warnings[0] ? getLocalizedText(preview.warnings[0], lang) : ""}
                </p>
              )}
            </div>
          </div>

          {preview ? (
            <div className="space-y-5 p-5">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    {preview.route.origin.label}
                  </span>
                  <span className="text-right font-medium">{routeDestinationLabel(preview.route)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{t.transit}</span>
                  <span className="font-medium">{preview.route.transitTimeDays ?? t.notPublished}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{t.policy}</span>
                  <span className="text-right text-xs font-medium">
                    {preview.compliancePolicy?.sourceLabel ?? "Standard export"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">{t.lineItems}</h3>
                <div className="divide-y border">
                  {preview.lineItems
                    .filter((line) => line.amountUsd !== 0 || line.id !== "packing_loading")
                    .map((line) => (
                      <div key={line.id} className="grid grid-cols-[1fr_auto] gap-3 p-3 text-sm">
                        <div>
                          <div className="font-medium">{line.label}</div>
                          {line.note && <div className="mt-1 text-xs text-muted-foreground">{line.note}</div>}
                        </div>
                        <div className="font-semibold">
                          {line.amountUsd == null
                            ? line.includedInTotal
                              ? "Quote"
                              : t.notIncluded
                            : formatDollar(line.amountUsd)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{t.compliancePrep}</span>
                  <span className="font-bold">
                    {preview.compliancePrep.amountStatus === "priced" &&
                    preview.compliancePrep.amountUsd != null
                      ? formatDollar(preview.compliancePrep.amountUsd)
                      : preview.compliancePrep.amountStatus === "not_applicable"
                        ? t.unavailable
                        : t.brokerConfirmed}
                  </span>
                </div>
                {preview.compliancePrep.note && (
                  <p className="mt-2 text-xs leading-relaxed text-amber-900">
                    {getLocalizedText(preview.compliancePrep.note, lang)}
                  </p>
                )}
                {preview.compliancePrep.lines.length > 0 && (
                  <div className="mt-3 divide-y divide-amber-200 border-y border-amber-200">
                    {preview.compliancePrep.lines.map((line) => (
                      <div key={line.id} className="grid grid-cols-[1fr_auto] gap-3 py-2 text-xs">
                        <div>
                          <div className="font-medium">{getLocalizedText(line.label, lang)}</div>
                          <div className="mt-1 leading-relaxed text-amber-800">
                            {getLocalizedText(line.note, lang)}
                          </div>
                        </div>
                        <div className="font-semibold">
                          {line.amountUsd == null ? t.brokerConfirmed : formatDollar(line.amountUsd)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {preview.freightPlusComplianceTotal != null && (
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-amber-200 pt-3">
                    <span className="font-medium">{t.freightPlusCompliance}</span>
                    <span className="font-bold">{formatDollar(preview.freightPlusComplianceTotal)}</span>
                  </div>
                )}
              </div>

              {preview.dedicatedContainerFreightTotal != null && (
                <div className="border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
                  <div className="font-semibold">{t.dedicated}</div>
                  <div className="mt-1">{formatDollar(preview.dedicatedContainerFreightTotal)}</div>
                </div>
              )}

              <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{t.importEstimate}</span>
                  <span className="font-bold">
                    {preview.importCost.available && preview.importCost.amountUsd != null
                      ? formatDollar(preview.importCost.amountUsd)
                      : t.unavailable}
                  </span>
                </div>
                {preview.importCost.available ? (
                  <div className="mt-2 space-y-2 text-xs leading-relaxed">
                    <p>
                      HS {preview.importCost.hsCode}; {preview.importCost.profileName ?? preview.importCost.sourceLabel};
                      {" "}
                      {preview.importCost.sourceVersion}.
                    </p>
                    {preview.importCost.recoverableCreditsUsd != null &&
                      preview.importCost.recoverableCreditsUsd > 0 && (
                        <p>
                          Recoverable credits: {formatDollar(preview.importCost.recoverableCreditsUsd)}.
                        </p>
                      )}
                    {preview.importCost.note && (
                      <p>{getLocalizedText(preview.importCost.note, lang)}</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 space-y-2 text-xs leading-relaxed">
                    <p>
                      {preview.importCost.note ? getLocalizedText(preview.importCost.note, lang) : t.unavailable}
                    </p>
                    {preview.importCost.missingInputs.length > 0 && (
                      <p>
                        {t.missingInputs}:{" "}
                        {preview.importCost.missingInputs
                          .map((key) => missingInputLabel(key, lang))
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {(preview.notes.length > 0 || preview.warnings.length > 0) && (
                <div className="space-y-3">
                  {preview.warnings.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-amber-800">{t.warnings}</h3>
                      <ul className="space-y-1 text-xs leading-relaxed text-amber-800">
                        {preview.warnings.map((warning, index) => (
                          <li key={`${warning.en}-${index}`}>{getLocalizedText(warning, lang)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {preview.notes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">{t.notes}</h3>
                      <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                        {preview.notes.slice(0, 3).map((item, index) => (
                          <li key={`${item.en}-${index}`}>{getLocalizedText(item, lang)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 border-t pt-5">
                <div className="hidden">
                  <Label htmlFor="v3-website">Website</Label>
                  <Input
                    id="v3-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="v3-email" className="mb-2 block">{t.email}</Label>
                  <Input
                    id="v3-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <Label htmlFor="v3-name" className="mb-2 block">{t.name}</Label>
                    <Input id="v3-name" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="v3-company" className="mb-2 block">{t.company}</Label>
                    <Input id="v3-company" value={company} onChange={(event) => setCompany(event.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="v3-phone" className="mb-2 block">{t.phone}</Label>
                  <Input id="v3-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>
                <div>
                  <Label className="mb-2 block">{t.preferredContact}</Label>
                  <div className="grid grid-cols-2 border">
                    {(["email", "whatsapp"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPreferredContact(option)}
                        className={`h-10 text-sm font-medium ${
                          preferredContact === option
                            ? "bg-foreground text-background"
                            : "bg-background text-foreground"
                        }`}
                      >
                        {option === "email" ? t.emailOption : t.whatsappOption}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {result?.success && (
                  <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                    {t.success}
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || !preview}
                  onClick={handleSubmit}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isSubmitting ? t.submitting : t.submit}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  render={
                    <a
                      href={CONTACT.whatsappUrl}
                      onClick={() => trackContactClick("whatsapp", "calculator_v3_handoff")}
                    />
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.whatsapp}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground">
              Select equipment, route, and quantity to show the V3 freight estimate.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
