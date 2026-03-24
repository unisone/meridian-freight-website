export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  equipmentType: string;
  destination: string;
  containerType: string;
  weight: string;
  transitTime: string;
  category: string;
}

const projectsEn: Project[] = [
  {
    id: 1,
    title: "John Deere 9650STS Combine Export",
    description: "We loaded a John Deere 9650STS combine onto a UASC flat rack, securing the detached tires alongside for safe ocean transit to Santos, Brazil. The header and unloading auger were removed, labeled, and strapped to the flat rack deck — total prep time was 3 days from arrival to port departure. The buyer had the combine field-ready within a week of clearing Santos customs.",
    image: "/images/project-jd-9650sts-combine.jpg",
    equipmentType: "Combine Harvester",
    destination: "Santos, Brazil",
    containerType: "40ft Flat Rack",
    weight: "15,000 kg",
    transitTime: "28 days",
    category: "Harvesting",
  },
  {
    id: 2,
    title: "John Deere W260 Windrower Export",
    description: "We shipped a John Deere W260 windrower to the UAE on a Hapag-Lloyd flat rack with custom wood bracing and heavy-duty tie-downs at port. The draper header was crated separately to protect the belt and knife sections during 35 days of ocean transit. The buyer in Jebel Ali reported zero damage on arrival — equipment was operational within 48 hours.",
    image: "/images/project-jd-w260-windrower.jpg",
    equipmentType: "Windrower",
    destination: "Jebel Ali, UAE",
    containerType: "40ft Flat Rack",
    weight: "12,000 kg",
    transitTime: "35 days",
    category: "Harvesting",
  },
  {
    id: 3,
    title: "Case IH 9120 Combine to Middle East",
    description: "We secured a Case IH 9120 combine and detached tires on a Hapag-Lloyd flat rack using custom wood blocking and grade-43 chain binders for overseas shipping to Saudi Arabia. At 18,000 kg, load distribution was critical — we calculated center of gravity and positioned the machine to stay within flat rack weight limits across all four corners. The shipment cleared Jeddah port in 30 days with all SABER documentation pre-approved.",
    image: "/images/project-case-ih-combine.jpg",
    equipmentType: "Combine Harvester",
    destination: "Jeddah, Saudi Arabia",
    containerType: "40ft Flat Rack",
    weight: "18,000 kg",
    transitTime: "30 days",
    category: "Harvesting",
  },
  {
    id: 4,
    title: "John Deere Combine Pair — Container Export",
    description: "We dismantled and packed two John Deere combines into side-by-side 40ft containers, loading rear-first with professional strapping to maximize space. Headers, augers, and GPS domes were removed and crated separately — every bolt bag was labeled for reassembly. The dual-container shipment reached Novorossiysk in 30 days, saving the buyer over $8,000 compared to flat rack pricing.",
    image: "/images/project-jd-tillage-containers.jpg",
    equipmentType: "Combine Harvesters",
    destination: "Novorossiysk, Russia",
    containerType: "2x 40ft Standard",
    weight: "22,000 kg",
    transitTime: "30 days",
    category: "Harvesting",
  },
  {
    id: 6,
    title: "Shelbourne Stripper Headers",
    description: "We forklift-loaded Shelbourne stripper headers into two 40ft high-cube containers at our packing facility, adding custom protective bracing for the knife sections and belt assemblies. Each header was secured on welded transport stands to prevent lateral movement during 25 days of ocean transit to Constanta, Romania. The buyer confirmed all four units arrived in working condition.",
    image: "/images/project-shelbourne-loading.jpg",
    equipmentType: "Stripper Headers",
    destination: "Constanta, Romania",
    containerType: "2x 40ft HC",
    weight: "5,200 kg",
    transitTime: "25 days",
    category: "Harvesting",
  },
  {
    id: 7,
    title: "John Deere Self-Propelled Sprayer",
    description: "We crane-lifted a John Deere self-propelled sprayer onto a Maersk flat rack, crating the 120-foot boom sections separately in custom wooden frames for safe transit to Turkey. The chemical tank was triple-rinsed and certified clean for customs compliance. The sprayer arrived at Mersin port in 20 days and was reassembled by the buyer's team using our labeled documentation package.",
    image: "/images/project-jd-sprayer-crane.jpg",
    equipmentType: "Self-Propelled Sprayer",
    destination: "Mersin, Turkey",
    containerType: "40ft Flat Rack",
    weight: "14,000 kg",
    transitTime: "20 days",
    category: "Spraying",
  },
];

