import type { MetadataRoute } from "next";
import { todosOsPosts, categorias } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = todosOsPosts();
  const maisRecente = posts[0]?.data ?? new Date().toISOString().slice(0, 10);

  return [
    { url: SITE.url, lastModified: new Date(maisRecente), changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE.url}/benchmarks`,
      lastModified: new Date(maisRecente),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${SITE.url}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    ...categorias().map((c) => ({
      url: `${SITE.url}/categoria/${c.slug}`,
      lastModified: new Date(maisRecente),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${SITE.url}/posts/${p.slug}`,
      lastModified: new Date(p.data),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
