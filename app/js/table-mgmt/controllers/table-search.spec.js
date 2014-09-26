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
    beforeEach(module('gastronomy.tableMgmt'));

    beforeEach(inject(function ($rootScope, $controller) {
        //given
        $scope = $rootScope.$new();
        $controller('TableSearchCntl', {$scope: $scope, tables: tablesMock });
    }));

    it('exposes tables referencing tables from service on $scope', function () {
        expect($scope.tables).toBeDefined();
    });
    it('exposes tables\' column definitions', function () {
        expect($scope.columnDefs).toBeDefined();
        expect($scope.columnDefs.length).toEqual(3);
        expect($scope.columnDefs[0].field).toEqual('id');
        expect($scope.columnDefs[1].field).toEqual('state');
        expect($scope.columnDefs[2].field).toEqual('waiter');
    });
});