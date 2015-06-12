angular.module('app.table-mgmt')
    .controller('TableSearchCntl', function ($scope, tables, paginatedTableList, $modal, globalSpinner, offers, sales) {
        'use strict';
        var selectedTable = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };
        
        $scope.openEditDialog = function (tableRow) {
            $modal.open({
                templateUrl: 'table-mgmt/html/table-details.html',
                controller: 'TableDetailsCntl',
                resolve: {
                    tableDetails: function () {
                        return tables.loadTable(tableRow.id);
                    },
                    allOffers: function () {
                        return offers.loadAllOffers();
                    },
                    currentOrder: function () {
                        return sales.loadOrderForTable(tableRow.id);
                    }
                }
            });
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
                label: 'Edit...',
                onClick: function () {
                    $scope.openEditDialog(selectedTable());
                },
                isActive: function () {
                    return selectedTable();
                }
            },
            {
                label: 'Reserve',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.reserve(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'FREE';
                }
            },
            {
                label: 'Cancel Reservation',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.cancelReservation(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'RESERVED';
                }
            },
            {
                label: 'Occupy',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.occupy(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && (selectedTable().state === 'RESERVED' || selectedTable().state === 'FREE');
                }
            },
            {
                label: 'Free',
                onClick: function () {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.free(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    return selectedTable() && selectedTable().state === 'OCCUPIED';
                }
            }
        ];
    

    });