module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        watch: {
            options: { livereload: true },
            less: {
                files: ['<%= config.paths.app %>/**/*.less'],
                tasks: ['less']
            },
            index: {
                files: ['<%= config.paths.app %>/index.html'],
                tasks: ['htmlbuild']
            },
            cached: {
                files: ['<%= config.paths.app %>/**/html/**/cached/**/*.html'],
                tasks: ['html2js']
            }
        }
    });
};
