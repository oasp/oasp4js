angular.module('app.main').controller('AppCntl', function (SIGN_IN_DLG_PATH, $scope, $location, $window, appContext, oaspSecurityService, globalSpinner, $state) {
    'use strict';

    appContext.getCurrentUser().then(function (currentUser) {
        $scope.currentUser = currentUser;
    });

    $scope.logOff = function () {
        var goToSignInDialogFullyReloadingApp = function () {
            $state.go('signIn', {}, {reload: true});
            //used reload via state instead of $window.location.reload(); to avoid page flickering on logout.
        };
        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
            return oaspSecurityService.logOff();
        }).then(function () {
            goToSignInDialogFullyReloadingApp();
        });
    };
});
