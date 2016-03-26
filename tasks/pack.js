var path = require('path');
var Q = require('q');

module.exports = function(grunt) {
  var exec = require('./utils')(grunt).exec;

  grunt.registerMultiTask('pack', 'Packs an example using webpack', function() {
    var done = this.async();
    var configs = grunt.file.expand(this.filesSrc);

    var tasks = configs.map(function(config) {
      return function() {
        var example = path.dirname(config);
        grunt.log.writeln('Packing: ' + example);
        return exec('npm install', { cwd: example })
          .then(function() {
            grunt.log.writeln('Building: ' + example);
            return exec('npm run build', { cwd: example });
          });
      };
    });

    tasks
      .reduce(Q.when, Q(true))
      .done(function() {
        done(true);
      }, function(error) {
        grunt.log.error(error);
        done(false);
      });
  });
};
