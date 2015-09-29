/**
 * @ngdoc service
 * @name sales-mgmt.sales
 * @module app.sales-mgmt
 * @requires sales-mgmt.salesManagementRestService
 */
angular.module('app.sales-mgmt').factory('sales', function (salesManagementRestService) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name sales-mgmt.sales#loadOrderForTable
         * @methodOf sales-mgmt.sales
         *
         * @params {number} tableId
         * @return {promise} promise
         */
        loadOrderForTable: function (tableId) {
            var orderSearchCriteria = {
                state: 'OPEN',
                tableId: tableId
            };
            return salesManagementRestService.findOrders(orderSearchCriteria).then(function (response) {
                return response.data.result && response.data.result.length ? response.data.result[0] : undefined;
            });
        },
        /**
         * @ngdoc method
         * @name sales-mgmt.sales#findOrderPositions
         * @methodOf sales-mgmt.sales
         *
         * @params {object} order
         * @return {promise} promise
         */
        saveOrUpdateOrder: function (order) {
            var promise;
            //with the new REST API, there is no destinction between updating and creating an order
            promise = salesManagementRestService.saveOrder(order).then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
});
