'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('test', [], function () {
    /**
     * Pass empty array - karma will query for files.
     */
    return gulp.src('dummy.dummy')
        .pipe($.karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});
