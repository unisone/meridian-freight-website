import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  FileText,
  MapPinned,
  Route,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DarkCta } from "@/components/dark-cta";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/content/blog";
import { SITE, COMPANY } from "@/lib/constants";
import { getOgLocale, toBCP47 } from "@/lib/i18n-utils";
import { renderMarkdown } from "@/lib/markdown";
import { setRequestLocale, getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return getAllBlogPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug, locale);
  if (!post) return {};
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE.url}${localePath}/blog/${slug}`,
      languages: {
        en: `${SITE.url}/blog/${slug}`,
        es: `${SITE.url}/es/blog/${slug}`,
        ru: `${SITE.url}/ru/blog/${slug}`,
        "x-default": `${SITE.url}/blog/${slug}`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE.url}${localePath}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      images: [
        { url: SITE.ogImage, width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [SITE.ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tb = await getTranslations("BlogPostPage");
  const post = getBlogPostBySlug(slug, locale);
  if (!post) notFound();

  const localePath = locale === "en" ? "" : `/${locale}`;
  const pageUrl = `${SITE.url}${localePath}/blog/${slug}`;
  const contentHtml = renderMarkdown(post.content);
  const isParaguayImportGuide =
    slug === "import-farm-machinery-united-states-paraguay";

  const routeOptions = [
    {
      label: tb("routeAsuncion"),
      description: tb("routeAsuncionDescription"),
    },
    {
      label: tb("routeParanagua"),
      description: tb("routeParanaguaDescription"),
    },
    {
      label: tb("routeMontevideo"),
      description: tb("routeMontevideoDescription"),
    },
  ];
  const routeComparisonRows = [
    {
      route: tb("routeAsuncion"),
      bestFor: tb("routeAsuncionBestFor"),
      buyerConfirms: tb("routeAsuncionBuyerConfirms"),
    },
    {
      route: tb("routeParanagua"),
      bestFor: tb("routeParanaguaBestFor"),
      buyerConfirms: tb("routeParanaguaBuyerConfirms"),
    },
    {
      route: tb("routeMontevideo"),
      bestFor: tb("routeMontevideoBestFor"),
      buyerConfirms: tb("routeMontevideoBuyerConfirms"),
    },
  ];
  const quickAnswerSteps = [
    {
      title: tb("quickAnswerStepOneTitle"),
      description: tb("quickAnswerStepOneDescription"),
    },
    {
      title: tb("quickAnswerStepTwoTitle"),
      description: tb("quickAnswerStepTwoDescription"),
    },
    {
      title: tb("quickAnswerStepThreeTitle"),
      description: tb("quickAnswerStepThreeDescription"),
    },
    {
      title: tb("quickAnswerStepFourTitle"),
      description: tb("quickAnswerStepFourDescription"),
    },
    {
      title: tb("quickAnswerStepFiveTitle"),
      description: tb("quickAnswerStepFiveDescription"),
    },
  ];
  const ctaHeading = isParaguayImportGuide
    ? tb("screeningCtaHeading")
    : tb("ctaHeading");
  const ctaDescription = isParaguayImportGuide
    ? tb("screeningCtaDescription")
    : tb("ctaDescription");
  const ctaButton = isParaguayImportGuide
    ? tb("screeningCtaButton")
    : tb("getAQuote");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: toBCP47(locale),
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logos/meridian-logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: `${SITE.url}${SITE.ogImage}`,
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <PageHero
          variant="dark"
          locale={locale}
          currentPath={`/blog/${slug}`}
          breadcrumbs={[
            { label: tb("blogBreadcrumb"), href: "/blog" },
            { label: post.title },
          ]}
          eyebrow={post.category}
          heading={post.title}
          description={post.excerpt}
          icon={FileText}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="secondary"
              className="h-8 rounded-lg bg-white/10 px-3 text-xs font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              <Tag className="mr-1.5 h-3.5 w-3.5 text-sky-300" />
              {post.category}
            </Badge>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-xs font-semibold text-sky-100 ring-1 ring-white/15">
              <CalendarDays className="h-3.5 w-3.5 text-sky-300" />
              {post.publishedAt}
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-xs font-semibold text-sky-100 ring-1 ring-white/15">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
              {tb("minRead", { minutes: post.readingTimeMinutes })}
            </span>
          </div>
        </PageHero>

        {/* Article Content */}
        <ScrollReveal variant="fade">
          <section className="bg-muted/40 py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
              <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-foreground/10">
                <div className="border-b bg-gradient-to-r from-primary/10 via-white to-white px-6 py-6 sm:px-8 lg:px-10">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {tb("guideLabel")}
                  </p>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
                {isParaguayImportGuide && (
                  <>
                    <div className="border-b bg-sky-50/70 px-6 py-6 sm:px-8 lg:px-10">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-primary/15">
                          <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                            {tb("quickAnswerEyebrow")}
                          </p>
                          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {tb("quickAnswerHeading")}
                          </h2>
                          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">
                            {tb("quickAnswerDescription")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-0 divide-y divide-border border-y border-border sm:grid-cols-5 sm:divide-x sm:divide-y-0">
                        {quickAnswerSteps.map((step, index) => (
                          <div key={step.title} className="py-4 sm:px-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                                {index + 1}
                              </span>
                              {step.title}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-b px-6 py-6 sm:px-8 lg:px-10">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MapPinned className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {tb("routeComparisonHeading")}
                          </h2>
                          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">
                            {tb("routeComparisonDescription")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 overflow-hidden rounded-lg border border-border">
                        <div className="hidden grid-cols-[0.9fr_1.1fr_1.2fr] bg-muted px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:grid">
                          <div>{tb("routeTableRoute")}</div>
                          <div>{tb("routeTableBestFor")}</div>
                          <div>{tb("routeTableBuyerConfirms")}</div>
                        </div>
                        <div className="divide-y divide-border">
                          {routeComparisonRows.map((row) => (
                            <div
                              key={row.route}
                              className="grid gap-3 px-4 py-4 text-sm md:grid-cols-[0.9fr_1.1fr_1.2fr] md:gap-5"
                            >
                              <div className="font-bold text-foreground">
                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden">
                                  {tb("routeTableRoute")}
                                </span>
                                {row.route}
                              </div>
                              <div className="leading-relaxed text-muted-foreground">
                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden">
                                  {tb("routeTableBestFor")}
                                </span>
                                {row.bestFor}
                              </div>
                              <div className="leading-relaxed text-muted-foreground">
                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden">
                                  {tb("routeTableBuyerConfirms")}
                                </span>
                                {row.buyerConfirms}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="px-6 py-8 text-base leading-7 text-slate-700 sm:px-8 lg:px-10 lg:py-10 [&>*:first-child]:mt-0 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80 [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground sm:[&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:text-foreground [&_li]:pl-1 [&_li]:text-muted-foreground [&_p]:mt-4 [&_p]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </article>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <Card className="shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                        {tb("articleDetails")}
                      </p>
                      <h2 className="mt-2 text-lg font-bold text-foreground">
                        {post.category}
                      </h2>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{post.publishedAt}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {tb("minRead", { minutes: post.readingTimeMinutes })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isParaguayImportGuide && (
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Route className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">
                        {tb("routePlanning")}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {tb("routePlanningDescription")}
                      </p>
                      <div className="mt-5 space-y-3">
                        {routeOptions.map((option) => (
                          <div key={option.label} className="rounded-lg bg-muted p-3">
                            <p className="font-semibold text-foreground">{option.label}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-slate-900 text-white shadow-lg">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold">{tb("supportCardTitle")}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-sky-100">
                      {tb("supportCardDescription")}
                    </p>
                    <Button
                      render={
                        <TrackedCtaLink
                          href="/contact"
                          location={`blog_sidebar_${slug}`}
                          text={ctaButton}
                        />
                      }
                      className="mt-5 h-10 w-full rounded-lg bg-white text-foreground hover:bg-slate-100"
                    >
                      {ctaButton} <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {tb("backToAllArticles")}
                </Link>
              </aside>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal variant="fade">
          <DarkCta heading={ctaHeading} description={ctaDescription}>
            <Button
              render={
                <TrackedCtaLink
                  href="/contact"
                  location={`blog_footer_${slug}`}
                  text={ctaButton}
                />
              }
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
            >
              {ctaButton} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
