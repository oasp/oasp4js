angular.module('gastronomy.offerMgmt').factory('offerManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/offermanagement';

    return {
        getAllOffers: function () {
            return $http.get(servicePath + '/offer');
        }
    };
});
