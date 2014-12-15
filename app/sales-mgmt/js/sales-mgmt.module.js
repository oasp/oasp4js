angular.module('app.sales-mgmt', ['app.main'])
    .config(function ($routeProvider) {
        'use strict';
        $routeProvider.when('/sales-mgmt/cook-positions', {
            templateUrl: 'sales-mgmt/html/cook-positions.html',
            controller: 'CookPositionsCntl',
            resolve: {
                currentPositions: ['positions', function (positions) {
                    return positions.get();
                }]
            }
        });
    });

