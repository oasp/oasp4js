/* angular */
angular.module('gastronomy.tableMgmt').controller('TableDetailsCntl', function ($scope, $sce, tableDetails, allOffers, currentOrder) {
    'use strict';
    $scope.table = tableDetails;
    $scope.allOffers = allOffers;
    $scope.model = {};
    $scope.model.order = currentOrder;
    $scope.model.selected = allOffers.length ? allOffers[0] : undefined;

    $scope.trustAsHtml = function (value) {
        return $sce.trustAsHtml(value);
    };

    $scope.noOrderAssigned = function () {
        return !$scope.model.order;
    };
    $scope.orderAssigned = function () {
        return !$scope.noOrderAssigned();
    };
    $scope.assignNewOrder = function () {
        $scope.model.order = {
            tableId: $scope.table.id,
            orderState: 'INIT',
            positions: []
        };
    };
    $scope.columnDefs = [
        {
            field: 'orderId',
            label: 'Number'
        },
        {
            field: 'offerName',
            label: 'Title'
        },
        {
            field: 'state',
            label: 'Status'
        },
        {
            field: 'price',
            label: 'Price',
            renderer: function (row) {
                return row.price ? '<span>' + row.price.amount + ' ' + row.price.currency + '</span>' : '';
            }
        },
        {
            field: 'comment',
            label: 'Comment'
        }
    ];

    // form container to access forms added in parent scopes
    $scope.forms = {};

    $scope.ok = function () {
        $scope.$close();
    };
    $scope.addPosition = function (offer) {
        $scope.model.order.positions.push({
            orderId: $scope.model.order.positions.length + 1,
            offerId: offer.id,
            offerName: offer.description,
            state: 'ORDERED',
            price: offer.price,
            comment: ''
        });
    };
});
