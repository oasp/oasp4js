angular.module('gastronomy.tableMgmt').controller('TableSearchCntl', function ($scope, $location, tables) {
    'use strict';
    $scope.openEditDialog = function (tableRow) {
        alert('Hello ' + tableRow.id);
    };
    $scope.tables = tables.getAllTables();
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
                    // todo wrap up in spinner
                    tables.reserve(selectedTable);
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
                    // todo wrap up in spinner
                    tables.cancelReservation(selectedTable);
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
                    // todo wrap up in spinner
                    tables.occupy(selectedTable);
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
                    // todo wrap up in spinner
                    tables.free(selectedTable);
                }
            },
            isActive: function (selectedTable) {
                return selectedTable && selectedTable.state === 'OCCUPIED';
            }
        }
    ];
    $scope.actionReserve = function (table) {
        tables.reserve(table);
    };
    $scope.actionCancelReservation = function (table) {
        tables.cancelReservation(table);
    };
    $scope.actionOccupy = function (table) {
        tables.occupy(table);
    };
    $scope.actionFree = function (table) {
        tables.free(table);
    };
    $scope.actionTakeOrder = function (table) {
        $location.url('/table-mgmt/order-details/' + table.id);
    };
    $scope.actionReserveAllowed = function (table) {
        return table.state === 'FREE';
    };
    $scope.actionFreeAllowed = function (table) {
        return table.state === 'OCCUPIED';
    };
    $scope.actionCancelReservationAllowed = function (table) {
        return table.state === 'RESERVED';
    };
    $scope.actionOccupyAllowed = function (table) {
        return table.state === 'RESERVED' || table.state === 'FREE';
    };
    $scope.actionTakeOrderAllowed = function (table) {
        return table.state === 'OCCUPIED';
    };
});