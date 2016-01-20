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
        var logMessage = ("git " + fnName + " " + Array.prototype.slice.call(arguments, 1).join()).trim() + "...";
        grunt.log.write(logMessage);
        var deferred = Q.defer();
        var args = Array.prototype.slice.call(arguments, 1);
        args.push(function(err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        this[fnName].apply(this, args);
        return deferred.promise.thenLogOk();
    };
    git.prototype.fetchTags = function (then) {
        return this._run(['fetch', '--tags'], function (err, data) {
            then && then(err, !err && this._parseFetch(data));
        });
    };

    // promise wrapper around exec + logging
    var _exec = Q.nfbind(require('child_process').exec);
    var exec = function(cmd, options) {
        grunt.log.write("exec:", cmd, options ? options : {}, "...");
        return _exec.apply(undefined, arguments).thenLogOk();
    };

    return {
        exec: exec
    };
};