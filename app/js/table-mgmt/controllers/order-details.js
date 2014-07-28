angular.module('gastronomy.tableMgmt').controller('OrderDetailsCntl', function ($scope, $routeParams) {
    'use strict';
    $scope.tableId = $routeParams.tableId;
});