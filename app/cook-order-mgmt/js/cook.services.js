angular.module('app.cook-order-mgmt').factory('orders', function (cookManagmentRestServices) {
    'use strict';
    var orders = [];
    return {
        getAllOrders: function () {
            return cookManagmentRestServices.getAllOrders().then(function (response) {
                angular.copy(response.data, orders);
                return orders;
            });
        },

        getOrdersPosition: function () {
            return cookManagmentRestServices.getAllOrders().then(function (response) {
                angular.copy(response.data, orders);
                // waiting for rest service findOrdersPosition
                return orders[0].positions;
            });
        }
    };
});