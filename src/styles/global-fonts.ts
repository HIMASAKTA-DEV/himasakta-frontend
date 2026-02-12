// global fonts config
import { Averia_Serif_Libre, Inter, Lora, Poppins } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const averiaSerifLibre = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-averia-serif-libre",
});

export const linuxLibertine = localFont({
  src: [
    {
      path: "../assets/fonts/LinuxLibertineRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/LinuxLibertineBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-linux-libertine",
  display: "swap",
});
