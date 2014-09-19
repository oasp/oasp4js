angular.module('gastronomy.tableMgmt').factory('tables', function (tableManagementRestService, $q) {
    'use strict';
    var tables = [], tableDetails = null;
    return {
        getAllTables: function () {
            tableManagementRestService.getAllTables().then(function (response) {
                angular.copy(response.data, tables);
            });
            return tables;
        },
        reserve: function (table) {
            tableManagementRestService.markTableAs(table.id, 'RESERVED').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'RESERVED';
                }
            });
        },
        free: function (table) {
            tableManagementRestService.markTableAs(table.id, 'FREE').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'FREE';
                }
            });
        },
        occupy: function (table) {
            tableManagementRestService.markTableAs(table.id, 'OCCUPIED').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'OCCUPIED';
                }
            });
        },
        cancelReservation: function (table) {
            tableManagementRestService.markTableAs(table.id, 'FREE').then(function () {
                var tableIndex = tables.indexOf(table);
                if (tableIndex >= 0) {
                    tables[tableIndex].state = 'FREE';
                }
            });
        },
        loadTableDetails: function (table) {
            return tableManagementRestService.getOrder(123).then(function (order) {
                tableDetails = {};
                angular.copy(table, tableDetails);
                return tableDetails;
            });
        }
    };
});
