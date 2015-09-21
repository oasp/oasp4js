var glob = require('glob'),
    paths = require('path'),
    fs = require('fs'),
    ngParseModule = require('ng-parse-module');


module.exports = {
    parseModules: function (basePath, libRegexp) {
        'use strict';
        var moduleDirectories = glob.sync(libRegexp + '*/', {cwd: basePath}), modules = [], moduleName, moduleDirectory, module, moduleFile, joinFn = paths.posix ? paths.posix.join : paths.join;
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
