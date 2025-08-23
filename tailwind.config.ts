import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22c55e", // groen (Duolingo vibe)
          dark: "#16a34a",
          light: "#4ade80"
        },
        accent: {
          yellow: "#facc15",
          orange: "#fb923c",
          purple: "#a855f7"
        }
      },
      borderRadius: {
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
}
export default config
