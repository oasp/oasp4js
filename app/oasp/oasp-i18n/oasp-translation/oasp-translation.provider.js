angular.module('oasp.oaspI18n').provider('oaspTranslation', function ($translatePartialLoaderProvider, $translateProvider) {
    'use strict';

    var modulesWithTranslations = [],
        defaultModule,
        supportedLanguages = [],
        getDefaultLanguage = function () {
            var i;
            if (supportedLanguages && supportedLanguages.length) {
                for (i = 0; i < supportedLanguages.length; i += 1) {
                    if (supportedLanguages[i].default === true) {
                        return supportedLanguages[i];
                    }
                }
                return supportedLanguages[0];
            }
            return undefined;
        };




    this.enableTranslationForModule = function (module, isDefault) {
        if (modulesWithTranslations.indexOf(module) < 0) {
            modulesWithTranslations.push(module);
        }
        if (isDefault === true) {
            if (defaultModule) {
                throw new Error('Default module already specified defaultModule=' + defaultModule);
            }
            defaultModule = module;
            $translatePartialLoaderProvider.addPart(defaultModule);
        }
    };

    this.setSupportedLanguages = function (langs) {
        if (supportedLanguages && supportedLanguages.length) {
            throw new Error('Supported languages already specified');
        }
        supportedLanguages = langs;
        var defaultLanguage = getDefaultLanguage();
        if (defaultLanguage) {
            $translateProvider.preferredLanguage(defaultLanguage.key);
        }
    };

    this.$get = [function () {
        return {
            moduleHasTranslations: function (module) {
                return modulesWithTranslations.indexOf(module) > -1;
            },
            getDefaultTranslationModule: function () {
                return defaultModule;
            },
            getSupportedLanguages: function () {
                return supportedLanguages;
            },
            getDefaultLanguage: getDefaultLanguage
        };
    }];
});
