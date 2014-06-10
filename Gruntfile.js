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
                    base: ['<%= config.dist %>']
                }
            }
        },
        less: {
            develop: {
                options: {
                    yuicompress: false
                },
                files: {
                    '<%= config.tmp %>/css/oasp.css': '<%= config.app %>/css/oasp.less'
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= config.dist %>/css/oasp.min.css': '<%= config.app %>/css/oasp.less'
                }
            }
        },
        watch: {
            less: {
                files: ['<%= config.app %>/css/*.less'],
                tasks: ['less']
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= config.dist %>/{,*/}*'
                        ]
                    }
                ]
            },
            develop: '<%= config.tmp %>/{,*/}*'
        }
    });
    grunt.registerTask('serve', [
        'build:develop', 'connect:develop', 'watch'
    ]);
    grunt.registerTask('build:develop', [
        'clean:develop', 'less:develop'
    ]);
    grunt.registerTask('build:dist', [
        'clean:dist', 'less:dist'
    ]);
};