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
        tmp: ".tmp", //temp !
        dist: "dist",
        app: "app",
        test: "test",
        //start
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
            paths: function () {
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
        }
    };
}());
