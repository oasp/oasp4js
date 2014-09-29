/*globals angular*/
angular.module('oasp.main')
    .directive('spinner', function () {
        "use strict";

        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/main/spinner.html',
            scope: {
                spinnerVisible: '=spinner'
            },
            link: function (scope) {
                scope.spinnerOptions = {
                    lines: 13, // The number of lines to draw
                    length: 20, // The length of each line
                    width: 4, // The line thickness
                    radius: 16, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    color: '#ffffff', // #rgb or #rrggbb
                    speed: 1.2, // Rounds per second
                    trail: 54, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    zIndex: 2e9 // The z-index (defaults to 2000000000)
                };
            }
        };
    });