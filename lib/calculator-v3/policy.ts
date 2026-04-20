import {
  compliancePolicySchema,
  equipmentQuoteProfileSchema,
  importCostProfileSchema,
  localeCodeSchema,
  type CalculatorLocale,
  type CompliancePolicy,
  type EquipmentQuoteMode,
  type EquipmentQuoteProfile,
  type ImportCostProfile,
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
    "Se envia como maquina completa con ruta optimizada al mejor puerto de EE.UU.",
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
    "Se embala en la instalacion de Meridian en Albion, IA y se envia en contenedor high cube de 40 pies.",
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
      "Cosechadoras grandes con opciones de envio completas o en contenedores.",
      "Зерноуборочные комбайны с вариантами отправки целиком или в контейнерах.",
    ),
    image: "/images/project-jd-9650sts-combine.jpg",
    quantityLabel: text("Number of combines", "Numero de cosechadoras", "Количество комбайнов"),
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
    notes: [
      text(
        "Combines are quoted as one public equipment category; Meridian confirms model-specific handling during follow-up.",
        "Las cosechadoras se cotizan como una categoria publica; Meridian confirma el manejo especifico del modelo en el seguimiento.",
        "Комбайны рассчитываются как одна публичная категория техники; особенности конкретной модели Meridian подтверждает при follow-up.",
      ),
    ],
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
      "Tractores agricolas, 4WD y de orugas con cotizacion primaria en contenedor.",
      "Колесные, 4WD и гусеничные тракторы с приоритетом контейнерной отправки.",
    ),
    image: "/images/project-jd-4044r-tractor.jpg",
    quantityLabel: text("Number of tractors", "Numero de tractores", "Количество тракторов"),
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
    quantityLabel: text("Number of sprayers", "Numero de pulverizadoras", "Количество опрыскивателей"),
    quantityHelp: text(
      "Self-propelled sprayers usually require whole-unit routing; pull-type sprayers often fit 40HC.",
      "Las autopropulsadas normalmente requieren envio completo; las de arrastre suelen entrar en 40HC.",
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
      "Cabezales flexibles, rigidos, draper, maiceros y especiales con calculo por contenedor compartido.",
      "Гибкие, жесткие, draper, кукурузные и специальные жатки с расчетом доли контейнера.",
    ),
    image: "/images/project-jd-925f-header-load.jpg",
    quantityLabel: text("Number of headers", "Numero de cabezales", "Количество жаток"),
    quantityHelp: text(
      "Flex/rigid headers with augers can usually load four per 40HC; one unit is priced as one quarter of a shared container.",
      "Los cabezales flex/rigidos con sinfin normalmente cargan cuatro por 40HC; una unidad se calcula como un cuarto de contenedor compartido.",
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
          "La asignacion compartida asume cuatro cabezales compatibles por 40HC y tambien muestra una comparacion con contenedor dedicado.",
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
    quantityLabel: text("Number of units", "Numero de unidades", "Количество единиц"),
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
    quantityLabel: text("Number of units", "Numero de unidades", "Количество единиц"),
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
      "Equipos agricolas generales en contenedor antes de verificacion dimensional manual.",
      "Общая сельхозтехника в контейнере перед ручной проверкой габаритов.",
    ),
    image: "/images/project-spare-parts-container.jpg",
    quantityLabel: text("Number of units", "Numero de unidades", "Количество единиц"),
    quantityHelp: text(
      "Use this for equipment that is not covered by the primary categories.",
      "Use esta opcion si el equipo no aparece en las categorias principales.",
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
      "Oversized machines normally routed as whole units with port loading.",
      "Maquinas sobredimensionadas normalmente enviadas completas con carga en puerto.",
      "Крупногабаритные машины обычно отправляются целиком с погрузкой в порту.",
    ),
    image: "/images/project-jd-aerial-container.jpg",
    quantityLabel: text("Number of units", "Numero de unidades", "Количество единиц"),
    quantityHelp: text(
      "Exact mode depends on dimensions and attachments.",
      "El modo exacto depende de dimensiones y accesorios.",
      "Точный способ зависит от габаритов и навесного оборудования.",
    ),
    defaultQuantity: 1,
    maxQuantity: 4,
    hsCode: "842952",
    modes: [wholeMode("flatrack")],
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
      "Argentina requires AFIDI-led document and physical checks for used agricultural machinery; clean machinery and applicable phytosanitary treatments are verified case by case.",
      "Argentina verifica AFIDI, documentos e inspeccion fisica para maquinaria agricola usada; limpieza y tratamientos fitosanitarios aplican caso por caso.",
      "Аргентина проверяет AFIDI, документы и физическое состояние бывшей в употреблении сельхозтехники; мойка и фитосанитарная обработка зависят от случая.",
    ),
    lines: [
      {
        id: "wash",
        label: text("Export wash", "Lavado de exportacion", "Экспортная мойка"),
        amountUsd: null,
        includedInFreight: true,
        note: text(
          "Uses the equipment-specific wash cost from Meridian's rate table.",
          "Usa el costo de lavado especifico del equipo en la tabla de Meridian.",
          "Использует стоимость мойки из таблицы Meridian для выбранной техники.",
        ),
      },
      {
        id: "fumigation",
        label: text("Fumigation / phytosanitary treatment", "Fumigacion / tratamiento fitosanitario", "Фумигация / фитосанитарная обработка"),
        amountUsd: 650,
        includedInFreight: true,
        note: text(
          "Indicative service allowance; AFIDI defines the final treatment requirement.",
          "Provision indicativa; AFIDI define el tratamiento final requerido.",
          "Ориентировочный сервисный резерв; финальное требование определяет AFIDI.",
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
      "Chile regula maquinaria usada bajo requisitos fitosanitarios de importacion/transito SAG.",
      "Чили регулирует бывшую в употреблении технику по фитосанитарным требованиям SAG.",
    ),
    lines: [
      {
        id: "wash",
        label: text("Export wash", "Lavado de exportacion", "Экспортная мойка"),
        amountUsd: null,
        includedInFreight: true,
        note: text(
          "Uses the equipment-specific wash cost from Meridian's rate table.",
          "Usa el costo de lavado especifico del equipo en la tabla de Meridian.",
          "Использует стоимость мойки из таблицы Meridian для выбранной техники.",
        ),
      },
      {
        id: "fumigation",
        label: text("Fumigation / phytosanitary treatment", "Fumigacion / tratamiento fitosanitario", "Фумигация / фитосанитарная обработка"),
        amountUsd: 650,
        includedInFreight: true,
        note: text(
          "Indicative service allowance pending final documentation review.",
          "Provision indicativa pendiente de revision documental final.",
          "Ориентировочный резерв до финальной проверки документов.",
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
      "Uruguay exige maquinaria usada limpia e inspeccion fitosanitaria; DGSA puede requerir tratamiento.",
      "Уругвай требует чистую технику и фитосанитарную инспекцию; DGSA может потребовать обработку.",
    ),
    lines: [
      {
        id: "wash",
        label: text("Export wash", "Lavado de exportacion", "Экспортная мойка"),
        amountUsd: null,
        includedInFreight: true,
        note: text(
          "Default Meridian quote includes wash only; DGSA may require additional treatment after inspection.",
          "La cotizacion default incluye solo lavado; DGSA puede requerir tratamiento adicional tras inspeccion.",
          "Базовый расчет Meridian включает только мойку; DGSA может потребовать дополнительную обработку после инспекции.",
        ),
      },
    ],
  },
  {
    country: "PY",
    version: "py-policy-2026-04",
    sourceLabel: "Meridian Paraguay import policy",
    sourceUrl: "https://meridianexport.com/destinations/paraguay",
    effectiveDate: "2026-04-20",
    summary: text(
      "No default wash or fumigation allowance is added; broker/importer confirmation is still required.",
      "No se agrega lavado ni fumigacion por defecto; se requiere confirmacion del broker/importador.",
      "По умолчанию мойка и фумигация не добавляются; требуется подтверждение брокера/импортера.",
    ),
    lines: [],
  },
  {
    country: "BO",
    version: "bo-policy-2026-04",
    sourceLabel: "Meridian Bolivia import policy",
    sourceUrl: "https://meridianexport.com/destinations/bolivia",
    effectiveDate: "2026-04-20",
    summary: text(
      "No default wash or fumigation allowance is added; broker/importer confirmation is required for Bolivia-bound cargo.",
      "No se agrega lavado ni fumigacion por defecto; se requiere confirmacion para carga hacia Bolivia.",
      "По умолчанию мойка и фумигация не добавляются; для Боливии требуется подтверждение брокера/импортера.",
    ),
    lines: [],
  },
].map((policy) => compliancePolicySchema.parse(policy));

const tariffNote = text(
  "Indicative public-data estimate only. Duties and taxes depend on final HS classification, customs valuation, importer status, and active local regulations.",
  "Estimacion indicativa con datos publicos. Aranceles e impuestos dependen de clasificacion HS final, valoracion aduanera, estado del importador y normativa local vigente.",
  "Ориентировочная оценка по публичным данным. Пошлины и налоги зависят от финальной HS-классификации, таможенной оценки, статуса импортера и актуальных правил.",
);

const importProfile = (
  country: string,
  equipmentProfileId: string,
  hsCode: string,
  dutyRatePct: number,
  taxRatePct: number,
): ImportCostProfile =>
  importCostProfileSchema.parse({
    country,
    equipmentProfileId,
    hsCode,
    dutyRatePct,
    taxRatePct,
    confidence: "medium",
    sourceLabel: "WTO Tariff & Trade Data / WITS public tariff references",
    sourceUrl: "https://ttd.wto.org/en/download",
    retrievedAt: "2026-04-20",
    sourceVersion: "public-tariff-seed-2026-04",
    note: tariffNote,
  });

const tariffSeeds: Array<[string, string, string, number, number]> = [
  ["AR", "combines", "843351", 0.14, 0.105],
  ["AR", "tractors", "870190", 0.14, 0.105],
  ["AR", "sprayers", "842449", 0.14, 0.105],
  ["AR", "headers", "843390", 0.14, 0.105],
  ["CL", "combines", "843351", 0.06, 0.19],
  ["CL", "tractors", "870190", 0.06, 0.19],
  ["CL", "sprayers", "842449", 0.06, 0.19],
  ["CL", "headers", "843390", 0.06, 0.19],
  ["UY", "combines", "843351", 0.14, 0.22],
  ["UY", "tractors", "870190", 0.14, 0.22],
  ["UY", "sprayers", "842449", 0.14, 0.22],
  ["UY", "headers", "843390", 0.14, 0.22],
  ["PY", "combines", "843351", 0.10, 0.10],
  ["PY", "tractors", "870190", 0.10, 0.10],
  ["PY", "sprayers", "842449", 0.10, 0.10],
  ["PY", "headers", "843390", 0.10, 0.10],
  ["BO", "combines", "843351", 0.10, 0.13],
  ["BO", "tractors", "870190", 0.10, 0.13],
  ["BO", "sprayers", "842449", 0.10, 0.13],
  ["BO", "headers", "843390", 0.10, 0.13],
];

export const IMPORT_COST_PROFILES: ImportCostProfile[] = tariffSeeds.map((seed) =>
  importProfile(...seed),
);

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

export function getImportCostProfile(
  country: string,
  equipmentProfileId: string,
): ImportCostProfile | null {
  return (
    IMPORT_COST_PROFILES.find(
      (profile) =>
        profile.country.toUpperCase() === country.toUpperCase() &&
        profile.equipmentProfileId === equipmentProfileId,
    ) ?? null
  );
}
