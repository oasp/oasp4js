module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
            less: {
                options: {
                    paths: ['<%= config.paths.app %>']
                },
                all: {
                    files: {
                        '<%= config.paths.tmp %>/css/app.css': '<%= config.paths.tmp %>/css/app.less'
                    }
                }
            },
            concat: {
                less: {
                    src: grunt.config().config.tasks.less(),
                    dest: '<%= config.paths.tmp %>/css/app.less'
                }
            }}
    );
    grunt.registerTask('styles', [
        'concat:less', 'less'
    ]);
};
