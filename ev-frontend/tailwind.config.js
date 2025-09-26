/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 900:"#00182A", 700:"#0A2F4A", 500:"#1B4E74", 100:"#E6F0F7" }
      }
    },
  },
  plugins: [],
}
