import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
  /** Path without locale prefix, e.g. "/destinations/argentina" */
  currentPath: string;
}

export function Breadcrumbs({ items, locale, currentPath }: BreadcrumbsProps) {
  const t = useTranslations("Breadcrumbs");

  const localePrefix = locale === "en" ? "" : `/${locale}`;

  // Build JSON-LD BreadcrumbList with locale-prefixed URLs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label={t("breadcrumbLabel")} className="py-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">{t("home")}</span>
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
