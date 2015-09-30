/**
 * @module oasp.oaspUi.errorNotificator
 * @service oaspErrorNotificatorInterceptor
 *
 * This interceptor service is desired to log an error response into error log and notify in real time current error
 * responses from the server.
 *
 * For logging an error responses it uses an {@link oaspErrorNotificatorService}.
 * For notify error responses it uses an {@link angular-growl} plugin that is configured in @module.
 *
 */
angular.module('oasp.oaspUi.errorNotificator')
    .service('oaspErrorNotificatorInterceptor', function ($q, growl, oaspErrorNotificatorService) {
        'use strict';
        return {
            /**
             * Logs and notifies passed response.
             * @param response
             *          error response from server
             * @returns {Promise}
             *          an promise of passed response in param
             */
            responseError: function (response) {
                oaspErrorNotificatorService.logError(response);
                growl.error(response.data.message ? response.data.message : '', {title: response.statusText});
                return $q.reject(response);
            }
        };
    });
