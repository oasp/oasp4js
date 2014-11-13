module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
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

                        projectKey: 'io.oasp:oasp4js:0.0.1',
                        projectName: 'oasp4js',
                        projectVersion: '0.0.1',
                        sources: ['app'].join(','),
                        exclusions: ['app/bower_components/**/*', '**/*.spec.js', '**/*.mock.js'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8',
                        'javascript.lcov.reportPath': 'test/coverage/lcov.info'
                    }
                }
            }
        }
    });
};