angular.module('app.main')
    .controller('SignInModalCntl', function ($scope, signIn) {
        'use strict';

        function signInSuccessCallback() {
            $scope.$close();
        }
        this.getLoginForm = function() {
            return $scope.loginForm;
        };
        signIn(this, signInSuccessCallback);
    });
