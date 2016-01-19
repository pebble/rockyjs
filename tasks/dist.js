module.exports = function(grunt) {
    var Q = require("q");
    var simpleGit = require("simple-git");
    var fs = require('fs');
    var _exec = Q.nfbind(require('child_process').exec);

    var pkg = grunt.file.readJSON('package.json');
    var tempCheckout = 'temp/checkout';

    // promise wrapper around exec
    var exec = function() {
        grunt.verbose.writeln("exec:", arguments);
        return _exec.apply(undefined, arguments);
    };

    // rocky.js filename for a given version
    function rockyNameForTag(version) {
        return 'build/dist/rocky-' + version + '.js';
    }

    // true, if a versioned rocky file exists in the destination filder
    function versionedRockyExists(tag) {
        try {
            var filename = rockyNameForTag(tag);
            return fs.statSync(filename).isFile();
        } catch (err) {
            return false;
        }
    }

    // promise wrapper around simpleGit + logging
    function cloneAndReceiveRelevantTags(url, dir) {
        var deferred = Q.defer();
        grunt.log.write('cloning ' + url + ' into ' + dir + '...');
        simpleGit('.').clone(url, 'temp/checkout').tags(function(err, tags) {
            if (err) {
                deferred.reject(err);
                return;
            }
            grunt.log.ok("ok");

            var foundTags = tags.all.filter(function(tag) {
                return tag.match(/^v?\d\.\d\.\d$/);
            });
            grunt.log.writeln('found tags', foundTags);

            var relevantTags = foundTags.filter(function(tag) {
                return !versionedRockyExists(tag);
            });
            grunt.log.writeln('relevant tags', relevantTags);
            deferred.resolve(relevantTags);
        });
        return deferred.promise;
    }

    // promise wrapper around simpleGit
    function checkout(git, tag) {
        var deferred = Q.defer();
        git.checkout(tag, function(err) {
            if (err) deferred.reject(err); else deferred.resolve();
        });
        return deferred.promise;
    }

    function checkoutNpmBuildCopy(tag) {
        grunt.log.write("building and copying '" + tag + "'...");
        return checkout(simpleGit(tempCheckout), tag)
        .then(function() {
            return exec('npm install', {cwd: tempCheckout});
        })
        .then(function() {
            return exec('grunt build', {cwd:tempCheckout});
        })
        .then(function() {
            var taggedPkg = grunt.file.readJSON('package.json');
            var destName = rockyNameForTag(taggedPkg.version);
            if (versionedRockyExists(taggedPkg.version)) {
                grunt.log.warn("skipping file " + destName + ". Tag '" + tag + "' seems to be named incorrectly.");
                return false;
            }
            return exec('cp ' + tempCheckout + '/' + destName + ' ' + destName).then(function() {
                grunt.log.ok("ok");
            });
        });
    }

    // actual grunt task
    var desc = 'Checks out and builds tags from remote repository and copies versioned output to ./build/dist';
    grunt.registerTask('build-missing-dists', desc, function() {
        var done = this.async();
        exec( 'rm -rf temp')
        .then(function() {
            return cloneAndReceiveRelevantTags(pkg.repository.url, tempCheckout);
        })
        .then(function(relevantTags) {
            // this function returns a single promise that represents a chain of builds for the relevant tags
            var tasks = relevantTags.map(function(tag) {
                return function(){return checkoutNpmBuildCopy(tag);};
            });
            return tasks.reduce(function(chain, t){
                return chain.then(t);
            }, Q(true));
        })
        .catch(function (error) {
            grunt.log.error(error);
            throw error;
        })
        .done(function(){done(true)}, function(){done(false)});
    });

};