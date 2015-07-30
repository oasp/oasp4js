/*
 app.table-mgmt module retrieval
 For details regarding angular.module() syntax please check: https://docs.angularjs.org/api/ng/function/angular.module
 The module is retrieved in order to define a service factory in it.
 */
angular.module('app.table-mgmt')
    // tableManagementRestService  factory definition
    // The definition contains:
    // - service name as a first parameter
    // - resource service factory function with dependencies as a function parameters (injection of the angular $http service and OASP
    //  currentContextPath service)
    // For more details regarding creating services please check https://docs.angularjs.org/guide/services.
    .factory('tableManagementRestService', function ($http, currentContextPath) {
        'use strict';

    // setting current context path with currentContextPath service usage
    var servicePath = currentContextPath.get() + 'services/rest/tablemanagement/v1';

        // returned object with defined service functions
        // Functions will be available after service injection.
        // Functions use angular $http service to send http requests.
        // For more details regarding $http please check https://docs.angularjs.org/api/ng/service/$http.
        return {
            // gets the table details
            getTable: function (id) {
                return $http.get(servicePath + '/table/' + id);
            },
            // gets the list of tables with pagination support
            getPaginatedTables: function (pagenumber, pagesize) {
                var tableSearchCriteria = {
                    pagination: {
                        size: pagesize,
                        page: pagenumber,
                        total: true
                    }
                };
                return $http.post(servicePath + '/table/search', tableSearchCriteria);
            },
            // creates table
            createTable: function (id, table) {
                return $http.put(servicePath + '/table/' + id, table);
            },
            // deletes table
            deleteTable: function (id) {
                return $http.delete(servicePath + '/table/' + id);
            },
            // saves changed in table
            saveTable: function (table) {
                return $http.post(servicePath + '/table/', table);
            },
            // checks if table is releasable
            isTableReleasable: function (id) {
                return $http.get(servicePath + '/table/' + id + '/istablereleasable/');
            }
        };
    });
