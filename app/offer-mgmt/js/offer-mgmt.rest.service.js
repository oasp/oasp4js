angular.module('app.offer-mgmt').factory('offerManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/offermanagement/v1';
    
    return {
        getPaginatedOffers: function (searchCriteria) {
            return $http.post(servicePath + '/offer/search', searchCriteria);
        },
        getPaginatedProducts: function (searchCriteria) {
            return $http.post(servicePath + '/product/search', searchCriteria);
        }
    };
});
