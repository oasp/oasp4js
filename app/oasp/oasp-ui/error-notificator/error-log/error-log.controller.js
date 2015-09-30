/**
 * @module oasp.oaspUi.errorNotificator
 * @controller errorLogCntl
 *
 * Controller that simply provides error log collection using {@link oaspErrorNotificatorService}.
 *
 * @field errorLog
 *          holds actual error log collection
 */
angular.module('oasp.oaspUi.errorNotificator')
    .controller('errorLogCntl', function ($scope, oaspErrorNotificatorService) {
    'use strict';
    $scope.errorLog = oaspErrorNotificatorService.getErrorLog();
    $scope.errorLogIsCollapsed = true;
});
