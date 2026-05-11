/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // tailwind.config.js

  theme: {
    extend: {
      animation: {
        "spin-slow":
          "spin 12s linear infinite",
      },
    },
  },
  plugins: [],
}