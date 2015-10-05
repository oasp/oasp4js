/**
 * @ngdoc service
 * @name oaspErrorNotificatorService
 * @module oasp.oaspUi.errorNotificator
 *
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
            if(errorLog.length === logLimit) {
                errorLog.pop();
            }
            errorLog.unshift(error);
        }

        function trimLog(limit){
            if (errorLog.length > limit) {
                var diff = errorLog.length-limit;
                for(var i=0; i<diff; i++) {
                    errorLog.pop();
                }
            }
        }

        return {
            /**
             * @ngdoc method
             * @name setErrorLogLimit
             * @methodOf oaspErrorNotificatorService
             * Sets an error log size limit.
             * @param {number} limit represents a new error log size limit
             */
            setErrorLogLimit: function(limit) {
                logLimit = limit;
                trimLog(logLimit);
            },

            /**
             * @ngdoc method
             * @name getErrorLogLimit
             * @methodOf oaspErrorNotificatorService
             * @returns {number} current error log size limit
             */
            getErrorLogLimit: function() {
                return logLimit;
            },

            /**
             * @ngdoc method
             * @name logError
             * @methodOf oaspErrorNotificatorService
             * Logs a new error response into error log.
             * @param errorResponse error response message from server
             */
            logError: function(errorResponse) {
                var error = errorResponse;
                error.date = new Date();
                log(error);
            },

            /**
             * @ngdoc method
             * @name getErrorLog
             * @methodOf oaspErrorNotificatorService
             * @returns {*[]} whole error log
             */
            getErrorLog: function() {
                return errorLog;
            }
        };
    });
