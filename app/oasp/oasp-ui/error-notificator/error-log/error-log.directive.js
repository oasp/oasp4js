/**
 * @ngdoc directive
 * @module oasp.oaspUi.errorNotificator
 * @name errorLog
 * @restrict EA
 *
 * Directive that provides an html template for error log collection.
 */
angular.module('oasp.oaspUi.errorNotificator')
    .directive('errorLog', function () {
    'use strict';
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        controller: 'errorLogCntl',
        templateUrl: 'oasp/oasp-ui/error-notificator/error-log/error-log.html'
    };
});
