const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',

  entry: './src/index.js',

  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: 'gsap-tools.js'
  },

  externals: {
    react: 'react',
  },

  resolve: {
    modules: [
      './src',
      './src/app',
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /(\.scss|\.css)$/,
        use: [
          'classnames-loader',
          MiniCssExtractPlugin.loader,
          'css-loader?modules=1&importLoaders=1',
          'sass-loader',
        ],
        exclude: /node_modules.*\.css$/,
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      path: path.resolve(__dirname, 'dist'),
      filename: "gsap-tools.css",
      chunkFilename: "[id].css"
    })
  ],
};