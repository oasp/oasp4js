describe('Module: tableMgmt, Controller: table-search', function () {
    'use strict';
    var $scope, table = {
        id: '1',
        state: 'FREE',
        waiter: ''
    }, tablesMock = {
        getAllTables: function () {
            return [table];
        },
        reserve: jasmine.createSpy(),
        free: jasmine.createSpy(),
        occupy: jasmine.createSpy(),
        cancelReservation: jasmine.createSpy()
    };

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('app.table-mgmt'));

    beforeEach(inject(function ($rootScope, $controller) {
        //given
        $scope = $rootScope.$new();
        $controller('TableSearchCntl', {$scope: $scope, tables: tablesMock, initialTableList: [table] });
    }));

    it('exposes tables referencing tables from service on $scope', function () {
        expect($scope.gridOptions.data).toBeDefined();
    });
});