export interface FaqEntry {
  question: string;
  answer: string;
  category: string;
}

const faqEntriesEn: FaqEntry[] = [
  {
    question: "What types of machinery do you handle?",
    answer: "We specialize in agricultural and heavy-duty machinery: combines, tractors, excavators, bulldozers, planters, sprayers, mining equipment, and more. We handle all major brands — John Deere, Case IH, CAT, Kinze, Kubota — and know the disassembly specs for each.",
    category: "General",
  },
  {
    question: "What areas do you serve?",
    answer: "We pick up equipment anywhere in the USA and Canada. Our main facility is in Iowa, with partner warehouses in California, Georgia, Illinois, North Dakota, Texas, and Alberta. We ship to any port worldwide — Latin America, Middle East, Africa, Central Asia, and beyond.",
    category: "General",
  },
  {
    question: "How long does the entire process take?",
    answer: "Equipment pickup to container loading typically takes 5–14 days depending on complexity. Ocean transit is 18–35 days for most routes. For urgent parts or time-sensitive shipments, air freight delivers in 7–14 days. Every quote includes a detailed timeline so you know exactly when to expect delivery.",
    category: "Shipping",
  },
  {
    question: "What container sizes do you work with?",
    answer: "We work with 20ft, 40ft, and 40ft high-cube containers, plus flat racks and open tops for oversized equipment. Our team optimizes every cubic foot of space to keep your shipping costs as low as possible.",
    category: "Shipping",
  },
  {
    question: "Do you handle customs documentation?",
    answer: "Yes — we handle all export paperwork: commercial invoices, packing lists, bills of lading, certificates of origin, and phytosanitary certificates. We coordinate directly with customs brokers to prevent delays at port.",
    category: "Documentation",
  },
  {
    question: "How do you calculate pricing?",
    answer: "Pricing depends on equipment type, dismantling complexity, pickup distance, and destination. Every quote is transparent and itemized — no hidden fees. Check our pricing page for reference rates, or use our freight calculator for an instant estimate.",
    category: "Pricing",
  },
  {
    question: "Do you provide transportation insurance?",
    answer: "Yes — our transportation and storage services are fully insured. Coverage details are outlined in our service agreement. We can also arrange marine cargo insurance for the ocean shipping leg.",
    category: "General",
  },
  {
    question: "How do you ensure parts aren't lost during dismantling?",
    answer: "Every component is tagged, photographed, and cataloged. Hardware gets bagged and labeled with matching assembly points. You receive a complete documentation package so your team can reassemble everything on the other end.",
    category: "General",
  },
  {
    question: "Can you source and purchase equipment for me?",
    answer: "Yes — our sourcing team helps international buyers find specific machinery from dealers, auctions, and private sellers across the USA and Canada. Every piece is inspected and documented with photos before we ship it.",
    category: "General",
  },
  {
    question: "Do you offer storage services?",
    answer: "Yes — we offer secure storage at our Iowa facility and partner warehouses across the USA and Canada. Short-term staging before loading or long-term storage while awaiting shipping schedules — your equipment stays protected.",
    category: "General",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept wire transfers and ACH payments. For larger projects, we can arrange milestone-based payment schedules. Every service comes with a detailed, itemized invoice.",
    category: "Pricing",
  },
  {
    question: "Is there a minimum order requirement?",
    answer: "No minimum order. We handle everything from a single piece of equipment to full fleet operations. Every project gets the same level of professional service regardless of size.",
    category: "Pricing",
  },
  {
    question: "What happens if my equipment is damaged in transit?",
    answer: "All transportation and storage is fully insured. We photograph and document every component before packing, establishing a clear condition baseline. If damage occurs during transit, we file claims with the carrier and insurance provider on your behalf. We also offer marine cargo insurance for the ocean shipping leg — ask us about coverage options when you request a quote.",
    category: "General",
  },
  {
    question: "Can you handle equipment I've never exported before?",
    answer: "Absolutely — we handle first-time exports regularly. Our team manages everything: figuring out the best way to disassemble your equipment, preparing all documentation, and clearing customs. No prior export experience needed on your end.",
    category: "General",
  },
  {
    question: "What countries have you shipped to?",
    answer: "Anywhere with a seaport or airport. Our most active markets are Latin America (Brazil, Colombia, Mexico), the Middle East (UAE, Turkey, Saudi Arabia), Africa, Central Asia, and Eastern Europe. We work with Maersk, Hapag-Lloyd, and CMA CGM for reliable transit.",
    category: "Shipping",
  },
  {
    question: "Why can't I use FedEx or DHL for heavy machinery?",
    answer: "Parcel carriers like FedEx, UPS, and DHL have strict weight and dimension limits — typically under 150 lbs per package. Heavy machinery weighing thousands of pounds requires specialized freight logistics: flatbed trucking for inland transport, professional dismantling and container packing, and ocean freight on cargo vessels. That is exactly what we do — full-service export logistics for equipment that parcel carriers cannot handle.",
    category: "Shipping",
  },
  {
    question: "What about import duties and tariffs at the destination?",
    answer: "Import duties vary by country and equipment type — they can range from 0% (free-zone ports like Jebel Ali, UAE) to 20%+ in some markets. We provide duty estimates for your specific destination as part of your quote so there are no surprises. Some countries offer duty exemptions for agricultural equipment under trade agreements like USMCA for Mexico.",
    category: "Pricing",
  },
  {
    question: "Do you ship parts and components, not just whole machines?",
    answer: "Yes. We source and ship OEM John Deere parts, aftermarket replacement components, and used parts worldwide. We consolidate multiple items into single shipments so you save 30-50% on per-item freight. Parts can ship via air freight (7-14 days) or ocean for larger orders. No minimum order — contact parts@meridianexport.com for a quote within 1 hour.",
    category: "Shipping",
  },
  {
    question: "Can you ship by air instead of ocean?",
    answer: "Yes. We offer air freight for time-sensitive shipments — parts typically arrive in 7-14 days via air. Air freight is ideal for urgently needed components, seasonal farming deadlines, or smaller items where speed matters more than cost. Most complete machines ship by ocean, but we arrange air transport when the timeline demands it.",
    category: "Shipping",
  },
  {
    question: "Do I need an export license to ship machinery from the USA?",
    answer: "Most commercial and agricultural machinery does not require a specific export license from the USA. However, certain equipment with dual-use technology or controlled components may need a Bureau of Industry and Security (BIS) license. We check your equipment against the Export Administration Regulations (EAR) and handle all required filings as part of our documentation service.",
    category: "Documentation",
  },
];

