/*global config*/
'use strict';

var gulp = require('gulp');

gulp.task('watch', [], function () {
    gulp.watch(config.styles.allSrc(), ['styles']);
    gulp.watch(config.indexHtml.src(), ['indexHtml:html']);
    gulp.watch(config.html.src(), ['html']);
    gulp.watch(config.scripts.src(), function (vinyl) {
        if (vinyl.type === 'added' || vinyl.type === 'deleted' || vinyl.type === 'renamed') {
            gulp.start('indexHtml:html');
        }
    });
    gulp.watch('bower.json', ['indexHtml:html']);
    config.ngTemplates.conf().forEach(function (ngTemplatesItemConf) {
        gulp.watch(ngTemplatesItemConf.src, ['ngTemplates[' + ngTemplatesItemConf.file + ']']);
    });
});
