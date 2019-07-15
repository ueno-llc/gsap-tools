const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,

  entry: './src/index.js',

  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: 'gsap-tools.js',
  },

  externals: {
    react: 'react',
    gsap: 'gsap',
  },

  resolve: {
    modules: [
      './src',
      './src/app',
      'node_modules',
    ],
  },

  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin([{ from: 'src/index.d.ts', to: './gsap-tools.d.ts' }]),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /(\.scss|\.css)$/,
        use: [
          'classnames-loader',
          'simple-universal-style-loader',
          'css-loader?modules=true&importLoaders=true',
          'postcss-loader',
          'sass-loader',
        ],
        exclude: /node_modules.*\.css$/,
      },
    ],
  },
};
