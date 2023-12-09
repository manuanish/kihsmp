/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ["var(--font-minecraft)"],
      },
    },
    listStyleType: {
      square: "square",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
