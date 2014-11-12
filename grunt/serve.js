module.exports = function (grunt) {
    'use strict';
    grunt.mergeConfig({
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            server: {
                proxies: [
                    {
                        context: '/<%= config.context %>/services',
                        host: 'localhost',
                        port: 8081,
                        https: false,
                        changeOrigin: true
                    },
                    {
                        context: '/<%= config.context %>',
                        host: 'localhost',
                        port: 9000,
                        https: false,
                        changeOrigin: true,
                        rewrite: {
                            '^/oasp4j-example-application': '/'
                        }
                    }
                ]
            },
            develop: {
                options: {
                    port: 9000,
                    open: {
                        target: 'http://localhost:9000/<%= config.context %>/'
                    },
                    base: ['<%= config.paths.tmp %>', '<%= config.paths.app %>'],
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var cacheClear = function (req, res, next) {
                            res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
                            res.setHeader('Pragma', 'no-cache');
                            res.setHeader('Cache-Control', 'no-store');
                            next();
                        }, middlewares = [cacheClear], directory = (options.directory || options.base[options.base.length - 1]);
                        // Serve static files.
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            },
            dist: {
                options: {
                    port: 9000,
                    open: {
                        target: 'http://localhost:9000/<%= config.context %>/'
                    },
                    base: ['<%= config.paths.dist %>'],
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var middlewares = [], directory = options.directory || options.base[options.base.length - 1];
                        // Serve static files.
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));
                        return middlewares;
                    }
                }
            }
        }
    });
    grunt.registerTask('serve', [
        'build:develop', 'configureProxies:server', 'connect:develop', 'watch'
    ]);
    grunt.registerTask('serve:dist', [
        'build:dist', 'configureProxies:server', 'connect:dist:keepalive'
    ]);
};