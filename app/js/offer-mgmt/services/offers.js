angular.module('gastronomy.offerMgmt').factory('offers', function (offerManagementRestService) {
    'use strict';
    return {
        loadAllOffers: function () {
            return offerManagementRestService.getAllOffers().then(function (response) {
                return response.data;
            });
        }
    };
});
