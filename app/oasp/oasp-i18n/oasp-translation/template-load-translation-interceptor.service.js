/**
 * @ngdoc service
 * @name oasp.oaspI18n.templateLoadTranslationInterceptor
 * @module oasp.oaspI18n
 * @requires $rootScope
 * @requires oaspI18n.oaspTranslation
 */
angular.module('oasp.oaspI18n').service('templateLoadTranslationInterceptor', function ($rootScope, oaspTranslation) {
    'use strict';
    var regexp = new RegExp('/?([^/]+)/.*html');
    return {

        /**
         * @ngdoc method
         * @name oasp.oaspI18n.templateLoadTranslationInterceptor#request
         * @methodOf oasp.oaspI18n.templateLoadTranslationInterceptor
         *
         * @params {object} config
         * @return {object} config
         */
        request: function (config) {
            if (config.url) {
                var matches = regexp.exec(config.url);
                if (matches && matches.length > 1 && oaspTranslation.moduleHasTranslations(matches[1])) {
                    $rootScope.$emit('translationPartChange', matches[1]);
                }
            }
            return config;
        }
    };
});
