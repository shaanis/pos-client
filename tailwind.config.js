/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4ADE80",
          soft: "#F8FAFC",
          card: "#FFFFFF",
        },
      },
    },
    plugins: [require("tailwind-scrollbar-hide")],
  };
  