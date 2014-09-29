angular.module('oasp', ['oasp.templates', 'oasp.main']);
angular.module('gastronomy', ['ui.select', 'ngRoute', 'oasp', 'gastronomy.tableMgmt', 'gastronomy.offerMgmt', 'gastronomy.salesMgmt'])
    .config(function ($routeProvider, $locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        $routeProvider.otherwise({
            templateUrl: 'html/main/sign-in.html'
        });
        uiSelectConfig.theme = 'bootstrap';
    });