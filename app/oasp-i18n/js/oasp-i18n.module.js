angular.module('app.oasp-i18n', ['pascalprecht.translate', 'app.oasp-i18n.templates'], function ($translateProvider, $httpProvider) {
    'use strict';
    $httpProvider.interceptors.push('templateLoadTranslationInterceptor');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/locale-{lang}.json'
    });
}).run(function ($rootScope, $translate, $translatePartialLoader, translationSupport, supportedLanguages) {
    'use strict';
    var switchPart = function (part) {
        $translatePartialLoader.addPart(part);
        $translate.refresh();
    };
    $rootScope.$on('translationPartChange', function (event, part) {
        switchPart(part, event);
    });
    if (supportedLanguages.getDefault()) {
        $translate.use(supportedLanguages.getDefault().key);
    }
    if (translationSupport.getDefaultTranslationModule()) {
        switchPart(translationSupport.getDefaultTranslationModule());
    }
});

