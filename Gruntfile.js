module.exports = function(grunt) {

    var glob = require('glob');

    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');
    var githubBanner = grunt.template.process(grunt.file.read('html/misc/githubBanner.html'), {data: {pkg: pkg}});
    var deprecatedBanner = grunt.template.process(grunt.file.read('html/misc/deprecated.html'), {data: {pkg: pkg}});
    var isMasterBuildOnTravis = process.env.TRAVIS_BRANCH === 'master';
    var rockyjsLegacyPath = 'dist/rocky-0.3.0.js';

    grunt.initConfig({
        tintin_root: process.env.TINTIN_ROOT,
        pkg: pkg,
        rockyjs_path: isMasterBuildOnTravis ? "dist/rocky-dev.js" : "dist/rocky.js",
        license_banner: grunt.file.read('license-banner.txt') + '\n\n',
        uglify: {
            options: {
                banner: '<%=license_banner%>'
            },
            applib: {
                src: '<%= tintin_root %>/build/applib/applib-targets/emscripten/html/rocky.js',
                dest: 'src/transpiled.js'
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%=license_banner%>'
            },
            rockyjs: {
                src: ['src/html-binding.js', 'src/symbols-manual.js', 'src/symbols-generated.js',
                      'src/transpiled.js'],
                dest: 'build/<%= rockyjs_path %>'
            }
        },
        newer: {
            options: {
                cache: '.cache'
            }
        },
        processhtml: {
            examples:{
                options: {
                    process: true,
                    data: {
                        rockyjs_path: "<%=rockyjs_path%>",
                        rockyjs_legacy_path: rockyjsLegacyPath,
                        github_banner: githubBanner,
                        deprecated_banner: deprecatedBanner
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'examples-legacy',
                        src: ['**/*.*', '!**/*.md'],
                        dest: 'build/examples-legacy'
                    },
                    {
                        expand: true,
                        cwd: 'simple',
                        src: ['**/*.*'],
                        dest: 'build/simple'
                    },
                    {
                        expand: true,
                        cwd: 'playground',
                        src: ['**/*.*'],
                        dest: 'build/playground'
                    },
                    {
                        expand: true,
                        cwd: 'html',
                        src: ['css/*'],
                        dest: 'build'
                    },
                    {
                        expand: true,
                        cwd: 'build/docs-legacy',
                        src: ['**/*.*'],
                        dest: 'build/docs-legacy'
                    },
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['index.html'],
                        dest: 'build/'
                    }
                ]
            }
        },
        md2html: {
            all: {
                files: [
                    {
                        expand: true,
                        src: ['examples-legacy/*.md', 'docs-legacy/*.md', '*.md'],
                        dest: 'build',
                        ext: '.html',
                        rename: function(dir, file) {
                            // readme.html -> index.html
                            return dir + "/" + file.replace(/(\breadme)\.html$/, "/index.html")
                        }
                    }
                ],
                options: {
                    basePath: 'build',
                    layout: 'html/markdown/template.html',
                    templateData: {
                        pkg: pkg,
                        github_banner: githubBanner,
                        deprecated_banner: deprecatedBanner,
                        rockyjs_path: "<%=rockyjs_path%>"
                    }
                }
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'html',
                        src: ['img/*'],
                        dest: 'build'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/ace-builds/src-min-noconflict',
                        src: ['**/*.*'],
                        dest: 'build/playground/js/ace'
                    },

                ]
            }
        },
        eslint: {
            src: ['src/**/*.js', '!src/transpiled.js', 'examples-legacy/**/*.js', '!examples-legacy/interactive/js/TangleKit/**/*.js'],
            options: {
                format: 'unix'
            },
            test: ['test/**/*.js']
        },
        mochaTest: {
            all: {
                src: ['test/**/*.js']
            }
        },
        'gh-pages': {
            options: {
                base: 'build'
            },
            publish: {
                src: ['**']
            },
            'publish-ci': {
                options: {
                    user: {
                        name: 'travis',
                        email: 'travis@pebble.com'
                    },
                    repo: 'https://' + process.env.GH_TOKEN + '@github.com/pebble/rockyjs.git',
                    message: 'publish gh-pages (auto)' + getDeployMessage(),
                    silent: true // don't leak the token
                },
                src: ['**/*']
            }
        },
        modify_json: {
            options: {
                fields: {
                    main: 'build/<%=rockyjs_path%>'
                },
                indent: 4
            },
            files: ['package.json']
        }
    });

    // see http://bartvds.github.io/demo-travis-gh-pages/
    function getDeployMessage() {
        var ret = '\n\n';
        if (process.env.TRAVIS !== 'true') {
            ret += 'missing env vars for travis-ci';
            return ret;
        }
        ret += 'branch:       ' + process.env.TRAVIS_BRANCH + '\n';
        ret += 'SHA:          ' + process.env.TRAVIS_COMMIT + '\n';
        ret += 'range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
        ret += 'build id:     ' + process.env.TRAVIS_BUILD_ID  + '\n';
        ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
        return ret;
    }

    grunt.registerTask('publish-ci', function() {
        // need this
        this.requires(['pre-publish']);

        // only deploy under these conditions
        if (process.env.TRAVIS === 'true' &&
            process.env.TRAVIS_BRANCH === 'master' &&
            process.env.TRAVIS_SECURE_ENV_VARS === 'true'
            && process.env.TRAVIS_PULL_REQUEST === 'false') {
            grunt.log.writeln('executing deployment');
            // queue deploy
            grunt.task.run('gh-pages:publish-ci');
        }
        else {
            grunt.log.writeln('skipped deployment');
            grunt.log.writeln('TRAVIS', process.env.TRAVIS_SECURE_ENV_VARS);
            grunt.log.writeln('TRAVIS_BRANCH', process.env.TRAVIS_BRANCH);
            grunt.log.writeln('TRAVIS_SECURE_ENV_VARS', process.env.TRAVIS_SECURE_ENV_VARS);
            grunt.log.writeln('TRAVIS_PULL_REQUEST', process.env.TRAVIS_PULL_REQUEST);
        }
    });

    require('./tasks/dist')(grunt);

    var build_tasks = ['eslint:src'];

    // only run uglify per default if transpiled applib exists at TINTIN_ROOT
    if (glob.sync(grunt.config('uglify').applib.src).length > 0) {
        build_tasks.push("newer:uglify:applib");
    } else {
        grunt.verbose.write("Cannot find transpiled applib at " + grunt.config('uglify').applib.src + " - skipping uglify")
    }

    build_tasks.push('concat:rockyjs', 'md2html', 'processhtml:examples', 'copy', 'modify_json');

    grunt.registerTask('pre-publish', 'should not be called directly', ['build', 'build-missing-dists']);

    grunt.registerTask('build', build_tasks);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('test', ['build', 'eslint:test', 'mochaTest']);
    grunt.registerTask('publish', ['pre-publish', 'gh-pages:publish']);
};
