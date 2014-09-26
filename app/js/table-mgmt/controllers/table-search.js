/*jslint todo: true */
angular.module('gastronomy.tableMgmt').controller('TableSearchCntl', function ($scope, tables, $modal, offers, sales) {
    'use strict';
    $scope.tables = tables.getAllTables();
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
                    return sales.loadOrderForTable(1);
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
});