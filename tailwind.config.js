/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        udla: {
          50:  '#e8f3ee',
          100: '#c5e0d0',
          200: '#9dccb0',
          300: '#70b58e',
          400: '#3a8e63',
          500: '#00693e',
          600: '#005232',
          700: '#003d25',
          800: '#002c1b',
          900: '#001e12',
        },
        accent: {
          500: '#c1272d',
          600: '#a01f25',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
