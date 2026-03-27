import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllServices } from "@/content/services";
import { getAllEquipmentTypes } from "@/content/equipment";
import { getAllDestinations } from "@/content/destinations";
import { blogPosts } from "@/content/blog";

/** Generate hreflang alternates for a given path */
function withAlternates(path: string) {
  return {
    languages: {
      en: `${SITE.url}${path}`,
      es: `${SITE.url}/es${path}`,
      ru: `${SITE.url}/ru${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withAlternates("") },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withAlternates("/about") },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: withAlternates("/services") },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withAlternates("/projects") },
    { url: `${SITE.url}/destinations`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withAlternates("/destinations") },
    { url: `${SITE.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: withAlternates("/pricing") },
    { url: `${SITE.url}/pricing/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: withAlternates("/pricing/calculator") },
    { url: `${SITE.url}/shared-shipping`, lastModified: now, changeFrequency: "daily", priority: 0.9, alternates: withAlternates("/shared-shipping") },
    { url: `${SITE.url}/schedule`, lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: withAlternates("/schedule") },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withAlternates("/faq") },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withAlternates("/contact") },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withAlternates("/blog") },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: withAlternates("/privacy") },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: withAlternates("/terms") },
  ];

  const servicePages: MetadataRoute.Sitemap = getAllServices('en').map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: withAlternates(`/services/${s.slug}`),
  }));

  const equipmentPages: MetadataRoute.Sitemap = getAllEquipmentTypes('en').map((e) => ({
    url: `${SITE.url}/equipment/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: withAlternates(`/equipment/${e.slug}`),
  }));

  const destinationPages: MetadataRoute.Sitemap = getAllDestinations('en').map((d) => ({
    url: `${SITE.url}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: withAlternates(`/destinations/${d.slug}`),
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: withAlternates(`/blog/${p.slug}`),
  }));

  return [...staticPages, ...servicePages, ...equipmentPages, ...destinationPages, ...blogPages];
}
