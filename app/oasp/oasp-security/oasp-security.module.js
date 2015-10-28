/**
 * @ngdoc object
 * @name oasp.oaspSecurity
 * @module oasp
 */
angular.module('oasp.oaspSecurity', ['angular-growl', 'oasp.oaspI18n'])
    .config(function ($httpProvider, oaspTranslationProvider) {
        'use strict';
        $httpProvider.interceptors.push('oaspSecurityInterceptor');

        oaspTranslationProvider.enableTranslationForModule('oaspSecurity');
    })
    .run(function (oaspSecurityService) {
        'use strict';
        oaspSecurityService.checkIfUserIsLoggedInAndIfSoReinitializeAppContext();
    });
