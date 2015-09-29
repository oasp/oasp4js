/**
 * @ngdoc service
 * @name offer-mgmt.offers
 * @module app.offer-mgmt
 * @requires offer-mgmt.offerManagementRestService
 */
angular.module('app.offer-mgmt').factory('offers', function (offerManagementRestService) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name offer-mgmt.offers#loadAllOffers
         * @methodOf offer-mgmt.offers
         *
         * @return {promise} promise
         */
        loadAllOffers: function () {
            var searchCriteria = {
                pagination: {
                    page: 1,
                    total: true
                }
            };
            return offerManagementRestService.getPaginatedOffers(searchCriteria).then(function (response) {
                return response.data.result;
            });
        },
        /**
         * @ngdoc method
         * @name offer-mgmt.offers#loadAllProducts
         * @methodOf offer-mgmt.offers
         *
         * @return {promise} promise
         */
        loadAllProducts: function () {
            var searchCriteria = {
                pagination: {
                    page: 1,
                    total: true
                }
            };
            return offerManagementRestService.getPaginatedProducts(searchCriteria).then(function (response) {
                return response.data.result;
            });
        }
    };
});
