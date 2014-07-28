describe('Controller: MainCntl', function () {
    'use strict';

    var $scope, $location, initializeUserHttpDeferredMock, logOffHttpDeferredMock;
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
            initializeUser: function () {
                initializeUserHttpDeferredMock = httpDeferredMockFactory($q);
                return initializeUserHttpDeferredMock.promise;
            },
            logOff: function () {
                logOffHttpDeferredMock = httpDeferredMockFactory($q);
                return logOffHttpDeferredMock.promise;
            },
            getCurrentUser: function () {
                return {
                    isLoggedIn: function () {
                        return false;
                    },
                    getUserName: function () {
                        return '';
                    }
                };
            }
        };
        $location = _$location_;
        $scope = $rootScope;

        $controller('MainCntl', {$scope: $scope, $location: $location, security: security});
    }));

    it('goes to /main/sign-in when initializing fails', function () {
        // when
        initializeUserHttpDeferredMock.reject();
        $scope.$apply();
        // then
        expect($location.path()).toEqual('/main/sign-in');
        expect($scope.currentUser.isLoggedIn()).toBeFalsy();
    });

    it('exposes currentUser.isLoggedIn() on $scope which returns false for anonymous user', function () {
        // when
        initializeUserHttpDeferredMock.resolve();
        $scope.$apply();
        // then
        expect($scope.currentUser.isLoggedIn()).toBeFalsy();
    });

    it('exposes currentUser.getName() on $scope which returns empty string if for anonymous user', function () {
        // when
        initializeUserHttpDeferredMock.resolve();
        $scope.$apply();
        // then
        expect($scope.currentUser.getUserName()).toEqual('');
    });

    it('exposes logOff() on $scope which redirects to /main/sign-in on success', function () {
        // given
        initializeUserHttpDeferredMock.resolve();
        $scope.$apply();
        $location.path('/table-mgmt/table-search');
        // when
        $scope.logOff();
        logOffHttpDeferredMock.resolve();
        $scope.$apply();
        // then
        expect($location.path()).toEqual('/main/sign-in');
    });
});
