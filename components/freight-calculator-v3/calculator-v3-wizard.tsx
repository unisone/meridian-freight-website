"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock3,
  DollarSign,
  Globe,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Package,
  PackageCheck,
  Ship,
  Truck,
} from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { CATEGORY_ICONS } from "@/components/freight-calculator/category-icons";
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
import { CONTACT, TRACKING } from "@/lib/constants";
import { formatDollar } from "@/lib/freight-engine-v2";
import {
  trackCalcFunnel,
  trackContactClick,
  trackGA4Event,
  trackGoogleAdsConversion,
  trackPixelEvent,
} from "@/lib/tracking";
import { COUNTRY_NAMES, type ContainerType } from "@/lib/types/calculator";
import { Link } from "@/i18n/navigation";
import type {
  CalculatorDataV3,
  CalculatorLocale,
  EquipmentQuoteMode,
  EquipmentQuoteProfile,
  FreightEstimateV3,
  FreightLineItemV3,
  ImportCostEstimateV3,
  RouteOption,
  RoutePreference,
  ShippingMode,
} from "@/lib/calculator-v3/contracts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  en: {
    unavailableTitle: "Calculator unavailable",
    unavailableDescription:
      "Live rate data is temporarily unavailable. Meridian can still prepare a manual quote.",
    selectEquipmentCategory: "Select Equipment Category",
    selectEquipmentHint: "Select equipment above to see specifications.",
    equipmentSpecs: "Equipment Specs",
    shippingRoute: "Shipping Route",
    completeEquipmentHint: "Complete equipment selection to configure routing.",
    shippingMode: "Shipping mode",
    quantity: "Quantity",
    equipmentValueUsd: "Equipment value",
    equipmentValuePlaceholder: "e.g. 125000",
    equipmentValueHint:
      "Used for flat rack insurance and indicative import-cost estimates.",
    valueRequired: "Enter equipment value for this mode.",
    destinationCountry: "Destination Country",
    selectCountry: "Select country",
    usPickupZip: "U.S. Pickup ZIP",
    optional: "optional",
    zipPlaceholder: "e.g. 50005",
    zipHint: "Used to estimate U.S. inland transport. Leave blank for port-only freight.",
    routePreference: "Route preference",
    cheapest: "Cheapest",
    fastest: "Fastest",
    destinationPort: "Destination port",
    routeOptions: "Route options",
    route: "Route",
    transit: "Transit",
    notPublished: "Not published",
    routeRequired: "Select a route before submitting.",
    noPublishedRoutesTitle: "No published route for this selection",
    noPublishedRoutesDescription:
      "This equipment mode and destination are not available in the automatic calculator yet. Meridian can quote it manually.",
    estimatedFreight: "Estimated Freight",
    basedOnRates: "Based on live route rates and V3 freight policy.",
    optimizedRouteRate: "optimized route rate",
    exclInlandTransport: "excludes U.S. inland transport",
    selectDestination: "Select destination",
    routeUnavailableEstimate: "Route unavailable",
    emptyStateText:
      "Select your equipment and destination to see a live freight estimate",
    freightTotal: "Estimated freight to port",
    compliancePrep: "Compliance prep",
    importEstimate: "Indicative import-cost estimate",
    importNotIncluded: "Not included in freight",
    brokerConfirmed: "Broker confirmation required",
    quoteConfirmed: "Quote confirmation required",
    notAvailable: "Not included",
    notCalculatedOnline: "Not calculated online",
    noAutomaticCharge: "No automatic charge",
    needsInput: "Needs input",
    missingInputs: "Missing inputs",
    dedicatedComparison: "Dedicated-container comparison",
    getYourDetailedEstimate: "Get your detailed estimate",
    emailLabel: "Email",
    nameLabel: "Name",
    companyLabel: "Company",
    phoneLabel: "Phone / WhatsApp",
    preferredContact: "Preferred contact",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    optionalPlaceholder: "Optional",
    emailPlaceholder: "you@company.com",
    validEmailError: "Enter a valid email.",
    calculateAndSend: "Calculate & send",
    calculating: "Calculating...",
    emailBreakdownNote: "Email required to receive the detailed breakdown",
    bookThisFreight: "Book this freight",
    refineQuote: "Refine quote",
    estimateSentTo: "Estimate sent to {email}",
    getDetailedQuote: "Get detailed quote",
    whatsAppUs: "Chat on WhatsApp",
    calculateAnother: "Calculate another",
    viewEstimateDetails: "View estimate details",
    viewEstimate: "View estimate",
    selectDestinationForEstimate: "Select destination for estimate",
    selectEquipmentToBegin: "Select equipment to begin",
    yourFreightEstimate: "Your freight estimate",
    lineItems: "Line items",
    warnings: "Warnings",
    notes: "Notes",
    disclaimer:
      "Estimates cover the freight lines shown on screen. Customs duties, import taxes, destination inland transport, and destination-specific wash or fumigation are separate estimates and must be confirmed with the destination broker/importer.",
  },
  es: {
    unavailableTitle: "Calculadora no disponible",
    unavailableDescription:
      "Las tarifas en vivo no estan disponibles temporalmente. Meridian puede preparar una cotizacion manual.",
    selectEquipmentCategory: "Seleccione categoria de equipo",
    selectEquipmentHint: "Seleccione equipo arriba para ver especificaciones.",
    equipmentSpecs: "Especificaciones",
    shippingRoute: "Ruta de envio",
    completeEquipmentHint: "Complete la seleccion del equipo para configurar la ruta.",
    shippingMode: "Modo de envio",
    quantity: "Cantidad",
    equipmentValueUsd: "Valor del equipo",
    equipmentValuePlaceholder: "ej. 125000",
    equipmentValueHint:
      "Se usa para seguro flat rack y estimaciones indicativas de importacion.",
    valueRequired: "Ingrese el valor del equipo para este modo.",
    destinationCountry: "Pais destino",
    selectCountry: "Seleccione pais",
    usPickupZip: "ZIP de retiro en EE.UU.",
    optional: "opcional",
    zipPlaceholder: "ej. 50005",
    zipHint: "Se usa para estimar transporte interno en EE.UU. Deje vacio para flete puerto.",
    routePreference: "Preferencia de ruta",
    cheapest: "Mas barata",
    fastest: "Mas rapida",
    destinationPort: "Puerto destino",
    routeOptions: "Opciones de ruta",
    route: "Ruta",
    transit: "Transito",
    notPublished: "No publicado",
    routeRequired: "Seleccione una ruta antes de enviar.",
    noPublishedRoutesTitle: "No hay ruta publicada para esta seleccion",
    noPublishedRoutesDescription:
      "Este modo de equipo y destino aun no esta disponible en la calculadora automatica. Meridian puede cotizarlo manualmente.",
    estimatedFreight: "Flete estimado",
    basedOnRates: "Basado en tarifas en vivo y politica V3.",
    optimizedRouteRate: "ruta optimizada",
    exclInlandTransport: "sin transporte interno de EE.UU.",
    selectDestination: "Seleccione destino",
    routeUnavailableEstimate: "Ruta no disponible",
    emptyStateText:
      "Seleccione equipo y destino para ver una estimacion en vivo",
    freightTotal: "Flete estimado al puerto",
    compliancePrep: "Preparacion de cumplimiento",
    importEstimate: "Estimacion indicativa de importacion",
    importNotIncluded: "No incluido en flete",
    brokerConfirmed: "Requiere confirmacion del broker",
    quoteConfirmed: "Requiere confirmacion de cotizacion",
    notAvailable: "No incluido",
    notCalculatedOnline: "No calculado en linea",
    noAutomaticCharge: "Sin cargo automatico",
    needsInput: "Faltan datos",
    missingInputs: "Datos faltantes",
    dedicatedComparison: "Comparacion con contenedor dedicado",
    getYourDetailedEstimate: "Reciba su estimacion detallada",
    emailLabel: "Email",
    nameLabel: "Nombre",
    companyLabel: "Empresa",
    phoneLabel: "Telefono / WhatsApp",
    preferredContact: "Contacto preferido",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    optionalPlaceholder: "Opcional",
    emailPlaceholder: "usted@empresa.com",
    validEmailError: "Ingrese un email valido.",
    calculateAndSend: "Calcular y enviar",
    calculating: "Calculando...",
    emailBreakdownNote: "Email requerido para recibir el detalle",
    bookThisFreight: "Reservar este flete",
    refineQuote: "Ajustar cotizacion",
    estimateSentTo: "Estimacion enviada a {email}",
    getDetailedQuote: "Solicitar cotizacion detallada",
    whatsAppUs: "Chat por WhatsApp",
    calculateAnother: "Calcular otra",
    viewEstimateDetails: "Ver detalle",
    viewEstimate: "Ver estimacion",
    selectDestinationForEstimate: "Seleccione destino",
    selectEquipmentToBegin: "Seleccione equipo",
    yourFreightEstimate: "Su estimacion de flete",
    lineItems: "Lineas",
    warnings: "Avisos",
    notes: "Notas",
    disclaimer:
      "Las estimaciones cubren las lineas de flete mostradas. Derechos, impuestos, transporte interno de destino y lavado o fumigacion especificos son estimaciones separadas y deben confirmarse con el broker/importador.",
  },
  ru: {
    unavailableTitle: "Калькулятор недоступен",
    unavailableDescription:
      "Живые тарифы временно недоступны. Meridian подготовит ручной расчет.",
    selectEquipmentCategory: "Выберите категорию техники",
    selectEquipmentHint: "Выберите технику выше, чтобы увидеть параметры.",
    equipmentSpecs: "Параметры техники",
    shippingRoute: "Маршрут отправки",
    completeEquipmentHint: "Завершите выбор техники, чтобы настроить маршрут.",
    shippingMode: "Способ отправки",
    quantity: "Количество",
    equipmentValueUsd: "Стоимость техники",
    equipmentValuePlaceholder: "например 125000",
    equipmentValueHint:
      "Используется для страхования flat rack и ориентировочной импортной оценки.",
    valueRequired: "Укажите стоимость техники для этого способа.",
    destinationCountry: "Страна назначения",
    selectCountry: "Выберите страну",
    usPickupZip: "ZIP забора в США",
    optional: "необязательно",
    zipPlaceholder: "например 50005",
    zipHint: "Используется для оценки внутренней доставки по США. Оставьте пустым для фрахта от порта.",
    routePreference: "Приоритет маршрута",
    cheapest: "Дешевле",
    fastest: "Быстрее",
    destinationPort: "Порт назначения",
    routeOptions: "Варианты маршрута",
    route: "Маршрут",
    transit: "Транзит",
    notPublished: "Не опубликовано",
    routeRequired: "Выберите маршрут перед отправкой.",
    noPublishedRoutesTitle: "Нет опубликованного маршрута для выбора",
    noPublishedRoutesDescription:
      "Этот способ и направление пока не доступны в автоматическом калькуляторе. Meridian может подготовить ручной расчет.",
    estimatedFreight: "Оценка фрахта",
    basedOnRates: "На основе живых тарифов и политики V3.",
    optimizedRouteRate: "оптимальный маршрут",
    exclInlandTransport: "без внутренней доставки по США",
    selectDestination: "Выберите направление",
    routeUnavailableEstimate: "Маршрут недоступен",
    emptyStateText: "Выберите технику и направление, чтобы увидеть расчет",
    freightTotal: "Оценка фрахта до порта",
    compliancePrep: "Подготовка к требованиям",
    importEstimate: "Ориентировочная импортная оценка",
    importNotIncluded: "Не включено во фрахт",
    brokerConfirmed: "Требуется подтверждение брокера",
    quoteConfirmed: "Требуется подтверждение квоты",
    notAvailable: "Не включено",
    notCalculatedOnline: "Не рассчитывается онлайн",
    noAutomaticCharge: "Нет автоматического начисления",
    needsInput: "Нужны данные",
    missingInputs: "Не хватает данных",
    dedicatedComparison: "Сравнение с отдельным контейнером",
    getYourDetailedEstimate: "Получить подробный расчет",
    emailLabel: "Email",
    nameLabel: "Имя",
    companyLabel: "Компания",
    phoneLabel: "Телефон / WhatsApp",
    preferredContact: "Предпочтительный контакт",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    optionalPlaceholder: "Необязательно",
    emailPlaceholder: "you@company.com",
    validEmailError: "Укажите корректный email.",
    calculateAndSend: "Рассчитать и отправить",
    calculating: "Расчет...",
    emailBreakdownNote: "Email нужен, чтобы получить подробный расчет",
    bookThisFreight: "Забронировать фрахт",
    refineQuote: "Уточнить расчет",
    estimateSentTo: "Расчет отправлен на {email}",
    getDetailedQuote: "Получить подробную квоту",
    whatsAppUs: "Написать в WhatsApp",
    calculateAnother: "Рассчитать еще",
    viewEstimateDetails: "Открыть детали",
    viewEstimate: "Смотреть расчет",
    selectDestinationForEstimate: "Выберите направление",
    selectEquipmentToBegin: "Выберите технику",
    yourFreightEstimate: "Ваш расчет фрахта",
    lineItems: "Строки расчета",
    warnings: "Предупреждения",
    notes: "Примечания",
    disclaimer:
      "Оценка покрывает строки фрахта на экране. Пошлины, налоги, доставка в стране назначения и мойка или фумигация являются отдельными оценками и должны подтверждаться брокером/импортером.",
  },
} as const;

