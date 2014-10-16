angular.module('app.tableMgmt', ['ngRoute', 'app.offerMgmt', 'app.salesMgmt', 'app.main'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/table-mgmt/table-search', {
        templateUrl: 'html/table-mgmt/table-search.html',
        controller: 'TableSearchCntl',
        resolve: {
            initialTableList: ['tables', function (tables) {
                return tables.getAllTables();
            }],
            dupa: ['tables', function (tables) {
                return tables.getAllTables();
            }]
        }
    });
});
