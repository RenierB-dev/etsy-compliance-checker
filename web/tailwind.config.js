/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fad5ad',
          300: '#f6b879',
          400: '#f29143',
          500: '#ef711e',
          600: '#e05614',
          700: '#b93f13',
          800: '#933317',
          900: '#762c16',
        },
      },
    },
  },
  plugins: [],
}
