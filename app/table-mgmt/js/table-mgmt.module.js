angular.module('app.table-mgmt', ['ngRoute', 'app.offer-mgmt', 'app.sales-mgmt', 'app.main', 'app.tableMgmt.templates'], function ($routeProvider, oaspTranslationProvider) {
    'use strict';
    oaspTranslationProvider.enableTranslationForModule('table-mgmt');
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
