angular.module('app.table-mgmt')
    .controller('TableSearchCntl', function ($scope, tables, paginatedTableList, $state, globalSpinner) {
        'use strict';
        var selectedTable = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };

        $scope.openEditDialog = function (tableRow) {
            $state.go('tableMgmt.details', {tableId: tableRow.id});
        };

        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedTableList.pagination.total;
        $scope.numPerPage = paginatedTableList.pagination.size;
        $scope.currentPage = paginatedTableList.pagination.page;

        $scope.gridOptions = {
            data: paginatedTableList.result
        };

        $scope.reloadTables = function () {
            tables.getPaginatedTables($scope.currentPage, $scope.numPerPage).then(function (paginatedTables) {
                return paginatedTables;
            }).then(function (res) {
                paginatedTableList = res;
                $scope.gridOptions.data = paginatedTableList.result;
            });
        };

        $scope.$watch('currentPage', function () {
            $scope.reloadTables();
        });

        $scope.buttonDefs = [
            {
                label: 'TABLE_MGMT.EDIT',
                onClick: function () {
                    $scope.openEditDialog(selectedTable());
                },
                isActive: function () {
                    return selectedTable();
                }
            },
            {
                label: 'TABLE_MGMT.RESERVE',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        var result = tables.reserve(selectedTable()).then($scope.reloadTables);
                        $scope.selectedItems.length = 0;
                        return result;
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'FREE';
                }
            },
            {
                label: 'TABLE_MGMT.CANCEL_RESERVATION',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        var result = tables.cancelReservation(selectedTable()).then($scope.reloadTables);
                        $scope.selectedItems.length = 0;
                        return result;
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'RESERVED';
                }
            },
            {
                label: 'TABLE_MGMT.OCCUPY',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        var result = tables.occupy(selectedTable()).then($scope.reloadTables);
                        $scope.selectedItems.length = 0;
                        return result;
                    });
                },
                isActive: function () {
                    return selectedTable() && (selectedTable().state === 'RESERVED' || selectedTable().state === 'FREE');
                }
            },
            {
                label: 'TABLE_MGMT.FREE',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        var result = tables.free(selectedTable()).then($scope.reloadTables);
                        $scope.selectedItems.length = 0;
                        return result;
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'OCCUPIED';
                }
            }
        ];


    });
