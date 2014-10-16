angular.module('app.main', ['ngRoute', 'pascalprecht.translate', 'oasp-ui', 'oasp-security'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $routeProvider, $translateProvider) {
        'use strict';
        $routeProvider
            .when('/', {redirectTo: SIGN_IN_DLG_PATH})
            .when(SIGN_IN_DLG_PATH, {templateUrl: 'html/main/sign-in.html'})
            .otherwise({templateUrl: 'html/main/page-not-found.html'});
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    });