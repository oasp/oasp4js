angular.module('app.table-mgmt').controller('TableDetailsCntl',
    function ($scope, $sce, tableDetails, allOffers, currentOrder, sales, globalSpinner) {
        'use strict';
        $scope.table = tableDetails;
        $scope.allOffers = allOffers;
        $scope.model = {};
        $scope.model.order = currentOrder;
        $scope.model.selected = allOffers.length ? allOffers[0] : undefined;
        $scope.selectedItems = [];

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
                order: {
                    tableId: $scope.table.id,
                    state: 'OPEN'
                },
                positions: []
            };
        };

        // form container to access forms added in parent scopes
        $scope.forms = {};

        $scope.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return sales.saveOrUpdateOrder($scope.model.order);
            }).then(function () {
                $scope.$close();
            });
        };
        $scope.addPosition = function (offer) {
            //$scope.gridOptions.data = $scope.model.order.positions;
            $scope.model.order.positions.push({
                revision: null,
                orderId: $scope.model.order.order.id,
                offerId: null,
                offerName: offer.description,
                state: 'ORDERED',
                price: offer.currentPrice,
                comment: ''
            });
        };

        $scope.buttonDefs = [
            {
                label: 'Remove',
                onClick: function () {
                    $scope.model.order.positions.splice($scope.model.order.positions.indexOf($scope.selectedItems[0]), 1);
                },
                isActive: function () {
                    return $scope.selectedItems.length;
                }
            }
        ];
    });
