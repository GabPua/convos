const path = require('path')

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      paths.appBuild = webpackConfig.output.path = path.resolve('../backend/public')
      return webpackConfig
    }
  },
  
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}