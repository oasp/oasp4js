angular.module('app.sales-mgmt', ['app.main'])
    .config(function ($routeProvider) {
        $routeProvider.when('/sales-mgmt/cook-positions', {
            templateUrl: 'sales-mgmt/html/cook-positions.html',
            controller: 'CookPositionsCntl'
//            resolve: {
//                initialOrders: ['orders', function (orders) {
//                    return orders.getOrdersPosition();
//                }]
//            }
        });
    });

