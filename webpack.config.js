'use strict';
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  mode: production ? 'production' : 'development',
  devtool: production ? undefined : 'source-map',
  entry: './src/entrypoint.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules|\.d\.ts$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&camelCase',
          'postcss-loader',
        ],
      },
      {
        test: /\.html$/,
        loaders: ['ignore-loader', 'file-loader?name=[name].[ext]'],
      },
      {
        test: /\.(?:png|gif)$/,
        loaders: ['url-loader', 'img-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // こうしないとなぜかReactがこわれる
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  performance: {
    //bye bye, FIXME...
    hints: false,
  },

  devServer: {
    contentBase: './dist',
    port: 8080,
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
