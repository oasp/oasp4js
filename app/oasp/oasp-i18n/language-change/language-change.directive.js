/**
 * @ngdoc directive
 * @name oasp.oaspI18n.directive:languageChange
 * @module oasp.oaspI18n
 * @directive
 * @restrict EA
 * @scope
 */
angular.module('oasp.oaspI18n').directive('languageChange', function () {
    'use strict';
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        controller: 'LanguageChangeCntl',
        templateUrl: 'oasp/oasp-i18n/language-change/language-change.html'
    };
});
