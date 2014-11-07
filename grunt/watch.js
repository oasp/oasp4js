module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        watch: {
            options: { livereload: true },
            less: {
                files: ['<%= config.app %>/css/*.less'],
                tasks: ['less']
            },
            index: {
                files: ['<%= config.app %>/index.html'],
                tasks: ['copy:develop']
            },
            cached: {
                files: ['<%= config.app %>/html/**/cached/**/*.html'],
                tasks: ['html2js']
            }
        }
    });
};
