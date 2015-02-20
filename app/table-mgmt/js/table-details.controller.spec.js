describe('Module: tableMgmt, Controller: table-details', function () {
    'use strict';
    var $scope, deferred, tableDetailsMock = {
        id: 103,
        number: 3,
        state: 'FREE'
    }, allOffersMock = {}, currentOrderMock = {
        order: {
            id: 1,
            state: 'OPEN',
            tableId: 103
        }}, salesMock = {
        saveOrUpdateOrder: angular.noop
    };

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('app.table-mgmt'));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        //given
        deferred = $q.defer();
        spyOn(salesMock, 'saveOrUpdateOrder').and.returnValue(deferred.promise);
        $scope = $rootScope.$new();
        $controller('TableDetailsCntl', {$scope: $scope, tableDetails: tableDetailsMock, allOffers: allOffersMock, currentOrder: currentOrderMock, sales: salesMock});
    }));

    describe('testing $scope functions', function () {
        it('should call $sce.trustAsHtml when $scope.trustAsHtml is called', inject(function ($sce) {
            //given
            var value = 'some value';
            spyOn($sce, 'trustAsHtml');
            //when
            $scope.trustAsHtml(value);
            //then
            expect($sce.trustAsHtml).toHaveBeenCalledWith(value);
        }));

        it('should return false when there is an order assigned to the table', function () {
            //given when then
            expect($scope.noOrderAssigned()).toBeFalsy();
        });

        it('should return true then there is an order assigned to the table', function () {
            //given when then
            expect($scope.orderAssigned()).toBeTruthy();
        });

        it('should assign new order to the table', function () {
            //given when
            $scope.assignNewOrder();
            //then
            expect($scope.model.order).toEqual({order: {
                tableId: 103,
                state: 'OPEN'
            }, positions: []});
        });

        it('should update order when submit button is clicked', inject(function (globalSpinner, positionStateNotification, $q) {
            //given
            var positionStateNotificationDeferred = $q.defer();
            $scope.model.order.positions = [];
            $scope.model.order.positions.push({id: 1, status: 'STATUS'});
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            spyOn(positionStateNotification, 'connect').and.returnValue(positionStateNotificationDeferred.promise);
            spyOn(positionStateNotification, 'notify');
            $scope.$close = angular.noop;
            spyOn($scope, '$close');
            //when
            $scope.submit();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(salesMock.saveOrUpdateOrder).toHaveBeenCalledWith(currentOrderMock);

            //when
            deferred.resolve();
            positionStateNotificationDeferred.resolve();
            $scope.$digest();
            //then
            expect(positionStateNotification.connect).toHaveBeenCalled();
            expect(positionStateNotification.notify).toHaveBeenCalledWith(1, 'STATUS');
            expect($scope.$close).toHaveBeenCalled();
        }));

        it('should add position to the order when add button is clicked', function () {
            //given
            var offer = {
                id: 1,
                description: 'description',
                price: 'price'
            };
            //when
            $scope.addPosition(offer);
            //then
            expect($scope.model.order.positions.length).toEqual(2);
            expect($scope.model.order.positions[1]).toEqual({
                revision: null,
                orderId: 1,
                offerId: offer.id,
                offerName: offer.description,
                state: 'ORDERED',
                price: offer.price,
                comment: ''
            });
        });
    });

    describe('testing button definitions', function () {
        it('should remove selected position on remove button click', function () {
            //given
            $scope.selectedItems.push($scope.model.order.positions[1]);
            //when
            $scope.buttonDefs[0].onClick();
            //then
            expect($scope.model.order.positions.length).toEqual(1);
            expect($scope.selectedItems.length).toEqual(0);
        });

        it('should activate remove button where there is an item selected', function () {
            //given
            $scope.selectedItems.push($scope.model.order.positions[0]);
            //when then
            expect($scope.buttonDefs[0].isActive()).toBeTruthy();
        });
    });


});