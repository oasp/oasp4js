describe('Module: main, Controller: sign-in', function () {
    'use strict';
    var $scope, SIC, $location, oaspSecurityService, appContext, userHomeDialogPath;

    beforeEach(function () {
        oaspSecurityService = {
            logIn: angular.noop,
            checkIfUserIsLoggedInAndIfSoReinitializeAppContext: angular.noop
        };

        module('app.main', function ($provide) {
            $provide.value('oaspSecurityService', oaspSecurityService);
        });
    });

    beforeEach(inject(function ($rootScope, $controller, _$location_, $q) {
        appContext = {
            getCurrentUser: function () {
                return $q.when({
                    getHomeDialogPath: function () {
                        return userHomeDialogPath;
                    }
                });
            }
        };
        $location = _$location_;
        $scope = $rootScope;

        SIC = $controller('SignInCntl', {$scope: $scope, $location: $location, appContext: appContext});
    }));

    it('exposes errorMessage.text on controller instance which is empty string initially', function () {
        expect(SIC.errorMessage.text).toEqual('');
    });
    it('exposes errorMessage.hasOne() on controller instance which returns false when no message', function () {
        expect(SIC.errorMessage.hasOne()).toBeFalsy();
    });
    it('exposes hasErrorMessage() on controller instance which returns true when message present', function () {
        // when
        SIC.errorMessage.text = 'Error occurred';
        // then
        expect(SIC.errorMessage.hasOne()).toBeTruthy();
    });
    it('exposes clearMessage() on controller instance which resets the errorMessage to empty string', function () {
        // given
        SIC.errorMessage.text = 'Error occurred';
        // when
        SIC.errorMessage.clear();
        // then
        expect(SIC.errorMessage.text).toEqual('');
    });
    it('exposes signIn() on controller instance which changes to the user\'s home dialog on success', inject(function ($q) {
        // given
        userHomeDialogPath = '/some-module/home';
        spyOn(oaspSecurityService, 'logIn').and.callFake(function () {
            return $q.when();
        });
        $scope.loginForm = {
            $invalid: false
        };
        SIC.validation.forceShowingValidationErrors = true;
        // when
        SIC.signIn();
        $scope.$apply();
        // then
        expect($location.path()).toEqual(userHomeDialogPath);

    }));
    it('exposes signIn() on controller instance which adds an error message and clears the form on failure', inject(function ($q) {
        // given
        spyOn(oaspSecurityService, 'logIn').and.callFake(function () {
            return $q.reject();
        });
        $scope.loginForm = {
            $invalid: false,
            $setPristine: jasmine.createSpy('$setPristine'),
            $setUntouched: jasmine.createSpy('$setUntouched')
        };
        SIC.validation.forceShowingValidationErrors = true;
        // when
        SIC.signIn();
        $scope.$apply();
        // then
        expect(SIC.errorMessage.text).toEqual('Authentication failed. Please try again!');
        expect(SIC.credentials).toEqual({});
        expect(SIC.validation.forceShowingValidationErrors).toBeFalsy();
        expect($scope.loginForm.$setPristine).toHaveBeenCalled();
        expect($scope.loginForm.$setUntouched).toHaveBeenCalled();
    }));
    it('exposes signIn() on controller instance which forces showing errors when the form invalid', function () {
        // given
        $scope.loginForm = {
            $invalid: true
        };
        SIC.validation.forceShowingValidationErrors = false;
        // when
        SIC.signIn();
        // then
        expect(SIC.validation.forceShowingValidationErrors).toBeTruthy();
    });
    it('exposes validation.userNameNotProvided() on controller instance which returns true if field dirty and empty', function () {
        // given // when
        $scope.loginForm = {
            userName: {
                $dirty: true,
                $error: {
                    required: true
                }
            }
        };
        SIC.validation.forceShowingValidationErrors = false;
        // then
        expect(SIC.validation.userNameNotProvided()).toBeTruthy();
    });
    it('exposes validation.userNameNotProvided() on controller instance which returns true if field empty and forced validation',
        function () {
            // given // when
            $scope.loginForm = {
                userName: {
                    $dirty: false,
                    $error: {
                        required: true
                    }
                }
            };
            SIC.validation.forceShowingValidationErrors = true;
            // then
            expect(SIC.validation.userNameNotProvided()).toBeTruthy();
        });
    it('exposes validation.userNameNotProvided() on controller instance which returns false if field empty and neither validation forced nor filed dirty',
        function () {
            // given // when
            $scope.loginForm = {
                userName: {
                    $dirty: false,
                    $error: {
                        required: true
                    }
                }
            };
            SIC.validation.forceShowingValidationErrors = false;
            // then
            expect(SIC.validation.userNameNotProvided()).toBeFalsy();
        });
    it('exposes validation.passwordNotProvided() on controller instance which returns true if field dirty and empty', function () {
        // given // when
        $scope.loginForm = {
            password: {
                $dirty: true,
                $error: {
                    required: true
                }
            }
        };
        SIC.validation.forceShowingValidationErrors = false;
        // then
        expect(SIC.validation.passwordNotProvided()).toBeTruthy();
    });
    it('exposes validation.passwordNotProvided() on controller instance which returns true if field empty and forced validation',
        function () {
            // given // when
            $scope.loginForm = {
                password: {
                    $dirty: false,
                    $error: {
                        required: true
                    }
                }
            };
            SIC.validation.forceShowingValidationErrors = true;
            // then
            expect(SIC.validation.passwordNotProvided()).toBeTruthy();
        });
    it('exposes validation.passwordNotProvided() on controller instance which returns false if field empty and neither validation forced nor filed dirty',
        function () {
            // given // when
            $scope.loginForm = {
                password: {
                    $dirty: false,
                    $error: {
                        required: true
                    }
                }
            };
            SIC.validation.forceShowingValidationErrors = false;
            // then
            expect(SIC.validation.passwordNotProvided()).toBeFalsy();
        });
});
