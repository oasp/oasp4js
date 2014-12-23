module.exports = (function () {
    'use strict';
    var $s = require('string'), _ = require('lodash'), externalConfig = require('../config.json'),
        paths = externalConfig.paths,
        modules = externalConfig.modules,
        builder = (function () {
            return {
                build: function (path, module) {
                    return $s(path)
                        .replaceAll('{module}', module)
                        .replaceAll('{app}', paths.app)
                        .replaceAll('{tmp}', paths.tmp)
                        .replaceAll('{test}', paths.test)
                        .replaceAll('{dist}', paths.dist).s;
                },
                buildForModules: function (patterns) {
                    var i, j, result = [];
                    for (i = 0; i < modules.length; i += 1) {
                        for (j = 0; j < arguments.length; j += 1) {
                            result.push(builder.build(arguments[j], modules[i]));
                        }
                    }
                    return result;
                },
                visitModules: function (factoryFn) {
                    var i, result = [], item;
                    for (i = 0; i < modules.length; i += 1) {
                        item = factoryFn(modules[i]);
                        if (item) {
                            result.push(item);
                        }
                    }
                    return result;
                }
            };
        }());
    return {
        context: externalConfig.proxyContext,
        proxy: externalConfig.proxy + externalConfig.proxyContext,
        app: {
            src: function () {
                return builder.build('{app}');
            },
            tmp: function () {
                return builder.build('{tmp}');
            },
            test: function () {
                return builder.build('{test}');
            },
            dist: function () {
                return builder.build('{dist}');
            }
        },
        js: {
            src: function () {
                return _.flatten([
                    [
                        builder.build('{app}/*.module.js')
                    ],
                    builder.buildForModules(
                        '{app}/{module}/js/**/**.module.js',
                        '{app}/{module}/js/**/!(*spec|*mock).js',
                        '{tmp}/{module}/js/**/*.js'
                    )
                ]);
            },
            testSrc: function () {
                return _.flatten([
                    builder.buildForModules(
                        '{app}/{module}/js/**/*.mock.js'
                    ),
                    builder.buildForModules(
                        '{app}/{module}/js/**/*.spec.js'
                    )
                ]);
            },
            lintSrc: function () {
                return _.flatten([
                    [
                        builder.build('{app}/*.module.js')
                    ],
                    builder.buildForModules(
                        '{app}/{module}/js/**/**.js'
                    )
                ]);
            }
        },
        index: {
            src: function () {
                return builder.build('{app}/index.html');
            }
        },
        css: {
            src: function () {
                return builder.buildForModules(
                    '{app}/{module}/css/{module}.less'
                );
            },
            includePaths: function () {
                return builder.build('{app}');
            },
            dest: {
                file: function () {
                    return builder.build('css/oasp.css');
                },
                path: function () {
                    return builder.build('{tmp}/css/oasp.css');
                }
            },
            inject: function () {
                return builder.build('{tmp}/css/*.css');
            }
        },
        html: {
            src: function () {
                return builder.buildForModules(
                    '{app}/{module}/html/**/*.html',
                    '!{app}/{module}/html/cached/**/*.html'
                );
            }
        },
        img: {
            src: function () {
                return builder.buildForModules(
                    '{app}/{module}/img/**/*.*',
                    '!{app}/{module}/img/sprite/**'
                );
            }
        },
        i18n: {
            src: function () {
                return builder.buildForModules(
                    '{app}/{module}/i18n/**/*.*'
                );
            }
        },
        sprite: {
            src: function () {
                return builder.buildForModules(
                    '{app}/{module}/img/sprite/**/*.png'
                );
            },
            dest: {
                css: function () {
                    return builder.build('css/sprite.css');
                },
                img: function () {
                    return builder.build('img/sprite.png');
                }
            }
        },
        ngTemplates: {
            conf: function () {
                return builder.visitModules(function (module) {
                    return {
                        module: 'app.' + $s(module).camelize().s + '.templates',
                        file: builder.build('{module}.templates.js', module),
                        moduleBasePath: builder.build('{module}/html', module),
                        dest: builder.build('{tmp}/{module}/js', module),
                        src: builder.build('{app}/{module}/html/cached/**/*.html', module)
                    };
                });
            }
        }
    };
}());