const faqEntriesEs: FaqEntry[] = [
  {
    question: "¿Qué tipos de maquinaria manejan?",
    answer: "Nos especializamos en maquinaria agrícola y pesada: cosechadoras, tractores, excavadoras, bulldozers, sembradoras, pulverizadoras, equipo minero y más. Manejamos todas las marcas principales — John Deere, Case IH, CAT, Kinze, Kubota — y conocemos las especificaciones de desmontaje de cada una.",
    category: "General",
  },
  {
    question: "¿Qué áreas atienden?",
    answer: "Recogemos equipo en cualquier parte de USA y Canadá. Nuestra instalación principal está en Iowa, con bodegas asociadas en California, Georgia, Illinois, North Dakota, Texas y Alberta. Enviamos a cualquier puerto del mundo — Latinoamérica, Medio Oriente, África, Asia Central y más allá.",
    category: "General",
  },
  {
    question: "¿Cuánto tiempo toma todo el proceso?",
    answer: "Desde la recolección del equipo hasta la carga del contenedor típicamente toma 5-14 días dependiendo de la complejidad. El tránsito marítimo es de 18-35 días para la mayoría de las rutas. Para repuestos urgentes o envíos sensibles al tiempo, el flete aéreo entrega en 7-14 días. Cada cotización incluye un cronograma detallado.",
    category: "Envío",
  },
  {
    question: "¿Con qué tamaños de contenedor trabajan?",
    answer: "Trabajamos con contenedores de 20ft, 40ft y 40ft high-cube, además de flat racks y open tops para equipo sobredimensionado. Nuestro equipo optimiza cada pie cúbico de espacio para mantener sus costos de envío lo más bajos posible.",
    category: "Envío",
  },
  {
    question: "¿Manejan la documentación aduanera?",
    answer: "Sí — manejamos todo el papeleo de exportación: facturas comerciales, listas de empaque, conocimientos de embarque, certificados de origen y certificados fitosanitarios. Coordinamos directamente con agentes aduanales para prevenir retrasos en puerto.",
    category: "Documentación",
  },
  {
    question: "¿Cómo calculan los precios?",
    answer: "Los precios dependen del tipo de equipo, complejidad del desmontaje, distancia de recolección y destino. Cada cotización es transparente y detallada — sin cargos ocultos. Consulte nuestra página de precios para tarifas de referencia, o use nuestra calculadora de flete para un estimado instantáneo.",
    category: "Precios",
  },
  {
    question: "¿Proporcionan seguro de transporte?",
    answer: "Sí — nuestros servicios de transporte y almacenamiento están completamente asegurados. Los detalles de cobertura se describen en nuestro acuerdo de servicio. También podemos gestionar un seguro de carga marítima para el tramo de envío marítimo.",
    category: "General",
  },
  {
    question: "¿Cómo aseguran que no se pierdan partes durante el desmontaje?",
    answer: "Cada componente se etiqueta, fotografía y cataloga. La tornillería se empaca en bolsas y se etiqueta con puntos de ensamblaje correspondientes. Usted recibe un paquete de documentación completo para que su equipo pueda reensamblar todo en destino.",
    category: "General",
  },
  {
    question: "¿Pueden buscar y comprar equipo por mí?",
    answer: "Sí — nuestro equipo de búsqueda ayuda a compradores internacionales a encontrar maquinaria específica de distribuidores, subastas y vendedores privados en USA y Canadá. Cada pieza se inspecciona y documenta con fotos antes de enviarla.",
    category: "General",
  },
  {
    question: "¿Ofrecen servicios de almacenamiento?",
    answer: "Sí — ofrecemos almacenamiento seguro en nuestra instalación de Iowa y bodegas asociadas en USA y Canadá. Preparación a corto plazo antes de la carga o almacenamiento a largo plazo mientras espera programas de envío — su equipo se mantiene protegido.",
    category: "General",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos transferencias bancarias y pagos ACH. Para proyectos más grandes, podemos coordinar calendarios de pago por hitos. Cada servicio viene con una factura detallada y desglosada.",
    category: "Precios",
  },
  {
    question: "¿Hay un pedido mínimo?",
    answer: "Sin pedido mínimo. Manejamos desde una sola pieza de equipo hasta operaciones de flotas completas. Cada proyecto recibe el mismo nivel de servicio profesional sin importar el tamaño.",
    category: "Precios",
  },
  {
    question: "¿Qué pasa si mi equipo se daña en tránsito?",
    answer: "Todo el transporte y almacenamiento está completamente asegurado. Fotografiamos y documentamos cada componente antes del embalaje, estableciendo una línea base clara de condición. Si ocurre daño durante el tránsito, presentamos reclamaciones con el transportista y la aseguradora en su nombre. También ofrecemos seguro de carga marítima — pregunte sobre opciones de cobertura al solicitar su cotización.",
    category: "General",
  },
  {
    question: "¿Pueden manejar equipo que nunca he exportado antes?",
    answer: "Por supuesto — manejamos exportaciones primerizas regularmente. Nuestro equipo gestiona todo: determinar la mejor forma de desmontar su equipo, preparar toda la documentación y pasar la aduana. No necesita experiencia previa en exportación de su parte.",
    category: "General",
  },
  {
    question: "¿A qué países han enviado?",
    answer: "A cualquier lugar con un puerto marítimo o aéreo. Nuestros mercados más activos son Latinoamérica (Brasil, Colombia, México), Medio Oriente (EAU, Turquía, Arabia Saudita), África, Asia Central y Europa del Este. Trabajamos con Maersk, Hapag-Lloyd y CMA CGM para un tránsito confiable.",
    category: "Envío",
  },
  {
    question: "¿Por qué no puedo usar FedEx o DHL para maquinaria pesada?",
    answer: "Los transportistas de paquetería como FedEx, UPS y DHL tienen límites estrictos de peso y dimensiones — típicamente menos de 70 kg por paquete. La maquinaria pesada que pesa miles de kilos requiere logística de flete especializada: transporte en plataforma para el traslado terrestre, desmontaje profesional y embalaje en contenedor, y flete marítimo en buques de carga. Eso es exactamente lo que hacemos — logística de exportación de servicio completo para equipo que los transportistas de paquetería no pueden manejar.",
    category: "Envío",
  },
  {
    question: "¿Qué hay de los aranceles e impuestos de importación en destino?",
    answer: "Los aranceles de importación varían por país y tipo de equipo — pueden ir desde 0% (puertos de zona libre como Jebel Ali, EAU) hasta más del 20% en algunos mercados. Proporcionamos estimados de aranceles para su destino específico como parte de su cotización para que no haya sorpresas. Algunos países ofrecen exenciones de aranceles para equipo agrícola bajo acuerdos comerciales como el T-MEC para México.",
    category: "Precios",
  },
  {
    question: "¿Envían repuestos y componentes, no solo máquinas completas?",
    answer: "Sí. Conseguimos y enviamos repuestos OEM de John Deere, componentes de reemplazo aftermarket y repuestos usados a todo el mundo. Consolidamos múltiples artículos en envíos únicos para que ahorre 30-50% en flete por artículo. Los repuestos pueden enviarse por flete aéreo (7-14 días) o marítimo para pedidos más grandes. Sin pedido mínimo — contacte parts@meridianexport.com para una cotización en 1 hora.",
    category: "Envío",
  },
  {
    question: "¿Pueden enviar por avión en lugar de barco?",
    answer: "Sí. Ofrecemos flete aéreo para envíos sensibles al tiempo — los repuestos típicamente llegan en 7-14 días por aire. El flete aéreo es ideal para componentes urgentemente necesarios, plazos de temporada agrícola o artículos más pequeños donde la velocidad importa más que el costo. La mayoría de las máquinas completas se envían por mar, pero coordinamos transporte aéreo cuando el plazo lo requiere.",
    category: "Envío",
  },
  {
    question: "¿Necesito una licencia de exportación para enviar maquinaria desde USA?",
    answer: "La mayoría de la maquinaria comercial y agrícola no requiere una licencia de exportación específica de USA. Sin embargo, cierto equipo con tecnología de uso dual o componentes controlados puede necesitar una licencia de la Oficina de Industria y Seguridad (BIS). Verificamos su equipo contra las Regulaciones de Administración de Exportaciones (EAR) y manejamos todos los registros requeridos como parte de nuestro servicio de documentación.",
    category: "Documentación",
  },
  // LATAM-specific FAQs
  {
    question: "¿Cuáles son las rutas de envío más rápidas a Latinoamérica?",
    answer: "México (Veracruz) es nuestro destino más rápido con 10-15 días de tránsito. Colombia (Cartagena) toma 12-18 días, y Brasil (Santos) 25-30 días. Todas las rutas tienen salidas semanales desde puertos del Golfo y Costa Este de EE.UU. Para repuestos urgentes, el flete aéreo llega a cualquier capital latinoamericana en 7-14 días.",
    category: "Envío",
  },
  {
    question: "¿Qué requisitos aduaneros específicos tienen los países de Latinoamérica?",
    answer: "Cada país tiene requisitos diferentes: México requiere pedimento y certificado de origen T-MEC para aranceles preferentes. Colombia exige inspección previa al embarque para equipo usado. Brasil requiere licencia de importación para ciertas categorías y certificados de fumigación ISPM-15. Nosotros manejamos toda la documentación específica de cada país.",
    category: "Documentación",
  },
  {
    question: "¿Puedo contactarlos por WhatsApp para consultas y cotizaciones?",
    answer: "Sí — atendemos consultas en español por WhatsApp. Envíenos un mensaje con los detalles de su equipo (marca, modelo, año) y destino, y le respondemos con una cotización detallada dentro de 24 horas. También puede llamarnos o enviar un correo a info@meridianexport.com.",
    category: "General",
  },
];

