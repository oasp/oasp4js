module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        watch: {
            options: { livereload: true },
            less: {
                files: ['<%= config.paths.app %>/css/*.less'],
                tasks: ['less']
            },
            index: {
                files: ['<%= config.paths.app %>/index.html'],
                tasks: ['copy:develop']
            },
            cached: {
                files: ['<%= config.paths.app %>/html/**/cached/**/*.html'],
                tasks: ['html2js']
            }
        }
    });
};
