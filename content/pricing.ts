export interface EquipmentPricing {
  type: string;
  model: string;
  delivery: string;
  containerized: string;
  container: string;
  category: "harvesting" | "tillage" | "spraying" | "planting" | "large";
}

export interface MiscPricing {
  item: string;
  price: string;
}

export interface DeliveryRate {
  route: string;
  lines: string;
  soc: string;
}

export const equipmentPricing: EquipmentPricing[] = [
  // Harvesting Equipment
  { type: "Flex and rigid platforms up to 30'", model: "925, 930, 630, 625, 2020, 1010", delivery: "$6", containerized: "$1,500.00", container: "25%", category: "harvesting" },
  { type: "Flex and rigid platforms over 30'", model: "635, 3062", delivery: "$6", containerized: "$2,000.00", container: "25%", category: "harvesting" },
  { type: "Draper platforms up to 30'", model: "D60, FD75, D125-130, FD125-130", delivery: "$6", containerized: "$1,500.00", container: "50%", category: "harvesting" },
  { type: "Draper platforms over 30'", model: "D60, FD75, D135-140, FD135-140", delivery: "$6", containerized: "$2,000.00", container: "50%", category: "harvesting" },
  { type: "Shelbourne header", model: "CVS, XCV, RSD", delivery: "$6", containerized: "$1,500.00", container: "50%", category: "harvesting" },
  { type: "Corn header", model: "Various models", delivery: "$6", containerized: "$140 per row", container: "Variable", category: "harvesting" },
  { type: "Honey Bee header", model: "AF240, AF250 and similar", delivery: "$6", containerized: "$2,500.00", container: "50%+", category: "harvesting" },
  { type: "Combines - Small Series", model: "560-595R, S-series, STS-series, 5-9 series", delivery: "$10", containerized: "$8,250.00", container: "130%", category: "harvesting" },
  { type: "Combines - Large Series", model: "9600, 9610, 2388, 2588, 450-485R", delivery: "$10", containerized: "$8,250.00", container: "130%", category: "harvesting" },

  // Tillage Equipment
  { type: "Field cultivators", model: "980, 2210, Tigermate, 200", delivery: "$8", containerized: "$80 per foot", container: "25%", category: "tillage" },
  { type: "Row Crop Cultivators", model: "Various models", delivery: "$8", containerized: "$130 per row", container: "25%", category: "tillage" },
  { type: "Rotary Hoes", model: "400, 3160", delivery: "$8", containerized: "$45 per foot", container: "25%", category: "tillage" },
  { type: "Rippers", model: "Ecolotiger, Dominator, 512", delivery: "$8", containerized: "$315 per shank", container: "33%", category: "tillage" },
  { type: "Excelerator/Heavy Disk", model: "Excelerator", delivery: "$8", containerized: "$130 per foot", container: "25%", category: "tillage" },
  { type: "Plows", model: "Various models", delivery: "$8", containerized: "$150 per bottom", container: "25%", category: "tillage" },
  { type: "Disks", model: "637, 1544", delivery: "$8", containerized: "$110 per foot", container: "25%", category: "tillage" },
  { type: "Spike Harrows", model: "Various models", delivery: "$8", containerized: "$60 per foot", container: "25%", category: "tillage" },

  // Spraying Equipment
  { type: "Self-Propelled sprayer", model: "Various models", delivery: "$10", containerized: "$4,675.00", container: "70%", category: "spraying" },
  { type: "Pull-Type sprayer", model: "Various models", delivery: "$10", containerized: "$1,995.00+", container: "50%+", category: "spraying" },

  // Planting Equipment - Seeders
  { type: "Seeders - Small Models", model: "1890/1910 < 18m", delivery: "$15", containerized: "$5,400.00", container: "100%", category: "planting" },
  { type: "Seeders - Large Models", model: "1890/1910 > 18m", delivery: "$15", containerized: "$6,200.00", container: "100%", category: "planting" },
  { type: "Seeders - CCS Models", model: "CCS Models", delivery: "$15", containerized: "$4,850.00", container: "100%", category: "planting" },
  { type: "Seeders - 1820/1830", model: "1820/1830", delivery: "$10", containerized: "$5,450.00", container: "120%", category: "planting" },
  { type: "Seeders - 1835", model: "1835", delivery: "$10", containerized: "$5,350.00", container: "100%", category: "planting" },
  { type: "Seeders - 45Ft", model: "45Ft", delivery: "$10", containerized: "$6,750.00", container: "100%", category: "planting" },
  { type: "Seeders - 60Ft", model: "60Ft", delivery: "$10", containerized: "$6,900.00", container: "100%", category: "planting" },

  // Planting Equipment - Planters
  { type: "Planters - Standard Models", model: "3700, 3660, 1770", delivery: "$10", containerized: "$175 per row", container: "100%", category: "planting" },
  { type: "Planters - 3700/3660", model: "3700, 3660", delivery: "$10", containerized: "$165 per row", container: "100%", category: "planting" },
  { type: "Planters - ASD/CCS", model: "ASD, CCS", delivery: "$10", containerized: "$175 per row", container: "100%", category: "planting" },
  { type: "Planters - 1790 (12/23)", model: "1790 Planters 12/23", delivery: "$10", containerized: "$4,150.00", container: "100%", category: "planting" },
  { type: "Planters - 1790 (16/31)", model: "1790 Planters 16/31", delivery: "$10", containerized: "$4,900.00", container: "100%", category: "planting" },
  { type: "Planters - 1780 (12/23)", model: "1780 Planters 12/23", delivery: "$10", containerized: "$4,650.00", container: "100%", category: "planting" },
  { type: "Planters - 1780 (16/31)", model: "1780 Planters 16/31", delivery: "$10", containerized: "$5,450.00", container: "100%", category: "planting" },
  { type: "Planters - DB60 (36 Row)", model: "DB60's 36 Row", delivery: "$10", containerized: "$5,450.00", container: "100%", category: "planting" },
  { type: "Planters - DB60 (47 Row)", model: "DB60's 47 Row", delivery: "$10", containerized: "$5,950.00", container: "100%", category: "planting" },
  { type: "Planters - No-Till", model: "HD, 750", delivery: "$10", containerized: "$145 per foot", container: "100%", category: "planting" },
  { type: "Planters - Standard", model: "455, 3s-3000, 9430", delivery: "$10", containerized: "$125 per foot", container: "100%", category: "planting" },

  // Large Equipment
  { type: "Tractors", model: "JD R4045", delivery: "$10", containerized: "$6,350.00", container: "100%+", category: "large" },
  { type: "Planters - Container Fit", model: "Fits in 40' container", delivery: "$10", containerized: "$6,500.00", container: "100%", category: "large" },
  { type: "Planters - Multi-Container", model: "Requires multiple containers", delivery: "$10", containerized: "$7,500.00", container: "100%+", category: "large" },
];

