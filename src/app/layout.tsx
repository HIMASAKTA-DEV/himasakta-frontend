import LenisWrapper from "@/components/commons/LenisWrapper";
import "./globals.css";
import Providers from "@/app/providers";
import AuthGuard from "@/layouts/AuthGuard";
import {
  averiaSerifLibre,
  inter,
  linuxLibertine,
  lora,
  poppins,
} from "@/styles/global-fonts";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = "https://himasakta.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria ITS",
    template: "%s | HIMASAKTA ITS",
  },
  description:
    "Website resmi Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember (ITS). Informasi departemen, berita, progenda, dan kegiatan mahasiswa aktuaria.",
  keywords: [
    "HIMASAKTA",
    "ITS",
    "Aktuaria",
    "Himpunan Mahasiswa",
    "Institut Teknologi Sepuluh Nopember",
    "Actuarial Science",
    "Departemen Aktuaria",
  ],
  authors: [{ name: "HIMASAKTA ITS" }],
  creator: "HIMASAKTA ITS",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "HIMASAKTA ITS",
    title: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria ITS",
    description:
      "Website resmi Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember (ITS).",
    images: [
      {
        url: "/images/ProfilHimpunan.png",
        width: 1200,
        height: 630,
        alt: "HIMASAKTA ITS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria ITS",
    description:
      "Website resmi Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember (ITS).",
    images: ["/images/ProfilHimpunan.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`
          ${inter.variable}
          ${lora.variable}
          ${poppins.variable}
          ${averiaSerifLibre.variable}
          ${linuxLibertine.variable}
        `}
      >
        <AuthGuard />
        <Providers>
          <LenisWrapper>{children}</LenisWrapper>
        </Providers>
      </body>
    </html>
  );
}
