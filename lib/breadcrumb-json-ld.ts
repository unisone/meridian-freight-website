import { SITE } from "@/lib/constants";

export interface BreadcrumbJsonLdItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbJsonLd({
  items,
  locale,
  currentPath,
  homeLabel,
}: {
  items: BreadcrumbJsonLdItem[];
  locale: string;
  currentPath: string;
  homeLabel: string;
}) {
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: `${SITE.url}${localePrefix}`,
      },
      ...items.map((item, i) => {
        const isLast = i === items.length - 1;
        const base: { "@type": "ListItem"; position: number; name: string; item?: string } = {
          "@type": "ListItem",
          position: i + 2,
          name: item.label,
        };

        if (item.href) {
          base.item = `${SITE.url}${localePrefix}${item.href}`;
        } else if (isLast) {
          base.item = `${SITE.url}${localePrefix}${currentPath}`;
        }

        return base;
      }),
    ],
  };
}
