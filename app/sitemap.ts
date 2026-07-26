import type { MetadataRoute } from "next";
import { todosOsPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = todosOsPosts();
  const maisRecente = posts[0]?.data ?? new Date().toISOString().slice(0, 10);

  return [
    { url: SITE.url, lastModified: new Date(maisRecente), changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((p) => ({
      url: `${SITE.url}/posts/${p.slug}`,
      lastModified: new Date(p.data),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
