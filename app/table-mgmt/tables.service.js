/**
 * @ngdoc service
 * @name table-mgmt.tables
 * @module app.table-mgmt
 * @requires table-mgmt.tableManagementRestService
 */
angular.module('app.table-mgmt').factory('tables', function (tableManagementRestService) {
    'use strict';
    var paginatedTables = {};
    return {
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {number} pagenumber
         * @params {number} pagesize
         * @return {promise} promise
         */
        getPaginatedTables: function (pagenumber, pagesize) {
            return tableManagementRestService.getPaginatedTables(pagenumber, pagesize).then(function (response) {
                angular.copy(response.data, paginatedTables);
                return paginatedTables;
            });
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {number} tableId
         * @return {promise} promise
         */
        loadTable: function (tableId) {
            return tableManagementRestService.getTable(tableId).then(function (response) {
                return response.data;
            });
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {object} table
         * @return {promise} promise
         */
        reserve: function (table) {
            table.state = 'RESERVED';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {object} table
         * @return {promise} promise
         */
        free: function (table) {
            table.state = 'FREE';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {object} table
         * @return {promise} promise
         */
        occupy: function (table) {
            table.state = 'OCCUPIED';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tables#getTable
         * @methodOf table-mgmt.tables
         *
         * @params {object} table
         * @return {promise} promise
         */
        cancelReservation: function (table) {
            table.state = 'FREE';
            return tableManagementRestService.saveTable(table).then(function () {
            });
        }
    };
});
