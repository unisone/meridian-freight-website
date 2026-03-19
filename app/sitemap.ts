import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { services } from "@/content/services";
import { equipmentTypes } from "@/content/equipment";
import { destinations } from "@/content/destinations";
import { blogPosts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/destinations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/pricing/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const equipmentPages: MetadataRoute.Sitemap = equipmentTypes.map((e) => ({
    url: `${SITE.url}/equipment/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${SITE.url}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...equipmentPages, ...destinationPages, ...blogPages];
}
