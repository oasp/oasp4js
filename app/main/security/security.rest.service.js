/**
 * @ngdoc service
 * @name main.securityRestService
 * @module app.main
 * @requires $http
 * @requires main.currentContextPath
 */
angular.module('app.main').factory('securityRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/';

    return {
        /**
         * @ngdoc method
         * @name main.securityRestService#getCurrentUser
         * @methodOf main.securityRestService
         *
         * @return {promise} http promise
         */
        getCurrentUser: function () {
            return $http.get(servicePath + 'security/v1/currentuser/');
        },
        /**
         * @ngdoc method
         * @name main.securityRestService#getCsrfToken
         * @methodOf main.securityRestService
         *
         * @return {promise} http promise
         */
        getCsrfToken: function () {
            return $http.get(servicePath + 'security/v1/csrftoken/');
        },
        /**
         * @ngdoc method
         * @name main.securityRestService#login
         * @methodOf main.securityRestService
         *
         * @return {promise} http promise
         */
        login: function (username, password) {
            /*jshint -W106*/
            return $http.post(servicePath + 'login', {
                j_username: username,
                j_password: password
            });
            /*jshint +W106*/
        },
        /**
         * @ngdoc method
         * @name main.securityRestService#logout
         * @methodOf main.securityRestService
         *
         * @return {promise} http promise
         */
        logout: function () {
            return $http.get(servicePath + 'logout');
        }
    };
});
