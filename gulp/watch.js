/*global config*/
'use strict';

var gulp = require('gulp');

gulp.task('watch', [], function () {
    gulp.watch(config.styles.allSrc(), ['styles']);
    gulp.watch(config.indexHtml.src(), ['indexHtml']);
    gulp.watch(config.html.src(), ['html']);
    gulp.watch('bower.json', ['indexHtml']);
    config.ngTemplates.conf().forEach(function (ngTemplatesItemConf) {
        gulp.watch(ngTemplatesItemConf.src, ['ngTemplates[' + ngTemplatesItemConf.file + ']']);
    });
});
