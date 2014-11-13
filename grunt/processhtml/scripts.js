module.exports = function (processor) {
    'use strict';
    var grunt = require('grunt'), _ = require('lodash');
    processor.registerBlockType('scripts', function (content, block, blockLine, blockContent) {
        var files = [], result = '';
        _.forEach(processor.options.scriptsFiles, function (filePattern) {
            files.push(grunt.file.expand({cwd: filePattern.cwd}, filePattern.files));
        });
        _.forEach(_.flatten(files), function (file) {
            result += '<script src="' + file + '"></script>\r\n';
        });
        return content.replace(blockLine, result);
    });
};