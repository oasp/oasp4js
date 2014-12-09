/**
 * @ngdoc module
 * @name app.main
 * @module app.main
 *
 * @description
 * Main module of OaspJs
 *
 *
 */

angular.module('app.main', ['ngRoute', 'oasp-ui', 'oasp-security', 'app.main.templates', 'app.oasp-i18n'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $routeProvider, supportedLanguagesProvider, translationSupportProvider) {
        'use strict';
        $routeProvider
            .when('/', {redirectTo: SIGN_IN_DLG_PATH})
            .when(SIGN_IN_DLG_PATH, {templateUrl: 'main/html/sign-in.html'})
            .otherwise({templateUrl: 'main/html/page-not-found.html'});

        translationSupportProvider.enableTranslationForModule('main', true);
        supportedLanguagesProvider.setSupportedLanguages(
            [
                {
                    key: 'en',
                    label: 'English',
                    'default': true
                },
                {
                    key: 'de',
                    label: 'German'
                }
            ]
        );
    });
