const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProduction ? '/Project-Web-Intermediate/' : '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' },
        { from: 'icons', to: 'icons' },
      ],
    }),
    ...(isProduction ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })] : []),
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