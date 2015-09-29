/**
 * @ngdoc service
 * @name main.currentContextPath
 * @module app.main
 * @requires $window
 */
angular.module('app.main').factory('currentContextPath', function ($window) {
    'use strict';
    var contextPath = '';
    return {

        /**
         * @ngdoc method
         * @name main.currentContextPath#get
         * @methodOf main.currentContextPath
         *
         * @return {string} context path
         */
        get: function () {
            var contextPathNotInitializedYet = contextPath ? false : true,
                path,
                splitPath,
                parsedContextPath;
            if (contextPathNotInitializedYet) {
                contextPath = '/';
                path = $window.location.pathname;
                if (path) {
                    splitPath = path.split('/');
                    if (splitPath.length > 1) {
                        parsedContextPath = splitPath[1];
                        if (parsedContextPath) {
                            contextPath += parsedContextPath + '/';
                        }
                    }
                }
            }
            return contextPath;
        }
    };
});
