describe('Module: tableMgmt, Controller: order-details', function () {
    'use strict';
    var $scope;

    beforeEach(module('gastronomy.tableMgmt'));

    beforeEach(inject(function ($rootScope, $controller) {
        //given
        $scope = $rootScope.$new();
        $controller('OrderDetailsCntl', {$scope: $scope, $routeParams: {
            tableId: 4
        }});
    }));
    it('should set proper table id', function () {
        expect($scope.tableId).toBe(4);
    });
});