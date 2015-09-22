angular.module('app.sales-mgmt', ['app.main', 'app.offer-mgmt'])
    .config(function ($routeProvider) {
        'use strict';
        $routeProvider.when('/sales-mgmt/cook-positions', {
            templateUrl: 'sales-mgmt/cook-positions/cook-positions.html',
            controller: 'CookPositionsCntl',
            resolve: {
                currentPositions: ['positions', function (positions) {
                    return positions.get();
                }]
            }
        });
    });

