module.exports = function (processor) {
    'use strict';
    var grunt = require('grunt'), _ = require('lodash');
    processor.registerBlockType('styles', function (content, block, blockLine, blockContent) {
        var files = [], result = '';
        _.forEach(processor.options.stylesFiles, function (filePattern) {
            files.push(grunt.file.expand({cwd: filePattern.cwd}, filePattern.files));
        });
        _.forEach(_.flatten(files), function (file) {
            result += '<link rel="stylesheet" href="' + file + '">\r\n';
        });
        return content.replace(blockLine, result);
    });
};