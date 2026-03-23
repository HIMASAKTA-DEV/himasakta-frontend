import JsonLd from "@/components/seo/JsonLd";
import { baseURL } from "@/lib/axios";
import type { Metadata } from "next";
import ProgendaDetailClient from "./ProgendaDetailClient";

const SITE_URL = "https://himasakta.com";

type Props = { params: Promise<{ id: string }> };

async function fetchProgenda(id: string) {
  try {
    const res = await fetch(`${baseURL}/progenda/${id}`, {
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
  const { id } = await params;
  const p = await fetchProgenda(id);
  if (!p) return { title: "Progenda" };

  const title = p.name;
  const description = p.description
    ? p.description.slice(0, 160)
    : `Progenda ${p.name} - HIMASAKTA ITS`;
  const image = p.thumbnail?.image_url || "/images/ProfilHimpunan.png";

  return {
    title,
    description,
    keywords: [
      p.name,
      "Progenda",
      "HIMASAKTA",
      "ITS",
      p.department?.name,
    ].filter(Boolean),
    openGraph: {
      type: "article",
      title: `${title} | HIMASAKTA ITS`,
      description,
      url: `${SITE_URL}/progenda/${id}`,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HIMASAKTA ITS`,
      description,
      images: [image],
    },
    alternates: { canonical: `${SITE_URL}/progenda/${id}` },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const p = await fetchProgenda(id);

  return (
    <>
      {p && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Event",
              name: p.name,
              description: p.description,
              image: p.thumbnail?.image_url,
              organizer: {
                "@type": "Organization",
                name: p.department?.name || "HIMASAKTA ITS",
                url: p.department?.slug
                  ? `${SITE_URL}/departments/${p.department.slug}`
                  : SITE_URL,
              },
              url: `${SITE_URL}/progenda/${id}`,
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
                ...(p.department?.slug
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: p.department.name,
                        item: `${SITE_URL}/departments/${p.department.slug}`,
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: p.department?.slug ? 3 : 2,
                  name: p.name,
                  item: `${SITE_URL}/progenda/${id}`,
                },
              ],
            }}
          />
        </>
      )}
      <ProgendaDetailClient />
    </>
  );
}
