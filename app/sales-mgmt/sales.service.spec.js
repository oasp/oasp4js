/*globals oasp*/
describe('Module: \'app.sales-mgmt\', Service: \'sales\'', function () {
    'use strict';
    var contextPath = '/oasp-app/', $httpBackend, sales;

    beforeEach(module('app.sales-mgmt', function ($provide) {
        $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
    }));
    /*jslint nomen: true */
    beforeEach(inject(function (_$httpBackend_, _sales_) {
        $httpBackend = _$httpBackend_;
        sales = _sales_;
    }));
    /*jslint nomen: false */
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('loads an order for a given table', function () {
        // given
        var paginatedOrders = {
            pagination: {size: 500, page: 1, total: null},
            result: [
                {
                    order: {
                        id: 10000000,
                        modificationCounter: 0,
                        revision: null,
                        tableId: 102,
                        state: 'OPEN'
                    },
                    positions: [
                        {id: 10000010},
                        {id: 10000011}
                    ]
                }
            ]
        },
            loadedOrder,
            orderSearchCriteria = {
                state: 'OPEN',
                tableId: 102
            };
        $httpBackend.whenPOST(contextPath + 'services/rest/salesmanagement/v1/order/search', orderSearchCriteria).respond(paginatedOrders);

        // when
        sales.loadOrderForTable(102)
            .then(function (result) {
                loadedOrder = result;
            });
        $httpBackend.flush();
        // then
        expect(loadedOrder.order).toEqual({
            id: 10000000,
            modificationCounter: 0,
            revision: null,
            tableId: 102,
            state: 'OPEN'
        });
    });
    it('returns undefined when no orders exist', function () {
        // given
        var paginatedOrders = {
            pagination: {size: 500, page: 1, total: null},
            result: [
            ]
        },
            loadedOrder,
            orderSearchCriteria = {
                state: 'OPEN',
                tableId: 102
            };
        $httpBackend.whenPOST(contextPath + 'services/rest/salesmanagement/v1/order/search', orderSearchCriteria).respond(paginatedOrders);

        // when
        sales.loadOrderForTable(102)
            .then(function (order) {
                loadedOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(loadedOrder).toBeUndefined();
    });
    it('saves an order', function () {
        // given
        var savedOrder, returnedOrder = {order: {id: 1}};
        $httpBackend.whenPOST(contextPath + 'services/rest/salesmanagement/v1/order').respond(returnedOrder);
        // when
        sales.saveOrUpdateOrder({order: {}})
            .then(function (order) {
                savedOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(savedOrder).toEqual(returnedOrder);
    });
});

