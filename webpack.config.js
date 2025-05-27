const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProduction ? '/Project-Web-Intermediate/' : '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    port: 8087,
    open: true,
    proxy: {
      '/api': {
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false,
      },
    },
  },
  mode: isProduction ? 'production' : 'development',
};