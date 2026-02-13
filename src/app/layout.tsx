import "./globals.css";
import Providers from "@/app/providers";
import {
  averiaSerifLibre,
  inter,
  linuxLibertine,
  lora,
  poppins,
} from "@/styles/global-fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "HIMASAKTA ITS | Himpunan Mahasiswa Aktuaria ITS",
    template: "%s | HIMASAKTA ITS",
  },
  description: "Website resmi Himpunan Mahasiswa Aktuaria ITS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${lora.variable}
          ${poppins.variable}
          ${averiaSerifLibre.variable}
          ${linuxLibertine.variable}
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
