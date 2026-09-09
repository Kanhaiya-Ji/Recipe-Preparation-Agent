import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sage green — primary brand color
        sage: {
          50:  "#f4f7f2",
          100: "#e6eee3",
          200: "#cdddc8",
          300: "#aac4a3",
          400: "#82a67a",
          500: "#7C9A6E", // main sage
          600: "#537a4b",
          700: "#42613c",
          800: "#364e30",
          900: "#2d4129",
        },
        // Warm amber/orange — accent & CTA
        amber: {
          50:  "#fff8f3",
          100: "#ffeedd",
          200: "#ffd9b8",
          300: "#ffbc87",
          400: "#f59754",
          500: "#E8834E", // main amber
          600: "#d4652e",
          700: "#b04f22",
          800: "#8d3f1e",
          900: "#72341c",
        },
        // Cream — background
        cream: {
          50:  "#fffef9",
          100: "#FDF6EC", // main cream background
          200: "#f7e8d0",
          300: "#f0d4ae",
          400: "#e6bc87",
          500: "#d9a060",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        spin: "spin 0.8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.07), 0 2px 12px 0 rgba(0,0,0,0.05)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.1), 0 2px 6px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
