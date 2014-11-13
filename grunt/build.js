module.exports = function (grunt) {
    'use strict';
    var _ = require('lodash');
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
        processhtml: {
            options: {
                commentMarker: 'process',
                customBlockTypes: ['grunt/processhtml/scripts.js', 'grunt/processhtml/styles.js'],
                scriptsFiles: [
                    {
                        cwd: '<%= config.paths.app %>',
                        files: grunt.config().config.scripts.htmlScriptSources()
                    },
                    {
                        cwd: '<%= config.paths.tmp %>',
                        files: grunt.config().config.scripts.htmlTmpScriptSources()
                    }
                ],
                stylesFiles: [
                    {
                        cwd: '<%= config.paths.tmp %>',
                        files: grunt.config().config.styles.htmlStylesSources()
                    }
                ]
            },
            dist: {
                files: {
                    '<%= config.paths.tmp %>/index.html': ['<%= config.paths.app %>/index.html']
                }
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
                    //TODO TB optimize it on base of modules
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['**/html/**/*.html', '!**/cached/**']
                    },
                    //TODO TB optimize it on base of modules
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['**/img/**', '!**/sprite/**']
                    },
                    //TODO TB optimize it on base of modules
                    {
                        expand: true,
                        cwd: '<%= config.paths.app %>',
                        dest: '<%= config.paths.dist %>',
                        src: ['**/i18n/**.json']
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
    grunt.registerTask('build:develop', [
        'clean:develop', 'sprite', 'less', 'html2js', 'wiredep', 'processhtml'
    ]);

    grunt.registerTask('build:dist', [
        'clean:dist', 'sprite', 'less', 'html2js', 'wiredep', 'processhtml', 'useminPrepare', 'concat', 'ngAnnotate', 'copy:dist', 'eol', 'uglify', 'cssmin', 'filerev', 'usemin'
    ]);
    grunt.registerTask('build:ci', [
        'build:dist', 'karma:ci'
    ]);
};
