angular.module('app.main').controller('AppCntl', function (SIGN_IN_DLG_PATH, $scope, $location, $window, security) {
    'use strict';
    $scope.currentUser = security.getCurrentUser();

    $scope.logOff = function () {
        var goToSignInDialogFullyReloadingApp = function () {
            $location.path(SIGN_IN_DLG_PATH);
            $window.location.href = $location.absUrl();
            $window.location.reload();
        };
        security.logOff()
            .then(function () {
                goToSignInDialogFullyReloadingApp();
            });
    };
});