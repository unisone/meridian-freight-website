import {
  compliancePolicySchema,
  equipmentQuoteProfileSchema,
  localeCodeSchema,
  type CalculatorLocale,
  type CompliancePolicy,
  type EquipmentQuoteMode,
  type EquipmentQuoteProfile,
  type LocalizedText,
} from "@/lib/calculator-v3/contracts";

export const CALCULATOR_V3_POLICY_VERSION = "calculator-v3-policy-2026-04-20";

const text = (en: string, es: string, ru: string): LocalizedText => ({
  en,
  es,
  ru,
});

const wholeMode = (
  containerType: "flatrack" | "fortyhc",
  overrides: Partial<EquipmentQuoteMode> = {},
): EquipmentQuoteMode => ({
  id: "whole",
  containerType,
  enabled: true,
  label: text("Whole unit", "Unidad completa", "Целиком"),
  shortLabel: text("Whole", "Completo", "Целиком"),
  description: text(
    "Ships as a complete machine with route optimized to the best U.S. port.",
    "Se envía como máquina completa con ruta optimizada al mejor puerto de EE. UU.",
    "Отправляется целиком с оптимизацией маршрута до лучшего порта США.",
  ),
  fractionalContainerPricing: false,
  requiresEquipmentValue: containerType === "flatrack",
  ...overrides,
});

const containerMode = (
  overrides: Partial<EquipmentQuoteMode> = {},
): EquipmentQuoteMode => ({
  id: "container",
  containerType: "fortyhc",
  enabled: true,
  label: text("In containers", "En contenedor", "В контейнере"),
  shortLabel: text("Container", "Contenedor", "Контейнер"),
  description: text(
    "Packed at Meridian's Albion, IA facility and shipped by 40' high cube container.",
    "Se embala en la instalación de Meridian en Albion, IA y se envía en contenedor high cube de 40 pies.",
    "Упаковка на площадке Meridian в Albion, IA и отправка в 40-футовом high cube контейнере.",
  ),
  fractionalContainerPricing: false,
  requiresEquipmentValue: false,
  ...overrides,
});

