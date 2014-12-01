angular.module('app.table-mgmt').factory('tables', function (tableManagementRestService) {
    'use strict';
    var tables = [];
    return {
        getAllTables: function () {
            return tableManagementRestService.getAllTables().then(function (response) {
                angular.copy(response.data, tables);
                return tables;
            });
        },
        loadTable: function (tableId) {
            return tableManagementRestService.getTable(tableId).then(function (response) {
                return response.data;
            });
        },
        reserve: function (table) {
            return tableManagementRestService.markTableAs(table.id, 'RESERVED').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'RESERVED';
                }
            });
        },
        free: function (table) {
            return tableManagementRestService.markTableAs(table.id, 'FREE').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'FREE';
                }
            });
        },
        occupy: function (table) {
            return tableManagementRestService.markTableAs(table.id, 'OCCUPIED').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'OCCUPIED';
                }
            });
        },
        cancelReservation: function (table) {
            return tableManagementRestService.markTableAs(table.id, 'FREE').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'FREE';
                }
            });
        }
    };
});
