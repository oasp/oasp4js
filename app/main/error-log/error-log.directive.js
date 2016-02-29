/**
 * Directive that provides an html template for error log collection.
 */
angular.module('app.main')
    .directive('errorLog', function (oaspErrorNotificatorService) {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'main/error-log/error-log.html',
            link: function ($scope) {
                $scope.errorLog = oaspErrorNotificatorService.getErrorLog();
            }
        };
    });
