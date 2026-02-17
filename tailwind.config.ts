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
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Blue 600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e293b", // Slate 800
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f59e0b", // Amber 500
          foreground: "#ffffff",
        },
        background: "#f8fafc", // Slate 50
        foreground: "#0f172a", // Slate 900
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
