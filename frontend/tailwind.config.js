/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        '8x-coral': '#F15A3A',
        '8x-ink': '#171915',
        '8x-navy': '#182B67',
        '8x-warm': '#F7F3EC',
        '8x-surface': '#F1EEE7',
        '8x-muted': '#6B6B67',
        '8x-border': '#DDD9D1',
      }
    },
  },
  plugins: [],
}
