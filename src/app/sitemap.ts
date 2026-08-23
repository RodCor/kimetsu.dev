import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: new URL(`${page.url}/`, "https://kimetsu.dev").toString(),
    changeFrequency: "weekly" as const,
    priority: page.url === "/docs" ? 0.9 : 0.7,
  }));

  return [
    {
      url: "https://kimetsu.dev/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://kimetsu.dev/projects/",
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...docs,
  ];
}
