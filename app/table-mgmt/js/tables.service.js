angular.module('app.table-mgmt').factory('tables', function (tableManagementRestService) {
    'use strict';
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
            table.state = 'RESERVED';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        free: function (table) {
            table.state = 'FREE';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        occupy: function (table) {
            table.state = 'OCCUPIED';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        cancelReservation: function (table) {
            table.state = 'FREE';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        }
    };
});
