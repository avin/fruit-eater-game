var path = require('path');
var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');

module.exports = {
    context: path.resolve('src'),
    entry: {
        app: './app.es6',

    },
    output: {
        path: path.resolve('public/js'),
        filename: "[name].js"
    },
    plugins: [commonsPlugin],

    module: {
        loaders: [
            {
                test: [/\.es6$/],
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    //watchOptions: {
    //    poll: 1000,
    //    aggregateTimeout: 1000
    //},

    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        alias: {
            'pixi.js': 'pixi.js/bin/pixi.js'
        },
        modulesDirectories: [
            'node_modules',
            'web_modules'
        ]
    }
};
