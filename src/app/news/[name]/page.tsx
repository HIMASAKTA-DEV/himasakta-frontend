import JsonLd from "@/components/seo/JsonLd";
import { baseURL } from "@/lib/axios";
import type { Metadata } from "next";
import NewsDetailClient from "./NewsDetailClient";

const SITE_URL = "https://himasakta.com";

type Props = { params: Promise<{ name: string }> };

async function fetchNews(slug: string) {
  try {
    const res = await fetch(`${baseURL}/news/s/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const news = await fetchNews(name);
  if (!news) return { title: "Berita" };

  const title = news.title;
  const description =
    news.tagline ||
    (news.content ? news.content.slice(0, 160) : "Berita HIMASAKTA ITS");
  const image = news.thumbnail?.image_url || "/images/ProfilHimpunan.png";

  return {
    title,
    description,
    keywords: [news.title, "HIMASAKTA", "Berita", "ITS", "Aktuaria"],
    openGraph: {
      type: "article",
      title: `${title} | HIMASAKTA ITS`,
      description,
      url: `${SITE_URL}/news/${name}`,
      images: [{ url: image, alt: title }],
      publishedTime: news.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HIMASAKTA ITS`,
      description,
      images: [image],
    },
    alternates: { canonical: `${SITE_URL}/news/${name}` },
  };
}

export default async function Page({ params }: Props) {
  const { name } = await params;
  const news = await fetchNews(name);

  return (
    <>
      {news && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: news.title,
              description: news.tagline || news.content?.slice(0, 200),
              image: news.thumbnail?.image_url,
              datePublished: news.published_at,
              author: {
                "@type": "Organization",
                name: "HIMASAKTA ITS",
                url: SITE_URL,
              },
              publisher: {
                "@type": "Organization",
                name: "HIMASAKTA ITS",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/images/ProfilHimpunan.png`,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${SITE_URL}/news/${name}`,
              },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Berita",
                  item: `${SITE_URL}/news`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: news.title,
                  item: `${SITE_URL}/news/${name}`,
                },
              ],
            }}
          />
        </>
      )}
      <NewsDetailClient />
    </>
  );
}
