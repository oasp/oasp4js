module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: require('./config.json'),
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            develop: {
                options: {
                    open: true,
                    base: ['<%= config.tmp %>', '<%= config.app %>']
                }
            },
            dist: {
                options: {
                    open: true,
                    base: ['<%= config.dist %>']
                }
            }
        },
        less: {
            develop: {
                options: {
                    compress: false
                },
                files: {
                    '<%= config.tmp %>/css/oasp.css': '<%= config.app %>/css/oasp.less'
                }
            },
            dist: {
                options: {
                    compress: true
                },
                files: {
                    '<%= config.dist %>/css/oasp.css': '<%= config.app %>/css/oasp.less'
                }
            }
        },
        watch: {
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
        },
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
                            '<%= config.dist %>/{,*/}*', '<%= config.dist %>'
                        ]
                    }
                ]
            },
            develop: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= config.tmp %>/{,*/}*', '<%= config.tmp %>'
                        ]
                    }
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
                            js: ['concat', 'uglifyjs']
                        },
                        post: {}
                    }
                }
            }
        },
        html2js: {
            options: {
                module: 'oasp.templates',
                singleModule: true,
                rename: function (moduleName) {
                    return moduleName.replace('../app/', '').replace('cached/', '');
                }
            },
            main: {
                src: ['<%= config.app %>/html/**/cached/**/*.html'],
                dest: '<%= config.tmp %>/js/app-templates.js'
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
        jslint: {
            client: {
                src: [
                    '<%= config.app %>/js/**/*.js'
                ],
                exclude: [
                    '<%= config.app %>/js/**/*-test.js'
                ],
                directives: {
                    browser: true,
                    predef: [
                        'jQuery', 'angular', '$'
                    ]
                }
            },
            test: {
                src: [
                    '<%= config.app %>/js/**/*-test.js'
                ],
                directives: {
                    browser: true,
                    nomen: 'false',
                    predef: [
                        'jQuery', 'angular', '$', 'beforeEach', 'expect', 'it', 'describe', 'module', 'inject'
                    ]
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: false,
                browsers: [
                    'Chrome'
                ]
            },
            ci: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });
    grunt.registerTask('serve', [
        'build:develop',
        'connect:develop',
        'watch'
    ]);
    grunt.registerTask('serve:dist', [
        'build:dist',
        'connect:dist:keepalive'
    ]);
    grunt.registerTask('build:develop', [
        'clean:develop',
        'less:develop',
        'html2js',
        'wiredep',
        'copy:develop'
    ]);
    grunt.registerTask('build:dist', [
        'clean:dist',
        'less:dist',
        'html2js',
        'wiredep',
        'useminPrepare',
        'concat',
        'copy:dist',
        'uglify',
        'usemin'
    ]);
    grunt.registerTask('test', [
        'jslint',
        'karma:ci'
    ]);
    grunt.registerTask('default', [
        'jslint:client',
        'build:dist'
    ]);
};