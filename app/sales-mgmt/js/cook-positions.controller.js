angular.module('app.sales-mgmt')
    .controller('CookPositionsCntl', function ($scope, currentPositions, positions, globalSpinner) {
        'use strict';

        $scope.positionsAvailableSelected = [];
        $scope.positionsAssignedSelected = [];
        $scope.positions = currentPositions;

        $scope.availablePositionSelected = function () {
            return ($scope.positionsAvailableSelected && $scope.positionsAvailableSelected.length > 0) ? true : false;
        };

        $scope.assignedPositionSelected = function () {
            return ($scope.positionsAssignedSelected && $scope.positionsAssignedSelected.length > 0) ? true : false;
        };

        $scope.assignCookToPosition = function () {
            if ($scope.availablePositionSelected) {
                globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                    return positions.assignCookToPosition($scope.positionsAvailableSelected[0].id);
                });
            }
        };
        $scope.buttonDefs = [
            {
                label: 'Done',
                onClick: function () {
                    if ($scope.assignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return positions.setPositionStatusToPrepared($scope.positionsAssignedSelected[0].id);
                        });
                    }
                },
                isActive: function () {
                    return $scope.assignedPositionSelected();
                }
            },
            {
                label: 'Reject',
                onClick: function () {
                    if ($scope.assignedPositionSelected()) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return positions.makePositionAvailable($scope.positionsAssignedSelected[0].id);
                        });
                    }
                },
                isActive: function () {
                    return $scope.assignedPositionSelected();
                }
            }
        ];
    });
