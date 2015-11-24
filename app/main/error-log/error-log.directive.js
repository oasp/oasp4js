/**
 * Directive that provides an html template for error log collection.
 */
angular.module('app.main')
    .directive('errorLog', function () {
    'use strict';
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        controller: 'errorLogCntl',
        templateUrl: 'main/error-log/error-log.html'
    };
});
