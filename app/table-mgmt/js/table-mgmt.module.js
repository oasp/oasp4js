angular.module('app.tableMgmt', ['ngRoute', 'app.offerMgmt', 'app.salesMgmt', 'app.main', 'app.table-mgmt.templates'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/table-mgmt/table-search', {
        templateUrl: 'table-mgmt/html/table-search.html',
        controller: 'TableSearchCntl',
        resolve: {
            initialTableList: ['tables', function (tables) {
                return tables.getAllTables();
            }]
        }
    });
});
