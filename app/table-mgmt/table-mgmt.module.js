angular.module('app.table-mgmt', ['app.offer-mgmt', 'app.sales-mgmt', 'app.main', 'app.table-mgmt.templates'], function ($stateProvider, oaspTranslationProvider) {
    'use strict';
    oaspTranslationProvider.enableTranslationForModule('table-mgmt');

    $stateProvider.state('tableMgmt', {
        abstract: true,
        url: '/table-mgmt',
        template: '<ui-view/>'
    });

    $stateProvider.state('tableMgmt.search', {
        url: '/table-search',
        templateUrl: 'table-mgmt/table-search/table-search.html',
        controller: 'TableSearchCntl',
        resolve: {
            paginatedTableList: ['tables', function (tables) {
                return tables.getPaginatedTables(1, 4).then(function(paginatedTables) {
                    return paginatedTables;
                });
            }]
        }
    });
});
