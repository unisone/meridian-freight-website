import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { SITE, COMPANY } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { renderMarkdown } from "@/lib/markdown";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
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
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = renderMarkdown(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
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
      "@id": `${SITE.url}/blog/${slug}`,
    },
    image: `${SITE.url}${SITE.ogImage}`,
    url: `${SITE.url}/blog/${slug}`,
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
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium"
              >
                {post.category}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-sky-300">
                <Tag className="h-3.5 w-3.5" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-sky-300">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTimeMinutes} min read
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Article Content */}
        <ScrollReveal variant="fade">
          <article className="py-16 md:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:my-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </article>
        </ScrollReveal>

        {/* Back to Blog */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all articles
          </Link>
        </div>

        {/* CTA */}
        <ScrollReveal variant="fade">
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Get a Quote
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sky-300">
                Ready to ship your equipment? Tell us what you need to export and where
                it is going — we will send you a detailed quote within 24 hours.
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
