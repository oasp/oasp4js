angular.module('app.main').controller('ContainerCntl', function ($scope, appContext, $state) {
    'use strict';

    appContext.getCurrentUser().then(function (currentUser) {
        $scope.currentUser = currentUser;
    });
    $scope.state = $state;
});
