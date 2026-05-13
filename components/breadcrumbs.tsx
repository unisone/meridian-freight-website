import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-json-ld";
import { encodeJsonLd } from "@/lib/json-ld";
import { JsonLdScript } from "@/components/json-ld-script";
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

  const jsonLd = buildBreadcrumbJsonLd({
    items,
    locale,
    currentPath,
    homeLabel: t("home"),
  });

  return (
    <>
      <JsonLdScript encodedJson={encodeJsonLd(jsonLd)} />
      <nav aria-label={t("breadcrumbLabel")} className="py-4">
        <ol className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-muted-foreground sm:flex-wrap">
          <li className="shrink-0">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">{t("home")}</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={item.label}
                className={`flex items-center gap-1.5 ${isLast ? "min-w-0" : "shrink-0"}`}
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-foreground">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
