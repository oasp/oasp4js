/**
 * @ngdoc service
 * @name oaspErrorNotificatorInterceptor
 * @module oasp.oaspUi.errorNotificator
 * @requires $q
 * @requires growl
 * @requires errorNotificator.oaspErrorNotificatorService
 *
 * This interceptor service is desired to log an error response into error log and notify in real time current error
 * responses from the server.
 *
 * For logging an error responses it uses an {@link app/oasp/oasp-ui/error-notificator/error-notificator.service.js}.
 * For notify error responses it uses an {@link bower_components/angular-growl-v2/build/angular-growl.js} plugin.
 */
angular.module('oasp.oaspUi.errorNotificator')
    .service('oaspErrorNotificatorInterceptor', function ($q, growl, oaspErrorNotificatorService) {
        'use strict';
        return {
            /**
             * @ngdoc method
             * @name responseError
             * @methodOf oaspErrorNotificatorInterceptor
             * @param {object} response error response from server
             * @returns {promise} promise
             */
            responseError: function (response) {
                oaspErrorNotificatorService.logError(response);
                growl.error(response.data.message ? response.data.message : '', {title: response.statusText});
                return $q.reject(response);
            }
        };
    });
