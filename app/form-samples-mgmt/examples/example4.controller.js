angular.module('app.form-samples-mgmt')
    .controller('Example4Ctrl', function () {
        'use strict';

        this.customMessageRepo = {
            password: {
                equal: {
                    msg: 'OASP.VALIDATION.SHOWCASE.PSWD_EQUAL'
                },
                required: {
                    msg: 'OASP.VALIDATION.SHOWCASE.PSWD_REQUIRED'
                }
            }
        };

    });
