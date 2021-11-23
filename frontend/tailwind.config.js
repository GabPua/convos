const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'keep-calm': ['keep calm', 'sans-serif']
    },
    colors: {
      primary: '#544179',
      'primary-hover': '#371f65',
      secondary: '#FFF',
      error: colors.red,
      gray: colors.gray,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
