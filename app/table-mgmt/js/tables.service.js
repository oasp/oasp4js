/*
 app.table-mgmt module retrieval
 For details regarding angular.module() syntax please check: https://docs.angularjs.org/api/ng/function/angular.module
 The module is retrieved in order to define a service factory in it.
 */
angular.module('app.table-mgmt')
    // tables service factory definition
    // The definition contains:
    // - service name as a first parameter
    // - resource service factory function with dependencies as a function parameters (injection of the tableManagementRestService)
    // For more details regarding creating services please check https://docs.angularjs.org/guide/services.
    .factory('tables', function (tableManagementRestService) {
        'use strict';
        // variables that won't be exposed outside
        var paginatedTables = {};

        // returned object with defined service functions
        // Functions will be available after service injection.
        return {
            // fetches tables including pagination
            getPaginatedTables: function (pagenumber, pagesize) {
                return tableManagementRestService.getPaginatedTables(pagenumber, pagesize).then(function (response) {
                    angular.copy(response.data, paginatedTables);
                    return paginatedTables;
                });
            },
            // loads details of the table identified by tableId
            loadTable: function (tableId) {
                return tableManagementRestService.getTable(tableId).then(function (response) {
                    return response.data;
                });
            },
            // changes state of a table to 'RESERVED' value
            reserve: function (table) {
                table.state = 'RESERVED';
                return tableManagementRestService.saveTable(table);
            },
            // changes state of a table to 'FREE' value
            free: function (table) {
                table.state = 'FREE';
                return tableManagementRestService.saveTable(table);
            },
            // changes state of a table to 'OCCUPIED' value
            occupy: function (table) {
                table.state = 'OCCUPIED';
                return tableManagementRestService.saveTable(table);
            },
            // changes state of a table to 'FREE' value
            cancelReservation: function (table) {
                table.state = 'FREE';
                return tableManagementRestService.saveTable(table);
            }
        };
    });