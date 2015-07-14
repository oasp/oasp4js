var glob = require('glob'),
    paths = require('path'),
    fs = require('fs'),
    ngParseModule = require('ng-parse-module'),
    pushMainOnTopOfList = function (moduleFiles, mainModule) {
        if (mainModule) {
            var mainModules = [], otherModules = [], i, dirname;
            for (i = 0; i < moduleFiles.length; i++) {
                dirname = paths.basename(moduleFiles[i]);
                if (dirname.indexOf(mainModule) === 0) {
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
        var moduleDirectories = glob.sync(libRegexp + '*/', {cwd: basePath}), modules = [], moduleName, moduleDirectory, module, moduleFile, joinFn = paths.posix ? paths.posix.join : paths.join;
        moduleDirectories = pushMainOnTopOfList(moduleDirectories, mainModule);
        for (var i = 0; i < moduleDirectories.length; i++) {
            moduleDirectory = moduleName = moduleDirectories[i];
            moduleName = paths.basename(moduleDirectory);
            moduleFile = joinFn(moduleDirectory, moduleName + '.module.js');
            module = {
                name: moduleName,
                moduleFile: moduleFile,
                moduleDir: paths.dirname(moduleFile),
                moduleAbsDir: joinFn(basePath, moduleDirectory)
            };
            if (fs.existsSync(paths.join(basePath, module.moduleFile))) {
                module.ngModule = ngParseModule.parse(paths.join(basePath, module.moduleFile)).name;
            }
            modules.push(module);
        }

        return {
            modules: modules
        };
    }
};
