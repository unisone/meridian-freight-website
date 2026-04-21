import type { FaqEntry } from "@/content/faq";

interface LinkItem {
  label: string;
  href: string;
  description?: string;
}

interface KazakhstanHeroContent {
  eyebrow: string;
  heading: string;
  description: string;
  highlights: string[];
  whatsappMessage: string;
  primaryCtaLabel: string;
  scheduleCtaLabel: string;
  calculatorCtaLabel: string;
  laneBoardTitle: string;
  laneBoardSubtitle: string;
  laneBoardEmpty: string;
}

interface KazakhstanMarketContext {
  eyebrow: string;
  title: string;
  intro: string;
  cards: Array<{
    title: string;
    description: string;
  }>;
  sourceLinks: LinkItem[];
}

interface KazakhstanScopeContent {
  eyebrow: string;
  title: string;
  intro: string;
  includedLabel: string;
  excludedLabel: string;
  included: string[];
  excluded: string[];
  note: string;
}

interface KazakhstanEquipmentFocus {
  eyebrow: string;
  title: string;
  intro: string;
  cardLabelPrefix: string;
  items: Array<{
    title: string;
    summary: string;
    fit: string;
    href: string;
    linkLabel: string;
  }>;
}

interface KazakhstanScheduleContent {
  eyebrow: string;
  title: string;
  intro: string;
  metricRowsLabel: string;
  metricOpenSpaceLabel: string;
  metricInTransitLabel: string;
  openSpaceSuffix: string;
  scheduleLinkLabel: string;
  whatsappLabel: string;
}

interface KazakhstanProcessContent {
  eyebrow: string;
  title: string;
  intro: string;
  steps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
}

interface KazakhstanCtaContent {
  heading: string;
  description: string;
  whatsappLabel: string;
  calculatorLabel: string;
}

interface KazakhstanSeoContent {
  title: string;
  description: string;
  keywords: string[];
}

interface KazakhstanBreadcrumbs {
  destinations: string;
  kazakhstan: string;
}

interface KazakhstanLaneBoardLabels {
  badge: string;
  datePlaceholder: string;
  status: {
    bookable: string;
    inTransit: string;
    delivered: string;
    booked: string;
  };
}

interface KazakhstanMidCtaContent {
  heading: string;
  description: string;
}

interface KazakhstanProofSection {
  eyebrow: string;
  title: string;
  intro: string;
  openLinkLabel: string;
}

export interface KazakhstanMarketPageContent {
  seo: KazakhstanSeoContent;
  breadcrumbs: KazakhstanBreadcrumbs;
  laneBoardLabels: KazakhstanLaneBoardLabels;
  hero: KazakhstanHeroContent;
  marketContext: KazakhstanMarketContext;
  scope: KazakhstanScopeContent;
  equipmentFocus: KazakhstanEquipmentFocus;
  schedule: KazakhstanScheduleContent;
  process: KazakhstanProcessContent;
  midCta: KazakhstanMidCtaContent;
  faq: {
    title: string;
    intro: string;
    sectionEyebrow: string;
    entries: FaqEntry[];
  };
  proofSection: KazakhstanProofSection;
  cta: KazakhstanCtaContent;
  proofLinks: LinkItem[];
}

export const KAZAKHSTAN_PATH = "/ru/destinations/kazakhstan";

