angular.module('app.sales-mgmt')
    .controller('CookAssigmentCntl', function ($scope, currentPositions, positions, globalSpinner, positionStateNotification, $q) {
        'use strict';

        positionStateNotification.connect().then(function () {
            positionStateNotification.subscribe(function () {
                positions.get();
            });
        });

        $scope.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            multiSelect: true,
            enableFullRowSelection: true,
            enableColumnMenus: false
        };

        $scope.gridOptions.columnDefs = [
            {name: 'id', displayName: 'ID', minWidth: 80},
            {name: 'orderId', displayName: 'Order ID', minWidth: 80},
            {name: 'mealName', displayName: 'Meal', minWidth: 100},
            {name: 'sideDishName', displayName: 'Side Dish', minWidth: 100}
        ];
        function assignPositionsToGrid() {
            $scope.gridOptions.data = currentPositions ? currentPositions.availablePositions : [];
            $scope.gridOptionsAssigned.data = currentPositions ? currentPositions.positionsAssignedToCurrentUser : [];
        }

        $scope.gridOptionsAssigned = angular.copy($scope.gridOptions);
        assignPositionsToGrid();

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.positionsAvailableSelected.push(row.entity);
                } else {
                    $scope.positionsAvailableSelected.splice($scope.positionsAvailableSelected.indexOf(row.entity), 1);
                }
            });
        };

        $scope.gridOptionsAssigned.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.positionsAssignedSelected.push(row.entity);
                } else {
                    $scope.positionsAssignedSelected.splice($scope.positionsAssignedSelected.indexOf(row.entity), 1);
                }
            });
        };

        $scope.positionsAvailableSelected = [];
        $scope.positionsAssignedSelected = [];

        $scope.isAvailablePositionSelected = function () {
            return ($scope.positionsAvailableSelected && $scope.positionsAvailableSelected.length > 0) ? true : false;
        };

        $scope.isAssignedPositionSelected = function () {
            return ($scope.positionsAssignedSelected && $scope.positionsAssignedSelected.length > 0) ? true : false;
        };


        function refreshTable() {
            assignPositionsToGrid();
            $scope.gridApi.core.refresh();
            return currentPositions;
        }

        $scope.assignCookToPosition = function () {
            if ($scope.isAvailablePositionSelected()) {
                globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                    var promises = [];
                    angular.forEach($scope.positionsAvailableSelected, function (element) {
                        promises.push(positions.assignCookToPosition(element.id));
                    });
                    return $q.all(promises).then(function () {
                        $scope.positionsAssignedSelected.length = 0;
                        $scope.positionsAvailableSelected.length = 0;
                        return refreshTable();
                    });
                });
            }
        };

        $scope.buttonDefs = [
            {
                label: 'SALES_MGMT.DONE',
                onClick: function () {
                    if ($scope.isAssignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {


                            var promises = [];
                            angular.forEach($scope.positionsAssignedSelected, function (element) {
                                promises.push(positions.setPositionStatusToPrepared(element.id));
                            });
                            return $q.all(promises).then(function () {
                                $scope.positionsAssignedSelected.length = 0;
                                $scope.positionsAvailableSelected.length = 0;
                                return refreshTable();
                            });


                        });
                    }
                },
                isActive: function () {
                    return $scope.isAssignedPositionSelected();
                }
            },
            {
                label: 'SALES_MGMT.REJECT',
                onClick: function () {
                    if ($scope.isAssignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            var promises = [];
                            angular.forEach($scope.positionsAssignedSelected, function (element) {
                                promises.push(positions.makePositionAvailable(element.id));
                            });
                            return $q.all(promises).then(function () {
                                $scope.positionsAssignedSelected.length = 0;
                                $scope.positionsAvailableSelected.length = 0;
                                return refreshTable();
                            });

                        });
                    }
                },
                isActive: function () {
                    return $scope.isAssignedPositionSelected();
                }
            }
        ];
    });
