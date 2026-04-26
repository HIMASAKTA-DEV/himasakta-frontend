import type { Metadata } from "next";
import InfoClient from "./InfoClient";

export const metadata: Metadata = {
  title: "Tentang HIMASAKTA ITS",
  description:
    "Informasi lengkap tentang HIMASAKTA ITS, media partner, dan kontak resmi Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember.",
  keywords: [
    "HIMASAKTA",
    "Tentang",
    "Info",
    "Kontak",
    "Media Partner",
    "ITS",
    "Aktuaria",
  ],
  openGraph: {
    title: "Tentang HIMASAKTA ITS",
    description:
      "Informasi lengkap tentang HIMASAKTA ITS, media partner, dan kontak resmi.",
    url: "https://himasakta-its.com/info",
    images: [{ url: "/images/ProfilHimpunan.png", alt: "HIMASAKTA ITS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang HIMASAKTA ITS",
    description:
      "Informasi lengkap tentang HIMASAKTA ITS, media partner, dan kontak resmi.",
    images: ["/images/ProfilHimpunan.png"],
  },
  alternates: { canonical: "https://himasakta-its.com/info" },
};

export default function Page() {
  return <InfoClient />;
}
