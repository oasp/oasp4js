/**
 * @ngdoc service
 * @name errorNotificator.oaspErrorNotificatorService
 * @module oasp.oaspUi.errorNotificator
 * @description
 * This service is desired to provide an features to run an error notification log called error log.
 *
 * You can log a new error notifications, set a limit of log size and retrieve an error log as a collection.
 *
 * Error log works like a FIFO queue. When you log a new error, then oldest logged error will be removed
 * from log if limit is reached. Default limit of error log size equals 10.
 *
 * You can change a limit of error log, so when the new limit is smaller than current volume of error log,
 * then log will be automatically trimmed to size of new limit.
 */
angular.module('oasp.oaspUi.errorNotificator')
    .service('oaspErrorNotificatorService', function () {
        'use strict';
        var errorLog = [],
            logLimit = 10;

        function log(error) {
            if (errorLog.length === logLimit) {
                errorLog.pop();
            }
            errorLog.unshift(error);
        }

        function trimLog(limit) {
            if (errorLog.length > limit) {
                var diff = errorLog.length - limit;
                for (var i = 0; i < diff; i++) {
                    errorLog.pop();
                }
            }
        }

        return {
            /**
             * @ngdoc method
             * @name errorNotificator.oaspErrorNotificatorService#setErrorLogLimit
             * @methodOf errorNotificator.oaspErrorNotificatorService
             * @param {Number} limit error log size limit
             */
            setErrorLogLimit: function (limit) {
                logLimit = limit;
                trimLog(logLimit);
            },

            /**
             * @ngdoc method
             * @name errorNotificator.oaspErrorNotificatorService#getErrorLogLimit
             * @methodOf errorNotificator.oaspErrorNotificatorService
             * @returns {Number} current error log size limit
             */
            getErrorLogLimit: function () {
                return logLimit;
            },

            /**
             * @ngdoc method
             * @name errorNotificator.oaspErrorNotificatorService#logError
             * @methodOf errorNotificator.oaspErrorNotificatorService
             * @param {Object} errorResponse error response from server
             */
            logError: function (errorResponse) {
                errorResponse.date = new Date();
                log(errorResponse);
            },

            /**
             * @ngdoc method
             * @name errorNotificator.oaspErrorNotificatorService#getErrorLog
             * @methodOf errorNotificator.oaspErrorNotificatorService
             * @returns {Array} error log collection with logged error responses
             */
            getErrorLog: function () {
                return errorLog;
            }
        };
    });
