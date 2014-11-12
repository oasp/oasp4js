module.exports = (function () {
    'use strict';
    var grunt = require('grunt'), $s = require('string'),
        paths = {
            tmp: ".tmp",
            dist: "dist",
            app: "app",
            test: "test"
        },
        modules = [
            'main',
            'oasp-security',
            'oasp-ui',
            'oasp-mock',
            'offer-mgmt',
            'sales-mgmt',
            'table-mgmt'
        ],
        builder = (function () {
            return {
                build: function (path, module) {
                    return $s(path)
                        .replaceAll('{module}', module)
                        .replaceAll('{app}', paths.app)
                        .replaceAll('{tmp}', paths.tmp)
                        .replaceAll('{test}', paths.test)
                        .replaceAll('{dest}', paths.dest).s;
                }
            };
        }());

    return {
        context: "oasp4j-example-application",
        paths: paths,
        //generating configuration for particular tasks
        less: {
            paths: function () {
                var lessPaths = {}, i, srcPath;
                for (i = 0; i < modules.length; i += 1) {
                    srcPath = builder.build('{app}/{module}/css/{module}.less', modules[i]);
                    if (grunt.file.exists(srcPath)) {
                        lessPaths[builder.build('{tmp}/{module}/css/{module}.css', modules[i])] = srcPath;
                    }
                }
                return lessPaths;
            }
        },
        html2js: {
            tasks: function () {
                var ngTempaltesPaths = {}, i, srcPath;
                for (i = 0; i < modules.length; i += 1) {
                    srcPath = builder.build('{app}/{module}/html/cached', modules[i]);
                    if (grunt.file.isDir(srcPath)) {
                        ngTempaltesPaths[modules[i]] = {
                            src: srcPath + '/**/*.html',
                            dest: builder.build('{tmp}/{module}/js/{module}.templates.js', modules[i])
                        };
                    }
                }
                return ngTempaltesPaths;
            }
        },
        sprite: {
            tasks: function () {
                var spriteConf = {}, i, srcPath;
                for (i = 0; i < modules.length; i += 1) {
                    srcPath = builder.build('{app}/{module}/img/sprite', modules[i]);
                    if (grunt.file.isDir(srcPath)) {
                        spriteConf[modules[i]] = {
                            src: srcPath + '/**/*.png',
                            destImg: builder.build('{tmp}/{module}/img/icons.png', modules[i]),
                            destCSS: builder.build('{tmp}/{module}/css/{module}-icons.css', modules[i]),
                            engine: 'pngsmith',
                            cssFormat: 'css'
                        };
                    }
                }
                return spriteConf;
            }
        },
        scripts: {
            sources: function () {
                var sourcesPatterns = [], i;
                sourcesPatterns.push(builder.build('{app}/app.module.js'));
                for (i = 0; i < modules.length; i += 1) {
                    sourcesPatterns.push(builder.build('{app}/{module}/js/**/*.module.js', modules[i]));
                    sourcesPatterns.push(builder.build('{app}/{module}/js/**/!(*spec|*mock).js', modules[i]));
                    sourcesPatterns.push(builder.build('{tmp}/{module}/js/**/*.js', modules[i]));
                }
                return sourcesPatterns;
            },
            testSources: function () {
                var sourcesPatterns = [], i;
                for (i = 0; i < modules.length; i += 1) {
                    sourcesPatterns.push(builder.build('{app}/{module}/js/**/*.mock.js', modules[i]));
                }
                for (i = 0; i < modules.length; i += 1) {
                    sourcesPatterns.push(builder.build('{app}/{module}/js/**/*.spec.js', modules[i]));
                }
                return sourcesPatterns;
            }
        }
    };
}());
