angular.module('app.main').controller('LanguageChangeCntl', function ($scope, $translate) {
    'use strict';
    $scope.supportedLanguages = [
        {
            key: 'en',
            label: 'Englisch'
        },
        {
            key: 'de',
            label: 'German'
        }
    ];
    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
    };
    $scope.getCurrentLanguage = function () {
        return $translate.use();
    };
});