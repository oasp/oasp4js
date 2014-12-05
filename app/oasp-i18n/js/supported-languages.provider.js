angular.module('app.oasp-i18n').provider('supportedLanguages', function () {
    'use strict';

    var supportedLanguages = [];
    this.setSupportedLanguages = function (langs) {
        supportedLanguages = langs;
    };
    this.$get = [function () {
        return {
            get: function () {
                return supportedLanguages;
            },
            getDefault: function () {
                var i, defaultLanguage;
                if (supportedLanguages && supportedLanguages.length) {
                    defaultLanguage = supportedLanguages[0];
                    for (i = 0; i < supportedLanguages.length; i += 1) {
                        if (supportedLanguages[i].default === true) {
                            defaultLanguage = supportedLanguages[i];
                        }
                    }
                }
                return defaultLanguage;
            }
        };
    }];
});