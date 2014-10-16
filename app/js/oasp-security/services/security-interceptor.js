angular.module('oasp-security')
    .factory('securityInterceptor', function ($q, retryRequestQueue, $injector) {
        'use strict';

        return {
            responseError: function (response) {
                var $http = $injector.get('$http');
                if (response.status === 403) {
                    return retryRequestQueue.addRetryFn('Not authenticated', function () {
                        return $http(response.config);
                    });
                }
                return $q.reject(response);
            }
        };
    });