// ES: Projects with LATAM destinations first
const projectsEs: Project[] = [
  {
    id: 1,
    title: "Exportación de Cosechadora John Deere 9650STS",
    description: "Cargamos una cosechadora John Deere 9650STS en un flat rack UASC, asegurando las llantas desmontadas junto a ella para un tránsito marítimo seguro a Santos, Brasil. El cabezal y la descarga se retiraron, etiquetaron y aseguraron en la plataforma del flat rack — el tiempo total de preparación fue de 3 días desde la llegada hasta la salida del puerto. El comprador tuvo la cosechadora lista para el campo dentro de una semana de pasar la aduana de Santos.",
    image: "/images/project-jd-9650sts-combine.jpg",
    equipmentType: "Cosechadora",
    destination: "Santos, Brasil",
    containerType: "40ft Flat Rack",
    weight: "15,000 kg",
    transitTime: "28 días",
    category: "Cosecha",
  },
  {
    id: 7,
    title: "Pulverizadora Autopropulsada John Deere",
    description: "Elevamos con grúa una pulverizadora autopropulsada John Deere sobre un flat rack Maersk, embalando las secciones de barra de 36 metros por separado en marcos de madera a medida para un tránsito seguro a Turquía. El tanque de químicos se enjuagó tres veces y se certificó limpio para cumplimiento aduanero. La pulverizadora llegó al puerto de Mersin en 20 días y fue reensamblada por el equipo del comprador usando nuestro paquete de documentación etiquetada.",
    image: "/images/project-jd-sprayer-crane.jpg",
    equipmentType: "Pulverizadora Autopropulsada",
    destination: "Mersin, Turquía",
    containerType: "40ft Flat Rack",
    weight: "14,000 kg",
    transitTime: "20 días",
    category: "Pulverización",
  },
  {
    id: 2,
    title: "Exportación de Segadora John Deere W260",
    description: "Enviamos una segadora John Deere W260 a los EAU en un flat rack Hapag-Lloyd con arriostrado de madera a medida y amarres de servicio pesado en puerto. El cabezal draper se embaló por separado en caja para proteger las secciones de banda y cuchilla durante 35 días de tránsito marítimo. El comprador en Jebel Ali reportó cero daños a la llegada — el equipo estuvo operativo en 48 horas.",
    image: "/images/project-jd-w260-windrower.jpg",
    equipmentType: "Segadora",
    destination: "Jebel Ali, EAU",
    containerType: "40ft Flat Rack",
    weight: "12,000 kg",
    transitTime: "35 días",
    category: "Cosecha",
  },
  {
    id: 3,
    title: "Cosechadora Case IH 9120 a Medio Oriente",
    description: "Aseguramos una cosechadora Case IH 9120 y llantas desmontadas en un flat rack Hapag-Lloyd usando bloqueo de madera a medida y tensores de cadena grado 43 para envío a Arabia Saudita. Con 18,000 kg, la distribución de carga fue crítica — calculamos el centro de gravedad y posicionamos la máquina para mantenerse dentro de los límites de peso del flat rack en las cuatro esquinas. El envío pasó la aduana de Jeddah en 30 días con toda la documentación SABER preaprobada.",
    image: "/images/project-case-ih-combine.jpg",
    equipmentType: "Cosechadora",
    destination: "Jeddah, Arabia Saudita",
    containerType: "40ft Flat Rack",
    weight: "18,000 kg",
    transitTime: "30 días",
    category: "Cosecha",
  },
  {
    id: 4,
    title: "Par de Cosechadoras John Deere — Exportación en Contenedor",
    description: "Desmontamos y empacamos dos cosechadoras John Deere en contenedores de 40ft lado a lado, cargando por la parte trasera con cintas profesionales para maximizar el espacio. Los cabezales, descargas y domos GPS se retiraron y embalaron por separado — cada bolsa de tornillería se etiquetó para reensamblaje. El envío de doble contenedor llegó a Novorossiysk en 30 días, ahorrando al comprador más de $8,000 comparado con precios de flat rack.",
    image: "/images/project-jd-tillage-containers.jpg",
    equipmentType: "Cosechadoras",
    destination: "Novorossiysk, Rusia",
    containerType: "2x 40ft Estándar",
    weight: "22,000 kg",
    transitTime: "30 días",
    category: "Cosecha",
  },
  {
    id: 6,
    title: "Cabezales Stripper Shelbourne",
    description: "Cargamos con montacargas cabezales stripper Shelbourne en dos contenedores 40ft high-cube en nuestra instalación de embalaje, añadiendo arriostrado protector a medida para las secciones de cuchilla y ensamblajes de banda. Cada cabezal se aseguró en soportes de transporte soldados para prevenir movimiento lateral durante 25 días de tránsito marítimo a Constanta, Rumania. El comprador confirmó que las cuatro unidades llegaron en condición de funcionamiento.",
    image: "/images/project-shelbourne-loading.jpg",
    equipmentType: "Cabezales Stripper",
    destination: "Constanta, Rumania",
    containerType: "2x 40ft HC",
    weight: "5,200 kg",
    transitTime: "25 días",
    category: "Cosecha",
  },
];

