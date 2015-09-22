/*global config*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('scripts', ['ngTemplates'], function () {
    return gulp.src(config.scripts.src())
        .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.concat(config.externalConfig.buildLibName))
        .pipe(gulp.dest(config.output()))
        .pipe($.concat(config.externalConfig.buildLibMinName))
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.output()))
        .pipe($.size());
});

gulp.task('build:lib', ['scripts', 'html', 'i18n', 'style:copy', 'img:copy']);
