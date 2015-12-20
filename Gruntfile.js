module.exports = function(grunt) {

    var glob = require('glob')

    grunt.initConfig({
        tintin_root: process.env.TINTIN_ROOT,
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            applib: {
                src: '<%= tintin_root %>/build/applib/applib-targets/emscripten/applib.js',
                dest: 'src/transpiled.js'
            }
        },
        concat: {
            rockyjs: {
                src: ['src/html-binding.js', 'src/functions-manual.js', 'src/functions-generated.js',
                      'src/transpiled.js'],
                dest: 'build/rocky.js'
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
                    process: true
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'examples',      // Src matches are relative to this path.
                        src: ['**/*.*'], // Actual pattern(s) to match.
                        dest: 'build/examples'   // Destination path prefix.
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-processhtml');

    var default_tasks = [];

    // only run uglify per default if transpiled applib exists at TINTIN_ROOT
    if (glob.sync(grunt.config('uglify').applib.src).length > 0) {
        default_tasks.push("newer:uglify:applib");
    } else {
        grunt.verbose.write("Cannot find transpiled applib at " + grunt.config('uglify').applib.src + " - skipping uglify")
    }

    default_tasks.push('concat:rockyjs', 'processhtml:examples');

    // Default task(s).
    grunt.registerTask('default', default_tasks);

};