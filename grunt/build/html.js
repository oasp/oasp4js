module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        processhtml: {
            options: {
                commentMarker: 'process',
                recursive: true,
                customBlockTypes: ['grunt/processhtml/scripts.js', 'grunt/processhtml/styles.js'],
                includeBase: '<%= config.paths.app %>',
                scriptsFiles: [
                    grunt.config().config.tasks.html.scriptSources(),
                    grunt.config().config.tasks.html.generatedScriptSources()
                ],
                stylesFiles: [
                    {
                        cwd: '<%= config.paths.tmp %>',
                        files: '**/*.css'
                    }
                ]
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>/',
                        src: grunt.config().config.tasks.html.sources(),
                        dest: '<%= config.paths.tmp %>/'
                    }
                ]
            },
            index: {
                files: {
                    '<%= config.paths.tmp %>/index.html': ['<%= config.paths.app %>/index.html']
                }
            }
        }
    });
    grunt.registerTask('html', [
        'processhtml'
    ]);
    grunt.registerTask('html:index', [
        'processhtml:index'
    ]);
    grunt.registerTask('html:all', [
        'processhtml:all'
    ]);
};
