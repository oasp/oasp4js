angular.module('app.form-samples-mgmt')
    .controller('Example3Ctrl', function ($timeout, $q) {
        'use strict';

        var self = this;

        this.customMessageRepo = {
            email: {
                forbidden: {
                    msg: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORBIDDEN',
                    params: {
                        domain: '@forbidden.com'
                    }
                },
                email: {
                    msg: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORMAT'
                }
            }
        };


        // --------- Synchronous ---------

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        this.isForbiddenDomain = function ($value) {
            return $value && endsWith($value, '@forbidden.com');
        };

        // --------- Async ---------

        this.isAllowedOnServer = function ($value, formField) {

            return $q(function (resolve, reject) {
                $timeout(function afterTimeout(val) {
                    if (val) {
                        formField.$touched = true;
                    }
                    if (self.isForbiddenDomain(val)) {
                        reject();
                    } else {
                        resolve();
                    }
                }, 1500, false, $value);
            });
        };

    });
