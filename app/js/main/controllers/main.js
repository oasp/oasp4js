angular.module('oasp.main').controller('MainCntl', function ($scope, $location, security) {
    'use strict';
    security.initializeUser()
        .error(function () {
            $location.path('/main/sign-in');
        });

    $scope.currentUser = security.getCurrentUser();

    $scope.logOff = function () {
        security.logOff().success(function () {
            $location.path('/main/sign-in');
        });
    };
});