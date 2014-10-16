angular.module('app.main')
    .factory('authenticator', function ($modal) {
        'use strict';

        return {
            execute: function () {
                return $modal.open({
                    templateUrl: 'html/main/sign-in-modal.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: 'SignInModalCntl',
                    size: 'sm'
                }).result;
            }
        };
    });