// RU: Projects with CIS destinations first
const projectsRu: Project[] = [
  {
    id: 4,
    title: "Пара комбайнов John Deere — контейнерный экспорт",
    description: "Мы разобрали и упаковали два комбайна John Deere в два 40-футовых контейнера, загружая задней частью с профессиональной обвязкой для максимизации пространства. Жатки, шнеки и GPS-антенны были сняты и упакованы отдельно — каждый пакет с крепежом промаркирован для сборки. Сдвоенная контейнерная отправка достигла Новороссийска за 30 дней, сэкономив покупателю более $8 000 по сравнению с тарифами на flat rack.",
    image: "/images/project-jd-tillage-containers.jpg",
    equipmentType: "Зерноуборочные комбайны",
    destination: "Новороссийск, Россия",
    containerType: "2x 40 футов Стандарт",
    weight: "22 000 кг",
    transitTime: "30 дней",
    category: "Уборка",
  },
  {
    id: 6,
    title: "Очёсывающие жатки Shelbourne",
    description: "Мы загрузили погрузчиком очёсывающие жатки Shelbourne в два 40-футовых контейнера high-cube на нашем упаковочном предприятии, добавив защитное раскрепление для ножевых секций и ленточных узлов. Каждая жатка была закреплена на сварных транспортных стойках для предотвращения бокового смещения во время 25 дней морского транзита до Констанцы, Румыния. Покупатель подтвердил, что все четыре единицы прибыли в рабочем состоянии.",
    image: "/images/project-shelbourne-loading.jpg",
    equipmentType: "Очёсывающие жатки",
    destination: "Констанца, Румыния",
    containerType: "2x 40 футов HC",
    weight: "5 200 кг",
    transitTime: "25 дней",
    category: "Уборка",
  },
  {
    id: 7,
    title: "Самоходный опрыскиватель John Deere",
    description: "Мы подняли краном самоходный опрыскиватель John Deere на flat rack Maersk, упаковав 36-метровые секции штанги отдельно в деревянных рамах на заказ для безопасного транзита в Турцию. Химический бак был трижды промыт и сертифицирован как чистый для таможенного соответствия. Опрыскиватель прибыл в порт Мерсин за 20 дней и был собран командой покупателя с использованием нашего маркированного пакета документации.",
    image: "/images/project-jd-sprayer-crane.jpg",
    equipmentType: "Самоходный опрыскиватель",
    destination: "Мерсин, Турция",
    containerType: "40 футов Flat Rack",
    weight: "14 000 кг",
    transitTime: "20 дней",
    category: "Опрыскивание",
  },
  {
    id: 1,
    title: "Экспорт комбайна John Deere 9650STS",
    description: "Мы загрузили комбайн John Deere 9650STS на flat rack UASC, закрепив снятые шины рядом для безопасного морского транзита в Сантус, Бразилия. Жатка и выгрузной шнек были сняты, промаркированы и закреплены на платформе flat rack — общее время подготовки составило 3 дня от прибытия до отхода судна. Покупатель получил комбайн готовым к работе в поле в течение недели после прохождения таможни Сантуса.",
    image: "/images/project-jd-9650sts-combine.jpg",
    equipmentType: "Зерноуборочный комбайн",
    destination: "Сантус, Бразилия",
    containerType: "40 футов Flat Rack",
    weight: "15 000 кг",
    transitTime: "28 дней",
    category: "Уборка",
  },
  {
    id: 2,
    title: "Экспорт валковой жатки John Deere W260",
    description: "Мы отправили валковую жатку John Deere W260 в ОАЭ на flat rack Hapag-Lloyd с деревянным раскреплением на заказ и тяжёлыми стяжками в порту. Жатка draper была упакована отдельно для защиты ленты и ножевых секций во время 35 дней морского транзита. Покупатель в Джебель-Али сообщил об отсутствии повреждений при прибытии — техника была введена в эксплуатацию в течение 48 часов.",
    image: "/images/project-jd-w260-windrower.jpg",
    equipmentType: "Валковая жатка",
    destination: "Джебель-Али, ОАЭ",
    containerType: "40 футов Flat Rack",
    weight: "12 000 кг",
    transitTime: "35 дней",
    category: "Уборка",
  },
  {
    id: 3,
    title: "Комбайн Case IH 9120 на Ближний Восток",
    description: "Мы закрепили комбайн Case IH 9120 и снятые шины на flat rack Hapag-Lloyd, используя деревянное блокирование на заказ и цепные стяжки класса 43 для отправки в Саудовскую Аравию. При весе 18 000 кг распределение нагрузки было критичным — мы рассчитали центр тяжести и позиционировали машину для соблюдения предельных нагрузок на угловые стойки flat rack. Груз прошёл таможню порта Джидда за 30 дней с предварительно утверждённой документацией SABER.",
    image: "/images/project-case-ih-combine.jpg",
    equipmentType: "Зерноуборочный комбайн",
    destination: "Джидда, Саудовская Аравия",
    containerType: "40 футов Flat Rack",
    weight: "18 000 кг",
    transitTime: "30 дней",
    category: "Уборка",
  },
];

export const projects: Record<string, Project[]> = {
  en: projectsEn,
  es: projectsEs,
  ru: projectsRu,
};

export function getAllProjects(locale: string = 'en'): Project[] {
  return projects[locale] ?? projects.en;
}

export const projectCategories: Record<string, string[]> = {
  en: ["All", "Harvesting", "Spraying"],
  es: ["Todos", "Cosecha", "Pulverización"],
  ru: ["Все", "Уборка", "Опрыскивание"],
};

export function getProjectCategories(locale: string = 'en'): string[] {
  return projectCategories[locale] ?? projectCategories.en;
}
