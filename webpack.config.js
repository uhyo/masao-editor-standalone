"use strict";
const path = require('path');
const webpack = require('webpack');

module.exports={
    devtool: 'source-map',
    entry: './src/entrypoint.tsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules|\.d\.ts$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader?modules&camelCase', 'postcss-loader'],
            },
            {
                test: /\.json$/,
                loaders: ['json-loader'],
            },
            {
                test: /\.html$/,
                loaders: ['ignore-loader', 'file-loader?name=[name].[ext]'],
            },
        ]
    },
    plugins: [
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    performance: {
        //bye bye, FIXME...
        hints: false,
    },
    
    devServer: {
        contentBase: './dist',
        port: 8080,
    }
};
