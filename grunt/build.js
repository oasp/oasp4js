module.exports = function (grunt) {
    'use strict';
    var _ = require('lodash');
    require('./build/styles.js')(grunt);
    require('./build/html.js')(grunt);
    require('./build/html2js.js')(grunt);
    require('./build/sprite.js')(grunt);
    grunt.mergeConfig({
        clean: {
            options: { force: true },
            dist: [
                '<%= config.paths.dist %>/{,*/}*',
                '<%= config.paths.dist %>',
                '<%= config.paths.tmp %>/{,*/}*',
                '<%= config.paths.tmp %>'
            ],
            develop: [
                '<%= config.paths.tmp %>/{,*/}*',
                '<%= config.paths.tmp %>'
            ]
        },
        wiredep: {
            develop: {
                src: ['<%= config.paths.app %>/index.html'],
                ignorePath: new RegExp('^<%= config.paths.app %>/')
            }
        },
        eol: {
            dist: {
                options: {
                    eol: 'crlf',
                    replace: true
                },
                files: {
                    src: [
                        '<%= config.paths.dist %>/**/*.html'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['index.html']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>/bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= config.paths.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>',
                        dest: '<%= config.paths.dist %>/img',
                        flatten: true,
                        src: ['**/img/**/*-icons.png']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['**/html/**/*.html', '!**/cached/**']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: _.union(grunt.config().config.tasks.img(),['!**/sprite/**'])
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: grunt.config().config.tasks.i18n()
                    }
                ]
            }
        },
        filerev: {
            dist: {
                src: [
                    '<%= config.paths.dist %>/js/{,*/}*.js',
                    '<%= config.paths.dist %>/css/{,*/}*.css',
                    '<%= config.paths.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.paths.dist %>/fonts/*'
                ]
            }
        },
        ngAnnotate: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>/concat/js',
                        src: 'app.js',
                        dest: '<%= config.paths.tmp %>/concat/js'
                    }
                ]
            }
        },
        useminPrepare: {
            html: '<%= config.paths.tmp %>/index.html',
            options: {
                dest: '<%= config.paths.dist %>',
                root: ['<%= config.paths.tmp %>', '<%= config.paths.app %>'],
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= config.paths.dist %>/{,*/}*.html'],
            css: ['<%= config.paths.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= config.paths.dist %>', '<%= config.paths.dist %>/img']
            }
        }
    });

    grunt.registerTask('build:process', [
        'wiredep', 'sprite', 'styles', 'html:all', 'html2js', 'html:index'
    ]);

    grunt.registerTask('build:develop', [
        'clean:develop', 'build:process'
    ]);

    grunt.registerTask('build:dist', [
        'clean:dist', 'build:process', 'useminPrepare', 'concat:generated', 'ngAnnotate', 'copy:dist', 'eol', 'uglify', 'cssmin', 'filerev', 'usemin'
    ]);
    grunt.registerTask('build:ci', [
        'build:dist', 'karma:ci'
    ]);
};
