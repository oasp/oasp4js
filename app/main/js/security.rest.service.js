angular.module('app.main').factory('securityRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest';

    return {
        getCurrentUser: function () {
            return $http.get(servicePath + '/security/currentuser/');
        },
        getCsrfToken: function () {
            return $http.get(servicePath + '/security/csrftoken/');
        },
        login: function (username, password) {
            return $http.post(servicePath + '/login', {
                j_username: username,
                j_password: password
            });
        },
        logout: function () {
            return $http.get(servicePath + '/logout');
        }
    };
});
