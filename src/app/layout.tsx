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
    default: "Nextjs Starter Template",
    template: "%s | Nextjs Starter Template",
  },
  description: "Nextjs 14.2.1 + Tailwind CSS starter template",
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
