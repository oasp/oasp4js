angular.module('app.form-samples-mgmt')
    .config(function (valdrProvider) {
        'use strict';
        valdrProvider.addConstraints({
            example1LoginType: {
                userName: {
                    required: {
                        message: 'OASP.VALIDATION.SHOWCASE.USER_REQUIRED'
                    },
                    maxLength: {
                        message: 'OASP.VALIDATION.SHOWCASE.USER_MAX_LENGTH',
                        number: 20
                    }
                },
                password: {
                    required: {
                        message: 'OASP.VALIDATION.SHOWCASE.PSWD_REQUIRED'
                    }
                }
            }
        });
    })


.controller('Example1Ctrl', function () {
        'use strict';
    //when valdr initialized in config, nothing is really needed here :)
    });
