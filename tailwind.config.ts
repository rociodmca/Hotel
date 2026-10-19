import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6f1",
          100: "#e0eadd",
          200: "#c2d6bf",
          300: "#99b995",
          400: "#6c9668",
          500: "#4b7647",
          600: "#385d35",
          700: "#2d4a2b",
          800: "#263c24",
          900: "#1f321e",
          950: "#0f1c0f"
        },
        clay: {
          50: "#fbf5ef",
          100: "#f5e6d6",
          200: "#eac9a9",
          300: "#dda778",
          400: "#d08a4f",
          500: "#c26f34",
          600: "#a8582a",
          700: "#8a4425",
          800: "#713824",
          900: "#5d2f20"
        },
        paper: "#faf7f0"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        tightest: "-0.045em"
      },
      boxShadow: {
        soft: "0 2px 4px -2px rgba(31,50,30,0.10), 0 12px 32px -12px rgba(31,50,30,0.22)",
        lift: "0 4px 8px -4px rgba(31,50,30,0.16), 0 24px 48px -20px rgba(31,50,30,0.30)"
      },
      keyframes: {
        "fade-rise": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "ken-burns": {
          "0%": { transform: "scale(1.05) translate(0, 0)" },
          "100%": { transform: "scale(1.16) translate(-1.5%, -1.5%)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "fade-rise": "fade-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "ken-burns": "ken-burns 28s ease-in-out infinite alternate",
        shimmer: "shimmer 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
