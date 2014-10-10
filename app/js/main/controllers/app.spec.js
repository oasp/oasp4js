describe('Controller: AppCntl', function () {
    'use strict';

    var $scope, $location, $window, security;
    beforeEach(module('app.main'));
    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        security = {
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
        $window = {
            location: jasmine.createSpyObj('location', ['href', 'reload'])
        };

        $controller('AppCntl',
            {SIGN_IN_DLG_PATH: '/main/sign-in', $scope: $scope, $location: $location, security: security, $window: $window});
    }));

    it('exposes currentUser.isLoggedIn() on $scope which returns false for anonymous user', function () {
        // then
        expect($scope.currentUser.isLoggedIn()).toBeFalsy();
    });

    it('exposes currentUser.getName() on $scope which returns empty string for anonymous users', function () {
        // then
        expect($scope.currentUser.getUserName()).toEqual('');
    });

    it('exposes logOff() on $scope which redirects to the Sign In dialog on success', inject(function ($q, SIGN_IN_DLG_PATH) {
        // given
        security.logOff = jasmine.createSpy().andReturn($q.when(undefined));
        $location.path('/some-module/some-dialog');
        // when
        $scope.logOff();
        $scope.$apply();
        // then
        expect($location.path()).toEqual(SIGN_IN_DLG_PATH);
        expect($window.location.href).toMatch('.*' + SIGN_IN_DLG_PATH);
        expect($window.location.reload).toHaveBeenCalled();
    }));
});
