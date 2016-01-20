module.exports = function(grunt) {

    // location of our temporary working copy we use to build tags
    var tempCheckout = 'temp/checkout';

    // register a few promise related convenience functions
    var exec = require('./utils')(grunt).exec;

    var Q = require("q");
    var fs = require('fs');
    var simpleGit = require("simple-git");

    // rocky.js filename for a given version
    function rockyNameForTag(version) {
        return 'build/dist/rocky-' + version + '.js';
    }

    // true, if a versioned rocky file exists in the destination folder
    function versionedRockyExists(tag) {
        try {
            return fs.statSync(rockyNameForTag(tag)).isFile();
        } catch (err) {
            return false;
        }
    }

    // creates a promise that expresses all steps for a given tag
    function checkoutNpmBuildCopy(tag) {
        return simpleGit(tempCheckout).promising('checkout', tag)
        .then(function() {
            return exec('npm install', {cwd: tempCheckout});
        })
        .then(function() {
            return exec('grunt build', {cwd:tempCheckout});
        })
        .then(function() {
            var taggedPkg = grunt.file.readJSON(tempCheckout + '/package.json');
            var destName = rockyNameForTag(taggedPkg.version);
            if (versionedRockyExists(taggedPkg.version)) {
                grunt.log.warn("skipping file", destName, "Tag", tag, "seems to be named incorrectly.");
                return false;
            }
            return exec('cp ' + tempCheckout + '/' + destName + ' ' + destName);
        });
    }

    // actual grunt task
    var desc = 'Checks out and builds tags from remote repository and copies versioned output to ./build/dist';
    grunt.registerTask('build-missing-dists', desc, function() {
        var done = this.async();

        // delete temp folder
        exec( 'rm -rf ' + tempCheckout)
        // checkout Rocky.js repo into temp folder
        .then(function() {
            var url = grunt.file.readJSON('package.json').repository.url;
            grunt.verbose.writeln('cloning', url, 'into', tempCheckout);
            return simpleGit('.').promising("clone", url, tempCheckout);
        })
        // checkout gh-pages and copy all missing rocky-x.y.z.js from its dist folder to build/dist
        // we do this so that we will have gh-pages' dist folder + this working copy's rocky.js
        .then(function() {
            return simpleGit(tempCheckout).promising('checkout', 'gh-pages');
        })
        .then(function() {
            // copy all rocky.js files from gh-pages' dist into this working copy's build folder, but
            // preserve existing files in build/dist (presumably only the one we built from this working copy before)
            return exec('cp -n ' + tempCheckout + '/dist/*.js build/dist')
                   .catch(function(){return "this is fine since cp -n returns 1 if there was a file already."});
        })
        // retrieve all tags to continue with the actual copy
        .then(function() {
            return simpleGit(tempCheckout).fetchTags().promising('tags');
        })
        // filter tags: keep version tags we don't have a rocky-x.y.z.js for, yet
        .then(function(tags) {
                var foundTags = tags.all.filter(function(tag) {
                    return tag.match(/^v?\d\.\d\.\d$/);
                });
                grunt.verbose.writeln('found tags', foundTags);

                var relevantTags = foundTags.filter(function(tag) {
                    return !versionedRockyExists(tag);
                });
                grunt.log.writeln('relevant tags', relevantTags);
                return relevantTags;
        })
        // create a sequence of promises to build all relevant tags
        .then(function(relevantTags) {
            var tasks = relevantTags.map(function(tag) {
                return function(){return checkoutNpmBuildCopy(tag);};
            });
            return tasks.reduce(function(chain, t){
                return chain.then(t);
            }, Q(true));
        })
        // grunt logging of any error case
        .catch(function (error) {
            grunt.log.error(error);
            throw error;
        })
        // correctly terminate async grunt task
        .done(function(){done(true)}, function(){done(false)});
    });

};