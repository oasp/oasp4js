angular.module('app.cook-order-mgmt').controller('CookOrderViewCntl',
    function ($scope, initialOrders) {
        'use strict';
        $scope.columnDefs = [
            {field: 'orderId', label: 'Id'},
            {field: 'offerName', label: 'Offer Name'}
        ];
        $scope.orderPositions = initialOrders;
        $scope.assignOrder = function (orderPosition) {
            // todo assign the orderPosition to staff member
            orderPosition.state = 'ASSIGNED';
        };
    });