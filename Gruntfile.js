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
                dest: 'build/js/rocky.js'
            }
        },
        newer: {
            options: {
                cache: '.cache'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-concat');

    var default_tasks = [];

    // only run uglify per default if transpiled applib exists at TINTIN_ROOT
    if (glob.sync(grunt.config('uglify').applib.src).length > 0) {
        default_tasks.push("newer:uglify:applib");
    } else {
        grunt.verbose.write("Cannot find transpiled applib at " + grunt.config('uglify').applib.src + " - skipping uglify")
    }

    default_tasks.push('concat:rockyjs');

    // Default task(s).
    grunt.registerTask('default', default_tasks);

};