import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria",
    template: "%s | HIMASAKTA ITS",
  },
  description:
    "Portal resmi HIMASAKTA ITS. Informasi kabinet, departemen, berita terkini, dan kegiatan mahasiswa Aktuaria ITS Surabaya.",
  keywords: [
    "HIMASAKTA",
    "ITS",
    "Aktuaria",
    "Aktuaria ITS",
    "Himpunan Mahasiswa",
  ],
  authors: [{ name: "HIMASAKTA ITS" }],
  openGraph: {
    title: "HIMASAKTA ITS",
    description: "Himpunan Mahasiswa Teknik Aktuaria ITS Surabaya",
    url: "https://himasakta.its.ac.id",
    siteName: "HIMASAKTA ITS",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
