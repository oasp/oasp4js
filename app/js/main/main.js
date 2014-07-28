angular.module('oasp.main', ['ngRoute'], function ($routeProvider) {
    'use strict';
    $routeProvider.when('/main/sign-in', {templateUrl: 'html/main/sign-in.html'});
});