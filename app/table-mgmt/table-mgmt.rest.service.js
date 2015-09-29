/**
 * @ngdoc service
 * @name table-mgmt.tableManagementRestService
 * @module app.table-mgmt
 * @requires $http
 * @requires main.currentContextPath
 */
angular.module('app.table-mgmt').factory('tableManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/tablemanagement/v1';

    return {
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#getTable
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {number} id
         * @return {HttpPromise} http promise
         */
        getTable: function (id) {
            return $http.get(servicePath + '/table/' + id);
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#getPaginatedTables
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {number} pagenumber
         * @params {number} pagesize
         * @return {HttpPromise} http promise
         */
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
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#createTable
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {object} table
         * @return {HttpPromise} http promise
         */
        createTable: function (id, table) {
            return $http.put(servicePath + '/table/' + id, table);
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#deleteTable
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {number} id
         * @return {HttpPromise} http promise
         */
        deleteTable: function (id) {
            return $http.delete(servicePath + '/table/' + id);
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#saveTable
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {object} table
         * @return {HttpPromise} http promise
         */
        saveTable: function (table) {
            return $http.post(servicePath + '/table/', table);
        },
        /**
         * @ngdoc method
         * @name table-mgmt.tableManagementRestService#isTableReleasable
         * @methodOf table-mgmt.tableManagementRestService
         *
         * @params {number} id
         * @return {HttpPromise} http promise
         */
        isTableReleasable: function (id) {
            return $http.get(servicePath + '/table/' + id + '/istablereleasable/');
        }
    };
});
