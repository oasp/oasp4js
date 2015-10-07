angular.module('app.form-samples-mgmt', ['oasp.validation', 'oasp.oaspI18n', 'ui.router', 'app.form-samples-mgmt.templates'])
    .config(function ($stateProvider, oaspTranslationProvider, $translatePartialLoaderProvider) {
        'use strict';

        $stateProvider.state('validationShowcase',
            {
                url: '/validation-showcase',
                templateUrl: 'form-samples-mgmt/validation-showcase.html',
                //controller: 'ValidationShowcaseCntl',
                //controllerAs: 'VSC'
                resolve: {
                    addTranslationPart: function ($translate) {

                        // load module translations before controllers setup is started.
                        // this approach solved partial translations loading problem, which is not working very nice when no server requests
                        // are present on view load. Please try to mock existing services with empty success promise ($q.when())
                        // if you want to see the improper behaviour :)
                        // This solution also allows to keep URLs independent from module names and no convention exposing underlying module layout is needed.

                        $translatePartialLoaderProvider.addPart('form-samples-mgmt');
                        if (!$translate.use()) {
                            return $translate.use($translate.preferredLanguage());
                        }
                        return $translate.use();
                    }
                }
            }
        );

        oaspTranslationProvider.enableTranslationForModule('form-samples-mgmt');


    });




