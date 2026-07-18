import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tappy-Palette: Theke statt Café-Latte-Cream
        bar: {
          950: "#14100D", // fast schwarzes Thekenholz
          900: "#1C1512",
          800: "#2A211B",
          700: "#3D2F26",
        },
        brass: {
          400: "#D9B166", // heller Zapfhahn-Messing-Ton
          500: "#C89B3C", // Signaturfarbe
          600: "#A87F2E",
        },
        cream: "#EDE6D6",
        felt: "#3F5C4E", // gedecktes Grün, für "geöffnet"/Erfolg
        warn: "#B4533C",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        coaster: "50%",
      },
    },
  },
  plugins: [],
};
export default config;
