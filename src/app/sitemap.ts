import { baseURL } from "@/lib/axios";
import type { MetadataRoute } from "next";

const SITE_URL = "https://himasakta-its.com";

type ApiItem = { slug?: string; id?: string; updated_at?: string };

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(`${baseURL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, news, progendas] = await Promise.all([
    fetchAll<ApiItem>("/department?limit=100"),
    fetchAll<ApiItem & { slug?: string }>("/news?limit=100"),
    fetchAll<ApiItem>("/progenda?limit=100"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/info`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/kalender-akademik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const deptRoutes: MetadataRoute.Sitemap = departments
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${SITE_URL}/departments/${d.slug}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const newsRoutes: MetadataRoute.Sitemap = news
    .filter((n) => n.slug)
    .map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const progendaRoutes: MetadataRoute.Sitemap = progendas
    .filter((p) => p.id)
    .map((p) => ({
      url: `${SITE_URL}/progenda/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...deptRoutes, ...newsRoutes, ...progendaRoutes];
}
