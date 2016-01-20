module.exports = function(grunt) {

    var Q = require("q");
    // add a few grunt-specific convenience functions to Promise
    (function() {
        var thenLogWithFunc = function (func) {
            return function () {
                var logArgs = arguments;
                return this.then(function () {
                    func.apply(undefined, logArgs);
                    return arguments.length > 0 ? arguments[0] : undefined;
                });
            };
        };
        Q.makePromise.prototype.thenLog = thenLogWithFunc(grunt.log.writeln);
        Q.makePromise.prototype.thenLogOk = thenLogWithFunc(function(){grunt.log.ok("OK")});
        Q.makePromise.prototype.thenLogVerbose = thenLogWithFunc(grunt.verbose.writeln);
    })();

    // add support for promises to simpleGit
    // use it by calling git.promising('checkout', '0.1.0')
    var git = require('simple-git/src/git');
    git.prototype.promising = function(fnName) {
        var arguments = Array.prototype.slice.call(arguments, 1);
        grunt.log.write("git", fnName, arguments.join(), "...");
        return Q.nfapply(this[fnName].bind(this), arguments).thenLogOk();
    };
    git.prototype.fetchTags = function (then) {
        return this._run(['fetch', '--tags'], function (err, data) {
            then && then(err, !err && this._parseFetch(data));
        });
    };

    // promise wrapper around exec + logging
    var _exec = Q.nfbind(require('child_process').exec);
    var exec = function(cmd, options) {
        grunt.log.write("exec:", cmd, options ||  {}, "...");
        return _exec.apply(undefined, arguments).thenLogOk();
    };

    return {
        exec: exec
    };
};
