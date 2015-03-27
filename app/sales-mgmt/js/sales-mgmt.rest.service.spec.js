/*globals oasp*/
describe('Module: salesMgmt, Service: salesManagementRestService', function () {
    'use strict';
    var salesManagementRestService, contextPath = '/contextPath/';

    beforeEach(module('app.sales-mgmt', function ($provide) {
        $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
    }));

    beforeEach(inject(function (_salesManagementRestService_) {
        salesManagementRestService = _salesManagementRestService_;
    }));

    it('should call $http.get when salesManagementRestService.findOrders is called', inject(function ($http) {
        //given
        var params = {id: 'orderId'};
        spyOn($http, 'get');
        //when
        salesManagementRestService.findOrders(params);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/salesmanagement/v1/order', {params: params});
    }));

    it('should call $http.put when salesManagementRestService.updateOrder is called', inject(function ($http) {
        //given
        var orderId = 1, order = {description: 'desc'};

        spyOn($http, 'put');
        //when
        salesManagementRestService.updateOrder(order, orderId);
        //then
        expect($http.put).toHaveBeenCalledWith(contextPath + 'services/rest/salesmanagement/v1/order/' + orderId, order);
    }));

    it('should call $http.post when salesManagementRestService.createOrder is called', inject(function ($http) {
        //given
        var order = {description: 'desc'};

        spyOn($http, 'post');
        //when
        salesManagementRestService.createOrder(order);
        //then
        expect($http.post).toHaveBeenCalledWith(contextPath + 'services/rest/salesmanagement/v1/order', order);
    }));

    it('should call $http.post when salesManagementRestService.updateOrderPosition is called', inject(function ($http) {
        //given
        var orderPosition = 1;

        spyOn($http, 'post');
        //when
        salesManagementRestService.updateOrderPosition(orderPosition);
        //then
        expect($http.post).toHaveBeenCalledWith(contextPath + 'services/rest/salesmanagement/v1/orderposition', orderPosition);
    }));

    it('should call $http.get when salesManagementRestService.findOrderPositions is called', inject(function ($http) {
        //given
        var params = {orderId: 'id'};

        spyOn($http, 'get');
        //when
        salesManagementRestService.findOrderPositions(params);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/salesmanagement/v1/orderposition', {params: params});
    }));
});