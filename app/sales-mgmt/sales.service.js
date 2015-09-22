angular.module('app.sales-mgmt').factory('sales', function (salesManagementRestService) {
    'use strict';
    return {
        loadOrderForTable: function (tableId) {
            var orderSearchCriteria = {
                state: 'OPEN',
                tableId: tableId
            };
            return salesManagementRestService.findOrders(orderSearchCriteria).then(function (response) {
                return response.data.result && response.data.result.length ? response.data.result[0] : undefined;
            });
        },
        saveOrUpdateOrder: function (order) {
            var promise;
            //with the new REST API, there is no destinction between updating and creating an order
            promise = salesManagementRestService.saveOrder(order).then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
});
