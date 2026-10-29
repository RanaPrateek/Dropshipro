import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  // Gradient classes are built dynamically (category placeholders), so make
  // sure they're always generated.
  safelist: [
    "from-rose-400", "to-pink-600",
    "from-blue-400", "to-indigo-600",
    "from-sky-500",
    "from-slate-400", "to-slate-600",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
