angular.module('app.main', ['ui.router', 'oasp.oaspUi', 'oasp.oaspSecurity', 'app.main.templates', 'oasp.oaspI18n', 'ui.bootstrap'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .config(function (SIGN_IN_DLG_PATH, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, oaspTranslationProvider) {
        'use strict';


        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();
            var hasTrailingSlash = path && path[path.length - 1] === '/';
            if (hasTrailingSlash) {
                //if the last character is a slash, return the same url without the slash
                return path.substr(0, path.length - 1);
            }
        });


        // For any unmatched url, redirect to notFound state but keep old URL
        $urlRouterProvider.otherwise( //'notFound');
            function($injector, $location){
            var state = $injector.get('$state');
            state.go('notFound');
            return $location.path();
        });
        $urlRouterProvider.when('', '/');


        $stateProvider
            .state('notFound', {
                //do not define URL here
                //url: '/notFound',
                templateUrl: 'main/layout/page-not-found.html'
            })
            .state('blank', {
                url: '/',
                templateUrl: 'main/layout/blank.html',
                controller: 'RedirectorCntl'
            })
            .state('signIn', {
                url: SIGN_IN_DLG_PATH,
                templateUrl: 'main/sign-in/sign-in.html',
                controller: 'SignInCntl',
                resolve: {
                    check: ['homePageRedirector', function (homePageRedirector) {
                        return homePageRedirector.rejectAndRedirectToHomePageIfUserLoggedIn();
                    }]
                }
            });

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
