/**
 * @ngdoc service
 * @name offer-mgmt.offerManagementRestService
 * @module app.offer-mgmt
 * @requires $http
 * @requires main.currentContextPath
 */
angular.module('app.offer-mgmt').factory('offerManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/offermanagement/v1';

    return {
        /**
         * @ngdoc method
         * @name offer-mgmt.offerManagementRestService#getPaginatedOffers
         * @methodOf offer-mgmt.offerManagementRestService
         *
         * @params {object} searchCriteria
         * @return {promise} http promise
         */
        getPaginatedOffers: function (searchCriteria) {
            return $http.post(servicePath + '/offer/search', searchCriteria);
        }, /**
         * @ngdoc method
         * @name offer-mgmt.offerManagementRestService#getPaginatedProducts
         * @methodOf offer-mgmt.offerManagementRestService
         *
         * @params {object} searchCriteria
         * @return {promise} http promise
         */
        getPaginatedProducts: function (searchCriteria) {
            return $http.post(servicePath + '/product/search', searchCriteria);
        }
    };
});
