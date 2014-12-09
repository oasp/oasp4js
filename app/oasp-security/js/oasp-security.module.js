/**
 * @ngdoc module
 * @name oasp-security
 * @module oasp-security
 * @description
 *
 * Provides the oasp-security module.
 *
 */
angular.module('oasp-security', [])
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('securityInterceptor');
    })
    .run(function (oaspSecurityService) {
        'use strict';
        oaspSecurityService.checkIfUserIsLoggedInAndIfSoReinitializeAppContext();
    });
