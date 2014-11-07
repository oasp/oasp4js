angular.module('app.main', ['ngRoute', 'pascalprecht.translate', 'oasp-ui', 'oasp-security', 'app.main.templates'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $routeProvider, $translateProvider) {
        'use strict';
        $routeProvider
            .when('/', {redirectTo: SIGN_IN_DLG_PATH})
            .when(SIGN_IN_DLG_PATH, {templateUrl: 'main/html/sign-in.html'})
            .otherwise({templateUrl: 'main/html/page-not-found.html'});
        $translateProvider.useStaticFilesLoader({
            prefix: 'main/i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    });