export const EQUIPMENT_QUOTE_PROFILES: EquipmentQuoteProfile[] = [
  {
    id: "combines",
    publicCategory: "primary",
    equipmentCategory: "combine",
    sourceEquipmentTypes: ["combine_small", "combine_large", "combine"],
    sortOrder: 10,
    label: text("Combines", "Cosechadoras", "Комбайны"),
    pluralLabel: text("Combines", "Cosechadoras", "Комбайны"),
    description: text(
      "Large grain combines with whole-unit and containerized routing options.",
      "Cosechadoras grandes con opciones de envío completas o en contenedores.",
      "Зерноуборочные комбайны с вариантами отправки целиком или в контейнерах.",
    ),
    image: "/images/project-jd-9650sts-combine.jpg",
    quantityLabel: text("Number of combines", "Número de cosechadoras", "Количество комбайнов"),
    quantityHelp: text(
      "Containerized combines are priced as two 40HC containers because the machine occupies about 1 1/3 containers.",
      "Las cosechadoras en contenedor se cotizan como dos 40HC porque ocupan aproximadamente 1 1/3 contenedores.",
      "Контейнерная отправка комбайна считается как два 40HC, так как машина занимает около 1 1/3 контейнера.",
    ),
    defaultQuantity: 1,
    maxQuantity: 4,
    hsCode: "843351",
    modes: [
      wholeMode("flatrack"),
      containerMode({
        minimumContainers: 2,
        packingOverrideUsd: 8250,
        description: text(
          "Priced as two 40HC containers; about two thirds of the second container can be used for compatible additional cargo.",
          "Se cotiza como dos contenedores 40HC; cerca de dos tercios del segundo contenedor puede usarse para carga compatible adicional.",
          "Считается как два 40HC; около двух третей второго контейнера можно использовать под совместимый дополнительный груз.",
        ),
      }),
    ],
    notes: [],
  },
  {
    id: "tractors",
    publicCategory: "primary",
    equipmentCategory: "tractor",
    sourceEquipmentTypes: ["tractor_2wd", "tractor_4wd", "tractor_track", "tractor"],
    sortOrder: 20,
    label: text("Tractors", "Tractores", "Тракторы"),
    pluralLabel: text("Tractors", "Tractores", "Тракторы"),
    description: text(
      "Row-crop, 4WD, and tracked tractors with container-first quoting.",
      "Tractores agrícolas, 4WD y de orugas con cotización primaria en contenedor.",
      "Колесные, 4WD и гусеничные тракторы с приоритетом контейнерной отправки.",
    ),
    image: "/images/project-jd-4044r-tractor.jpg",
    quantityLabel: text("Number of tractors", "Número de tractores", "Количество тракторов"),
    quantityHelp: text(
      "Use the whole-unit mode only when dimensions require port loading.",
      "Use unidad completa solo cuando las dimensiones requieran carga en puerto.",
      "Режим целиком используйте только если габариты требуют погрузки в порту.",
    ),
    defaultQuantity: 1,
    maxQuantity: 8,
    hsCode: "870190",
    modes: [
      containerMode(),
      wholeMode("flatrack", {
        enabled: true,
        description: text(
          "Optional oversized route for tractors that cannot safely fit a 40HC profile.",
          "Ruta opcional para tractores sobredimensionados que no entran de forma segura en 40HC.",
          "Опция для крупногабаритных тракторов, которые нельзя безопасно разместить в 40HC.",
        ),
      }),
    ],
  },
  {
    id: "sprayers",
    publicCategory: "primary",
    equipmentCategory: "sprayer",
    sourceEquipmentTypes: ["sprayer_selfpropelled", "sprayer_pull", "sprayer"],
    sortOrder: 30,
    label: text("Sprayers", "Pulverizadoras", "Опрыскиватели"),
    pluralLabel: text("Sprayers", "Pulverizadoras", "Опрыскиватели"),
    description: text(
      "Self-propelled and pull-type sprayers with whole/container options.",
      "Pulverizadoras autopropulsadas y de arrastre con opciones completa o contenedor.",
      "Самоходные и прицепные опрыскиватели с отправкой целиком или в контейнере.",
    ),
    image: "/images/project-hagie-sprayer-flatbed.jpg",
    quantityLabel: text("Number of sprayers", "Número de pulverizadoras", "Количество опрыскивателей"),
    quantityHelp: text(
      "Self-propelled sprayers usually require whole-unit routing; pull-type sprayers often fit 40HC.",
      "Las autopropulsadas normalmente requieren envío completo; las de arrastre suelen entrar en 40HC.",
      "Самоходные обычно идут целиком; прицепные часто помещаются в 40HC.",
    ),
    defaultQuantity: 1,
    maxQuantity: 6,
    hsCode: "842449",
    modes: [wholeMode("flatrack"), containerMode()],
  },
  {
    id: "headers",
    publicCategory: "primary",
    equipmentCategory: "header",
    sourceEquipmentTypes: [
      "header_flex_rigid",
      "header_flex_rigid_30",
      "header_flex_rigid_over30",
      "header_draper",
      "header_draper_30",
      "header_draper_over30",
      "header_corn",
      "header_shelbourne",
      "header_honeybee",
      "header_lexion",
      "header",
    ],
    sortOrder: 40,
    label: text("Headers and platforms", "Cabezales y plataformas", "Жатки и платформы"),
    pluralLabel: text("Headers", "Cabezales", "Жатки"),
    description: text(
      "Flex, rigid, draper, corn, and specialty headers with shared-container math.",
      "Cabezales flexibles, rígidos, draper, maiceros y especiales con cálculo por contenedor compartido.",
      "Гибкие, жесткие, draper, кукурузные и специальные жатки с расчетом доли контейнера.",
    ),
    image: "/images/project-jd-925f-header-load.jpg",
    quantityLabel: text("Number of headers", "Número de cabezales", "Количество жаток"),
    quantityHelp: text(
      "Flex/rigid headers with augers can usually load four per 40HC; one unit is priced as one quarter of a shared container.",
      "Los cabezales flex/rígidos con sinfín normalmente cargan cuatro por 40HC; una unidad se calcula como un cuarto de contenedor compartido.",
      "Гибкие/жесткие жатки со шнеком обычно грузятся по четыре в 40HC; одна единица считается как четверть общего контейнера.",
    ),
    defaultQuantity: 1,
    maxQuantity: 12,
    hsCode: "843390",
    modes: [
      containerMode({
        capacityUnitsPerContainer: 4,
        fractionalContainerPricing: true,
        description: text(
          "Shared-container allocation assumes four compatible headers per 40HC and also shows a dedicated-container comparison.",
          "La asignación compartida asume cuatro cabezales compatibles por 40HC y también muestra una comparación con contenedor dedicado.",
          "Расчет доли предполагает четыре совместимые жатки на 40HC и также показывает сравнение с отдельным контейнером.",
        ),
      }),
    ],
  },
  {
    id: "planting-seeding",
    publicCategory: "other",
    equipmentCategory: "planter",
    sourceEquipmentTypes: ["planter", "seeder"],
    sortOrder: 50,
    label: text("Planters and seeders", "Sembradoras", "Сеялки и посевные комплексы"),
    pluralLabel: text("Planters and seeders", "Sembradoras", "Сеялки"),
    description: text(
      "Planters, seeders, and air carts routed through the container workflow where possible.",
      "Sembradoras y carros de aire por flujo de contenedor cuando es posible.",
      "Сеялки и пневмобункеры через контейнерный маршрут, когда это возможно.",
    ),
    image: "/images/project-kinze-planter-flatbed.jpg",
    quantityLabel: text("Number of units", "Número de unidades", "Количество единиц"),
    quantityHelp: text(
      "Large frames may still require a manual dimensional check.",
      "Los equipos grandes pueden requerir verificacion manual de dimensiones.",
      "Крупные рамы могут потребовать ручной проверки габаритов.",
    ),
    defaultQuantity: 1,
    maxQuantity: 6,
    hsCode: "843239",
    modes: [containerMode()],
  },
  {
    id: "tillage",
    publicCategory: "other",
    equipmentCategory: "tillage",
    sourceEquipmentTypes: [
      "tillage_cultivator",
      "tillage_disk",
      "tillage_ripper",
      "tillage_excelerator",
      "tillage_plow",
      "tillage_rotary_hoe",
      "tillage_spike_harrow",
      "tillage_field_cultivator",
      "tillage_row_crop_cultivator",
      "tillage",
    ],
    sortOrder: 60,
    label: text("Tillage equipment", "Equipos de labranza", "Почвообрабатывающая техника"),
    pluralLabel: text("Tillage equipment", "Equipos de labranza", "Почвообрабатывающая техника"),
    description: text(
      "Cultivators, disks, rippers, plows, and related implements.",
      "Cultivadores, discos, subsoladores, arados e implementos relacionados.",
      "Культиваторы, диски, рыхлители, плуги и похожие орудия.",
    ),
    image: "/images/project-jd-tillage-containers.jpg",
    quantityLabel: text("Number of units", "Número de unidades", "Количество единиц"),
    quantityHelp: text(
      "Container loading depends on folded dimensions and dismantling scope.",
      "La carga en contenedor depende de dimensiones plegadas y desmontaje.",
      "Контейнерная загрузка зависит от сложенных габаритов и объема разборки.",
    ),
    defaultQuantity: 1,
    maxQuantity: 10,
    hsCode: "843229",
    modes: [containerMode()],
  },
  {
    id: "baler-other",
    publicCategory: "other",
    equipmentCategory: "baler",
    sourceEquipmentTypes: ["baler", "other"],
    sortOrder: 70,
    label: text("Balers and other equipment", "Enfardadoras y otros equipos", "Прессы и другая техника"),
    pluralLabel: text("Balers and other equipment", "Enfardadoras y otros equipos", "Прессы и другая техника"),
    description: text(
      "General containerized farm equipment that needs route pricing before a manual dimensional check.",
      "Equipos agrícolas generales en contenedor antes de verificación dimensional manual.",
      "Общая сельхозтехника в контейнере перед ручной проверкой габаритов.",
    ),
    image: "/images/project-spare-parts-container.jpg",
    quantityLabel: text("Number of units", "Número de unidades", "Количество единиц"),
    quantityHelp: text(
      "Use this for equipment that is not covered by the primary categories.",
      "Use esta opción si el equipo no aparece en las categorías principales.",
      "Используйте для техники вне основных категорий.",
    ),
    defaultQuantity: 1,
    maxQuantity: 10,
    hsCode: "843340",
    modes: [containerMode()],
  },
  {
    id: "construction-forestry",
    publicCategory: "other",
    equipmentCategory: "construction",
    sourceEquipmentTypes: [
      "backhoe",
      "excavator",
      "wheel_loader",
      "skid_steer",
      "mini_excavator",
      "dozer",
      "skidder",
      "feller_buncher",
      "forwarder",
      "construction",
      "forestry",
    ],
    sortOrder: 80,
    label: text("Construction and forestry", "Construccion y forestal", "Строительная и лесная техника"),
    pluralLabel: text("Construction and forestry", "Construccion y forestal", "Строительная и лесная техника"),
    description: text(
      "Oversized machines require a manual dimensional and route review before quoting.",
      "Maquinas sobredimensionadas requieren revision manual de dimensiones y ruta antes de cotizar.",
      "Крупногабаритная техника требует ручной проверки габаритов и маршрута перед расчетом.",
    ),
    image: "/images/project-jd-aerial-container.jpg",
    quantityLabel: text("Number of units", "Número de unidades", "Количество единиц"),
    quantityHelp: text(
      "Exact mode depends on dimensions and attachments.",
      "El modo exacto depende de dimensiones y accesorios.",
      "Точный способ зависит от габаритов и навесного оборудования.",
    ),
    defaultQuantity: 1,
    maxQuantity: 4,
    hsCode: "842952",
    modes: [
      wholeMode("flatrack", {
        enabled: false,
        disabledReason: text(
          "Manual quote required for oversized construction and forestry equipment.",
          "Cotizacion manual requerida para equipos de construccion y forestales sobredimensionados.",
          "Для крупногабаритной строительной и лесной техники требуется ручной расчет.",
        ),
      }),
    ],
  },
].map((profile) => equipmentQuoteProfileSchema.parse(profile));

