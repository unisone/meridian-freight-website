// Single source of truth for all contact information, URLs, and social links.
// Every component MUST import from here — never hardcode phone/email/URLs.

export const COMPANY = {
  name: "Meridian Freight Inc.",
  legalName: "Meridian Freight Inc.",
  tagline: "Professional Machinery Export & Logistics",
  description:
    "Full-service machinery export from USA & Canada — equipment pickup, professional dismantling, secure container packing, export documentation, and air or ocean shipping worldwide. 500+ exports completed.",
  foundedYear: 2013,
} as const;

export const CONTACT = {
  phone: "+1 (641) 516-1616",
  phoneRaw: "+16415161616",
  phoneHref: "tel:+16415161616",
  email: "info@meridianexport.com",
  emailHref: "mailto:info@meridianexport.com",
  partsEmail: "parts@meridianexport.com",
  partsEmailHref: "mailto:parts@meridianexport.com",
  notificationEmail: "alex.z@meridianexport.com",
  fromEmail: "Meridian Freight <contact@meridianexport.com>",
  whatsappUrl: "https://wa.me/16415161616",
  address: {
    street: "2107 148th",
    city: "Albion",
    state: "IA",
    zip: "50005",
    country: "USA",
    full: "2107 148th, Albion, IA, USA",
  },
  hours: "Mon–Sat, replies within 24 hrs",
} as const;

export const SOCIAL = {
  facebook: "https://www.facebook.com/meridianfreight",
  instagram: "https://www.instagram.com/meridian_logistics_usa/",
  youtube: "https://youtube.com/@merifreight_eng",
} as const;

export const SITE = {
  url: "https://meridianexport.com",
  name: "Meridian Export",
  domain: "meridianexport.com",
  ogImage: "/og.jpg",
} as const;

export const TRACKING = {
  gaId: (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim(),
  metaPixelId: (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim(),
  googleAdsId: (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "").trim(),
} as const;

export const STATS = {
  projectsCompleted: 500,
  yearsExperience: new Date().getFullYear() - COMPANY.foundedYear,
} as const;

export const WAREHOUSE_MAIN = {
  state: "IA",
  name: "Iowa (Headquarters)",
  description: "Main packing & loading facility",
} as const;

export const WAREHOUSE_PARTNERS = [
  { state: "CA", name: "California" },
  { state: "GA", name: "Georgia" },
  { state: "IL", name: "Illinois" },
  { state: "ND", name: "North Dakota" },
  { state: "TX", name: "Texas" },
  { state: "AB", name: "Alberta, Canada" },
] as const;

/** @deprecated Use WAREHOUSE_MAIN + WAREHOUSE_PARTNERS instead */
export const WAREHOUSE_LOCATIONS = WAREHOUSE_PARTNERS;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Machinery Dismantling & Packing", href: "/services/machinery-packing" },
      { label: "Container Loading & Export", href: "/services/container-loading" },
      { label: "Agricultural Equipment", href: "/services/agricultural" },
      { label: "Equipment Sourcing & Procurement", href: "/services/equipment-sales" },
      { label: "Export Documentation", href: "/services/documentation" },
      { label: "Warehouse & Storage", href: "/services/warehousing" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Destinations", href: "/destinations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Shared Shipping", href: "/shared-shipping" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
