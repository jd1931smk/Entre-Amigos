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
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        beige: {
          50: '#fdfbf7',
          100: '#fcf7ed',
          200: '#f5e6d3',
          300: '#f0d5b5',
          400: '#e6b77f',
          500: '#dca366',
          600: '#c4824d',
          700: '#a66939',
          800: '#8b572f',
          900: '#724628',
        },
      },
    },
  },
  plugins: [],
}