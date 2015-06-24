var glob = require('glob'),
    paths = require('path'),
    ngParseModule = require('ng-parse-module'),
    pushMainAndAppModuleOnTopOfList = function (moduleFiles, mainModule) {
        if (mainModule) {
            var mainModules = [], otherModules = [], i, dirname;
            for (i = 0; i < moduleFiles.length; i++) {
                dirname = paths.dirname(moduleFiles[i]);
                if (dirname.indexOf(mainModule) === 0 || dirname === '.') {
                    mainModules.push(moduleFiles[i]);
                } else {
                    otherModules.push(moduleFiles[i]);
                }
            }
            for (i = 0; i < otherModules.length; i++) {
                mainModules.push(otherModules[i]);
            }
            return mainModules;
        } else {
            return moduleFiles;

        }
    };


module.exports = {
    parseModules: function (basePath, libRegexp, mainModule) {
        var moduleFiles = glob.sync(libRegexp + '**/*.module.js', {cwd: basePath}), modules = [], moduleFile, topLevelModules = [], module;
        moduleFiles = pushMainAndAppModuleOnTopOfList(moduleFiles, mainModule);
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
