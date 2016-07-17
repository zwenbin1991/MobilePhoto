/**
 * @description webpack生产环境下配置文件
 * @author 曾文彬
 * @date 2016.7.12
 */

'use strict';

import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';

// 生产环境下，代码压缩、混淆，版本管理
webpackConfig.output.filename = 'bundle[hash].min.js';
webpackConfig.plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
];

export default webpackConfig;