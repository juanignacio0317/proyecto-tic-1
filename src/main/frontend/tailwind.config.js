/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // tailwind.config.js
  extend: {
    fontFamily:{
    brand:['Poppins','sans-serif']
},
    colors: {
      brand: {
        start: "#6FD3CF",
        end:   "#1B7F79",
        accent:"#F2C94C",

      },
    },
  },

  plugins: [],
}
