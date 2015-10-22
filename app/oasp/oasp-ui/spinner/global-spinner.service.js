/**
 * @ngdoc service
 * @name spinner.globalSpinner
 * @module oaspUi.spinner
 * @requires $rootScope
 * @requires $q
 */
angular.module('oasp.oaspUi.spinner')
    .factory('globalSpinner', function ($rootScope, $q) {
        'use strict';

        var that = {
            /**
             * @ngdoc method
             * @name spinner.globalSpinner#show
             * @methodOf spinner.globalSpinner
             *
             */
            show: function () {
                $rootScope.globalSpinner = true;
            },
            /**
             * @ngdoc method
             * @name spinner.globalSpinner#hide
             * @methodOf spinner.globalSpinner
             *
             */
            hide: function () {
                $rootScope.globalSpinner = false;
            },
            /**
             * @ngdoc method
             * @name spinner.globalSpinner#showOnRouteChangeStartAndHideWhenComplete
             * @methodOf spinner.globalSpinner
             *
             */
            showOnRouteChangeStartAndHideWhenComplete: function () {
                /*jslint unparam: true*/
                $rootScope.$on('$stateChangeStart', function (event, toState/*toParams, fromState, fromParams*/) {
                    if (toState.resolve) {
                        that.show();
                    }
                });
                /*jslint unparam: false*/
                $rootScope.$on('$stateChangeSuccess', function () {
                    that.hide();
                });
                $rootScope.$on('$stateChangeError', function () {
                    that.hide();
                });
                $rootScope.$on('$stateNotFound', function () {
                    that.hide();
                });
            },
            /**
             * @ngdoc method
             * @name spinner.globalSpinner#decorateCallOfFunctionReturningPromise
             * @methodOf spinner.globalSpinner
             *
             * @return {promise} promise
             */
            decorateCallOfFunctionReturningPromise: function (fn) {
                that.show();
                return fn().then(function (value) {
                    that.hide();
                    return value;
                }, function (value) {
                    that.hide();
                    return $q.reject(value);
                });
            }
        };
        return that;
    });
