angular.module('app.main', ['ui.router', 'oasp.oaspUi', 'oasp.oaspSecurity', 'app.main.templates', 'oasp.oaspI18n', 'ui.bootstrap'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .constant('ROLES', {
        COOK: 'COOK',
        WAITER: 'WAITER'
    })
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
        $urlRouterProvider.otherwise(
            function($injector, $location){
            var state = $injector.get('$state');
            state.go('notFound');
            return $location.path();
        });

        $urlRouterProvider.when('', function (homePageRedirector) {
            homePageRedirector.redirect();
        });
        $urlRouterProvider.when(SIGN_IN_DLG_PATH, function (homePageRedirector) {
            homePageRedirector.redirect();
        });

        $stateProvider
            .state('notFound', {
                //do not define URL here
                //url: '/notFound',
                templateUrl: 'main/layout/page-not-found.html'
            })
            .state('signIn', {
                url: SIGN_IN_DLG_PATH,
                templateUrl: 'main/sign-in/sign-in.html',
                controller: 'SignInCntl',
                controllerAs: 'SIC'
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
