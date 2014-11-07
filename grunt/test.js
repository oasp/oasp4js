module.exports = function (grunt) {
    'use strict';

    grunt.mergeConfig({
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
        }
    });

    grunt.registerTask('test', [
        'jslint', 'karma:ci'
    ]);
    grunt.registerTask('test:tdd', [
        'karma:unit'
    ]);
    grunt.registerTask('test:tdd:debug', [
        'karma:unit_chrome'
    ]);
};