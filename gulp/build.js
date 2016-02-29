/*global config, isBuildForProd*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'uglify-save-license', 'del', 'wiredep']
});
var gulpsync = require('gulp-sync')(gulp);


/** ======================================== build ======================================== **/

gulp.task('env:develop', function () {
    $.env({
        vars: {
            NODE_ENV: 'dev'
        }
    });
});

gulp.task('env:prod', function () {
    $.env({
        vars: {
            NODE_ENV: 'prod'
        }
    });
});
gulp.task('build:develop', ['env:develop', 'build']);

gulp.task('build:ci', gulpsync.sync(['test', 'build:dist']));

gulp.task('build:dist', ['env:prod', 'build']);

gulp.task('build', ['indexHtml', 'styles', 'img', 'fonts', 'i18n', 'html']);

gulp.task('clean', function (done) {
    return $.del(config.outputs(), done);
});
/** ======================================== styles ======================================== **/
gulp.task('styles', function () {
    return gulp.src(config.styles.src())
        .pipe($.concat(config.styles.output()))
        .pipe($.less({
            paths: config.styles.includePaths()
        }))
        .pipe($.plumber())
        .pipe(gulp.dest(config.paths.tmp))
        .pipe($.size());
});

gulp.task('style:copy', function () {
    return gulp.src(config.styles.allSrc(), { base: config.paths.src})
        .pipe(gulp.dest(config.output()))
        .pipe($.size());
});

/** ======================================== indexHtml ======================================== **/
gulp.task('indexHtml', gulpsync.sync([
    ['styles', 'img:sprite', 'ngTemplates'],
    'indexHtml:html'
]));

//only build index.html without dependencies
gulp.task('indexHtml:html', function () {
    return gulp.src(config.indexHtml.src())
        //TODO fix it
        .pipe($.wiredep.stream({
            directory: 'bower_components',
            exclude: ['bootstrap.js']
        }))
        .pipe($.inject(gulp.src(config.scripts.src(), {read: false}), {
            addRootSlash: false,
            ignorePath: [config.paths.src, config.paths.tmp]
        }))
        .pipe($.inject(gulp.src(config.styles.injects(), {read: false}), {
            addRootSlash: false,
            ignorePath: [config.paths.src, config.paths.tmp, config.paths.dist]
        }))
        .pipe($.processhtml({commentMarker: 'process',
            recursive: true,
            includeBase: config.paths.src}))
        .pipe($.if(isBuildForProd(), $.usemin({
            path: '{' + config.paths.tmp + ',' + config.paths.src + '}',
            css: [$.minifyCss(), 'concat', $.rev()],
            jsModernizr: [$.ngAnnotate(), $.uglify({preserveComments: $.uglifySaveLicense}), $.rev()],
            jsVendor: [$.ngAnnotate(), $.uglify({preserveComments: $.uglifySaveLicense}), $.rev()],
            jsApp: [$.ngAnnotate(), $.uglify({preserveComments: $.uglifySaveLicense}), $.rev()]
        })))
        .pipe(gulp.dest(config.output()))
        .pipe($.size());
});

/** ======================================== img ======================================== **/
gulp.task('img', ['img:sprite', 'img:copy']);

gulp.task('img:sprite', function () {
    return gulp.src(config.img.sprite.src())
        .pipe($.spritesmith({
            imgName: config.img.sprite.output.img(),
            cssName: config.img.sprite.output.css()
        }))
        .pipe(gulp.dest(config.paths.tmp))
        .pipe($.size());
});

gulp.task('img:sprite:copy', ['img:sprite'], function (done) {
    if (isBuildForProd()) {
        return gulp.src(config.paths.tmp + '/' + config.img.sprite.output.img(), {base: config.paths.tmp})
            .pipe($.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(config.output()))
            .pipe($.size());
    } else {
        done();
    }
});

gulp.task('img:copy', ['img:sprite:copy'], function (done) {
    if (isBuildForProd()) {
        return gulp.src(config.img.src(), {base: config.paths.src})
            .pipe($.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(config.output()))
            .pipe($.size());
    } else {
        done();
    }
});

/** ======================================== fonts ======================================== **/
gulp.task('fonts', function (done) {
    //TODO check font awesome
    if (isBuildForProd()) {
        return gulp.src('bower_components/**/*.{eot,svg,ttf,woff,woff2}')
            .pipe($.flatten())
            .pipe(gulp.dest(config.output() + '/fonts/'));
    } else {
        done();
    }
});

/** ======================================== i18n ======================================== **/
gulp.task('i18n', function (done) {
    if (isBuildForProd()) {
        return gulp.src(config.i18n.src(), {base: config.paths.src})
            .pipe(gulp.dest(config.output()));
    } else {
        done();
    }
});

/** ======================================== html ======================================== **/
gulp.task('html', function () {
    return gulp.src(config.html.src(), { base: config.paths.src })
        .pipe($.newer(config.paths.tmp))
        .pipe($.processhtml({commentMarker: 'process',
            recursive: true,
            includeBase: config.paths.src}))
        .pipe($.if(isBuildForProd(), $.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulp.dest(config.output()))
        .pipe($.size());
});

/** ======================================== ng-templates ======================================== **/
var ngTemplatesTasks = [];
gulp.task('ngTemplates', gulpsync.sync(['ngTemplatesTasksGeneration', 'ngTemplatesTasksExecution']));
gulp.task('ngTemplatesTasksExecution', ngTemplatesTasks);
gulp.task('ngTemplatesTasksGeneration', function () {
    config.ngTemplates.conf().forEach(function (ngTemplatesItemConf) {
        ngTemplatesTasks.push('ngTemplates[' + ngTemplatesItemConf.file + ']');
        gulp.task('ngTemplates[' + ngTemplatesItemConf.file + ']', function () {
            return gulp.src(ngTemplatesItemConf.src)
                .pipe($.processhtml({commentMarker: 'process',
                    recursive: true,
                    includeBase: config.paths.src}))
                .pipe($.minifyHtml({
                    empty: true,
                    spare: true,
                    quotes: true
                }))
                .pipe($.ngTemplates({
                    module: ngTemplatesItemConf.module,
                    path: function (path, base) {
                        return path.replace(base, ngTemplatesItemConf.moduleDir + '/').replace('.tpl.html', '.html');
                    }
                }))
                .pipe($.concat(ngTemplatesItemConf.file))
                .pipe(gulp.dest(config.paths.tmp));
        });
    });
});
