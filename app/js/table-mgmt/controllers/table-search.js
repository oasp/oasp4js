angular.module('gastronomy.tableMgmt').controller('TableSearchCntl', function ($scope, $location, tables) {
    'use strict';
    $scope.tables = tables.getAllTables();

    $scope.actionReserve = function (table) {
        tables.reserve(table);
    };
    $scope.actionCancelReservation = function (table) {
        tables.cancelReservation(table);
    };
    $scope.actionOccupy = function (table) {
        tables.occupy(table);
    };
    $scope.actionFree = function (table) {
        tables.free(table);
    };
    $scope.actionTakeOrder = function (table) {
        $location.url('/table-mgmt/order-details/' + table.id);
    };
    $scope.actionReserveAllowed = function (table) {
        return table.state === 'FREE';
    };
    $scope.actionFreeAllowed = function (table) {
        return table.state === 'OCCUPIED';
    };
    $scope.actionCancelReservationAllowed = function (table) {
        return table.state === 'RESERVED';
    };
    $scope.actionOccupyAllowed = function (table) {
        return table.state === 'RESERVED' || table.state === 'FREE';
    };
    $scope.actionTakeOrderAllowed = function (table) {
        return table.state === 'OCCUPIED';
    };
});