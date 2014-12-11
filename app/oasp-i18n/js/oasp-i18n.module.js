angular.module('app.oasp-i18n', ['pascalprecht.translate', 'app.oasp-i18n.templates'], function ($translateProvider, $httpProvider) {
    'use strict';
    $httpProvider.interceptors.push('templateLoadTranslationInterceptor');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/locale-{lang}.json'
    });
}).run(function ($rootScope, $translate, $translatePartialLoader) {
    'use strict';
    var switchPart = function (part) {
        $translatePartialLoader.addPart(part);
        $translate.refresh();
    };
    $rootScope.$on('translationPartChange', function (event, part) {
        switchPart(part, event);
    });
});

