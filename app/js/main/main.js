angular.module('oasp.main', ['ngRoute', 'pascalprecht.translate', 'ui.bootstrap', 'angularSpinner'], function ($routeProvider, $translateProvider) {
    'use strict';
    $routeProvider.when('/main/sign-in', {templateUrl: 'html/main/sign-in.html'});
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
});