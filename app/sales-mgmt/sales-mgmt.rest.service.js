/**
 * @ngdoc service
 * @name sales-mgmt.salesManagementRestService
 * @module app.sales-mgmt
 * @requires $http
 * @requires main.currentContextPath
 *
 */
angular.module('app.sales-mgmt').factory('salesManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/salesmanagement/v1';

    return {
        /**
         * @ngdoc method
         * @name sales-mgmt.salesManagementRestService#findOrders
         * @methodOf sales-mgmt.salesManagementRestService
         * @params {object} params
         * @return {HttpPromise} http promise
         */
        findOrders: function (params) {
            return $http.post(servicePath + '/order/search', params);
        },
        /**
         * @ngdoc method
         * @name sales-mgmt.salesManagementRestService#saveOrder
         * @methodOf sales-mgmt.salesManagementRestService
         *
         * @params {object} order
         * @return {HttpPromise} http promise
         */
        saveOrder: function (order) {
            return $http.post(servicePath + '/order', order);
        },
        /**
         * @ngdoc method
         * @name sales-mgmt.salesManagementRestService#updateOrderPosition
         * @methodOf sales-mgmt.salesManagementRestService
         *
         * @params {object} orderPosition
         * @return {HttpPromise} http promise
         */
        updateOrderPosition: function (orderPosition) {
            return $http.post(servicePath + '/orderposition', orderPosition);
        },
        /**
         * @ngdoc method
         * @name sales-mgmt.salesManagementRestService#findOrderPositions
         * @methodOf sales-mgmt.salesManagementRestService
         *
         * @params {object} params
         * @return {HttpPromise} http promise
         */
        findOrderPositions: function (params) {
            return $http.get(servicePath + '/orderposition', {
                params: params
            });
        }
    };
});
