angular.module('app.main', ['ngRoute', 'oasp-ui', 'oasp-security', 'app.main.templates', 'app.oasp-i18n', 'ui.bootstrap'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $routeProvider, oaspTranslationProvider) {
        'use strict';
        $routeProvider
            .when('/', {
                templateUrl: 'main/html/blank.html',
                controller: 'RedirectorCntl'
            })
            .when(SIGN_IN_DLG_PATH, {
                templateUrl: 'main/html/sign-in.html',
                controller: 'SignInCntl',
                resolve: {
                    check: ['homePageRedirector', function (homePageRedirector) {
                        return homePageRedirector.rejectAndRedirectToHomePageIfUserLoggedIn();
                    }]
                }
            })
            .otherwise({templateUrl: 'main/html/page-not-found.html'});

        oaspTranslationProvider.enableTranslationForModule('main', true);
        oaspTranslationProvider.setSupportedLanguages(
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