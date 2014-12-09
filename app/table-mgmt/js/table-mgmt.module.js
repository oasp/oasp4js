/**
 * @ngdoc module
 * @name app.tableMgmt
 * @module app.tableMgmt
 * @description
 *
 * Provides the app.tableMgmt module. Depends on:
 *  ngRoute,
 * {@link app.offerMgmt app.offerMgmt},
 * {@link app.salesMgmt app.salesMgmt},
 * {@link app.main app.main},
 *  app.table-mgmt.templates
 *
 */
angular.module('app.table-mgmt', ['ngRoute', 'app.offer-mgmt', 'app.sales-mgmt', 'app.main', 'app.table-mgmt.templates'], function ($routeProvider, translationSupportProvider) {
    'use strict';
    translationSupportProvider.enableTranslationForModule('table-mgmt');
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
