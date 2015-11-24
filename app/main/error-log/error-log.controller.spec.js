describe('Controller: errorLogCntl', function () {
    'use strict';
    var $scope;

    beforeEach(
        module('app.main')
    );

    beforeEach(inject(function ($rootScope, $controller, _oaspErrorNotificatorService_) {
        $scope = $rootScope;
        $controller('errorLogCntl',
            {
                $scope: $scope,
                oaspErrorNotificatorService: _oaspErrorNotificatorService_
            });
    }));

    it('checks if error log is an empty array', function () {
        expect($scope.errorLog).toEqual(jasmine.any(Array));
        expect($scope.errorLog.length).toBe(0);
    });

    it('checks if error log collapse variable is true', function () {
        expect($scope.errorLogIsCollapsed).toBeTruthy();
    });
});