export const kazakhstanMarketPage: KazakhstanMarketPageContent = {
  seo: {
    title: "Доставка сельхозтехники из США в Казахстан",
    description:
      "Рассчитаем доставку комбайнов, тракторов, жаток и запчастей из США в Казахстан: забор у продавца, разборка, упаковка, документы и отправка.",
    keywords: [
      "доставка сельхозтехники из США в Казахстан",
      "привезти комбайн из США в Казахстан",
      "доставка комбайна из США в Казахстан",
      "импорт трактора из США в Казахстан",
      "доставка жатки из США в Казахстан",
      "контейнер из США в Казахстан",
      "купить технику в США с доставкой в Казахстан",
      "свободное место в контейнере Казахстан",
      "доставка техники в Астану",
      "доставка техники в Алматы",
      "доставка техники в Костанай",
      "доставка John Deere в Казахстан",
      "доставка Case IH в Казахстан",
      "экспорт сельхозтехники в Казахстан",
      "доставка запчастей из США в Казахстан",
      "доставка техники в Павлодар",
      "доставка техники в Шымкент",
      "доставка техники в Актобе",
      "доставка техники в Кокшетау",
      "40HC контейнер в Казахстан",
      "flat rack Казахстан",
      "контейнер из Чикаго в Казахстан",
    ],
  },
  breadcrumbs: {
    destinations: "Направления",
    kazakhstan: "Казахстан",
  },
  laneBoardLabels: {
    badge: "актуально",
    datePlaceholder: "дата уточняется",
    status: {
      bookable: "есть место",
      inTransit: "в пути",
      delivered: "доставлено",
      booked: "забронировано",
    },
  },
  hero: {
    eyebrow: "Казахстан · сельхозтехника из США",
    heading: "Доставка сельхозтехники из США в Казахстан",
    description:
      "Meridian помогает забрать технику у продавца в США, разобрать под контейнер, упаковать, подготовить экспортные документы и забронировать отправку в Казахстан.",
    highlights: [
      "Один куратор на всю работу в США: продавец, забор, разборка, упаковка, документы и фрахт.",
      "Заранее проверяем, что влезает в 40HC, что нужно везти на flat rack и где можно использовать свободное место.",
      "Отдельно показываем нашу часть расчёта и то, что должен подтвердить ваш таможенный представитель в Казахстане.",
    ],
    whatsappMessage:
      "Здравствуйте. Хочу рассчитать доставку сельхозтехники из США в Казахстан.",
    primaryCtaLabel: "Написать в WhatsApp",
    scheduleCtaLabel: "Смотреть рейсы в Казахстан",
    calculatorCtaLabel: "Рассчитать доставку",
    laneBoardTitle: "Ближайшие отправки в Казахстан",
    laneBoardSubtitle:
      "Что сейчас есть в публичном расписании Meridian по направлению Казахстан.",
    laneBoardEmpty:
      "Если расписание временно не загрузилось, напишите нам — проверим ближайший контейнер вручную.",
  },
  marketContext: {
    eyebrow: "Рынок Казахстана",
    title: "Когда имеет смысл смотреть технику в США",
    intro:
      "В Казахстане есть местная сборка, дилеры и лизинговые программы. Поэтому не каждая машина из США будет выгодной. Считать нужно конкретный вариант: модель, год, часы, комплектацию, цену продавца, доставку и расходы на оформление в РК.",
    cards: [
      {
        title: "Сравнивают не только цену",
        description:
          "Покупателю важны часы, состояние, комплектация, наличие жатки или draper-платформы, сроки забора у продавца и понятный план загрузки.",
      },
      {
        title: "Север и зерновые регионы задают спрос",
        description:
          "Костанай, Акмолинская область, Северный Казахстан, Кокшетау и Астана чаще связаны с крупными зерновыми хозяйствами. Там чаще считают комбайны, мощные тракторы, жатки, сеялки и расходники с запчастями под уборочную кампанию.",
      },
      {
        title: "США сильны не во всех случаях",
        description:
          "Американский рынок стоит проверять, когда нужна конкретная модель, комплектация, состояние, цена сделки или запчасть, которую сложно быстро найти у местных поставщиков.",
      },
    ],
    sourceLinks: [
      {
        label: "Trade.gov: агросектор Казахстана",
        href: "https://www.trade.gov/country-commercial-guides/kazakhstan-agricultural-sector",
      },
      {
        label: "KazAgroFinance: обновление парка техники",
        href: "https://www.kaf.kz/en/media/news/82902/",
      },
      {
        label: "KazAgroFinance: спрос по категориям и регионам",
        href: "https://www.kaf.kz/en/media/news/83260/",
      },
      {
        label: "Правительство Казахстана: локализация John Deere",
        href: "https://primeminister.kz/en/news/localisation-in-machine-building-john-deere-launches-production-of-agricultural-machinery-in-kostanay-29889",
      },
    ],
  },
  scope: {
    eyebrow: "Что входит в работу",
    title: "Отдельно считаем доставку и отдельно казахстанское оформление",
    intro:
      "Чтобы не смешивать всё в одну непонятную сумму, мы показываем, за что отвечает Meridian, и что нужно заранее проверить с таможенным представителем или декларантом в Казахстане.",
    includedLabel: "Входит в работу Meridian",
    excludedLabel: "Проверяет сторона в Казахстане",
    included: [
      "Связь с продавцом, дилером, аукционом или фермером в США.",
      "Забор техники и доставка до нашей площадки или порта погрузки.",
      "Разборка под контейнер: колёса, жатка, шнек, зеркала, навесное — по ситуации.",
      "Маркировка снятых деталей, фото перед загрузкой и упаковка для перевозки.",
      "Загрузка в 40HC, flat rack или консолидация запчастей, если есть свободное место.",
      "Экспортные документы США, бронь отправки, коносамент и связь по статусу груза.",
    ],
    excluded: [
      "Импортное таможенное оформление в Казахстане.",
      "Пошлины, НДС, местные сборы, сертификация и требования по конкретному коду ТН ВЭД.",
      "Доставка по Казахстану после прибытия на терминал, если она не согласована отдельно.",
      "Выбор схемы ввоза, импортёра и получателя груза.",
      "Финальный расчёт налогов и платежей по конкретной машине.",
    ],
    note:
      "Мы не заменяем таможенного представителя в Казахстане. Наша задача — закрыть американскую часть и дать документы, с которыми ваш брокер сможет заранее проверить оформление.",
  },
  equipmentFocus: {
    eyebrow: "Что чаще считают",
    title: "Какая техника из США обычно стоит отдельного расчёта",
    intro:
      "США стоит смотреть, когда речь идёт о дорогой машине, редкой комплектации, хорошем состоянии или запчастях, которые сложно быстро закрыть на месте.",
    cardLabelPrefix: "Категория",
    items: [
      {
        title: "Комбайны и уборочная техника",
        summary:
          "John Deere S-Series, Case IH Axial-Flow, Claas Lexion и похожие машины нужно считать по габаритам, жатке, шнеку, колёсам и способу загрузки.",
        fit:
          "Хороший вариант для расчёта, если вы уже нашли конкретный комбайн и хотите понять доставку до покупки.",
        href: "/equipment/combines",
        linkLabel: "Страница комбайнов",
      },
      {
        title: "Мощные тракторы",
        summary:
          "John Deere 8R/9R, Magnum, Steiger и похожие классы требуют проверки ширины, колёс, навески, веса и варианта погрузки.",
        fit:
          "По таким тракторам важно сразу видеть не только цену продавца, но и стоимость забора, разборки и фрахта.",
        href: "/equipment/tractors",
        linkLabel: "Страница тракторов",
      },
      {
        title: "Жатки, draper-платформы и навесное",
        summary:
          "MacDon, John Deere, Case IH и другие жатки часто едут отдельно или вместе с основной машиной — зависит от длины, крепления и свободного места.",
        fit:
          "Это хороший кандидат для консолидации, если контейнер в Казахстан уже планируется и в нём остаётся место.",
        href: "/schedule?country=KZ",
        linkLabel: "Проверить место в контейнере",
      },
      {
        title: "Запчасти и крупные узлы",
        summary:
          "Двигатели, мосты, колёса, решёта, шнеки, гидравлика и электроника требуют нормальной упаковки и понятной маркировки.",
        fit:
          "Запчасти удобно отправлять сборным грузом, когда нет смысла оплачивать полный 40HC.",
        href: "/schedule?country=KZ",
        linkLabel: "Смотреть доступные рейсы",
      },
    ],
  },
  schedule: {
    eyebrow: "Рейсы в Казахстан",
    title: "Проверяем, есть ли место в ближайшем контейнере",
    intro:
      "В расписании видно, какие отправки в Казахстан сейчас запланированы, какие уже в пути и где может быть свободное место под вашу технику или запчасти.",
    metricRowsLabel: "отправок в Казахстан",
    metricOpenSpaceLabel: "свободное место",
    metricInTransitLabel: "в пути",
    openSpaceSuffix: "м³",
    scheduleLinkLabel: "Открыть расписание",
    whatsappLabel: "Уточнить ближайшую отправку",
  },
  process: {
    eyebrow: "Как работаем",
    title: "От выбранной техники до отправки в Казахстан",
    intro:
      "Начинаем не с абстрактного тарифа, а с конкретной машины. На расчёт влияют город продавца, габариты, тип контейнера, порт, сроки и требования по оформлению в Казахстане.",
    steps: [
      {
        step: "01",
        title: "Вы присылаете ссылку или фото",
        description:
          "Нужны модель, год, часы, цена продавца, город в США и город назначения в Казахстане.",
      },
      {
        step: "02",
        title: "Проверяем, как её везти",
        description:
          "Смотрим, подходит ли 40HC, нужен ли flat rack, можно ли разобрать под контейнер или отправить вместе с другим грузом.",
      },
      {
        step: "03",
        title: "Разделяем расчёт",
        description:
          "Отдельно считаем нашу часть: забор, разборку, упаковку, документы и фрахт. Отдельно отмечаем, что проверяет ваш брокер.",
      },
      {
        step: "04",
        title: "Забираем, разбираем и грузим",
        description:
          "Связываемся с продавцом, забираем технику, маркируем снятые детали, фотографируем и готовим груз к отправке.",
      },
      {
        step: "05",
        title: "Передаём документы и статус",
        description:
          "Вы получаете экспортные документы и обновления по отправке, чтобы ваша сторона в Казахстане могла готовить оформление.",
      },
    ],
  },
  midCta: {
    heading: "Нужна проверка конкретной машины?",
    description:
      "Пришлите ссылку на объявление до оплаты продавцу. Мы быстро подскажем, что может сломать логистику: габариты, локация продавца, условия забора, тип контейнера или документы.",
  },
  faq: {
    title: "Вопросы покупателей из Казахстана",
    intro:
      "Эти вопросы лучше закрыть до покупки машины, потому что итоговая стоимость зависит не только от фрахта.",
    sectionEyebrow: "Частые вопросы",
    entries: [
      {
        question: "Можно сразу посчитать доставку до моего города в Казахстане?",
        answer:
          "Мы можем посчитать нашу часть: забор у продавца в США, разборку, упаковку, загрузку, экспортные документы и отправку до согласованной точки. Пошлины, НДС, сертификацию, местные сборы и доставку по Казахстану нужно подтвердить с вашим брокером по конкретной машине и коду ТН ВЭД.",
        category: "Казахстан",
      },
      {
        question: "Когда США выгоднее местного дилера?",
        answer:
          "Местный дилер может быть лучшим вариантом, если техника есть в наличии, нужна гарантия или лизинг. США стоит сравнивать, когда нужна конкретная модель, комплектация, состояние, наработка, цена сделки или запчасть. Мы помогаем посчитать логистику, чтобы сравнение было честным.",
        category: "Казахстан",
      },
      {
        question: "Можно ли отправить комбайн вместе с жаткой?",
        answer:
          "Иногда да, но это зависит от модели комбайна, ширины жатки, шнека, колёс, свободного места и выбранного контейнера. Часто комбайн и жатку нужно считать отдельно. Лучше проверить это по фото и габаритам до оплаты продавцу.",
        category: "Казахстан",
      },
      {
        question: "Есть ли сейчас место в контейнере в Казахстан?",
        answer:
          "Публичное расписание показывает ближайшие отправки и свободное место, если оно есть. Если места нет, мы можем проверить следующий контейнер, отдельную отправку или другой способ упаковки.",
        category: "Казахстан",
      },
      {
        question: "Вы работаете с аукционами и дилерами в США?",
        answer:
          "Да. Мы можем организовать забор у дилера, фермы, аукционной площадки или частного продавца. Если покупка ещё не закрыта, пришлите ссылку на объявление — проверим логистику и риски до оплаты.",
        category: "Казахстан",
      },
      {
        question: "Какие документы вы готовите?",
        answer:
          "Со стороны США мы готовим экспортный пакет, коммерческие и транспортные документы по нашей части перевозки. Документы для импортного оформления в Казахстане нужно заранее согласовать с вашим брокером или декларантом.",
        category: "Казахстан",
      },
    ],
  },
  proofSection: {
    eyebrow: "Следующий шаг",
    title: "Полезные разделы для проверки машины",
    intro:
      "После первого расчёта покупателю важно увидеть три вещи: есть ли ближайший контейнер, какие отправки уже закрыты и кто помогает с поиском техники до покупки.",
    openLinkLabel: "Открыть",
  },
  cta: {
    heading: "Пришлите конкретную машину — посчитаем до покупки",
    description:
      "Отправьте ссылку на объявление, город продавца и город назначения в Казахстане. Мы отдельно покажем нашу часть работы и подскажем, что нужно проверить с брокером перед оплатой.",
    whatsappLabel: "Написать в WhatsApp",
    calculatorLabel: "Открыть калькулятор",
  },
  proofLinks: [
    {
      label: "Расписание отправок в Казахстан",
      href: "/schedule?country=KZ",
      description:
        "Ближайшие контейнеры, отправки в пути и свободное место, если оно доступно.",
    },
    {
      label: "Проекты Meridian",
      href: "/projects",
      description:
        "Публичная галерея экспортных работ Meridian по разным направлениям.",
    },
    {
      label: "Подбор техники в США",
      href: "/services/equipment-sales",
      description:
        "Если машина ещё не выбрана, можно начать с поиска и проверки объявлений.",
    },
  ],
};
