angular.module('oasp.main')
    .controller('SignInCntl', function ($scope, $location, security) {
        "use strict";
        $scope.errorMessage = '';
        $scope.hasErrorMessage = function () {
            return $scope.errorMessage ? true : false;
        };
        $scope.clearMessage = function () {
            $scope.errorMessage = '';
        };

        $scope.credentials = {};
        $scope.forceShowingValidationErrors = false;
        $scope.userNameNotProvided = function () {
            return ($scope.loginForm.userName.$dirty || $scope.forceShowingValidationErrors) && $scope.loginForm.userName.$error.required;
        };
        $scope.passwordNotProvided = function () {
            return ($scope.loginForm.password.$dirty || $scope.forceShowingValidationErrors) && $scope.loginForm.password.$error.required;
        };
        $scope.signIn = function () {
            var addErrorMessage = function (message) {
                $scope.errorMessage = message;
                $scope.credentials = {};
                $scope.forceShowingValidationErrors = false;
                $scope.loginForm.$setPristine();
            };
            if ($scope.loginForm.$invalid) {
                $scope.forceShowingValidationErrors = true;
            } else {
                security.logIn($scope.credentials).success(function () {
                    security.getCurrentUser()
                        .success(function (userProfile) {
                            $scope.currentUser.onSuccessfulLogin(userProfile);
                            $location.url('/table-mgmt/table-search');
                        }).error(function (errorCode) {
                            addErrorMessage('Error occurred while getting user data. Please refresh the page!');
                        });
                }).error(function () {
                    addErrorMessage('Authentication failed. Please try again!');
                });
            }
        };
    });