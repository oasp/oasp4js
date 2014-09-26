/*globals angular*/
angular.module('oasp', ['oasp.templates', 'oasp.main']);
angular.module('gastronomy', ['ui.bootstrap', 'ui.select', 'ngRoute', 'oasp', 'gastronomy.tableMgmt', 'gastronomy.offerMgmt', 'gastronomy.salesMgmt'])
    .config(function ($routeProvider, $locationProvider, $tooltipProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        $routeProvider.otherwise({
            templateUrl: 'html/main/sign-in.html'
        });
        $tooltipProvider.options({appendToBody: true});
        $tooltipProvider.setTriggers({'blur': 'click'});
        uiSelectConfig.theme = 'bootstrap';
    });