module.exports = function (grunt) {
    'use strict';
    var _ = require('lodash');
    grunt.mergeConfig({
        less: {
            all: {
                options: {
                    compress: false
                },
                files: grunt.config().config.less.paths()
            }
        },
        html2js: _.merge(
            grunt.config().config.html2js.paths(),
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
        copy: {
            develop: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.tmp %>',
                        src: ['index.html']
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: ['index.html']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/html',
                        dest: '<%= config.dist %>/html',
                        src: ['**', '!**/cached/**']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/img',
                        dest: '<%= config.dist %>/img',
                        src: ['*.png']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/i18n',
                        dest: '<%= config.dist %>/i18n',
                        src: ['*.json']
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= config.dist %>'
                    }
                ]
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= config.dist %>/{,*/}*', '<%= config.dist %>', '<%= config.test %>/{,*/}*', '<%= config.test %>'
                        ]
                    }
                ]
            },
            develop: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= config.tmp %>/{,*/}*', '<%= config.tmp %>', '<%= config.test %>/{,*/}*', '<%= config.test %>'
                        ]
                    }
                ]
            }
        },
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/js/{,*/}*.js',
                    '<%= config.dist %>/css/{,*/}*.css',
                    '<%= config.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.dist %>/fonts/*'
                ]
            }
        },
        wiredep: {
            develop: {
                src: ['<%= config.app %>/index.html'],
                ignorePath: new RegExp('^<%= config.app %>/')
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.dist %>',
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
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/img']
            }
        },
        sprite: {
            all: {
                src: '<%= config.app %>/img/*.png',
                destImg: '<%= config.tmp %>/img/images.png',
                destCSS: '<%= config.tmp %>/css/images.less',
                engine: 'pngsmith',
                cssFormat: 'css'
            }
        },
        ngAnnotate: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/concat/js',
                        src: 'sample-app.js',
                        dest: '<%= config.tmp %>/concat/js'
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
