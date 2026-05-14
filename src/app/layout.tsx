import LenisWrapper from "@/components/commons/LenisWrapper";
import "./globals.css";
import Providers from "@/app/providers";
import AuthGuard from "@/layouts/AuthGuard";
import { GetCurrentCabinet } from "@/services/landing_page/InformasiKabinet";
import {
  averiaSerifLibre,
  inter,
  linuxLibertine,
  lora,
  poppins,
} from "@/styles/global-fonts";
import type { Metadata, Viewport } from "next";

export const revalidate = 60;

const SITE_URL = "https://himasakta-its.com";
const FALLBACK_OG_IMAGE = "/images/ProfilHimpunan.png";

export const viewport: Viewport = {
  themeColor: "#E91E63",
  width: "device-width",
  initialScale: 1,
};

async function getActiveCabinetLogo(): Promise<string> {
  try {
    const res = await GetCurrentCabinet();
    return res.data?.logo?.image_url || FALLBACK_OG_IMAGE;
  } catch {
    return FALLBACK_OG_IMAGE;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getActiveCabinetLogo();

  return {
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
      siteName: "HIMASAKTA-ITS",
      title: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria ITS",
      description:
        "Website resmi Himpunan Mahasiswa Aktuaria Institut Teknologi Sepuluh Nopember (ITS).",
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
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
}

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
