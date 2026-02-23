import lineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        poppins: ["var(--font-poppins)"],
        lora: ["var(--font-lora)"],
        averia: ["var(--font-averia-serif-libre)"],
        libertine: ["var(--font-linux-libertine)"],
      },
      colors: {
        primaryPink: "#D58A94",
        primaryGreen: "#22C55E",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "25%": {
            transform: "translate(80px, -120px) scale(1.15)",
          },
          "50%": {
            transform: "translate(-100px, 100px) scale(0.9)",
          },
          "75%": {
            transform: "translate(120px, 60px) scale(1.1)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        blob: "blob 18s ease-in-out infinite",
      },
    },
  },
  plugins: [lineClamp],
};
export default config;