export const miscPricing: MiscPricing[] = [
  { item: "Wheels", price: "$200.00" },
  { item: "Head Carts", price: "$1,050.00" },
  { item: "Balers", price: "$2,200.00" },
  { item: "Lawn Mowers", price: "$775.00" },
  { item: "Mower MOCO", price: "$1,550.00" },
];

export const deliveryRates: DeliveryRate[] = [
  { route: "Albion, IA → Novorossiysk", lines: "$11,800", soc: "$12,300" },
  { route: "Albion, IA → Vladivostok", lines: "$12,585", soc: "$11,825" },
  { route: "Albion, IA → Busan", lines: "$5,925", soc: "$6,425" },
  { route: "Hankinson, ND → Novorossiysk", lines: "$13,305", soc: "$13,805" },
  { route: "Hankinson, ND → Vladivostok", lines: "$13,535", soc: "$12,775" },
  { route: "Charleston, IL → Novorossiysk", lines: "$11,600", soc: "$12,100" },
  { route: "Charleston, IL → Vladivostok", lines: "$13,835", soc: "$13,075" },
  { route: "Albion, IA → Poti → Kostanay", lines: "$15,340", soc: "$15,840" },
  { route: "Hankinson, ND → Poti → Kostanay", lines: "$16,600", soc: "$17,100" },
  { route: "Charleston, IL → Busan", lines: "$5,325", soc: "$5,825" },
  { route: "Hankinson, ND → Busan", lines: "$6,775", soc: "$7,275" },
  { route: "Savannah, GA → Novorossiysk", lines: "$10,500", soc: "$11,050" },
  { route: "Savannah, GA → Busan", lines: "$6,570", soc: "$7,070" },
  { route: "Chicago, IL → Hong Kong", lines: "$5,345", soc: "$5,845" },
  { route: "Chicago, IL → Constanta", lines: "$8,015", soc: "$8,515" },
  { route: "Chicago, IL → Shanghai", lines: "$6,635", soc: "$7,135" },
  { route: "Chicago, IL → Istanbul → Almaty", lines: "$17,980", soc: "" },
  { route: "Albion, IA → Poti → Almaty", lines: "$14,850", soc: "$15,350" },
  { route: "Hankinson, ND → Poti → Almaty", lines: "$16,100", soc: "$16,600" },
  { route: "Savannah, GA → Vladivostok", lines: "$13,230", soc: "$12,470" },
  { route: "Albion, IA → Chicago → Montevideo", lines: "$7,880", soc: "" },
  { route: "Montreal → Batumi → Kostanay", lines: "$12,150", soc: "" },
];

export const equipmentCategories = [
  { id: "all", label: "All Equipment" },
  { id: "harvesting", label: "Harvesting" },
  { id: "tillage", label: "Tillage" },
  { id: "spraying", label: "Spraying" },
  { id: "planting", label: "Planting" },
  { id: "large", label: "Large Equipment" },
] as const;
