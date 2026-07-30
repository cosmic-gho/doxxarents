import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        paper: "#FAFAF9",
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C778",
          dark: "#9C7A2E",
        },
        stone: {
          50: "#FAFAF9",
          100: "#F2F1EE",
          200: "#E4E2DC",
          600: "#5C5A54",
          800: "#2A2A27",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
