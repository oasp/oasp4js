/*global isBuildForProd,bowerConfig*/
var moduleParser = require('./module-parser.js');
var builderFactory = require('./builder-factory.js');
var _ = require('lodash');
var configFactory = function (externalConfig) {

    var modulesConfig = moduleParser.parseModules(externalConfig.paths.src, externalConfig.libRegexp || '', externalConfig.mainModule);
    var pathsBuilder = builderFactory(externalConfig.paths, modulesConfig.modules, modulesConfig.topLevelModules);
    var currentOutput = function () {
        return  isBuildForProd() ? externalConfig.paths.dist : externalConfig.paths.tmp;
    };
    return {
        paths: externalConfig.paths,

        externalConfig: externalConfig,
        //outputs
        output: function () {
            return currentOutput();
        },
        testOutput: function () {
            return externalConfig.paths.testOutput;
        },
        outputs: function () {
            return [externalConfig.paths.dist, externalConfig.paths.tmp, externalConfig.paths.testOutput];
        },
        proxy: {
            url: function () {
                return externalConfig.proxy.baseUrl + externalConfig.proxy.context;
            },
            context: function () {
                return externalConfig.proxy.context;
            }
        },
        //app items
        indexHtml: {
            src: function () {
                return [pathsBuilder.build('{src}/index.html')];
            }
        },
        styles: {
            /** include only root files*/
            src: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleDir}/{module}.' + externalConfig.styles.type);
            },
            /** include all*/
            allSrc: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleDir}/**/*.' + externalConfig.styles.type);
            },
            output: function () {
                return externalConfig.styles.output;
            },
            injects: function () {
                return [pathsBuilder.build('{tmp}/**/*.css'), pathsBuilder.build('{src}/**/*.css')];
            },
            includePaths: function () {
                return [
                    externalConfig.paths.src,
                    bowerConfig.directory
                ];
            }
        },
        scripts: {
            src: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleFile}', '{src}/{moduleDir}/**/*.module.js', '{src}/{moduleDir}/**/!(*spec|*mock).js', '{tmp}/**/*.js');
            },
            testSrc: function () {
                return _.flatten([
                    pathsBuilder.buildForTopLevelModules(
                        '{src}/{moduleDir}/**/*.mock.js'
                    ),
                    pathsBuilder.buildForTopLevelModules(
                        '{src}/{moduleDir}/**/*.spec.js'
                    )
                ]);
            },
            lintSrc: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleFile}', '{src}/{moduleDir}/**/*.module.js', '{src}/{moduleDir}/**/!(*spec|*mock).js');
            }
        },
        i18n: {
            src: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleDir}/i18n/**/*.json');
            }
        },
        img: {
            src: function () {
                return pathsBuilder.buildForTopLevelModules('{src}/{moduleDir}/**/img/**/*.*', '!{src}/{moduleDir}/**/img/sprite/**');
            },
            sprite: {
                src: function () {
                    return pathsBuilder.buildForTopLevelModules('{src}/{moduleDir}/**/img/sprite/**/*.png');
                },
                output: {
                    css: function () {
                        return 'css/sprite.css';
                    },
                    img: function () {
                        return 'img/sprite.png';
                    }
                }
            }
        },
        html: {
            src: function () {
                return pathsBuilder.buildForTopLevelModules(
                    '{src}/{moduleDir}/**/*.html',
                    '!{src}/{moduleDir}/**/*.tpl.html'
                );
            }
        },
        ngTemplates: {
            conf: function () {
                return pathsBuilder.visitTopLevelModules(function (module) {
                    return {
                        module: module.ngModule + '.templates',
                        moduleDir: module.moduleDir,
                        file: pathsBuilder.build('{moduleDir}/{module}.templates.js', module),
                        src: pathsBuilder.build('{src}/{moduleDir}/**/*.tpl.html', module)
                    };
                }, true);
            }
        }
    };
};
module.exports = configFactory;
