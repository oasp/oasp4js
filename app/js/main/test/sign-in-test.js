/*globals describe, beforeEach, module, afterEach, it, inject, spyOn, expect*/
describe('Module: main, Controller: sign-in', function () {
    "use strict";
    var $scope, $location, logInHttpDeferredMock;

    beforeEach(module('oasp.main'));

    beforeEach(inject(function ($rootScope, $controller, _$location_, $q) {
        var httpDeferredMockFactory = function ($q) {
            var httpDeferredMock = $q.defer(),
                httpPromiseMock = httpDeferredMock.promise;
            httpPromiseMock.success = function (fn) {
                httpPromiseMock.then(function () {
                    fn();
                });
                return httpPromiseMock;
            };

            httpPromiseMock.error = function (fn) {
                httpPromiseMock.then(null, function () {
                    fn();
                });
                return httpPromiseMock;
            };
            return httpDeferredMock;
        }, security = {
            logIn: function () {
                logInHttpDeferredMock = httpDeferredMockFactory($q);
                return logInHttpDeferredMock.promise;
            }
        };
        $location = _$location_;
        $scope = $rootScope;

        $controller('SignInCntl', {$scope: $scope, $location: $location, security: security});
    }));

    it('exposes errorMessage.text on $scope which is empty string initially', function () {
        expect($scope.errorMessage.text).toEqual('');
    });
    it('exposes errorMessage.hasOne() on $scope which returns false when no message', function () {
        expect($scope.errorMessage.hasOne()).toBeFalsy();
    });
    it('exposes hasErrorMessage() on $scope which returns true when message present', function () {
        // when
        $scope.errorMessage.text = 'Error occurred';
        // then
        expect($scope.errorMessage.hasOne()).toBeTruthy();
    });
    it('exposes clearMessage() on $scope which resets the errorMessage to empty string', function () {
        // given
        $scope.errorMessage.text = 'Error occurred';
        // when
        $scope.errorMessage.clear();
        // then
        expect($scope.errorMessage.text).toEqual('');
    });
    it('exposes signIn() on $scope which changes to the default location /table-mgmt/table-search on success', function () {
        // given
        $scope.loginForm = {
            $invalid : false
        };
        $scope.validation.forceShowingValidationErrors = true;
        // when
        $scope.signIn();
        logInHttpDeferredMock.resolve();
        $scope.$apply();
        // then
        expect($location.path()).toEqual('/table-mgmt/table-search');
    });
    it('exposes validation.userNameNotProvided() on $scope which returns true if field dirty and empty', function () {
        // given // when
        $scope.loginForm = {
            userName : {
                $dirty : true,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = false;
        // then
        expect($scope.validation.userNameNotProvided()).toBeTruthy();
    });
    it('exposes validation.userNameNotProvided() on $scope which returns true if field empty and forced validation', function () {
        // given // when
        $scope.loginForm = {
            userName : {
                $dirty : false,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = true;
        // then
        expect($scope.validation.userNameNotProvided()).toBeTruthy();
    });
    it('exposes validation.userNameNotProvided() on $scope which returns false if field empty and neither validation forced nor filed dirty', function () {
        // given // when
        $scope.loginForm = {
            userName : {
                $dirty : false,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = false;
        // then
        expect($scope.validation.userNameNotProvided()).toBeFalsy();
    });
    it('exposes validation.passwordNotProvided() on $scope which returns true if field dirty and empty', function () {
        // given // when
        $scope.loginForm = {
            password : {
                $dirty : true,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = false;
        // then
        expect($scope.validation.passwordNotProvided()).toBeTruthy();
    });
    it('exposes validation.passwordNotProvided() on $scope which returns true if field empty and forced validation', function () {
        // given // when
        $scope.loginForm = {
            password : {
                $dirty : false,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = true;
        // then
        expect($scope.validation.passwordNotProvided()).toBeTruthy();
    });
    it('exposes validation.passwordNotProvided() on $scope which returns false if field empty and neither validation forced nor filed dirty', function () {
        // given // when
        $scope.loginForm = {
            password : {
                $dirty : false,
                $error : {
                    required : true
                }
            }
        };
        $scope.validation.forceShowingValidationErrors = false;
        // then
        expect($scope.validation.passwordNotProvided()).toBeFalsy();
    });
});