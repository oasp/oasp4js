describe('Module: tableMgmt, Controller: table-details', function () {
    'use strict';
    var $scope, TDC,
        tablesMock,
        offersMock,
        salesMock,
        TABLE_ID = 102,
        $stateParamsMock = {
            tableId: TABLE_ID
        },
        tableDetailsMock = {
            id: TABLE_ID,
            number: 3,
            state: 'FREE'
        }, allOffersMock = {},
        currentOrderMock = {
            order: {
                id: 10000000,
                modificationCounter: 0,
                revision: null,
                tableId: TABLE_ID,
                state: 'OPEN'
            },
            positions: [
                {id: 10000010},
                {id: 10000011}
            ]
        };

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('app.table-mgmt'));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        //given
        tablesMock = {
            loadTable: function(){
                return $q.when(tableDetailsMock);
            }
        };
        offersMock = {
            loadAllOffers: function(){
                return $q.when(allOffersMock);
            }
        };
        salesMock = {
            saveOrUpdateOrder: function(){
                return $q.when();
            },
            loadOrderForTable: function(){
                return $q.when(currentOrderMock);
            }
        };
        spyOn(salesMock, 'saveOrUpdateOrder').and.callThrough();

        $scope = $rootScope.$new();
        TDC = $controller('TableDetailsCntl', {$scope: $scope, $stateParams: $stateParamsMock, tables: tablesMock, offers: offersMock, sales: salesMock});
        $scope.$digest();
    }));

    describe('testing $scope functions', function () {
        it('should call $sce.trustAsHtml when $scope.trustAsHtml is called', inject(function ($sce) {
            //given
            var value = 'some value';
            spyOn($sce, 'trustAsHtml');
            //when
            TDC.trustAsHtml(value);
            //then
            expect($sce.trustAsHtml).toHaveBeenCalledWith(value);
        }));

        it('should return false when there is an order assigned to the table', function () {
            //given when then
            expect(TDC.noOrderAssigned()).toBeFalsy();
        });

        it('should return true then there is an order assigned to the table', function () {
            //given when then
            expect(TDC.orderAssigned()).toBeTruthy();
        });

        it('should assign new order to the table', function () {
            //given when
            TDC.assignNewOrder();
            //then
            expect(TDC.model.order).toEqual({order: {
                tableId: TABLE_ID,
                state: 'OPEN'
            }, positions: []});
        });

        it('should update order when submit button is clicked', inject(function (globalSpinner, positionStateNotification, $q, $state) {
            //given
            var positionStateNotificationDeferred = $q.defer();
            TDC.model.order.positions = [];
            TDC.model.order.positions.push({id: 1, status: 'STATUS'});
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            spyOn(positionStateNotification, 'connect').and.returnValue(positionStateNotificationDeferred.promise);
            spyOn(positionStateNotification, 'notify');
            spyOn($state, 'go');

            //when
            TDC.submit();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(salesMock.saveOrUpdateOrder).toHaveBeenCalledWith(currentOrderMock);

            //when
            positionStateNotificationDeferred.resolve();
            $scope.$digest();
            //then
            expect(positionStateNotification.connect).toHaveBeenCalled();
            expect(positionStateNotification.notify).toHaveBeenCalledWith(1, 'STATUS');
            expect($state.go).toHaveBeenCalledWith('tableMgmt.search');
        }));

        it('should add position to the order when add button is clicked', function () {
            //given
            var offer = {
                id: 1,
                description: 'description',
                price: 'price'
            };
            //when
            TDC.addPosition(offer);
            //then
            expect(TDC.model.order.positions.length).toEqual(2);
            expect(TDC.model.order.positions[1]).toEqual({
                revision: null,
                orderId: 10000000,
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
            TDC.selectedItems.push(TDC.model.order.positions[1]);
            //when
            TDC.buttonDefs[0].onClick();
            //then
            expect(TDC.model.order.positions.length).toEqual(1);
            expect(TDC.selectedItems.length).toEqual(0);
        });

        it('should activate remove button where there is an item selected', function () {
            //given
            TDC.selectedItems.push(TDC.model.order.positions[0]);
            //when then
            expect(TDC.buttonDefs[0].isActive()).toBeTruthy();
        });
    });
});
