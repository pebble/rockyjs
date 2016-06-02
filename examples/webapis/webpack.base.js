var path = require('path');

var PATHS = {
  js: path.resolve(__dirname, './js'),
  vendor: path.resolve(__dirname, './js/vendor'),
  nodeModules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  externals: {
    'rocky-namespace': 'Rocky'
  },

  alias: {},

  resolve: {
    // '' allows imports without an extension
    extensions: ['', '.js'],
    root: [
      PATHS.vendor
    ],
    alias: {}
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [PATHS.js, PATHS.vendor],
        exclude: [PATHS.nodeModules]
      }
    ]
  }
};
