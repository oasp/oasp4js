var glob = require('glob'),
    paths = require('path'),
    ngParseModule = require('ng-parse-module');

module.exports = {
    parseModules: function (basePath) {
        var moduleFiles = glob.sync('**/*.module.js', {cwd: basePath}), modules = [], moduleFile, topLevelModules = [], module;

        for (var i = 0; i < moduleFiles.length; i++) {
            moduleFile = moduleFiles[i];
            module = {
                name: paths.basename(moduleFile).replace('.module.js', ''),
                moduleFile: moduleFile,
                moduleDir: paths.dirname(moduleFile),
                moduleAbsDir: paths.join(basePath, paths.dirname(moduleFile)),
                ngModule: ngParseModule.parse(paths.join(basePath, moduleFile)).name
            };

            modules.push(module);

            if (paths.dirname(moduleFile).indexOf('/') < 0) {
                topLevelModules.push(module);
            }
        }

        return {
            modules: modules,
            topLevelModules: topLevelModules
        };
    }
};
