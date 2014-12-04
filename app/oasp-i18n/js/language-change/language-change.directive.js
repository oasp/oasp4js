angular.module('app.oasp-i18n').directive('languageChange', function () {
    'use strict';
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        controller: 'LanguageChangeCntl',
        templateUrl: 'oasp-i18n/html/language-change.html'
    };
});