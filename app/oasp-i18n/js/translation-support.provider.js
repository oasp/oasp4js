angular.module('app.oasp-i18n').provider('translationSupport', function () {
    'use strict';

    var modulesWithTranslations = [], defaultModule;
    this.enableTranslationForModule = function (module, isDefault) {
        if (modulesWithTranslations.indexOf(module) < 0) {
            modulesWithTranslations.push(module);
        }
        if (isDefault === true) {
            defaultModule = module;
        }
    };
    this.$get = [function () {
        return {
            moduleHasTranslations: function (module) {
                return modulesWithTranslations.indexOf(module) > -1;
            },
            getDefaultTranslationModule: function () {
                return defaultModule;
            }
        };
    }];
});