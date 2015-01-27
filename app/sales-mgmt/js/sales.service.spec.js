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
        var orders = [{id: '1'}, {id: '2'}], loadedOrder;
        $httpBackend.whenGET(contextPath + 'services/rest/salesmanagement/order?state=OPEN&tableId=1').respond(orders);

        // when
        sales.loadOrderForTable(1)
            .then(function (order) {
                loadedOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(loadedOrder).toEqual({id: '1'});
    });
    it('returns undefined when no orders exist', function () {
        // given
        var loadedOrder;
        $httpBackend.whenGET(contextPath + 'services/rest/salesmanagement/order?state=OPEN&tableId=1').respond([]);

        // when
        sales.loadOrderForTable(1)
            .then(function (order) {
                loadedOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(loadedOrder).toBeUndefined();
    });
    it('saves an order', function () {
        // given
        var createdOrder, returnedOrder = {order: {id: 1}};
        $httpBackend.whenPOST(contextPath + 'services/rest/salesmanagement/order').respond(returnedOrder);
        // when
        sales.saveOrUpdateOrder({order: {}})
            .then(function (order) {
                createdOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(createdOrder).toEqual(returnedOrder);
    });
    it('saves an order', function () {
        // given
        var createdOrder, returnedOrder = {order: {id: 1}};
        $httpBackend.whenPOST(contextPath + 'services/rest/salesmanagement/order').respond(returnedOrder);
        // when
        sales.saveOrUpdateOrder({order: {}})
            .then(function (order) {
                createdOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(createdOrder).toEqual(returnedOrder);
    });
    it('updates an existing order', function () {
        // given
        var updatedOrder, returnedOrder = {order: {id: 1, status : 'NEW'}};
        $httpBackend.whenPUT(contextPath + 'services/rest/salesmanagement/order/1').respond(returnedOrder);
        // when
        sales.saveOrUpdateOrder({order: {id : 1}})
            .then(function (order) {
                updatedOrder = order;
            });
        $httpBackend.flush();
        // then
        expect(updatedOrder).toEqual(returnedOrder);
    });
});

