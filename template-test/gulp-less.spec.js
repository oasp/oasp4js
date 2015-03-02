'use strict';
var should = require('should');
require('./fixtures/gulp-less/gulpfile.js');
require('mocha');
var gulp = require('gulp');
var fs = require('fs');
var rimraf = require('rimraf');

describe('oasp build system', function () {
    var currentPath = process.cwd();
    beforeEach(process.chdir.bind(null, './template-test/fixtures/gulp-less'));
    afterEach(process.chdir.bind(null, currentPath));
    describe('less', function () {
        afterEach(rimraf.bind(null, 'test_tmp'));
        it('should compile less into one file', function (done) {
            gulp.start('less', function () {
                fs.existsSync('test_tmp/css/oasp.css').should.eql(true);
                var body = fs.readFileSync('test_tmp/css/oasp.css', 'utf8');
                (body.indexOf('.class1') > -1).should.eql(true);
                (body.indexOf('.class2') > -1).should.eql(true);
                done();
            });
        });
    });
});
