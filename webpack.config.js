"use strict";
const path = require('path');
const webpack = require('webpack');

// production用の設定がある
const plugins = 
    process.env.NODE_ENV === 'production' ?
    [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),
    ] :
    [];

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
    plugins,
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
    }
};
