module.exports = function(grunt) {

  var glob = require('glob');

  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');
  var githubBanner = grunt.template.process(grunt.file.read('html/misc/githubBanner.html'), {data: {pkg: pkg}});
  var isMasterBuildOnTravis = process.env.TRAVIS_BRANCH === 'master';

  grunt.initConfig({
    tintin_root: process.env.TINTIN_ROOT,
    pkg: pkg,
    rockyjs_path: isMasterBuildOnTravis ? "dist/rocky-dev.js" : "dist/rocky.js",
    license_banner: "/* Copyright © 2015-2016 Pebble Technology Corp., All Rights Reserved. <%=pkg.license%> */\n\n",
    uglify: {
      options: {
        banner: '<%=license_banner%>'
      },
      applib: {
        src: '<%= tintin_root %>/build/applib/applib-targets/emscripten/applib.js',
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
          data: {rockyjs_path: "<%=rockyjs_path%>", github_banner: githubBanner}
        },
        files: [
          {
            expand: true,
            cwd: 'examples',
            src: ['**/*.*', '!**/*.md'],
            dest: 'build/examples'
          },
          {
            expand: true,
            cwd: 'html',
            src: ['css/*'],
            dest: 'build'

          }
        ]
      }
    },
    md2html: {
      all: {
        files: [
          {
            expand: true,
            src: ['examples/*.md', 'docs/*.md', '*.md'],
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
          }
        ]
      }
    },
    eslint: {
      src: [
        'src/**/*.js',
        '!src/transpiled.js',
        'examples/**/*.js',
        '!examples/interactive/js/TangleKit/**/*.js',
        '!examples/*/build/**/*.js',
        '!examples/*/node_modules/**/*.js'
      ],
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
    ret += 'branch:    ' + process.env.TRAVIS_BRANCH + '\n';
    ret += 'SHA:     ' + process.env.TRAVIS_COMMIT + '\n';
    ret += 'range SHA:  ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
    ret += 'build id:   ' + process.env.TRAVIS_BUILD_ID + '\n';
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

  build_tasks.push('concat:rockyjs', 'processhtml:examples', 'md2html', 'copy', 'modify_json');

  grunt.registerTask('pre-publish', 'should not be called directly', ['build', 'build-missing-dists']);

  grunt.registerTask('build', build_tasks);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['build', 'eslint:test', 'mochaTest']);
  grunt.registerTask('publish', ['pre-publish', 'gh-pages:publish']);
};
