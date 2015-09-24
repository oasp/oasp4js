angular.module('app.sales-mgmt', ['app.main', 'app.offer-mgmt', 'app.sales-mgmt.templates'])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider.state('salesMgmt', {
            url: '/sales-mgmt/cook-positions',
            templateUrl: 'sales-mgmt/cook-positions/cook-positions.html',
            controller: 'CookPositionsCntl',
            resolve: {
                currentPositions: ['positions', function (positions) {
                    return positions.get();
                }]
            }
        });
    });

