angular.module('oasp-ui')
    .factory('globalSpinner', function ($rootScope) {
        'use strict';
        var that = {};
        that.show = function () {
            $rootScope.globalSpinner = true;
        };
        that.hide = function () {
            $rootScope.globalSpinner = false;
        };
        that.showOnRouteChangeStartAndHideWhenComplete= function () {
            /*jslint unparam: true*/
            $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
                if (currentRoute.$$route && currentRoute.$$route.resolve) {
                    that.show();
                }
            });
            /*jslint unparam: false*/
            $rootScope.$on('$routeChangeSuccess', function () {
                that.hide();
            });
            $rootScope.$on('$routeChangeError', function () {
                that.hide();
            });
        };

        return that;
    });