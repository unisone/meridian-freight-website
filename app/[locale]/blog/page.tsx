import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { blogPosts } from "@/content/blog";
import { SITE, COMPANY } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("blogTitle"),
    description: t("blogDescription"),
    keywords: [
      "machinery export blog",
      "farm equipment shipping guides",
      "heavy machinery export tips",
      "freight shipping insights",
      "equipment export costs",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/blog`,
      languages: {
        en: `${SITE.url}/blog`,
        es: `${SITE.url}/es/blog`,
        ru: `${SITE.url}/ru/blog`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("blogTitle")} | ${SITE.name}`,
      description: t("blogDescription"),
      url: `${SITE.url}${localePath}/blog`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("blogTitle") }],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: locale,
    name: "Machinery Export Blog",
    description:
      "Expert articles on shipping and exporting heavy machinery from the USA and Canada.",
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: post.title,
      url: `${SITE.url}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-20">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog" }]} />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Machinery Export Insights
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
              Expert guides, cost breakdowns, and destination-specific advice from the{" "}
              {COMPANY.name} team. Everything you need to know about shipping heavy
              equipment from the USA and Canada.
            </p>
          </div>
        </section>

        {/* Blog Post Cards */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, idx) => (
                <StaggerItem key={post.slug} index={idx}>
                  <Link href={`/blog/${post.slug}`} className="group">
                    <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="px-2.5 py-0.5 text-xs font-medium"
                          >
                            {post.category}
                          </Badge>
                        </div>
                        <h2 className="text-lg font-bold text-foreground leading-snug">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-primary" />
                            {post.publishedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            {post.readingTimeMinutes} min read
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
                          Read article <ArrowRight className="h-3.5 w-3.5" />
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <ScrollReveal variant="fade">
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to Ship Your Equipment?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sky-300">
                Get a free, no-obligation quote within 24 hours. Tell us what you are
                shipping and where it needs to go.
              </p>
              <Button
                render={<Link href="/contact" />}
                size="lg"
                className="mt-6 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
              >
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
