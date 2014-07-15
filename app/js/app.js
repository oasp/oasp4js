/*globals angular*/
angular.module('oasp', ['oasp.templates', 'oasp.main', 'table-mgmt']);
angular.module('demoApp', ['ui.bootstrap', 'ngRoute', 'oasp'])
    .config(function ($routeProvider, $locationProvider) {
        "use strict";
        $locationProvider.html5Mode(false);
        $routeProvider.otherwise({
            templateUrl: 'html/main/sign-in.html'
        });
    });