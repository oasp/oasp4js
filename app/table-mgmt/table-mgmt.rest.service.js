angular.module('app.table-mgmt').factory('tableManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/tablemanagement/v1';

    return {
        getTable: function (id) {
            return $http.get(servicePath + '/table/' + id);
        },
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
        createTable: function (id, table) {
            return $http.put(servicePath + '/table/' + id, table);
        },
        deleteTable: function (id) {
            return $http.delete(servicePath + '/table/' + id);
        },
        saveTable: function (table) {
            return $http.post(servicePath + '/table/', table);
        },
        isTableReleasable: function (id) {
            return $http.get(servicePath + '/table/' + id + '/istablereleasable/');
        }
    };
});
