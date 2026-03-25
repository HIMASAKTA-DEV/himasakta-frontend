import JsonLd from "@/components/seo/JsonLd";
import { baseURL } from "@/lib/axios";
import type { Metadata } from "next";
import DepartmentClient from "./DepartmentClient";

const SITE_URL = "https://himasakta.com";

type Props = { params: Promise<{ slug: string }> };

async function fetchDept(slug: string) {
  try {
    const res = await fetch(`${baseURL}/department/${slug}`, {
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
  const { slug } = await params;
  const dept = await fetchDept(slug);
  if (!dept) return { title: "Departemen" };

  const title = dept.name;
  const description = dept.description
    ? dept.description.slice(0, 160)
    : `Departemen ${dept.name} - HIMASAKTA ITS`;
  const image = dept.logo?.image_url || "/images/ProfilHimpunan.png";

  return {
    title,
    description,
    keywords: [dept.name, "HIMASAKTA", "ITS", "Departemen", "Aktuaria"],
    openGraph: {
      title: `${title} | HIMASAKTA ITS`,
      description,
      url: `${SITE_URL}/departments/${slug}`,
      images: [{ url: image, alt: dept.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HIMASAKTA ITS`,
      description,
      images: [image],
    },
    alternates: { canonical: `${SITE_URL}/departments/${slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const dept = await fetchDept(slug);

  return (
    <>
      {dept && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: dept.name,
              url: `${SITE_URL}/departments/${slug}`,
              logo: dept.logo?.image_url,
              description: dept.description,
              parentOrganization: {
                "@type": "Organization",
                name: "HIMASAKTA ITS",
                url: SITE_URL,
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
                  name: "Departemen",
                  item: `${SITE_URL}/departments`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: dept.name,
                  item: `${SITE_URL}/departments/${slug}`,
                },
              ],
            }}
          />
        </>
      )}
      <DepartmentClient />
    </>
  );
}
