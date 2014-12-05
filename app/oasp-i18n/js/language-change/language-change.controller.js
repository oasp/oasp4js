angular.module('app.oasp-i18n').controller('LanguageChangeCntl', function ($scope, $translate, supportedLanguages) {
    'use strict';
    $scope.supportedLanguages = supportedLanguages.get();

    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
    };
    $scope.getCurrentLanguage = function () {
        return $translate.use();
    };
});