const faqEntriesRu: FaqEntry[] = [
  {
    question: "Какие виды техники вы обрабатываете?",
    answer: "Мы специализируемся на сельскохозяйственной и тяжёлой технике: комбайны, тракторы, экскаваторы, бульдозеры, сеялки, опрыскиватели, горнодобывающая техника и другое. Мы работаем со всеми основными брендами — John Deere, Case IH, CAT, Kinze, Kubota — и знаем спецификации разборки каждого.",
    category: "Общие",
  },
  {
    question: "Какие регионы вы обслуживаете?",
    answer: "Мы забираем технику в любой точке США и Канады. Наше основное предприятие в Айове, с партнёрскими складами в Калифорнии, Джорджии, Иллинойсе, Северной Дакоте, Техасе и Альберте. Мы отправляем в любой порт мира — Латинская Америка, Ближний Восток, Африка, Центральная Азия и далее.",
    category: "Общие",
  },
  {
    question: "Сколько времени занимает весь процесс?",
    answer: "От забора техники до загрузки контейнера обычно 5-14 дней в зависимости от сложности. Морской транзит — 18-35 дней для большинства маршрутов. Для срочных запчастей или чувствительных ко времени грузов авиафрахт доставляет за 7-14 дней. Каждая котировка включает подробный график, чтобы вы точно знали, когда ожидать доставку.",
    category: "Доставка",
  },
  {
    question: "С какими размерами контейнеров вы работаете?",
    answer: "Мы работаем с контейнерами 20 футов, 40 футов и 40 футов high-cube, а также flat racks и open tops для негабаритного оборудования. Наша команда оптимизирует каждый кубический фут пространства для минимизации стоимости доставки.",
    category: "Доставка",
  },
  {
    question: "Вы занимаетесь таможенной документацией?",
    answer: "Да — мы берём на себя все экспортные документы: коммерческие инвойсы, упаковочные листы, коносаменты, сертификаты происхождения и фитосанитарные сертификаты. Мы координируем работу напрямую с таможенными брокерами для предотвращения задержек в порту.",
    category: "Документация",
  },
  {
    question: "Как вы рассчитываете стоимость?",
    answer: "Стоимость зависит от типа техники, сложности демонтажа, расстояния забора и направления. Каждая котировка прозрачна и детализирована — никаких скрытых сборов. Ознакомьтесь с нашей страницей цен для справочных тарифов или используйте наш калькулятор фрахта для мгновенной оценки.",
    category: "Цены",
  },
  {
    question: "Вы предоставляете страхование транспортировки?",
    answer: "Да — наши услуги транспортировки и хранения полностью застрахованы. Детали покрытия описаны в нашем договоре обслуживания. Мы также можем организовать страхование морского груза на участок морской перевозки.",
    category: "Общие",
  },
  {
    question: "Как вы гарантируете, что детали не потеряются при разборке?",
    answer: "Каждый компонент маркируется, фотографируется и каталогизируется. Крепёж упаковывается в пакеты и маркируется с соответствующими точками сборки. Вы получаете полный пакет документации для повторной сборки.",
    category: "Общие",
  },
  {
    question: "Можете ли вы найти и купить технику для меня?",
    answer: "Да — наша команда по поиску помогает международным покупателям найти конкретную технику у дилеров, на аукционах и у частных продавцов в США и Канаде. Каждая единица осматривается и документируется фотографиями перед отправкой.",
    category: "Общие",
  },
  {
    question: "Вы предлагаете услуги хранения?",
    answer: "Да — мы предлагаем защищённое хранение на нашем предприятии в Айове и партнёрских складах в США и Канаде. Краткосрочная подготовка перед загрузкой или долгосрочное хранение в ожидании графика отправки — ваша техника остаётся под защитой.",
    category: "Общие",
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer: "Мы принимаем банковские переводы и платежи ACH. Для крупных проектов мы можем организовать поэтапные графики оплаты. Каждая услуга сопровождается подробным, детализированным инвойсом.",
    category: "Цены",
  },
  {
    question: "Есть ли минимальный заказ?",
    answer: "Минимального заказа нет. Мы работаем с чем угодно — от одной единицы техники до операций с целыми парками. Каждый проект получает одинаково высокий уровень профессионального обслуживания независимо от объёма.",
    category: "Цены",
  },
  {
    question: "Что произойдёт, если моя техника повредится при транспортировке?",
    answer: "Вся транспортировка и хранение полностью застрахованы. Мы фотографируем и документируем каждый компонент до упаковки, фиксируя исходное состояние. Если повреждение произойдёт при транзите, мы подаём претензии перевозчику и страховщику от вашего имени. Мы также предлагаем страхование морского груза — спросите о вариантах покрытия при запросе котировки.",
    category: "Общие",
  },
  {
    question: "Можете ли вы обработать технику, которую я никогда раньше не экспортировал?",
    answer: "Безусловно — мы регулярно работаем с первичными экспортами. Наша команда берёт на себя всё: определяет лучший способ разборки вашей техники, подготавливает всю документацию и проходит таможню. Никакого предыдущего опыта экспорта от вас не требуется.",
    category: "Общие",
  },
  {
    question: "В какие страны вы отправляли?",
    answer: "В любую страну с морским портом или аэропортом. Наши наиболее активные рынки — Латинская Америка (Бразилия, Колумбия, Мексика), Ближний Восток (ОАЭ, Турция, Саудовская Аравия), Африка, Центральная Азия и Восточная Европа. Мы работаем с Maersk, Hapag-Lloyd и CMA CGM для надёжного транзита.",
    category: "Доставка",
  },
  {
    question: "Почему нельзя использовать FedEx или DHL для тяжёлой техники?",
    answer: "Курьерские службы FedEx, UPS и DHL имеют строгие ограничения по весу и габаритам — обычно до 70 кг за место. Тяжёлая техника весом в тысячи килограммов требует специализированной фрахтовой логистики: перевозка на платформе для внутренних перевозок, профессиональный демонтаж и упаковка в контейнер, и морской фрахт на грузовых судах. Именно этим мы занимаемся — полный комплекс экспортной логистики для техники, которую курьерские службы не могут обработать.",
    category: "Доставка",
  },
  {
    question: "Что насчёт импортных пошлин и тарифов в стране назначения?",
    answer: "Импортные пошлины зависят от страны и типа техники — они могут составлять от 0% (порты свободных зон, такие как Джебель-Али, ОАЭ) до 20%+ на некоторых рынках. Мы предоставляем оценки пошлин для вашего конкретного направления в составе котировки, чтобы не было сюрпризов. Некоторые страны предоставляют льготы по пошлинам для сельхозтехники по торговым соглашениям.",
    category: "Цены",
  },
  {
    question: "Вы отправляете запчасти и комплектующие, а не только целые машины?",
    answer: "Да. Мы находим и отправляем оригинальные запчасти John Deere, аналоговые комплектующие и б/у запчасти по всему миру. Мы консолидируем несколько позиций в одну отправку, экономя вам 30-50% на фрахте за единицу. Запчасти отправляются авиафрахтом (7-14 дней) или морем для крупных заказов. Без минимального заказа — свяжитесь с parts@meridianexport.com для котировки в течение 1 часа.",
    category: "Доставка",
  },
  {
    question: "Можно ли отправить авиафрахтом вместо морского?",
    answer: "Да. Мы предлагаем авиафрахт для чувствительных ко времени отправок — запчасти обычно доставляются за 7-14 дней по воздуху. Авиафрахт идеален для срочно необходимых комплектующих, сезонных сроков посева или небольших предметов, где скорость важнее стоимости. Большинство комплектных машин отправляется морем, но мы организуем воздушную перевозку, когда сроки требуют.",
    category: "Доставка",
  },
  {
    question: "Нужна ли мне экспортная лицензия для отправки техники из США?",
    answer: "Большая часть коммерческой и сельскохозяйственной техники не требует специальной экспортной лицензии из США. Однако определённая техника с технологией двойного назначения или контролируемыми компонентами может потребовать лицензию Бюро промышленности и безопасности (BIS). Мы проверяем вашу технику по Правилам экспортного администрирования (EAR) и оформляем все необходимые подачи как часть нашего сервиса документации.",
    category: "Документация",
  },
  // CIS/Kazakhstan-specific FAQs
  {
    question: "Какие таможенные правила действуют для ввоза техники в Казахстан?",
    answer: "Казахстан входит в Евразийский экономический союз (ЕАЭС). Для определённых категорий техники требуется сертификация ГОСТ/ТР ТС. Импортные пошлины для сельхозтехники составляют 0-5% при наличии подтверждения целевого использования. Мы проверяем актуальные ставки и требования для вашей конкретной техники и подготавливаем полный пакет документов.",
    category: "Документация",
  },
  {
    question: "Существуют ли льготы по импортным пошлинам для сельхозтехники в странах СНГ?",
    answer: "Да. Казахстан и другие страны ЕАЭС предоставляют льготные ставки или полное освобождение от пошлин для определённых видов сельскохозяйственной техники, не производимой на территории союза. Комбайны, сеялки точного высева и специализированная техника часто подпадают под льготный режим. Мы уточняем актуальные ставки при подготовке каждой котировки.",
    category: "Цены",
  },
  {
    question: "Какие маршруты доставки в страны СНГ вы используете?",
    answer: "Для Казахстана: морем до перевалочного порта (Поти, Грузия или Мерсин, Турция), затем фидером через Каспийское море до Актау — общее время 40-50 дней. Для России: морем до Новороссийска или Санкт-Петербурга — 25-35 дней. Для Узбекистана и Кыргызстана: через Казахстан с наземной доставкой от Актау. Авиафрахт доступен для срочных запчастей с доставкой за 7-14 дней.",
    category: "Доставка",
  },
];

export const faqEntries: Record<string, FaqEntry[]> = {
  en: faqEntriesEn,
  es: faqEntriesEs,
  ru: faqEntriesRu,
};

export function getAllFaqEntries(locale: string = 'en'): FaqEntry[] {
  return faqEntries[locale] ?? faqEntries.en;
}

// Top 6 for homepage
export function getHomepageFaq(locale: string = 'en'): FaqEntry[] {
  const entries = faqEntries[locale] ?? faqEntries.en;
  return entries.slice(0, 6);
}

// Keep backward-compatible exports for sitemap and other non-locale-aware consumers
export const homepageFaq = faqEntriesEn.slice(0, 6);
