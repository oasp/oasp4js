angular.module('app.table-mgmt').factory('tables', function (tableManagementRestService) {
    'use strict';
    var tables = [];
    var paginatedTables = {};
    return {
        getPaginatedTables: function (pagenumber, pagesize) {
            return tableManagementRestService.getPaginatedTables(pagenumber, pagesize).then(function (response) {
                angular.copy(response.data, paginatedTables);
                return paginatedTables;
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
