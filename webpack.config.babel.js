/**
 * @description webpack基础配置文件
 * @author 曾文彬
 * @date 2016.7.12
 */

'use strict';

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: [
        './src/app.js'
    ],

    output: {
        path: 'assets',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.css/i,
                loader: 'style!css'
            }, {
                test: /\.(png|jpg|jpeg)/i,
                loader: 'url-loader?limit=8192'
            }, {
                test: /\.js$/i,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                },
                exclude: /node_modules/
            }, {
                test: /\.html/i,
                loader: 'raw',
                exclude: /node_modules/
            }, {
                test: /\.ejs/i,
                loader: 'ejs-compiled?htmlmin',
            }, {
                test: /\.handlebars/i,
                loader: 'handlebars'
            }
        ]
    },

    'ejs-compiled-loader': {
        htmlmin: true,
        htmlminOptions: {
            removeComments: true
        }
    },

    resolve: {
        alias: {
            css: path.join(__dirname, 'src', 'css'),
            components: path.join(__dirname, 'src', 'js', 'components'),
            modules: path.join(__dirname, 'src', 'js', 'modules'),
            lib: path.join(__dirname, 'src', 'js', 'lib')
        },
        extensions: ['', '.js', '.css', '.html']
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: '移动端web相册',
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),

        new webpack.ProvidePlugin({
            _: 'underscore'
        })
    ]
};