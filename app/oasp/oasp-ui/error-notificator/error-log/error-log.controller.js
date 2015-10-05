/**
 * @module oasp.oaspUi.errorNotificator
 * @name errorLogCntl
 * @requires $scope
 * @requires errorNotificator.oaspErrorNotificatorService
 * @property errorLog error log
 *
 * Controller that simply provides error log collection using {@link app/oasp/oasp-ui/error-notificator/error-notificator.service.js}.
 */
angular.module('oasp.oaspUi.errorNotificator')
    .controller('errorLogCntl', function ($scope, oaspErrorNotificatorService) {
    'use strict';
    $scope.errorLog = oaspErrorNotificatorService.getErrorLog();
    $scope.errorLogIsCollapsed = true;
});
