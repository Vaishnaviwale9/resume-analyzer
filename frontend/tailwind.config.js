/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(99, 102, 241, 0.45)",
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: 0, transform: "scale(0.96)" }, "100%": { opacity: 1, transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { "0%": { backgroundPosition: "-500px 0" }, "100%": { backgroundPosition: "500px 0" } },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
