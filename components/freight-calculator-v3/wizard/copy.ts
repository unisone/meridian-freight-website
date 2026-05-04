// Localized COPY dictionary + label helpers for the v3 freight calculator
// wizard. Pure data + pure helpers — no React, no JSX, no `"use client"`.

import { PackageCheck, Truck, type LucideIcon } from "lucide-react";

import { formatDollar } from "@/lib/calculator-v3/format";
import {
  compareRoutesForFreightV3,
  getV3RouteFreightSortCost,
} from "@/lib/calculator-v3/engine";
import type {
  CalculatorDataV3,
  CalculatorLocale,
  EquipmentQuoteMode,
  FreightLineItemV3,
  ImportCostEstimateV3,
  RouteOption,
  RoutePreference,
} from "@/lib/calculator-v3/contracts";
import { COUNTRY_NAMES, type ContainerType } from "@/lib/types/calculator";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const COPY = {
  en: {
    unavailableTitle: "Calculator unavailable",
    unavailableDescription:
      "Current rate data is temporarily unavailable. Meridian can still prepare a manual quote.",
    selectEquipmentCategory: "Select equipment category",
    selectEquipmentHint: "Select equipment above to see specifications.",
    equipmentSpecs: "Equipment specs",
    shippingRoute: "Shipping route",
    completeEquipmentHint: "Complete equipment selection to configure routing.",
    shippingMode: "Shipping mode",
    confirmWithMeridian: "Confirm with Meridian",
    quantity: "Quantity",
    equipmentValueUsd: "Equipment value",
    equipmentValuePlaceholder: "e.g. 125000",
    equipmentValueHint:
      "Used for flat rack insurance and indicative import-cost estimates.",
    valueRequired: "Enter equipment value for this mode.",
    destinationCountry: "Destination country",
    selectCountry: "Select country",
    usPickupZip: "U.S. Pickup ZIP",
    optional: "optional",
    zipPlaceholder: "e.g. 50005",
    zipHint: "Used to estimate U.S. inland transport. Leave blank for route-only freight.",
    routePreference: "Route preference",
    cheapest: "Cheapest",
    fastest: "Fastest",
    destinationPort: "Destination port / route",
    routeOptions: "Route options",
    route: "Route",
    transit: "Transit",
    notPublished: "To be confirmed",
    routeRequired: "Select a route before submitting.",
    noPublishedRoutesTitle: "No automatic route for this selection",
    noPublishedRoutesDescription:
      "This equipment mode and destination are not available in the automatic calculator yet. Meridian can quote it manually.",
    estimatedFreight: "Estimated freight",
    basedOnRates:
      "Estimated to the destination shown. Meridian confirms final pricing before booking.",
    optimizedRouteRate: "selected route estimate",
    exclInlandTransport: "excludes U.S. inland transport",
    selectDestination: "Select destination",
    routeUnavailableEstimate: "Route unavailable",
    emptyStateText: "Select equipment and destination to see an estimate",
    freightTotal: "Estimated freight to destination shown",
    compliancePrep: "Compliance prep",
    importEstimate: "Indicative import-cost estimate",
    importNotIncluded: "Separate from freight",
    importBrokerNote:
      "Final duties, taxes, broker fees, and destination charges must be confirmed with a licensed customs broker.",
    brokerConfirmed: "Broker confirmation required",
    quoteConfirmed: "Quote confirmation required",
    notAvailable: "Not calculated online",
    notCalculatedOnline: "Not calculated online",
    noAutomaticCharge: "No automatic charge",
    needsInput: "More info needed",
    missingInputs: "Missing inputs",
    dedicatedComparison: "Dedicated-container comparison",
    getYourDetailedEstimate: "Send this estimate",
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
    calculateAndSend: "Send detailed estimate",
    calculating: "Calculating...",
    emailBreakdownNote: "Email is required to send the detailed breakdown.",
    bookThisFreight: "Send detailed estimate",
    refineQuote: "Adjust estimate",
    estimateSentTo: "Estimate sent to {email}",
    getDetailedQuote: "Request confirmed quote",
    whatsAppUs: "Chat on WhatsApp",
    calculateAnother: "Calculate another",
    viewEstimateDetails: "View estimate details",
    viewEstimate: "View estimate",
    selectDestinationForEstimate: "Select destination for estimate",
    selectEquipmentToBegin: "Select equipment to begin",
    yourFreightEstimate: "Your freight estimate",
    lineItems: "Line items",
    container: "Container",
    carrier: "Carrier",
    recoverableCredits: "Recoverable credits",
    warnings: "Warnings",
    notes: "Notes",
    showAllCategories: "Show all categories",
    usPickup: "U.S. pickup",
    disclaimer:
      "Freight, compliance prep, and import costs are separate estimates. Freight is estimated to the destination shown; final booking, compliance services, duties, taxes, destination charges, and any destination-specific wash or treatment must be confirmed before shipment.",
  },
  es: {
    unavailableTitle: "Calculadora no disponible",
    unavailableDescription:
      "Las tarifas actuales no están disponibles temporalmente. Meridian puede preparar una cotización manual.",
    selectEquipmentCategory: "Seleccione categoría de equipo",
    selectEquipmentHint: "Seleccione equipo arriba para ver especificaciones.",
    equipmentSpecs: "Especificaciones",
    shippingRoute: "Ruta de envío",
    completeEquipmentHint: "Complete la selección del equipo para configurar la ruta.",
    shippingMode: "Modo de envío",
    confirmWithMeridian: "Confirmar con Meridian",
    quantity: "Cantidad",
    equipmentValueUsd: "Valor del equipo",
    equipmentValuePlaceholder: "ej. 125000",
    equipmentValueHint:
      "Se usa para seguro flat rack y estimaciones indicativas de importación.",
    valueRequired: "Ingrese el valor del equipo para este modo.",
    destinationCountry: "País destino",
    selectCountry: "Seleccione país",
    usPickupZip: "ZIP de retiro en EE. UU.",
    optional: "opcional",
    zipPlaceholder: "ej. 50005",
    zipHint:
      "Se usa para estimar transporte interno en EE. UU. Déjelo vacío para flete de ruta sin retiro en EE. UU.",
    routePreference: "Preferencia de ruta",
    cheapest: "Más barata",
    fastest: "Más rápida",
    destinationPort: "Puerto / ruta destino",
    routeOptions: "Opciones de ruta",
    route: "Ruta",
    transit: "Tránsito",
    notPublished: "Por confirmar",
    routeRequired: "Seleccione una ruta antes de enviar.",
    noPublishedRoutesTitle: "No hay ruta automática para esta selección",
    noPublishedRoutesDescription:
      "Este modo de equipo y destino aún no está disponible en la calculadora automática. Meridian puede cotizarlo manualmente.",
    estimatedFreight: "Flete estimado",
    basedOnRates:
      "Estimado hasta el destino mostrado. Meridian confirma el precio final antes de reservar.",
    optimizedRouteRate: "estimación de la ruta seleccionada",
    exclInlandTransport: "sin transporte interno de EE. UU.",
    selectDestination: "Seleccione destino",
    routeUnavailableEstimate: "Ruta no disponible",
    emptyStateText: "Seleccione equipo y destino para ver una estimación",
    freightTotal: "Flete estimado al destino mostrado",
    compliancePrep: "Preparación de cumplimiento",
    importEstimate: "Estimación indicativa de importación",
    importNotIncluded: "Separado del flete",
    importBrokerNote:
      "Derechos, impuestos, honorarios del broker y cargos en destino deben confirmarse con un broker aduanal autorizado.",
    brokerConfirmed: "Confirmación del broker requerida",
    quoteConfirmed: "Confirmación de cotización requerida",
    notAvailable: "No calculado en línea",
    notCalculatedOnline: "No calculado en línea",
    noAutomaticCharge: "Sin cargo automático",
    needsInput: "Faltan datos",
    missingInputs: "Datos faltantes",
    dedicatedComparison: "Comparación con contenedor dedicado",
    getYourDetailedEstimate: "Enviar esta estimación",
    emailLabel: "Email",
    nameLabel: "Nombre",
    companyLabel: "Empresa",
    phoneLabel: "Teléfono / WhatsApp",
    preferredContact: "Contacto preferido",
    emailOption: "Email",
    whatsappOption: "WhatsApp",
    optionalPlaceholder: "Opcional",
    emailPlaceholder: "usted@empresa.com",
    validEmailError: "Ingrese un email válido.",
    calculateAndSend: "Enviar estimación detallada",
    calculating: "Calculando...",
    emailBreakdownNote: "El email es obligatorio para enviar el detalle.",
    bookThisFreight: "Enviar estimación detallada",
    refineQuote: "Ajustar estimación",
    estimateSentTo: "Estimación enviada a {email}",
    getDetailedQuote: "Solicitar cotización confirmada",
    whatsAppUs: "Chat por WhatsApp",
    calculateAnother: "Calcular otra",
    viewEstimateDetails: "Ver detalle",
    viewEstimate: "Ver estimación",
    selectDestinationForEstimate: "Seleccione destino",
    selectEquipmentToBegin: "Seleccione equipo",
    yourFreightEstimate: "Su estimación de flete",
    lineItems: "Partidas",
    container: "Contenedor",
    carrier: "Naviera",
    recoverableCredits: "Créditos recuperables",
    warnings: "Avisos",
    notes: "Notas",
    showAllCategories: "Mostrar todas las categorías",
    usPickup: "Retiro en EE. UU.",
    disclaimer:
      "Flete, preparación de cumplimiento y costos de importación son estimaciones separadas. El flete se estima hasta el destino mostrado; reserva final, servicios de cumplimiento, derechos, impuestos, cargos en destino y cualquier lavado o tratamiento específico deben confirmarse antes del embarque.",
  },
  ru: {
    unavailableTitle: "Калькулятор недоступен",
    unavailableDescription:
      "Текущие тарифы временно недоступны. Meridian подготовит ручной расчет.",
    selectEquipmentCategory: "Выберите категорию техники",
    selectEquipmentHint: "Выберите технику выше, чтобы увидеть параметры.",
    equipmentSpecs: "Параметры техники",
    shippingRoute: "Маршрут отправки",
    completeEquipmentHint: "Завершите выбор техники, чтобы настроить маршрут.",
    shippingMode: "Способ отправки",
    confirmWithMeridian: "Подтвердить с Meridian",
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
    zipHint: "Используется для оценки внутренней доставки по США. Оставьте пустым для расчета маршрута без забора в США.",
    routePreference: "Приоритет маршрута",
    cheapest: "Дешевле",
    fastest: "Быстрее",
    destinationPort: "Порт / маршрут назначения",
    routeOptions: "Варианты маршрута",
    route: "Маршрут",
    transit: "Транзит",
    notPublished: "Подтвердить",
    routeRequired: "Выберите маршрут перед отправкой.",
    noPublishedRoutesTitle: "Нет автоматического маршрута для выбора",
    noPublishedRoutesDescription:
      "Этот способ и направление пока не доступны в автоматическом калькуляторе. Meridian может подготовить ручной расчет.",
    estimatedFreight: "Оценка фрахта",
    basedOnRates:
      "Расчет до указанного пункта назначения. Финальную цену Meridian подтверждает перед бронированием.",
    optimizedRouteRate: "оценка выбранного маршрута",
    exclInlandTransport: "без внутренней доставки по США",
    selectDestination: "Выберите направление",
    routeUnavailableEstimate: "Маршрут недоступен",
    emptyStateText: "Выберите технику и направление, чтобы увидеть расчет",
    freightTotal: "Оценка фрахта до указанного назначения",
    compliancePrep: "Подготовка к требованиям",
    importEstimate: "Ориентировочная импортная оценка",
    importNotIncluded: "Отдельно от фрахта",
    importBrokerNote:
      "Пошлины, налоги, услуги брокера и расходы в стране назначения должен подтвердить лицензированный таможенный брокер.",
    brokerConfirmed: "Требуется подтверждение брокера",
    quoteConfirmed: "Требуется подтверждение расчета",
    notAvailable: "Не рассчитывается онлайн",
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
    calculateAndSend: "Отправить подробный расчет",
    calculating: "Расчет...",
    emailBreakdownNote: "Email обязателен, чтобы отправить подробный расчет.",
    bookThisFreight: "Отправить подробный расчет",
    refineQuote: "Уточнить расчет",
    estimateSentTo: "Расчет отправлен на {email}",
    getDetailedQuote: "Запросить подтвержденный расчет",
    whatsAppUs: "Написать в WhatsApp",
    calculateAnother: "Рассчитать еще",
    viewEstimateDetails: "Открыть детали",
    viewEstimate: "Смотреть расчет",
    selectDestinationForEstimate: "Выберите направление",
    selectEquipmentToBegin: "Выберите технику",
    yourFreightEstimate: "Ваш расчет фрахта",
    lineItems: "Строки расчета",
    container: "Контейнер",
    carrier: "Линия",
    recoverableCredits: "Возмещаемые кредиты",
    warnings: "Предупреждения",
    notes: "Примечания",
    showAllCategories: "Показать все категории",
    usPickup: "Забор в США",
    disclaimer:
      "Фрахт, подготовка к требованиям и импортные расходы являются отдельными оценками. Фрахт рассчитан до указанного пункта назначения; финальное бронирование, услуги по требованиям, пошлины, налоги, расходы в стране назначения и любая мойка или обработка должны быть подтверждены до отправки.",
  },
} as const;

