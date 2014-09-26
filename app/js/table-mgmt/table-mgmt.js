angular.module('gastronomy.tableMgmt', ['ngRoute', 'gastronomy.offerMgmt', 'gastronomy.salesMgmt', 'oasp.main'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/table-mgmt/table-search', {
        templateUrl: 'html/table-mgmt/table-search.html',
        controller: 'TableSearchCntl'
    });
});
