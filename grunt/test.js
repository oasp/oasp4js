module.exports = function (grunt) {
    'use strict';
    var jsLintPredef = [
        'jQuery', 'angular', '$', 'describe', 'beforeEach', 'module', 'afterEach', 'it', 'inject', 'spyOn', 'expect', 'jasmine'
    ];
    grunt.mergeConfig({
        clean: {
            test: [
                '<%= config.paths.tmp %>',
                '<%= config.paths.test %>'
            ]
        },
        jslint: {
            client: {
                src: grunt.config().config.tasks.karma.sources(),
                directives: {
                    browser: true,
                    todo: true,
                    predef: jsLintPredef
                },
                exclude: [
                    '<%= config.paths.tmp %>/**/*.js'
                ]
            },
            test: {
                src: grunt.config().config.tasks.karma.testSources(),
                directives: {
                    browser: true,
                    nomen: 'false',
                    todo: true,
                    predef: jsLintPredef
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
        'jslint', 'html:all', 'html2js', 'karma:ci'
    ]);
    grunt.registerTask('test:tdd', [
        'html:all', 'html2js', 'karma:unit'
    ]);
    grunt.registerTask('test:tdd:debug', [
        'html:all', 'html2js', 'karma:unit_chrome'
    ]);
};