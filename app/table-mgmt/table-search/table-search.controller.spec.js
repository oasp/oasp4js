describe('Module: tableMgmt, Controller: table-search', function () {
    'use strict';
    var $scope, deferred,
        tableResults = {
            pagination: {
                size: 4,
                page: 1,
                total: 5
            },
            result: [
                {
                    id: 101,
                    modificationCounter: 1,
                    revision: null,
                    waiterId: null,
                    number: 1,
                    state: 'OCCUPIED'
                },
                {
                    id: 102,
                    modificationCounter: 1,
                    revision: null,
                    waiterId: null,
                    number: 2,
                    state: 'FREE'
                },
                {
                    id: 103,
                    modificationCounter: 1,
                    revision: null,
                    waiterId: null,
                    number: 3,
                    state: 'FREE'
                },
                {
                    id: 104,
                    modificationCounter: 1,
                    revision: null,
                    waiterId: null,
                    number: 4,
                    state: 'FREE'
                }
            ]
        },
        tablesMock = {
            loadTable: jasmine.createSpy(),
            reserve: angular.noop,
            cancelReservation: angular.noop,
            occupy: angular.noop,
            free: angular.noop,
            getPaginatedTables: function () {
                return {
                    then: function () {
                        return {
                            then: function (callback) {
                                return callback({});
                            }
                        };
                    }
                };
            }
        },
        offersMock = {
            loadAllOffers: jasmine.createSpy()
        },
        salesMock = {
            loadOrderForTable: jasmine.createSpy()
        };

    beforeEach(module('app.table-mgmt'));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        //given
        $scope = $rootScope.$new();
        deferred = $q.defer();
        //var res = {result: []};
        spyOn(tablesMock, 'reserve').and.returnValue(deferred.promise);
        spyOn(tablesMock, 'cancelReservation').and.returnValue(deferred.promise);
        spyOn(tablesMock, 'occupy').and.returnValue(deferred.promise);
        spyOn(tablesMock, 'free').and.returnValue(deferred.promise);
        spyOn(tablesMock, 'getPaginatedTables').and.callThrough();//and.callFake(function() {return {then: function(callback) { return callback(res); } };});
        $controller('TableSearchCntl', {$scope: $scope, tables: tablesMock, sales: salesMock, offers: offersMock, paginatedTableList: tableResults});
    }));

    it('exposes tables referencing tables from service on $scope', function () {
        expect($scope.gridOptions.data).toBeDefined();
    });

    it('should call $state.go when edit button is clicked', inject(function ($state) {
        //given
        var tableRow = {
            id: 104
        };
        spyOn($state, 'go').and.callThrough();
        //when
        $scope.openEditDialog(tableRow);
        //then
        expect($state.go).toHaveBeenCalledWith('tableMgmt.details', {tableId: tableRow.id});
    }));

    describe('testing buttons definitions', function () {

        it('should define buttons', function () {
            //given when then
            expect($scope.buttonDefs).toBeDefined();
            expect($scope.buttonDefs.length).toEqual(5);
        });

        it('should call $scope.openEditDialog when edit button is clicked', function () {
            //given
            $scope.selectedItems = [
                {id: 1}
            ];
            spyOn($scope, 'openEditDialog');
            //when
            $scope.buttonDefs[0].onClick();
            //then
            expect($scope.openEditDialog).toHaveBeenCalledWith($scope.selectedItems[0]);
            expect($scope.buttonDefs[0].isActive()).toBeTruthy();
        });

        it('should call activate edit button only when there are selected items', function () {
            //given
            $scope.selectedItems = [
                {id: 1}
            ];
            //when then
            expect($scope.buttonDefs[0].isActive()).toBeTruthy();
        });

        it('should call tables.reserve when reserve button is clicked', inject(function (globalSpinner) {
            //given
            var elem = {id: 1};
            $scope.selectedItems = [elem];
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            //when
            $scope.buttonDefs[1].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(tablesMock.reserve).toHaveBeenCalledWith(elem);
        }));

        it('should activate reserve button when there is a selected item in the FREE state', function () {
            //given
            $scope.selectedItems = [
                {
                    id: 1,
                    state: 'FREE'
                }
            ];
            //when then
            expect($scope.buttonDefs[1].isActive()).toBeTruthy();
        });

        it('should call tables.cancelReservation when reserve button is clicked', inject(function (globalSpinner) {
            //given
            var elem = {id: 1};
            $scope.selectedItems = [elem];
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            //when
            $scope.buttonDefs[2].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(tablesMock.cancelReservation).toHaveBeenCalledWith(elem);
        }));

        it('should activate cancel reservation button when there is a selected item in the RESERVED state', function () {
            //given
            $scope.selectedItems = [
                {
                    id: 1,
                    state: 'RESERVED'
                }
            ];
            //when then
            expect($scope.buttonDefs[2].isActive()).toBeTruthy();
        });

        it('should call tables.occupy when occupy button is clicked', inject(function (globalSpinner) {
            //given
            var elem = {id: 1};
            $scope.selectedItems = [elem];
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            //when
            $scope.buttonDefs[3].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(tablesMock.occupy).toHaveBeenCalledWith(elem);
        }));

        it('should activate occupy button when there is a selected item in the RESERVED or FREE state', function () {
            //given
            $scope.selectedItems = [
                {
                    id: 1,
                    state: 'RESERVED'
                }
            ];
            //when then
            expect($scope.buttonDefs[3].isActive()).toBeTruthy();
            //when
            $scope.selectedItems[0].state = 'FREE';
            //then
            expect($scope.buttonDefs[3].isActive()).toBeTruthy();
        });

        it('should call tables.free when free button is clicked', inject(function (globalSpinner) {
            //given
            var elem = {id: 1};
            $scope.selectedItems = [elem];
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            //when
            $scope.buttonDefs[4].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(tablesMock.free).toHaveBeenCalledWith(elem);
        }));

        it('should activate free button when there is a selected item in the OCCUPIED state', function () {
            //given
            $scope.selectedItems = [
                {
                    id: 1,
                    state: 'OCCUPIED'
                }
            ];
            //when then
            expect($scope.buttonDefs[4].isActive()).toBeTruthy();
        });

        it('should reload displayed tables when the page selected on the pagination element changes', function () {
            //given
            //when
            $scope.currentPage = 2;
            $scope.$digest();
            //then
            expect(tablesMock.getPaginatedTables).toHaveBeenCalledWith(2, 4);
        });

    });
});
