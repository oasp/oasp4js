/**
 * Controller that simply provides error log collection using error notificator service.
 */
angular.module('app.main')
    .controller('errorLogCntl', function ($scope, oaspErrorNotificatorService) {
    'use strict';
    $scope.errorLog = oaspErrorNotificatorService.getErrorLog();
    $scope.errorLogIsCollapsed = true;
});
