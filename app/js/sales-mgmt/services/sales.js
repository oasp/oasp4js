angular.module('gastronomy.salesMgmt').factory('sales', function (salesManagementRestService) {
    'use strict';
    return {
        loadOrderForTable: function (tableId) {
            return salesManagementRestService.findOrders({tableId: tableId, state: 'OPEN'}).then(function (response) {
                return response.data && response.data.length ? response.data[0] : undefined;
            });
        },
        saveOrUpdateOrder: function (order) {
            return salesManagementRestService.updateOrder(order, order.order.id).then(function (response) {
                return response.data;
            });
        }
    };
});
