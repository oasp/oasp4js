/*global config*/
'use strict';
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
gulp.task('copy-bower', function () {
    return gulp.src('gulp/oasp/bower.json')
        .pipe(gulp.dest(config.app.dist()));
});

gulp.task('build:oasp', gulpsync.sync(['build:oasp:init', 'build:lib', 'copy-bower']));

gulp.task('build:oasp:init', function () {
    process.env.NODE_ENV = 'prod';
    global.config = require('../configFactory.js')(require('./oasp-config.json'));
});
