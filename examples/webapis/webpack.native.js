var path = require('path');

var base = require('./webpack.base.js');

base.entry = {
  'rocky-js-app': path.resolve(__dirname, './js/tictoc.js')
};

base.resolve.alias['rocky$'] = path.resolve(__dirname, './js/rocky/index');

module.exports = base;
