module.exports = function (grunt) {
    'use strict';
    var _ = require('lodash');
    grunt.mergeConfig({
        clean: {
            dist: [
                '<%= config.paths.dist %>',
                '<%= config.paths.tmp %>'
            ],
            develop: [
                '<%= config.paths.tmp %>'
            ]
        },
        less: {
            all: {
                files: grunt.config().config.less.paths()
            }
        },
        html2js: _.merge(
            grunt.config().config.html2js.tasks(),
            {
                options: {
                    module: function (path, taskName) {
                        return 'app.' + taskName + '.templates';
                    },
                    singleModule: true,
                    rename: function (moduleName) {
                        return moduleName.replace('../app/', '').replace('cached/', '');
                    }
                }
            }
        ),
        sprite: grunt.config().config.sprite.tasks(),
        copy: {
            develop: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.tmp %>',
                        src: ['index.html']
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['index.html']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>/html',
                        dest: '<%= config.paths.dist %>/html',
                        src: ['**', '!**/cached/**']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>/img',
                        dest: '<%= config.paths.dist %>/img',
                        src: ['*.png']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>/i18n',
                        dest: '<%= config.paths.dist %>/i18n',
                        src: ['*.json']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>/bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= config.paths.dist %>'
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
        wiredep: {
            develop: {
                src: ['<%= config.paths.app %>/index.html'],
                ignorePath: new RegExp('^<%= config.paths.app %>/')
            }
        },
        useminPrepare: {
            html: '<%= config.paths.app %>/index.html',
            options: {
                dest: '<%= config.paths.dist %>',
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
        },
        ngAnnotate: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.paths.tmp %>/concat/js',
                        src: 'sample-app.js',
                        dest: '<%= config.paths.tmp %>/concat/js'
                    }
                ]
            }
        }
    });
    grunt.registerTask('build:develop', [
        'clean:develop', 'sprite', 'less', 'html2js', 'wiredep', 'copy:develop'
    ]);
    grunt.registerTask('build:dist', [
        'clean:dist', 'sprite', 'less', 'html2js', 'wiredep', 'useminPrepare', 'concat', 'ngAnnotate', 'copy:dist', 'uglify', 'cssmin', 'filerev', 'usemin'
    ]);
    grunt.registerTask('build:ci', [
        'build:dist', 'karma:ci'
    ]);
};
