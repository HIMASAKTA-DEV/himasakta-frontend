import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender Akademik",
  description:
    "Kalender akademik HIMASAKTA ITS - Timeline kegiatan dan event bulanan Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember.",
  keywords: [
    "Kalender Akademik",
    "HIMASAKTA",
    "ITS",
    "Event",
    "Timeline",
    "Aktuaria",
  ],
  openGraph: {
    title: "Kalender Akademik | HIMASAKTA ITS",
    description: "Timeline kegiatan dan event bulanan HIMASAKTA ITS.",
    url: "https://himasakta-its.com/kalender-akademik",
    images: [{ url: "/images/ProfilHimpunan.png", alt: "HIMASAKTA ITS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalender Akademik | HIMASAKTA ITS",
    description: "Timeline kegiatan dan event bulanan HIMASAKTA ITS.",
    images: ["/images/ProfilHimpunan.png"],
  },
  alternates: { canonical: "https://himasakta-its.com/kalender-akademik" },
};

export default function KalenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
