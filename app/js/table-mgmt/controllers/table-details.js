/* angular */
angular.module('gastronomy.tableMgmt')
    .controller('TableDetailsCntl', function ($scope, $modalInstance, tableDetails) {
        'use strict';
        $scope.table = tableDetails;
        $scope.noOrderAssigned = function () {
            return !$scope.table.order;
        };
        $scope.orderAssigned = function () {
            return !$scope.noOrderAssigned();
        };
        $scope.assignNewOrder = function () {
            $scope.table.order = {
                tableId: $scope.table.id,
                orderState: 'INIT',
                positions: []
            };
        };
        $scope.columnDefs = [
            {
                field: 'id',
                label: 'Number'
            },
            {
                field: 'offername',
                label: 'Title'
            },
            {
                field: 'state',
                label: 'Status'
            },
            {
                field: 'price',
                label: 'Price'
            },
            {
                field: 'comment',
                label: 'Comment'
            }
        ];

        // form container to access forms added in parent scopes
        $scope.forms = {};

        $scope.ok = function () {
            $modalInstance.close();
        };
    });
