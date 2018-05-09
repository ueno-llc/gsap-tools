/* eslint-disable import/no-extraneous-dependencies */

// PostCSS-Loader config options
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-csso')({ restructure: false }),
  ],
};
