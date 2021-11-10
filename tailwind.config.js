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
      secondary: '#FFF',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
