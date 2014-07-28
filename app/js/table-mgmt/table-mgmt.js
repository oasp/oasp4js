angular.module('gastronomy.tableMgmt', ['ngRoute'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/table-mgmt/table-search', {
        templateUrl: 'html/table-mgmt/table-search.html',
        controller: 'TableSearchCntl'
    }).when('/table-mgmt/order-details/:tableId', {
        templateUrl: 'html/table-mgmt/order-details.html',
        controller: 'OrderDetailsCntl'
    });
});
