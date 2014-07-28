/*globals angular*/
angular.module('oasp', ['oasp.templates', 'oasp.main']);
angular.module('gastronomy', ['ui.bootstrap', 'ngRoute', 'oasp', 'gastronomy.tableMgmt'])
    .config(function ($routeProvider, $locationProvider, $tooltipProvider) {
        'use strict';
        $locationProvider.html5Mode(false);
        $routeProvider.otherwise({
            templateUrl: 'html/main/sign-in.html'
        });
        $tooltipProvider.options({appendToBody: true});
        $tooltipProvider.setTriggers({'blur': 'click'});
    });