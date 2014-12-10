angular.module('app.cook-order-mgmt', ['ngRoute', 'app.main', 'app.cook-order-mgmt.templates'], function ($routeProvider) {
    'use strict';
//    translationSupportProvider.enableTranslationForModule('table-mgmt');
    $routeProvider.when('/cook-order-mgmt/order-view', {
        templateUrl: 'cook-order-mgmt/html/order-view.html',
        controller: 'CookOrderViewCntl',
        resolve: {
            initialOrders: function () {
                return [];
            }
        }
    });
});
