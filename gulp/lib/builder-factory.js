//polify
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

module.exports = function (paths, modules) {
    var builder = {
        build: function (path, module) {
            module = module || {};
            return path.replaceAll('{module}', module.name)
                .replaceAll('{moduleDir}', module.moduleDir)
                .replaceAll('{moduleFile}', module.moduleFile)
                .replaceAll('{src}', paths.src)
                .replaceAll('{tmp}', paths.tmp)
                .replaceAll('{testSrc}', paths.testSrc);
        },
        buildForTopLevelModules: function () {
            var i, j, result = [];
            for (i = 0; i < modules.length; i += 1) {
                for (j = 0; j < arguments.length; j += 1) {
                    result.push(builder.build(arguments[j], modules[i]));
                }
            }
            return result;
        },
        visitTopLevelModules: function (factoryFn) {
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
    return builder;
};
