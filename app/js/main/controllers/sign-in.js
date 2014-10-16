angular.module('app.main')
    .controller('SignInCntl', function ($scope, $location, appContext, signIn) {
        'use strict';
        signIn($scope, function () {
            var currentUser = appContext.getCurrentUser();
            $location.url(currentUser.getHomeDialogPath());
        });
    });