export const MISSING_INPUT_LABELS: Record<
  string,
  Record<CalculatorLocale, string>
> = {
  equipment_value: {
    en: "equipment value",
    es: "valor del equipo",
    ru: "стоимость техники",
  },
  local_transport: {
    en: "U.S. inland transport",
    es: "transporte interno EE. UU.",
    ru: "внутренняя доставка США",
  },
  packing_and_loading: {
    en: "packing and loading",
    es: "embalaje y carga",
    ru: "упаковка и погрузка",
  },
  ocean_freight: {
    en: "ocean freight",
    es: "flete marítimo",
    ru: "морской фрахт",
  },
};

export function normalizeLocale(locale: string): CalculatorLocale {
  return locale === "es" || locale === "ru" ? locale : "en";
}

export function countryLabel(country: string): string {
  return COUNTRY_NAMES[country] ?? country;
}

export function containerLabel(containerType: ContainerType): string {
  return containerType === "fortyhc" ? "40' High Cube" : "Flat Rack";
}

export function shortContainerLabel(containerType: ContainerType): string {
  return containerType === "fortyhc" ? "40'HC" : "Flat";
}

export function formatTransit(
  route: RouteOption,
  locale: CalculatorLocale,
): string {
  const value = route.transitTimeDays?.trim();
  if (!value) return COPY[locale].notPublished;
  if (!/\d/.test(value) || /\bday(s)?\b/i.test(value)) return value;
  const unit = locale === "es" ? "días" : locale === "ru" ? "дней" : "days";
  return `${value} ${unit}`;
}

export function routeSortCostLabel(input: {
  route: RouteOption;
  mode: EquipmentQuoteMode;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): string {
  return formatDollar(getV3RouteFreightSortCost(input));
}

export function getRoutes(input: {
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

export function getDestinationPortLabel(
  routes: RouteOption[],
  key: string,
): string {
  return (
    routes.find((route) => route.destination.key === key)?.destination.label ??
    key
  );
}

export function modeIcon(mode: EquipmentQuoteMode): LucideIcon {
  return mode.containerType === "flatrack" ? Truck : PackageCheck;
}

export function missingInputLabel(
  key: string,
  locale: CalculatorLocale,
): string {
  return MISSING_INPUT_LABELS[key]?.[locale] ?? key.replace(/_/g, " ");
}

export function lineItemLabel(
  line: FreightLineItemV3,
  locale: CalculatorLocale,
): string {
  if (line.id === "us_inland") {
    return {
      en: "U.S. inland transport",
      es: "Transporte interno EE. UU.",
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
    es: "Flete marítimo y carga",
    ru: "Морской фрахт и погрузка",
  }[locale];
}

export function importAmountLabel(
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
