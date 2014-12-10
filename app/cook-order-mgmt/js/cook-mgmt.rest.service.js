angular.module('app.cook-order-mgmt').factory('cookManagmentRestServices', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/salesmanagement';

    return {
        getAllOrders: function () {
            return $http.get(servicePath + '/order/');
        }
    };
});
