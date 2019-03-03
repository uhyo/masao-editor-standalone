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
        use: ['style-loader', 'css-loader?modules&camelCase', 'postcss-loader'],
      },
      {
        test: /\.html$/,
        use: ['ignore-loader', 'file-loader?name=[name].[ext]'],
      },
      {
        test: /\.(?:png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
            },
          },
          'img-loader',
        ],
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
  /*
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  */
};
