import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

/**
 * ES-ONLY homepage block. Links the indexed `/es` homepage DOWN to the 5 country
 * "money" pages (the full import-process pages), so Google crawls them — the #1
 * indexation lever from the SEO audit (see
 * mf-claude-ads/campaigns/seo-organic/A2-internal-link-architecture.md §3a).
 *
 * These pages exist only in Spanish, and the SEO spec bars cross-language in-body
 * links, so this renders only when `locale === "es"` (gated in app/[locale]/page.tsx).
 * Anchors are intentionally VARIED per the A2 matrix (not one exact-match repeated).
 * Uses next-intl `Link`, which the `/es` request renders as a crawlable
 * `<a href="/es/destinations/...">` in the SSR HTML.
 */
const IMPORT_PAGES = [
  { href: "/destinations/paraguay/importacion-maquinaria-usa", anchor: "importar maquinaria agrícola a Paraguay" },
  { href: "/destinations/argentina/importacion-maquinaria-usa", anchor: "importar maquinaria usada a Argentina" },
  { href: "/destinations/uruguay/importacion-maquinaria-usa", anchor: "importar maquinaria agrícola a Uruguay" },
  { href: "/destinations/bolivia/importacion-maquinaria-usa", anchor: "importación de maquinaria pesada a Bolivia" },
  { href: "/destinations/chile/importacion-maquinaria-usa", anchor: "importar maquinaria agrícola a Chile" },
];

export function ImportByCountry() {
  return (
    <section
      aria-labelledby="import-by-country-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <h2
        id="import-by-country-heading"
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        Importación de maquinaria por país
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Gestionamos todo el proceso de importación de maquinaria usada desde
        EE.UU.: una sola empresa, en español y por WhatsApp. Vea el proceso
        completo de importación para su país:
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {IMPORT_PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group inline-flex items-center gap-2 text-base font-medium text-primary hover:underline"
            >
              {p.anchor}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
