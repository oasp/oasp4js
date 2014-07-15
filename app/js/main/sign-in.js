/*globals angular*/
angular.module('oasp.main')
    .controller('SignInCntl', function ($scope, $location, security) {
        "use strict";
        $scope.errorMessage = {
            text: '',
            hasOne: function () {
                return this.text ? true : false;
            },
            clear: function () {
                this.text = '';
            }
        };

        $scope.credentials = {};

        $scope.validation = {
            userNameNotProvided: function () {
                return ($scope.loginForm.userName.$dirty || this.forceShowingValidationErrors) &&
                    $scope.loginForm.userName.$error.required;
            },
            passwordNotProvided: function () {
                return ($scope.loginForm.password.$dirty || this.forceShowingValidationErrors) &&
                    $scope.loginForm.password.$error.required;
            },
            forceShowingValidationErrors: false
        };

        $scope.signIn = function () {
            var addErrorMessageAndClearForm = function (message) {
                $scope.errorMessage.text = message;
                $scope.credentials = {};
                $scope.validation.forceShowingValidationErrors = false;
                $scope.loginForm.$setPristine();
            };
            if ($scope.loginForm.$invalid) {
                $scope.validation.forceShowingValidationErrors = true;
            } else {
                security.logIn($scope.credentials).success(function () {
                    $location.url('/table-mgmt/table-search');
                }).error(function () {
                    addErrorMessageAndClearForm('Authentication failed. Please try again!');
                });
            }
        };
    });