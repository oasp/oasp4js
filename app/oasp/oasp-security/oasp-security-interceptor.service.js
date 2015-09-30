/**
 * @ngdoc service
 * @name oaspSecurity.oaspSecurityInterceptor
 * @module oasp.oaspSecurity
 * @requires $q
 * $requires oaspSecurity.oaspUnauthenticatedRequestResender
 */
angular.module('oasp.oaspSecurity')
    .factory('oaspSecurityInterceptor', function ($q, oaspUnauthenticatedRequestResender) {
        'use strict';

        return {
            /**
             * @ngdoc method
             * @name oaspSecurity.oaspSecurityInterceptor#responseError
             * @methodOf oaspSecurity.oaspSecurityInterceptor
             *
             * @params {object} response
             * @return {promise} promise
             */
            responseError: function (response) {
                var originalRequest;
                if (response.status === 403) {
                    originalRequest = response.config;
                    return oaspUnauthenticatedRequestResender.addRequest(originalRequest);
                }
                return $q.reject(response);
            }
        };
    });
