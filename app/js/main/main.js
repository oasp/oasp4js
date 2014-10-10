angular.module('app.main', ['ngRoute', 'pascalprecht.translate', 'ui.bootstrap', 'angularSpinner', 'oasp'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $routeProvider, $translateProvider) {
        'use strict';
        $routeProvider.when(SIGN_IN_DLG_PATH, {templateUrl: 'html/main/sign-in.html'});

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    });