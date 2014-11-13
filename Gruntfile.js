module.exports = function (grunt) {
    'use strict';
    //api from grunt is not yet exposed
    grunt.mergeConfig = grunt.config.merge;
    // Load grunt tasks automatically
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith',
        configureProxies: 'grunt-connect-proxy',
        htmlbuild: 'grunt-html-build',
        useminPrepare: 'grunt-usemin'
    });
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.mergeConfig({
        config: require('./grunt/config.js')
    });
    //load sub tasks
    require('./grunt/build.js')(grunt);
    require('./grunt/sonar.js')(grunt);
    require('./grunt/serve.js')(grunt);
    require('./grunt/test.js')(grunt);
    require('./grunt/watch.js')(grunt);

    grunt.registerTask('default', [
        'jslint:client', 'build:dist'
    ]);
    grunt.registerTask('log', function () {
        grunt.log.write(JSON.stringify(grunt.filerev.summary));
        grunt.log.write(JSON.stringify(require('./grunt/config.js').less.paths()));
    });
};