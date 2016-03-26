// var webpack = require('webpack');
var path = require('path');

var PATHS = {
  js: path.resolve(__dirname, './js'),
  vendor: path.resolve(__dirname, './js/vendor'),
  nodeModules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
  devtool: 'inline-source-map',

  entry: {
    rocky: path.resolve(__dirname, './js/rocky/index.js'),
    app: path.resolve(__dirname, './js/tictoc.js')
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  externals: {
    rocky: 'Rocky'
  },

  resolve: {
    // '' allows imports without an extension
    extensions: ['', '.js'],
    root: [
      PATHS.js,
      PATHS.vendor
    ]
  },

  module: {
    loaders: [
      {
        test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'file'
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [PATHS.js, PATHS.vendor],
        exclude: [PATHS.nodeModules]
      }
    ]
  }
};
