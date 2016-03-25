// var webpack = require('webpack');
var path = require('path');

var PATHS = {
  js: path.resolve(__dirname, './js'),
  ext: path.resolve(__dirname, './ext'),
  nodeModules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
  devtool: 'inline-source-map',

  entry: [
    path.resolve(__dirname, './js/tictoc.js')
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },

  externals: {
    rocky: 'Rocky'
  },

  resolve: {
    // '' allows imports without an extension
    extensions: ['', '.js'],
    root: [
      PATHS.js,
      PATHS.ext
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
        include: [PATHS.js, PATHS.ext],
        exclude: [PATHS.nodeModules]
      }
    ]
  }
};
