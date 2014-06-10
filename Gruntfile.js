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
        // Empties folders to start fresh
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

        // Performs rewrites based on filerev and the useminPrepare configuration
        // TODO explain it
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/img']
            }
        }
    });
    grunt.registerTask('serve', [
        'build:develop', 'connect:develop', 'watch'
    ]);
    grunt.registerTask('serve:dist', [
        'build:dist', 'connect:dist:keepalive'
    ]);
    grunt.registerTask('build:develop', [
        'clean:develop', 'less:develop', 'wiredep', 'copy:develop', ]);

    grunt.registerTask('build:dist', [
        'clean:dist', 'less:dist', 'wiredep', 'useminPrepare', 'concat', 'copy:dist', 'uglify', 'usemin'
    ]);
};