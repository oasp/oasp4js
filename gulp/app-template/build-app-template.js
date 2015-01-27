/*global config*/
'use strict';
var gulp = require('gulp');

gulp.task('build:apptemplate', function () {
    var conf = [
        '.bowerrc',
        '.editorconfig',
        '.gitignore',
        '.jshintrc',
        'bower.json',
        'gulp/*.js',
        'gulpfile.js',
        'jenkins-build-sonar.sh',
        'jenkins-build.sh',
        'karma.conf.js',
        'package.json'
    ];
    return gulp.src(conf,{base: '.'})
        .pipe(gulp.dest(config.app.dist()));
});
