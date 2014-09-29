module.exports = function (grunt) {
    'use strict';

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
            server: {
                proxies: [
                    {
                        context: '/<%= config.context %>/services',
                        host: 'localhost',
                        port: 8081,
                        https: false,
                        changeOrigin: true
                    },
                    {
                        context: '/<%= config.context %>',
                        host: 'localhost',
                        port: 9000,
                        https: false,
                        changeOrigin: true,
                        rewrite: {
                            '^/oasp4j-example-application': '/'
                        }
                    }
                ]
            },
            develop: {
                options: {
                    port: 9000,
                    open: {
                        target: 'http://localhost:9000/<%= config.context %>/'
                    },
                    base: ['<%= config.tmp %>', '<%= config.app %>'],
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var cacheClear = function (req, res, next) {
                            res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
                            res.setHeader('Pragma', 'no-cache');
                            res.setHeader('Cache-Control', 'no-store');
                            next();
                        }, middlewares = [cacheClear], directory = (options.directory || options.base[options.base.length - 1]);
                        // Serve static files.
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            },
            dist: {
                options: {
                    port: 9000,
                    open: {
                        target: 'http://localhost:9000/<%= config.context %>/'
                    },
                    base: ['<%= config.dist %>'],
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var middlewares = [], directory = options.directory || options.base[options.base.length - 1];
                        // Serve static files.
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));
                        return middlewares;
                    }
                }
            }
        },
        less: {
            all: {
                options: {
                    compress: false
                },
                files: {
                    '<%= config.tmp %>/css/oasp.css': '<%= config.app %>/css/oasp.less'
                }
            }
        },
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
                    '<%= config.app %>/js/**/*.spec.js'
                ],
                directives: {
                    browser: true,
                    predef: [
                        'jQuery', 'angular', '$', 'describe', 'beforeEach', 'module', 'afterEach', 'it', 'inject', 'spyOn', 'expect', 'jasmine'
                    ]
                }
            },
            test: {
                src: [
                    '<%= config.app %>/js/**/*.spec.js'
                ],
                directives: {
                    browser: true,
                    nomen: 'false',
                    predef: [
                        'jQuery', 'angular', '$', 'describe', 'beforeEach', 'module', 'afterEach', 'it', 'inject', 'spyOn', 'expect', 'jasmine'
                    ]
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: false,
                reporters: ['progress']
            },
            unit_chrome: {
                configFile: 'karma.conf.js',
                singleRun: false,
                browsers: [
                    'Chrome'
                ],
                reporters: ['progress']
            },
            ci: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['progress', 'coverage', 'junit']
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
        },
        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    dryRun: false,
                    sonar: {
                        host: {
                            url: 'http://localhost:9000/sonarqube'
                        },
                        jdbc: {
                            url: 'jdbc:mysql://localhost:3306/sonar',
                            username: 'sonar',
                            password: 'sonar'
                        },

                        projectKey: 'org.oasp.js:oasp4js:0.0.1',
                        projectName: 'oasp4js',
                        projectVersion: '0.0.1',
                        sources: ['app'].join(','),
                        exclusions: ['app/bower_components/**/*', '**/*.spec.js'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8',
                        'javascript.lcov.reportPath': 'test/coverage/PhantomJS 1.9.7 (Linux)/lcov.info'
                    }
                }
            }
        }
    });
    grunt.registerTask('serve', [
        'build:develop', 'configureProxies:server', 'connect:develop', 'watch'
    ]);
    grunt.registerTask('serve:dist', [
        'build:dist', 'configureProxies:server', 'connect:dist:keepalive'
    ]);
    grunt.registerTask('build:develop', [
        'clean:develop', 'sprite', 'less', 'html2js', 'wiredep', 'copy:develop'
    ]);
    grunt.registerTask('build:dist', [
        'clean:dist', 'sprite', 'less', 'html2js', 'wiredep', 'useminPrepare', 'concat', 'ngAnnotate', 'copy:dist', 'uglify', 'cssmin', 'filerev', 'usemin'
    ]);
    grunt.registerTask('build:ci', [
        'build:dist', 'karma:ci'
    ]);
    grunt.registerTask('test', [
        'jslint', 'karma:ci'
    ]);
    grunt.registerTask('test:tdd', [
        'karma:unit'
    ]);
    grunt.registerTask('test:tdd:debug', [
        'karma:unit_chrome'
    ]);
    grunt.registerTask('default', [
        'jslint:client', 'build:dist'
    ]);
};