module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        watch: {
            options: { livereload: true },
            less: {
                files: ['<%= config.paths.app %>/**/*.less'],
                tasks: ['styles']
            },
            html: {
                files: ['<%= config.paths.app %>/**/*.html'],
                tasks: ['html']
            },
            cached: {
                files: ['<%= config.paths.app %>/**/html/**/cached/**/*.html'],
                tasks: ['html2js']
            }
        }
    });
};
