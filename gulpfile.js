'use strict';

var gulp = require('gulp');
var fs = require('fs');

global.bowerConfig = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));

global.isBuildForProd = function () {
    return process.env.NODE_ENV === 'prod';
};

global.config = require('./gulp/lib/config-factory.js')(require('./config.json'));

require('require-dir')('./gulp', {recurse: true});

gulp.task('default', ['clean'], function () {
    gulp.start('build:dist');
});
