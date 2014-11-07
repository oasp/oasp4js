angular.module('oasp-security')
    .factory('securityInterceptor', function ($q, requestResendingQueue) {
        'use strict';

        return {
            responseError: function (response) {
                var originalRequest;
                if (response.status === 403) {
                    originalRequest = response.config;
                    return requestResendingQueue.addRequest(originalRequest);
                }
                return $q.reject(response);
            }
        };
    });
