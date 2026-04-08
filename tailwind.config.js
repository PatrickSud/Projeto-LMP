/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#500788',
          DEFAULT: '#8E06D6',
          light: '#9565E6',
          lilac: '#D7C5FA',
        },
        secondary: {
          'light-blue': '#E1FAFF',
          cyan: '#94ECFF',
          indigo: '#423680',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Body text
        serif: ['"Playfair Display"', 'serif'], // Titles and impact phrases
      }
    },
  },
  plugins: [],
}
