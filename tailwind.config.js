/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.vue', './src/App.vue'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#eff1fb',
          200: '#d7dbf6',
          500: '#5F6EDD',
        },
        secondary: '#c34d10',
        white: '#f9f9fd',
      },
      fontFamily: {
        inter: 'Inter',
      },
    },
  },
  plugins: [],
}
