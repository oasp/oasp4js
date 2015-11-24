/**
 * @ngdoc service
 * @name errorNotificator.oaspErrorNotificatorInterceptor
 * @module oasp.oaspUi.errorNotificator
 * @description
 * This interceptor service is desired to log an error response into error log and notify in real time current error
 * responses from the server.
 *
 * For logging an error responses it uses an error notificator service.
 * For notify error responses it uses an angular growl plugin.
 */
angular.module('oasp.oaspUi.errorNotificator')
    .service('oaspErrorNotificatorInterceptor', function ($q, growl, oaspErrorNotificatorService) {
        'use strict';
        return {
            /**
             * @ngdoc method
             * @name responseError
             * @methodOf errorNotificator.oaspErrorNotificatorInterceptor
             * @params {object} response error response from server
             * @returns {promise} promise
             */
            responseError: function (response) {
                if (response) {
                    oaspErrorNotificatorService.logError(response);
                    growl.error(response.data.message ? response.data.message : '', {title: response.statusText});
                }
                return $q.reject(response);
            }
        };
    });
