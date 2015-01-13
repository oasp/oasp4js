/*global config*/
'use strict';
var gulp = require('gulp');

gulp.task('copy-bower', function () {
    return gulp.src('gulp/oasp/bower.json')
        .pipe(gulp.dest(config.app.dist()));
});

gulp.task('build:oasp', [], function () {
    process.env.NODE_ENV = 'prod';
    global.config = require('../configFactory.js')(require('./oasp-config.json'));
    gulp.start('build:lib', 'copy-bower');
});
