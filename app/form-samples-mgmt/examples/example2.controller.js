angular.module('app.form-samples-mgmt')
    .controller('Example2Ctrl', function () {
        'use strict';

        this.customMessageRepo = {
            userName: {
                required: {
                    msg: 'OASP.VALIDATION.SHOWCASE.USER_REQUIRED'
                },
                maxlength: {
                    msg: 'OASP.VALIDATION.SHOWCASE.USER_MAX_LENGTH',
                    param: {
                        number: 20
                    }
                }
            },
            password: {
                required: {
                    msg: 'OASP.VALIDATION.SHOWCASE.PSWD_REQUIRED'
                }
            }
        };

    });
