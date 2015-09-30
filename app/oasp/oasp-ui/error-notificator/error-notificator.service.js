/**
 * @module oasp.oaspUi.errorNotificator
 * @service oaspErrorNotificatorService
 *
 * This service is desired to provide an features to run an error notification log called error log.
 *
 * You can log a new error notifications, set a limit of log size and retrieve an error log as a collection.
 *
 * Error log works like a FIFO queue. When you log a new error, then oldest logged error will be removed
 * from log if limit is reached. Default limit of error log size equals 20.
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
             * Sets an error log size limit.
             * @param limit
             *          a Number that represents a new error log size limit
             */
            setErrorLogLimit: function(limit) {
                logLimit = limit;
                trimLog(logLimit);
            },

            /**
             * Returns current error log size limit
             * @returns {number}
             */
            getErrorLogLimit: function() {
                return logLimit;
            },

            /**
             * Logs a new error into error log.
             * @param response
             *          error message response
             */
            logError: function(response) {
                var error = response;
                error.date = new Date();
                log(error);
            },

            /**
             * Returns a whole error log as an collection
             * @returns {*[]}
             */
            getErrorLog: function() {
                return errorLog;
            }
        };
    });
