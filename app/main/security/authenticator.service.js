/**
 * @ngdoc service
 * @name main.authenticator
 * @module app.main
 * @requires $modal
 */
angular.module('app.main')
    .factory('authenticator', function ($modal) {
        'use strict';

        return {

            /**
             * @ngdoc method
             * @name main.authenticator#execute
             * @methodOf main.authenticator
             *
             * @return {promise} modal promise
             */
            execute: function () {
                return $modal.open({
                    templateUrl: 'main/sign-in/sign-in-modal.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: 'SignInModalCntl as SIC',
                    size: 'sm'
                }).result;
            }
        };
    });
