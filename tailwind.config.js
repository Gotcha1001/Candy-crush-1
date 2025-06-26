/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 30px #7e22ce, 0 0 20px #5b21b6",
        sunset: "0 0 30px #fb923c, 0 0 60px #ea580c, 0 0 90px #facc15",
        sky: "0 0 30px #60a5fa, 0 0 60px #2563eb",
        nature: "0 0 30px #4ade80, 0 0 60px #16a34a",
        teal: "0 0 30px #2dd4bf, 0 0 60px #0d9488",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
