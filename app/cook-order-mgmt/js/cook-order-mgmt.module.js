angular.module('app.cook-order-mgmt', ['ngRoute', 'app.main'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/cook-order-mgmt/order-view', {
        templateUrl: 'cook-order-mgmt/html/order-view.html',
        controller: 'CookOrderViewCntl',
        resolve: {
            initialOrders: ['orders', function (orders) {
                return orders.getOrdersPosition();
            }]
        }
    });
});
