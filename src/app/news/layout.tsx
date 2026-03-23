import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informasi Berita",
  description:
    "Kumpulan berita dan informasi terbaru dari HIMASAKTA ITS - Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember.",
  keywords: ["Berita", "HIMASAKTA", "ITS", "Aktuaria", "News", "Informasi"],
  openGraph: {
    title: "Informasi Berita | HIMASAKTA ITS",
    description: "Kumpulan berita dan informasi terbaru dari HIMASAKTA ITS.",
    url: "https://himasakta.com/news",
    images: [{ url: "/images/ProfilHimpunan.png", alt: "HIMASAKTA ITS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Informasi Berita | HIMASAKTA ITS",
    description: "Kumpulan berita dan informasi terbaru dari HIMASAKTA ITS.",
    images: ["/images/ProfilHimpunan.png"],
  },
  alternates: { canonical: "https://himasakta.com/news" },
};

export default function NewsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Informasi Berita HIMASAKTA ITS",
          description:
            "Kumpulan berita dan informasi terbaru dari HIMASAKTA ITS.",
          url: "https://himasakta.com/news",
          isPartOf: {
            "@type": "WebSite",
            name: "HIMASAKTA ITS",
            url: "https://himasakta.com",
          },
        }}
      />
      {children}
    </>
  );
}