export const COMPLIANCE_POLICIES: CompliancePolicy[] = [
  {
    country: "AR",
    version: "ar-senasa-2026-04",
    sourceLabel: "SENASA / Argentina.gob.ar",
    sourceUrl:
      "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de",
    effectiveDate: "2026-04-20",
    summary: text(
      "Argentina requires clean used machinery plus AFIDI document and physical checks; any treatment is confirmed case by case with the importer/broker.",
      "Argentina exige maquinaria usada limpia, revisión documental AFIDI e inspección física; cualquier tratamiento se confirma caso por caso con el importador/broker.",
      "Аргентина проверяет AFIDI, документы и физическое состояние бывшей в употреблении сельхозтехники; мойка и фитосанитарная обработка зависят от случая.",
    ),
    lines: [
      {
        id: "ar-cleaning-wash",
        serviceType: "wash",
        label: text("Export wash", "Lavado de exportación", "Экспортная мойка"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "required",
        publicAmount: false,
        note: text(
          "Used machinery must be clean and free of soil or plant residue; Meridian service pricing is confirmed with the export team.",
          "La maquinaria usada debe estar limpia y libre de suelo o restos vegetales; el precio del servicio Meridian se confirma con el equipo de exportación.",
          "Бывшая в употреблении техника должна быть чистой, без почвы и растительных остатков; стоимость услуги Meridian подтверждается командой экспорта.",
        ),
      },
      {
        id: "ar-treatment",
        serviceType: "treatment",
        label: text("Treatment review", "Revisión de tratamiento", "Проверка обработки"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "case_by_case",
        publicAmount: false,
        note: text(
          "AFIDI and the local broker/importer confirm whether treatment or fumigation is required before shipping.",
          "AFIDI y el broker/importador local confirman si se requiere tratamiento o fumigación antes del embarque.",
          "AFIDI и местный брокер/импортер подтверждают перед отправкой, требуется ли обработка или фумигация.",
        ),
      },
    ],
  },
  {
    country: "CL",
    version: "cl-sag-2026-04",
    sourceLabel: "SAG Resolucion 3.103",
    sourceUrl:
      "https://www.sag.gob.cl/content/establece-requisitos-fitosanitarios-para-la-importacion-admision-temporal-y-transito-de-maquinaria-usada-que-indica-y-deroga-resolucion-ndeg-2979-de-2001",
    effectiveDate: "2026-04-20",
    summary: text(
      "Chile regulates used machinery under SAG phytosanitary import/transit requirements.",
      "Chile regula maquinaria usada bajo requisitos fitosanitarios de importación/tránsito SAG.",
      "Чили регулирует бывшую в употреблении технику по фитосанитарным требованиям SAG.",
    ),
    lines: [
      {
        id: "cl-cleaning-wash",
        serviceType: "wash",
        label: text("Export wash", "Lavado de exportación", "Экспортная мойка"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "required",
        publicAmount: false,
        note: text(
          "SAG requires used machinery to be clean and free of regulated material; service pricing is confirmed before booking.",
          "SAG exige maquinaria usada limpia y libre de material regulado; el precio del servicio se confirma antes de reservar.",
          "SAG требует, чтобы бывшая в употреблении техника была чистой и без регулируемых материалов; стоимость услуги подтверждается до бронирования.",
        ),
      },
      {
        id: "cl-treatment",
        serviceType: "treatment",
        label: text("Treatment review", "Revisión de tratamiento", "Проверка обработки"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "case_by_case",
        publicAmount: false,
        note: text(
          "Broker/SAG documentation review confirms whether treatment or fumigation is required.",
          "La revisión documental del broker/SAG confirma si se requiere tratamiento o fumigación.",
          "Обработка или фумигация подтверждается после проверки документов брокером/SAG.",
        ),
      },
    ],
  },
  {
    country: "UY",
    version: "uy-dgsa-2026-04",
    sourceLabel: "Uruguay MGAP DGSA Resolucion 98/016",
    sourceUrl:
      "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais",
    effectiveDate: "2026-04-20",
    summary: text(
      "Uruguay requires used machinery to be clean and subject to phytosanitary inspection; treatment may be required by DGSA.",
      "Uruguay exige maquinaria usada limpia e inspección fitosanitaria; DGSA puede requerir tratamiento.",
      "Уругвай требует чистую технику и фитосанитарную инспекцию; DGSA может потребовать обработку.",
    ),
    lines: [
      {
        id: "uy-cleaning-wash",
        serviceType: "wash",
        label: text("Export wash", "Lavado de exportación", "Экспортная мойка"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "required",
        publicAmount: false,
        note: text(
          "DGSA requires cleaning and may require treatment or additional action after inspection.",
          "DGSA exige limpieza y puede requerir tratamiento o acción adicional tras la inspección.",
          "DGSA требует очистку и может потребовать обработку или дополнительные действия после инспекции.",
        ),
      },
      {
        id: "uy-treatment",
        serviceType: "treatment",
        label: text("Phytosanitary treatment", "Tratamiento fitosanitario", "Фитосанитарная обработка"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "case_by_case",
        publicAmount: false,
        note: text(
          "Treatment specifications must be confirmed with the broker/importer and origin certificate requirements.",
          "Las especificaciones de tratamiento deben confirmarse con el broker/importador y los requisitos del certificado de origen.",
          "Спецификации обработки должны быть подтверждены брокером/импортером и требованиями сертификата страны отправления.",
        ),
      },
    ],
  },
  {
    country: "PY",
    version: "py-law-7565-2026-04",
    sourceLabel: "Paraguay Ley 7565/2025",
    sourceUrl:
      "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados",
    effectiveDate: "2026-04-20",
    summary: text(
      "Paraguay requires used agricultural machinery to be sanitized, clean, treated/certified, and inspected under Ley 7565/2025; online pricing stays broker-confirmed.",
      "Paraguay exige maquinaria agrícola usada sanitizada, limpia, tratada/certificada e inspeccionada bajo Ley 7565/2025; el precio en línea queda sujeto a confirmación del broker.",
      "Парагвай требует санитарную подготовку, очистку, обработку/сертификацию и инспекцию бывшей в употреблении сельхозтехники по Ley 7565/2025.",
    ),
    lines: [
      {
        id: "py-cleaning-sanitation",
        serviceType: "cleaning",
        label: text("Cleaning / sanitation", "Limpieza / sanitización", "Очистка / санитарная подготовка"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "required",
        publicAmount: false,
        note: text(
          "Cleaning and sanitation must be confirmed with exporter/importer documentation and SENAVE process.",
          "Limpieza y sanitización deben confirmarse con documentación del exportador/importador y proceso SENAVE.",
          "Очистка и санитарная подготовка подтверждаются документами экспортера/импортера и процедурой SENAVE.",
        ),
      },
      {
        id: "py-treatment-certificate",
        serviceType: "certificate",
        label: text("Treatment and certificate", "Tratamiento y certificado", "Обработка и сертификат"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "broker_confirm",
        publicAmount: false,
        note: text(
          "Treatment certificate, phytosanitary certificate, and destination inspection are broker/importer-confirmed.",
          "Certificado de tratamiento, certificado fitosanitario e inspección en destino se confirman con broker/importador.",
          "Сертификат обработки, фитосанитарный сертификат и инспекция в стране назначения подтверждаются брокером/импортером.",
        ),
      },
    ],
  },
  {
    country: "BO",
    version: "bo-policy-2026-04",
    sourceLabel: "Bolivia SENASAG import permit procedure",
    sourceUrl:
      "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/administracion/area-nacional-de-recursos-humano/category/25-consulta-publica?download=1917%3Aprocedimiento-de-emision-de-permiso-de-importacion-fitosanitaria-y-de-insumos-agricolas-en-sanidad-vegetal",
    effectiveDate: "2026-04-20",
    summary: text(
      "Bolivia-bound cargo needs broker/importer confirmation for phytosanitary import documentation; no used-machinery-specific automatic treatment profile is confirmed.",
      "La carga hacia Bolivia requiere confirmación del broker/importador para documentación fitosanitaria; no hay perfil automático confirmado para maquinaria usada.",
      "Грузы в Боливию требуют подтверждения брокера/импортера по фитосанитарным документам; автоматический профиль для бывшей в употреблении техники не подтвержден.",
    ),
    lines: [
      {
        id: "bo-broker-confirmation",
        serviceType: "note",
        label: text("Broker/importer confirmation", "Confirmación broker/importador", "Подтверждение брокера/импортера"),
        amountUsd: null,
        amountStatus: "quote_confirmed",
        status: "broker_confirm",
        publicAmount: false,
        note: text(
          "Cleaning, treatment, or phytosanitary documentation may be required; confirm before booking.",
          "Limpieza, tratamiento o documentación fitosanitaria pueden ser requeridos; confirmar antes de reservar.",
          "Очистка, обработка или фитосанитарные документы могут потребоваться; подтвердите до бронирования.",
        ),
      },
    ],
  },
].map((policy) => compliancePolicySchema.parse(policy));

export function getLocalizedText(value: LocalizedText, locale: string): string {
  const normalized = localeCodeSchema.safeParse(locale).success
    ? (locale as CalculatorLocale)
    : "en";
  return value[normalized] || value.en;
}

export function getEquipmentProfile(profileId: string): EquipmentQuoteProfile | null {
  return EQUIPMENT_QUOTE_PROFILES.find((profile) => profile.id === profileId) ?? null;
}

export function getCompliancePolicy(country: string): CompliancePolicy | null {
  return (
    COMPLIANCE_POLICIES.find(
      (policy) => policy.country.toUpperCase() === country.toUpperCase(),
    ) ?? null
  );
}
