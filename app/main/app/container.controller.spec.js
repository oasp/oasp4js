describe('Controller: ContainerCntl', function () {
    'use strict';

    var $scope, $window, security;
    beforeEach(module('app.main'));
    beforeEach(inject(function ($rootScope, $controller, $q) {
        security = {
            getCurrentUser: function () {
                return $q.when({
                    isLoggedIn: function () {
                        return false;
                    },
                    getUserName: function () {
                        return '';
                    }
                });
            }
        };
        $scope = $rootScope;
        $window = {
            location: jasmine.createSpyObj('location', ['href', 'reload'])
        };

        $controller('AppCntl',
            {$scope: $scope, oaspSecurityService: security, $window: $window});
    }));

    it('exposes currentUser.isLoggedIn() on $scope which returns false for anonymous user', function () {
        // then
        $scope.$apply();
        expect($scope.currentUser.isLoggedIn()).toBeFalsy();
    });

    it('exposes currentUser.getName() on $scope which returns empty string for anonymous users', function () {
        // then
        $scope.$apply();
        expect($scope.currentUser.getUserName()).toEqual('');
    });
});
