/*jslint todo: true */
angular.module('app.tableMgmt').controller('TableSearchCntl',
    function ($scope, tables, initialTableList, $modal, globalSpinner, offers, sales) {
        'use strict';
        $scope.tables = initialTableList;
        $scope.openEditDialog = function (tableRow) {
            $modal.open({
                templateUrl: 'html/table-mgmt/table-details.html',
                backdrop: 'static',
                keyboard: false,
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
        $scope.columnDefs = [
            {field: 'id', label: 'Table number'},
            {field: 'state', label: 'State'},
            {field: 'waiter', label: 'Waiter'}
        ];
        $scope.buttonDefs = [
            {
                label: 'Edit...',
                onClick: function (selectedRow) {
                    $scope.openEditDialog(selectedRow);
                },
                isNotActive: function (selectedRow) {
                    return selectedRow === null;
                }
            },
            {
                label: 'Reserve',
                onClick: function (selectedTable) {
                    if (selectedTable) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return tables.reserve(selectedTable);
                        });
                    }
                },
                isActive: function (selectedTable) {
                    return selectedTable && selectedTable.state === 'FREE';
                }
            },
            {
                label: 'Cancel Reservation',
                onClick: function (selectedTable) {
                    if (selectedTable) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return tables.cancelReservation(selectedTable);
                        });
                    }
                },
                isActive: function (selectedTable) {
                    return selectedTable && selectedTable.state === 'RESERVED';
                }
            },
            {
                label: 'Occupy',
                onClick: function (selectedTable) {
                    if (selectedTable) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return tables.occupy(selectedTable);
                        });
                    }
                },
                isActive: function (selectedTable) {
                    return selectedTable && (selectedTable.state === 'RESERVED' || selectedTable.state === 'FREE');
                }
            },
            {
                label: 'Free',
                onClick: function (selectedTable) {
                    if (selectedTable) {
                        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                            return tables.free(selectedTable);
                        });
                    }
                },
                isActive: function (selectedTable) {
                    return selectedTable && selectedTable.state === 'OCCUPIED';
                }
            }
        ];
    });