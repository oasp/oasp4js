/*global config*/
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var middleware = require('./proxy');
var _ = require('lodash');
var gulpsync = require('gulp-sync')(gulp);

function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;
    browserSync.instance = browserSync.init(files, {
        startPath: '/',
        port: 9000,
        server: {
            baseDir: baseDir,
            middleware: middleware,
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        browser: browser,
        ghostMode: false
    });
}

gulp.task('serve', gulpsync.sync(['build', 'watch']), function () {
    browserSyncInit([
        config.paths.tmp,
        config.paths.src,
        'bower_components/bootstrap/dist'
    ], _.flatten([
            config.paths.tmp + '/**'
    ]));
});

gulp.task('serve:dist', ['build:dist'], function () {
    browserSyncInit('dist');
});
