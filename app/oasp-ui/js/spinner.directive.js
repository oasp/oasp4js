angular.module('oasp-ui')
    .directive('spinner', function () {
        'use strict';

        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'oasp-ui/html/spinner.html',
            scope: {
                spinnerVisible: '=spinner'
            },
            link: function (scope) {
                scope.spinnerOptions = {
                    lines: 13,
                    length: 20,
                    width: 4,
                    radius: 16,
                    corners: 1,
                    rotate: 0,
                    color: '#ffffff',
                    speed: 1.2,
                    trail: 54,
                    shadow: false,
                    hwaccel: false,
                    zIndex: 2e9
                };
            }
        };
    });