const MISSING_INPUT_LABELS: Record<string, Record<CalculatorLocale, string>> = {
  equipment_value: {
    en: "equipment value",
    es: "valor del equipo",
    ru: "стоимость техники",
  },
  local_transport: {
    en: "U.S. inland transport",
    es: "transporte interno EE.UU.",
    ru: "внутренняя доставка США",
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
};

function normalizeLocale(locale: string): CalculatorLocale {
  return locale === "es" || locale === "ru" ? locale : "en";
}

function countryLabel(country: string): string {
  return COUNTRY_NAMES[country] ?? country;
}

function containerLabel(containerType: ContainerType): string {
  return containerType === "fortyhc" ? "40' High Cube" : "Flat Rack";
}

function shortContainerLabel(containerType: ContainerType): string {
  return containerType === "fortyhc" ? "40'HC" : "Flat";
}

function formatTransit(route: RouteOption, locale: CalculatorLocale): string {
  const value = route.transitTimeDays?.trim();
  if (!value) return COPY[locale].notPublished;
  if (!/\d/.test(value) || /\bday(s)?\b/i.test(value)) return value;
  const unit = locale === "es" ? "dias" : locale === "ru" ? "дней" : "days";
  return `${value} ${unit}`;
}

function routeSortCostLabel(input: {
  route: RouteOption;
  mode: EquipmentQuoteMode;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): string {
  return formatDollar(getV3RouteFreightSortCost(input));
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
        (!input.destinationPortKey ||
          route.destination.key === input.destinationPortKey),
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

function getDestinationPortLabel(routes: RouteOption[], key: string): string {
  return routes.find((route) => route.destination.key === key)?.destination.label ?? key;
}

function modeIcon(mode: EquipmentQuoteMode) {
  return mode.containerType === "flatrack" ? Truck : PackageCheck;
}

function missingInputLabel(key: string, locale: CalculatorLocale): string {
  return MISSING_INPUT_LABELS[key]?.[locale] ?? key.replace(/_/g, " ");
}

function lineItemLabel(line: FreightLineItemV3, locale: CalculatorLocale): string {
  if (line.id === "us_inland") {
    return {
      en: "U.S. inland transport",
      es: "Transporte interno EE.UU.",
      ru: "Внутренняя доставка США",
    }[locale];
  }
  if (line.id === "packing_loading") {
    return {
      en: "Packing & Loading",
      es: "Embalaje y carga",
      ru: "Упаковка и погрузка",
    }[locale];
  }
  return {
    en: "Sea Freight & Loading",
    es: "Flete maritimo y carga",
    ru: "Морской фрахт и погрузка",
  }[locale];
}

function importAmountLabel(
  importCost: ImportCostEstimateV3,
  locale: CalculatorLocale,
): string {
  if (importCost.available && importCost.amountUsd != null) {
    return formatDollar(importCost.amountUsd);
  }
  if (importCost.status === "partial") {
    return COPY[locale].needsInput;
  }
  return COPY[locale].notCalculatedOnline;
}

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

  useEffect(() => {
    if (!destinationCountry || eligibleCountries.includes(destinationCountry)) return;
    setDestinationCountry("");
    setDestinationPortKey(null);
    setRouteId(null);
  }, [destinationCountry, eligibleCountries]);

  const routesForCountry = useMemo(() => {
    if (!data || !enabledMode || !destinationCountry) return [];
    return data.routes.filter(
      (route) =>
        route.containerType === enabledMode.containerType &&
        route.destinationCountry === destinationCountry,
    );
  }, [data, enabledMode, destinationCountry]);

  const destinationPortKeys = useMemo(
    () => [...new Set(routesForCountry.map((route) => route.destination.key))].sort(),
    [routesForCountry],
  );
  const showPortTabs = destinationPortKeys.length > 1;

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
        mode: enabledMode,
        destinationCountry,
        destinationPortKey: showPortTabs ? destinationPortKey : null,
        preference: routePreference,
        quantity,
        equipmentValueUsd,
        zipCode: zipCode || null,
      }),
    [
      data,
      enabledMode,
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
    if (!data || !profile || !enabledMode || !destinationCountry || !step2Done) {
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
      destinationCountry,
      destinationPortKey: showPortTabs ? destinationPortKey : null,
      routeId: selectedRoute?.id ?? null,
      routePreference,
      zipCode: zipCode || null,
    });
  }, [
    data,
    profile,
    enabledMode,
    destinationCountry,
    destinationPortKey,
    selectedRoute,
    routePreference,
    quantity,
    equipmentValueUsd,
    zipCode,
    showPortTabs,
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

  const step3Done = step2Done && destinationCountry !== "" && preview !== null;
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

  async function handleSubmit() {
    if (website || submittingRef.current) return;
    if (!EMAIL_RE.test(email)) {
      setError(t.validEmailError);
      return;
    }
    if (!profile || !enabledMode || !destinationCountry || !selectedRoute || !preview) {
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
          shipping_mode: enabledMode.id,
          destination_country: destinationCountry,
          route_preference: routePreference,
        });
        trackGoogleAdsConversion(TRACKING.gadsLeadLabel, 300);
        vercelTrack("generate_lead", { source: "calculator_v3", value: 300 });
        vercelTrack("calculator_lead_submitted", {
          equipment_profile: profile.id,
          shipping_mode: enabledMode.id,
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
    destinationCountry,
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
  } satisfies CalculatorV3EstimateCardProps;

  return (
    <div>
      <CalculatorProgressBar completedSteps={completedSteps} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-[3] space-y-8">
          <section>
            <SectionHeader num={1} title={t.selectEquipmentCategory} />

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProfiles.map((candidate) => {
                const Icon = CATEGORY_ICONS[candidate.equipmentCategory] ?? Package;
                const isSelected = profileId === candidate.id;
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => selectProfile(candidate)}
                    className={`group flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`h-6 w-6 transition-colors ${
                        isSelected
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary/70"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium leading-tight ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {getLocalizedText(candidate.label, lang)}
                    </span>
                  </button>
                );
              })}
            </div>

            {data.profiles.length > 8 && !showAllProfiles && (
              <button
                type="button"
                onClick={() => setShowAllProfiles(true)}
                className="mt-2 flex items-center gap-1 rounded py-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Show all categories <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </section>

          <section
            aria-disabled={!profile || undefined}
            className={`transition-[opacity,transform] duration-300 ${
              !profile
                ? "pointer-events-none translate-y-2 opacity-40"
                : "translate-y-0 opacity-100"
            }`}
          >
            <SectionHeader num={2} title={t.equipmentSpecs} />

            {!profile ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {t.selectEquipmentHint}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-sm">{t.shippingMode}</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {profile.modes.map((candidate) => {
                      const Icon = modeIcon(candidate);
                      const isSelected = modeId === candidate.id;
                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          disabled={!candidate.enabled}
                          onClick={() => selectMode(candidate)}
                          className={`flex min-h-24 items-start gap-3 rounded-xl border-2 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                          }`}
                        >
                          <Icon
                            aria-hidden="true"
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              isSelected ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span>
                            <span className="block text-sm font-semibold text-foreground">
                              {getLocalizedText(candidate.label, lang)}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                              {getLocalizedText(
                                candidate.enabled
                                  ? candidate.description
                                  : candidate.disabledReason ?? candidate.description,
                                lang,
                              )}
                            </span>
                            <Badge variant="secondary" className="mt-2 text-[10px]">
                              {candidate.enabled
                                ? containerLabel(candidate.containerType)
                                : "Confirm with Meridian"}
                            </Badge>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {enabledMode && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="v3-quantity" className="text-sm">
                        {getLocalizedText(profile.quantityLabel, lang)}
                      </Label>
                      <Input
                        id="v3-quantity"
                        type="number"
                        min={1}
                        max={profile.maxQuantity}
                        value={quantity}
                        onChange={(event) => {
                          const parsed = Number.parseInt(event.target.value || "1", 10);
                          setQuantity(Math.min(profile.maxQuantity, Math.max(1, parsed)));
                          resetEstimateState();
                        }}
                        className="mt-1.5 max-w-40"
                      />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {getLocalizedText(profile.quantityHelp, lang)}
                      </p>
                    </div>

                    {enabledMode.requiresEquipmentValue && (
                      <div>
                        <Label htmlFor="v3-equipment-value" className="text-sm">
                          {t.equipmentValueUsd}
                        </Label>
                        <Input
                          id="v3-equipment-value"
                          type="number"
                          inputMode="decimal"
                          min={1}
                          step={100}
                          value={equipmentValueUsd ?? ""}
                          onChange={(event) => {
                            const parsed = Number.parseFloat(event.target.value);
                            setEquipmentValueUsd(
                              Number.isFinite(parsed) && parsed > 0 ? parsed : null,
                            );
                            resetEstimateState();
                          }}
                          placeholder={t.equipmentValuePlaceholder}
                          className="mt-1.5 max-w-56"
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {t.equipmentValueHint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {enabledMode && (
                  <div className="rounded-xl bg-muted p-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {getLocalizedText(enabledMode.shortLabel, lang)} ·{" "}
                        {containerLabel(enabledMode.containerType)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {getLocalizedText(enabledMode.description, lang)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section
            aria-disabled={!step2Done || undefined}
            className={`transition-[opacity,transform] duration-300 ${
              !step2Done
                ? "pointer-events-none translate-y-2 opacity-40"
                : "translate-y-0 opacity-100"
            }`}
          >
            <SectionHeader num={3} title={t.shippingRoute} />

            {!step2Done ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {profile && enabledMode?.requiresEquipmentValue && !hasRequiredValue
                  ? t.valueRequired
                  : t.completeEquipmentHint}
              </p>
            ) : eligibleCountries.length === 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <div className="font-semibold">{t.noPublishedRoutesTitle}</div>
                <p className="mt-1 text-amber-900/80">
                  {t.noPublishedRoutesDescription}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="v3-dest-country"
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      {t.destinationCountry}
                    </Label>
                    <select
                      id="v3-dest-country"
                      value={destinationCountry}
                      onChange={(event) => {
                        const country = event.target.value;
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
                      }}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:text-sm"
                    >
                      <option value="">{t.selectCountry}</option>
                      {eligibleCountries.map((code) => (
                        <option key={code} value={code}>
                          {countryLabel(code)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="v3-zip-code"
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <Package className="h-3.5 w-3.5 text-primary" />
                      {t.usPickupZip}
                      <span className="text-xs text-muted-foreground">
                        {t.optional}
                      </span>
                    </Label>
                    <Input
                      id="v3-zip-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      value={zipCode}
                      onChange={(event) => {
                        setZipCode(event.target.value.replace(/\D/g, "").slice(0, 5));
                        setRouteId(null);
                        resetEstimateState();
                      }}
                      placeholder={t.zipPlaceholder}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.zipHint}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm">{t.routePreference}</Label>
                    <div className="mt-2 grid max-w-xs grid-cols-2 overflow-hidden rounded-lg border">
                      {(["cheapest", "fastest"] as const).map((preference) => (
                        <button
                          key={preference}
                          type="button"
                          onClick={() => {
                            setRoutePreference(preference);
                            setRouteId(null);
                            resetEstimateState();
                          }}
                          className={`h-10 text-sm font-medium transition-colors ${
                            routePreference === preference
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          {preference === "cheapest" ? t.cheapest : t.fastest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showPortTabs && (
                    <div>
                      <Label className="text-sm">{t.destinationPort}</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {destinationPortKeys.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setDestinationPortKey(key);
                              setRouteId(null);
                              resetEstimateState();
                            }}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                              destinationPortKey === key
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                            }`}
                          >
                            {getDestinationPortLabel(routesForCountry, key)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {destinationCountry && (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-foreground">
                      {t.routeOptions}
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {routeOptions.slice(0, 4).map((route) => {
                        const active = selectedRoute?.id === route.id;
                        return (
                          <button
                            key={route.id}
                            type="button"
                            onClick={() => selectRoute(route)}
                            className={`rounded-xl border-2 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                              active
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  {t.route}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-foreground">
                                  {route.origin.label} → {route.destination.label}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-[10px]">
                                {route.carrier}
                              </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-700" />
                                {enabledMode
                                  ? routeSortCostLabel({
                                      route,
                                      mode: enabledMode,
                                      quantity,
                                      equipmentValueUsd,
                                      zipCode: zipCode || null,
                                    })
                                  : "—"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5 text-primary" />
                                {formatTransit(route, lang)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {preview && (
                  <div className="rounded-xl bg-muted p-4 text-sm">
                    <div className="font-semibold text-foreground">
                      {t.shippingRoute}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {zipCode ? `ZIP ${zipCode}` : "U.S. pickup"} →{" "}
                      {preview.route.origin.label} → {preview.route.destination.label}
                    </div>
                    <div className="mt-2 font-mono text-lg font-bold text-primary">
                      {formatDollar(preview.freightTotal)}
                      {preview.totalExcludesInland && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({t.exclInlandTransport})
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
        </div>

        <div className="hidden flex-[2] lg:block">
          <div className="sticky top-24">
            <CalculatorV3EstimateCard {...estimateCardProps} />
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
              <CalculatorV3EstimateCard {...estimateCardProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}

interface CalculatorV3EstimateCardProps {
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

function CalculatorV3EstimateCard({
  locale,
  preview,
  result,
  profile,
  mode,
  destinationCountry,
  selectedRoute,
  isComplete,
  email,
  onEmailChange,
  name,
  onNameChange,
  company,
  onCompanyChange,
  phone,
  onPhoneChange,
  preferredContact,
  onPreferredContactChange,
  website,
  onWebsiteChange,
  isSubmitting,
  error,
  onSubmit,
  onReset,
}: CalculatorV3EstimateCardProps) {
  const t = COPY[locale];
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const isEmailValid = EMAIL_RE.test(email);
  const hasResult = result?.success && result.estimate;
  const estimate = result?.estimate ?? preview;

  if (!profile) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-muted p-6 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Ship className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t.emptyStateText}</p>
        </div>
      </div>
    );
  }

  const estimateMode = estimate?.mode ?? mode;
  const estimateRoute = estimate?.route ?? selectedRoute;
  const whatsappText = encodeURIComponent(
    `Hi! Your calculator estimated ${
      estimate ? formatDollar(estimate.freightTotal) : "N/A"
    } for ${profile ? getLocalizedText(profile.label, locale) : "equipment"} to ${
      destinationCountry ? countryLabel(destinationCountry) : "destination"
    }. Can I get an exact quote?`,
  );

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
      {hasResult && (
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            {t.estimateSentTo.replace("{email}", email)}
          </span>
        </div>
      )}

      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.estimatedFreight}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Ship className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-400">{t.basedOnRates}</p>

      {estimate ? (
        <>
          <div className="mb-1 font-mono tabular-nums text-4xl font-bold tracking-tight text-white">
            {formatDollar(estimate.freightTotal)}
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
            {estimate.totalExcludesInland
              ? t.exclInlandTransport
              : t.optimizedRouteRate}
          </p>
        </>
      ) : (
        <>
          <div className="mb-1 font-mono text-4xl font-bold tracking-tight text-slate-600">
            $—,———
          </div>
          <p className="mb-5 text-xs text-slate-600">
            {destinationCountry ? t.routeUnavailableEstimate : t.selectDestination}
          </p>
        </>
      )}

      <div className="-mx-6 mt-4 space-y-3 rounded-lg bg-white/5 px-6 pt-4 pb-4">
        <DetailRow
          label={t.transit}
          value={estimateRoute ? formatTransit(estimateRoute, locale) : "—"}
          mono
        />
        <DetailRow
          label="Container"
          value={estimateMode ? shortContainerLabel(estimateMode.containerType) : "—"}
          mono
        />
        <DetailRow
          label="Carrier"
          value={estimateRoute?.carrier ?? "—"}
          highlight
          mono
        />
        {estimateRoute && (
          <DetailRow
            label={t.route}
            value={`${estimateRoute.origin.label} → ${estimateRoute.destination.label}`}
          />
        )}
      </div>

      {estimate && (
        <div className="mt-5 space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t.lineItems}</h3>
            <div className="space-y-3">
              {estimate.lineItems
                .filter((line) => line.amountUsd !== 0 || line.id !== "packing_loading")
                .map((line) => (
                  <div key={line.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-300">
                        {lineItemLabel(line, locale)}
                      </div>
                      {line.note && (
                        <div className="text-xs text-slate-400">{line.note}</div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white">
                      {line.amountUsd == null
                        ? line.includedInTotal
                          ? t.quoteConfirmed
                          : t.notAvailable
                        : formatDollar(line.amountUsd)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-white">{t.freightTotal}</span>
              <span className="font-mono text-3xl font-bold text-white">
                {formatDollar(estimate.freightTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-700 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {t.compliancePrep}
                </div>
                {estimate.compliancePrep.note && (
                  <div className="mt-1 text-xs text-slate-400">
                    {getLocalizedText(estimate.compliancePrep.note, locale)}
                  </div>
                )}
              </div>
              <span className="text-right font-mono text-sm font-bold text-white">
                {estimate.compliancePrep.amountStatus === "priced" &&
                estimate.compliancePrep.amountUsd != null
                  ? formatDollar(estimate.compliancePrep.amountUsd)
                  : estimate.compliancePrep.amountStatus === "not_applicable"
                    ? t.noAutomaticCharge
                    : t.brokerConfirmed}
              </span>
            </div>

            {estimate.dedicatedContainerFreightTotal != null && (
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-slate-300">
                  {t.dedicatedComparison}
                </div>
                <span className="font-mono text-sm font-bold text-white">
                  {formatDollar(estimate.dedicatedContainerFreightTotal)}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    {t.importEstimate}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {t.importNotIncluded}
                    {estimate.importCost.hsCode
                      ? ` · HS ${estimate.importCost.hsCode}`
                      : ""}
                  </div>
                </div>
                <span className="text-right font-mono text-sm font-bold text-white">
                  {importAmountLabel(estimate.importCost, locale)}
                </span>
              </div>
              <ImportCostNote importCost={estimate.importCost} locale={locale} />
            </div>
          </div>

          {(estimate.warnings.length > 0 || estimate.notes.length > 0) && (
            <div className="space-y-2">
              {estimate.warnings.slice(0, 2).map((warning, index) => (
                <p
                  key={`${warning.en}-${index}`}
                  className="flex items-start gap-1.5 text-xs text-amber-500"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {getLocalizedText(warning, locale)}
                </p>
              ))}
              {estimate.notes.slice(0, 2).map((note, index) => (
                <p
                  key={`${note.en}-${index}`}
                  className="flex items-start gap-1.5 text-xs text-slate-400"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {getLocalizedText(note, locale)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {emailGateOpen && !hasResult ? (
        <div className="-mx-6 mt-5 space-y-3 rounded-lg bg-white/5 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t.getYourDetailedEstimate}
          </p>

          <div>
            <Label htmlFor="v3-est-email" className="text-xs text-slate-300">
              {t.emailLabel}
            </Label>
            <Input
              id="v3-est-email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder={t.emailPlaceholder}
              required
              aria-invalid={email ? !isEmailValid : undefined}
              aria-describedby={
                email && !isEmailValid ? "v3-est-email-error" : undefined
              }
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-primary"
            />
            {email && !isEmailValid && (
              <p id="v3-est-email-error" className="mt-1 text-xs text-red-500">
                {t.validEmailError}
              </p>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="v3-est-name" className="text-xs text-slate-300">
                {t.nameLabel}
              </Label>
              <Input
                id="v3-est-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder={t.optionalPlaceholder}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <Label htmlFor="v3-est-company" className="text-xs text-slate-300">
                {t.companyLabel}
              </Label>
              <Input
                id="v3-est-company"
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(event) => onCompanyChange(event.target.value)}
                placeholder={t.optionalPlaceholder}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="v3-est-phone" className="text-xs text-slate-300">
              {t.phoneLabel}
            </Label>
            <Input
              id="v3-est-phone"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder={t.optionalPlaceholder}
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <Label className="text-xs text-slate-300">{t.preferredContact}</Label>
            <div className="mt-1 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-700">
              {(["email", "whatsapp"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPreferredContactChange(option)}
                  className={`h-10 text-sm font-medium transition-colors ${
                    preferredContact === option
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {option === "email" ? t.emailOption : t.whatsappOption}
                </button>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
              height: 0,
              overflow: "hidden",
            }}
          >
            <Label htmlFor="v3-est-website">Website</Label>
            <Input
              id="v3-est-website"
              type="text"
              value={website}
              onChange={(event) => onWebsiteChange(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isEmailValid || isSubmitting}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.calculating}
              </>
            ) : (
              <>
                {t.calculateAndSend}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3 w-3" />
            {t.emailBreakdownNote}
          </p>
        </div>
      ) : !hasResult ? (
        <div className="mt-5 space-y-2">
          <Button
            type="button"
            onClick={() => setEmailGateOpen(true)}
            disabled={!isComplete}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.bookThisFreight}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-slate-300 hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t.refineQuote}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          <Button
            render={<Link href="/contact" />}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.getDetailedQuote}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            render={
              <a
                href={`${CONTACT.whatsappUrl}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick("whatsapp", "calculator_v3_estimate")}
              />
            }
            variant="outline"
            className="w-full border-emerald-600/50 py-5 font-semibold text-emerald-500 hover:bg-emerald-600/10"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t.whatsAppUs}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="w-full text-slate-300 hover:text-white"
          >
            {t.calculateAnother}
          </Button>
        </div>
      )}
    </div>
  );
}

function ImportCostNote({
  importCost,
  locale,
}: {
  importCost: ImportCostEstimateV3;
  locale: CalculatorLocale;
}) {
  const t = COPY[locale];
  if (importCost.available) {
    return (
      <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
        {importCost.sourceLabel && (
          <p>
            {importCost.sourceLabel}
            {importCost.sourceVersion ? ` · ${importCost.sourceVersion}` : ""}
          </p>
        )}
        {importCost.recoverableCreditsUsd != null &&
          importCost.recoverableCreditsUsd > 0 && (
            <p>Recoverable credits: {formatDollar(importCost.recoverableCreditsUsd)}</p>
          )}
        {importCost.note && <p>{getLocalizedText(importCost.note, locale)}</p>}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
      {importCost.note && <p>{getLocalizedText(importCost.note, locale)}</p>}
      {importCost.missingInputs.length > 0 && (
        <p>
          {t.missingInputs}:{" "}
          {importCost.missingInputs
            .map((key) => missingInputLabel(key, locale))
            .join(", ")}
        </p>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span
        className={`text-right ${
          highlight ? "font-semibold text-primary" : "font-medium text-white"
        }${mono ? " font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
    </div>
  );
}
