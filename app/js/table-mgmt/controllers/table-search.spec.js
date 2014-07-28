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
    }, $location;

    beforeEach(module('gastronomy.tableMgmt'));

    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        //given
        $scope = $rootScope.$new();
        $location = _$location_;
        $controller('TableSearchCntl', {$scope: $scope, tables: tablesMock });
    }));

    it('should create reference to tables from service', function () {
        expect($scope.tables).toBeDefined();
    });
    it('should call occupy action from service', function () {
        //when
        $scope.actionOccupy(table);
        //then
        expect(tablesMock.occupy).toHaveBeenCalledWith(table);
    });
    it('should call free action from service', function () {
        //when
        $scope.actionFree(table);
        //then
        expect(tablesMock.free).toHaveBeenCalledWith(table);
    });
    it('should call reserve action from service', function () {
        //when
        $scope.actionReserve(table);
        //then
        expect(tablesMock.reserve).toHaveBeenCalledWith(table);
    });
    it('should call cancelReservation action from service', function () {
        //when
        $scope.actionCancelReservation(table);
        //then
        expect(tablesMock.cancelReservation).toHaveBeenCalledWith(table);
    });

    it('should redirect to order details dialog on take order', function () {
        //when
        $scope.actionTakeOrder(table);
        //then
        expect($location.path()).toEqual('/table-mgmt/order-details/1');
    });

    it('should allow to reserve if table is free', function () {
        //when
        //then
        expect($scope.actionReserveAllowed({
            state: 'FREE'
        })).toBeTruthy();
    });

    it('should not allow to reserve if table is not FREE', function () {
        //when
        //then
        expect($scope.actionReserveAllowed({
            state: 'OCCUPIED'
        })).toBeFalsy();
    });
    it('should allow to free table if its OCCUPIED', function () {
        //when
        //then
        expect($scope.actionFreeAllowed({
            state: 'OCCUPIED'
        })).toBeTruthy();
    });
    it('should not allow to free table if its free', function () {
        //when
        //then
        expect($scope.actionFreeAllowed({
            state: 'FREE'
        })).toBeFalsy();
    });

    it('should allow to cancel reservation if table is RESERVED', function () {
        //when
        //then
        expect($scope.actionCancelReservationAllowed({
            state: 'RESERVED'
        })).toBeTruthy();
    });
    it('should not allow to cancel reservation if table is free', function () {
        //when
        //then
        expect($scope.actionCancelReservationAllowed({
            state: 'FREE'
        })).toBeFalsy();
    });
    it('should allow to take order if table is OCCUPIED', function () {
        //when
        //then
        expect($scope.actionTakeOrderAllowed({
            state: 'OCCUPIED'
        })).toBeTruthy();
    });
    it('should not allow to take order if table is free', function () {
        //when
        //then
        expect($scope.actionTakeOrderAllowed({
            state: 'FREE'
        })).toBeFalsy();
    });
    it('should allow to occupy table its FREE or RESERVED', function () {
        //when
        //then
        expect($scope.actionOccupyAllowed({
            state: 'FREE'
        })).toBeTruthy();
        expect($scope.actionOccupyAllowed({
            state: 'RESERVED'
        })).toBeTruthy();
    });
    it('should not allow to occupy table its  already OCCUPIED', function () {
        //when
        //then
        expect($scope.actionOccupyAllowed({
            state: 'OCCUPIED'
        })).toBeFalsy();
    });
});