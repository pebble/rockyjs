module.exports = function(grunt) {

    var taskName = 'build-missing-dists';

    // location of our temporary working copy we use to build tags
    var tempCheckout = '.grunt/' + taskName;

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

    // checks for a valid version string to find tags and verify valid filed names, e.g. x.y.z, x.y.z-beta1
    function isValidRockyVersion(version) {
        return version.match(/^\d+\.\d+\.\d+$(-\n+)?/);
    }

    // creates a promise that expresses all steps for a given tag
    function checkoutNpmBuildCopy(tag) {
        return simpleGit(tempCheckout).promising('checkout', tag)
        .then(function() {
            return exec('npm install', {cwd: tempCheckout});
        })
        .then(function() {
            return exec('grunt build', {cwd: tempCheckout});
        })
        .then(function() {
            var taggedPkg = grunt.file.readJSON(tempCheckout + '/package.json');
            var taggedVersion = taggedPkg.version;
            var destName = rockyNameForTag(taggedVersion);
            if (!isValidRockyVersion(taggedVersion)) {
                grunt.log.warn("skipping file", destName, "Version", taggedVersion, "doesn't follow expected format.");
                return false;
            }
            if (versionedRockyExists(taggedVersion)) {
                grunt.log.warn("skipping file", destName, "File already exists.");
                return false;
            }
            // this command is trustworthy, we checked the format of destName by checking the version format
            return exec('cp ' + tempCheckout + '/' + destName + ' ' + destName);
        });
    }

    // actual grunt task
    var desc = 'Checks out and builds tags from remote repository and copies versioned output to ./build/dist';
    grunt.registerTask(taskName, desc, function() {
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
                    return isValidRockyVersion(tag);
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
            return tasks.reduce(Q.when, Q(true));
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