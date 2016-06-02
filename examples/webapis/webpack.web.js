var path = require('path');

var base = require('./webpack.base.js');

base.devtool = 'inline-source-map';

base.entry = {
  rocky: path.resolve(__dirname, './js/rocky/namespace.js'),
  app: path.resolve(__dirname, './js/tictoc.js')
};

base.externals.rocky = 'rocky';

base.module.loaders.unshift({
  test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
  loader: 'file'
});

module.exports = base;
