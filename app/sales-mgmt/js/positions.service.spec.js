describe('Module: \'app.sales-mgmt\', Service: \'positions\'', function () {
    'use strict';
    var $q, positions, $scope, successCallback, failureCallback,
        userId = 1234,
        userProfile = {
            getUserId: function () {
                return userId;
            }
        }, availablePositionId = 10000012, currentUserPositionId = 10000010, allPositions,
        allOffers = [
            {id: 1, description: 'Some super offer 1', mealId: 1, drinkId: 10, sideDishId: 5, state: 'NORMAL', price: '6.99'}
        ],
        allProducts = [
            {'@type': 'Meal', id: 1, description: 'Steak'},
            {'@type': 'Meal', id: 5, description: 'Fries'}
        ],
        currentUserPromise,
        appContextMock = {
            getCurrentUser: function () {
                return currentUserPromise;
            }
        },
        positionPromise,
        salesManagementRestServiceMock = {
            findOrderPositions: function () {
                return positionPromise;
            },
            updateOrderPosition: angular.noop
        },
        allOffersPromise, allProductsPromise,
        offersServiceMock = {
            loadAllOffers: function () {
                return allOffersPromise;
            },

            loadAllProducts: function () {
                return allProductsPromise;
            }
        };

    beforeEach(module('app.sales-mgmt', function ($provide) {
        $provide.value('appContext', appContextMock);
        $provide.value('salesManagementRestService', salesManagementRestServiceMock);
        $provide.value('offers', offersServiceMock);
    }));

    beforeEach(inject(function (_$q_, _positions_, $rootScope) {
        $q = _$q_;
        positions = _positions_;
        $scope = $rootScope;
        successCallback = jasmine.createSpy('successCallback');
        failureCallback = jasmine.createSpy('failureCallback');

        allPositions = [
            {id: currentUserPositionId, orderId: 10000001, cookId: 1234, offerId: 1, offerName: 'Some super offer 1', state: 'ORDERED', price: 6.99},
            {id: 10000011, orderId: 10000000, cookId: 5678, offerId: 1, offerName: 'Some super offer 1', state: 'ORDERED', price: 6.99},
            {id: availablePositionId, orderId: 10000000, cookId: null, offerId: 1, offerName: 'Some super offer 1', state: 'ORDERED', price: 6.99},
            {id: 10000013, orderId: 10000001, cookId: null, offerId: 1, offerName: 'Some super offer 1', state: 'ORDERED', price: 6.99}
        ];
    }));

    it('gets available positions as well as the ones assigned to current user', function () {
        // given
        var result;
        currentUserPromise = $q.when(userProfile);
        positionPromise = $q.when({data: allPositions});
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        // when
        positions.get().then(function (currentPositions) {
            result = currentPositions;
        });
        $scope.$apply();
        // then
        expect(result.availablePositions).toEqual([
            { id: 10000012, orderId: 10000000, offerName: 'Some super offer 1', mealName: 'Steak', sideDishName: 'Fries' },
            { id: 10000013, orderId: 10000001, offerName: 'Some super offer 1', mealName: 'Steak', sideDishName: 'Fries' }
        ]);
        expect(result.positionsAssignedToCurrentUser).toEqual([
            { id: 10000010, orderId: 10000001, offerName: 'Some super offer 1', mealName: 'Steak', sideDishName: 'Fries' }
        ]);
    });

    it('rejects getting available positions when no current user available', function () {
        // given
        currentUserPromise = $q.when({
            getUserId: angular.noop
        });
        positionPromise = $q.when({data: allPositions});
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        // when
        positions.get().then(successCallback, failureCallback);
        $scope.$apply();
        // then
        expect(failureCallback).toHaveBeenCalled();
        expect(successCallback).not.toHaveBeenCalled();
    });

    it('rejects getting available positions when REST service fails', function () {
        // given
        currentUserPromise = $q.when(userProfile);
        positionPromise = $q.reject();
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        // when
        positions.get().then(successCallback, failureCallback);
        $scope.$apply();
        // then
        expect(failureCallback).toHaveBeenCalled();
        expect(successCallback).not.toHaveBeenCalled();
    });

    it('assigns a cook to a free position', function () {
        // given
        currentUserPromise = $q.when(userProfile);
        positionPromise = $q.when({data: allPositions});
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        positions.get();
        $scope.$apply();
        spyOn(salesManagementRestServiceMock, 'updateOrderPosition').and.returnValue($q.when());
        // when
        positions.assignCookToPosition(availablePositionId).then(successCallback, failureCallback);
        $scope.$apply();
        // then
        expect(salesManagementRestServiceMock.updateOrderPosition).toHaveBeenCalledWith({
            id: availablePositionId,
            orderId: 10000000,
            cookId: userId,
            offerId: 1,
            offerName: 'Some super offer 1',
            state: 'ORDERED',
            price: 6.99
        });
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });

    it('makes an assigned position free', function () {
        // given
        currentUserPromise = $q.when(userProfile);
        positionPromise = $q.when({data: allPositions});
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        positions.get();
        $scope.$apply();
        spyOn(salesManagementRestServiceMock, 'updateOrderPosition').and.returnValue($q.when());
        // when
        positions.makePositionAvailable(currentUserPositionId).then(successCallback, failureCallback);
        $scope.$apply();
        // then
        expect(salesManagementRestServiceMock.updateOrderPosition).toHaveBeenCalledWith({
            id : currentUserPositionId,
            orderId : 10000001,
            cookId : undefined,
            offerId : 1,
            offerName : 'Some super offer 1',
            state : 'ORDERED',
            price : 6.99
        });
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });

    it('set status of an assigned position to prepared', function () {
        // given
        currentUserPromise = $q.when(userProfile);
        positionPromise = $q.when({data: allPositions});
        allOffersPromise = $q.when(allOffers);
        allProductsPromise = $q.when(allProducts);
        positions.get();
        $scope.$apply();
        spyOn(salesManagementRestServiceMock, 'updateOrderPosition').and.returnValue($q.when());
        // when
        positions.setPositionStatusToPrepared(currentUserPositionId).then(successCallback, failureCallback);
        $scope.$apply();
        // then
        expect(salesManagementRestServiceMock.updateOrderPosition).toHaveBeenCalledWith({
            id : currentUserPositionId,
            orderId : 10000001,
            cookId : userId,
            offerId : 1,
            offerName : 'Some super offer 1',
            state : 'PREPARED',
            price : 6.99
        });
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });
});
