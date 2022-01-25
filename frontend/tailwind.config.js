const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'roboto': ['roboto', 'sans-serif'],
      'keep-calm': ['keep calm', 'sans-serif']
    },
    colors: {
      primary: '#544179',
      'primary-hover': '#371f65',
      secondary: '#FFF',
      error: colors.red,
      gray: colors.gray,
      black: colors.black,
      white: colors.white,
      red: colors.red,
      green: colors.green,
    }
  },
  variants: {
    display: ['group-hover'],
    extend: {},
  },
  plugins: [],
}
