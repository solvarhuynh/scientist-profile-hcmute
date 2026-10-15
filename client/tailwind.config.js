/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hcmute: {
          blue: '#005596',
          dark: '#003b69',
          light: '#eaf2f8',
          accent: '#0284c7'
        }
      }
    },
  },
  plugins: [],
}

