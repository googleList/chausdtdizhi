import type { MetadataRoute } from "next";
import newsData from "@/data/blockchain-news.json";
import { blockchainTools } from "@/lib/blockchain-tools";
import { guides } from "@/lib/guides";
import { getNewsTotalPages } from "@/lib/news";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3100");
  const newsTotalPages = getNewsTotalPages();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.78
    },
    ...Array.from({ length: Math.max(0, newsTotalPages - 1) }, (_, index) => ({
      url: `${siteUrl}/news/page/${index + 2}`,
      lastModified: new Date(newsData.generatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.62
    })),
    ...newsData.items.map((article) => ({
      url: `${siteUrl}/news/${article.slug}`,
      lastModified: new Date(newsData.generatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.68
    })),
    ...blockchainTools.map((tool) => ({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.72
    })),
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
