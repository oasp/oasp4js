angular.module('app.cook-order-mgmt').controller('CookOrderViewCntl',
    function ($scope, initialOrders) {
        'use strict';
        $scope.orders = initialOrders;

    });