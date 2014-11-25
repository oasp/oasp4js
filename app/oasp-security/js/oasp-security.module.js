angular.module('oasp-security', [])
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('securityInterceptor');
    })
    .run(function (security) {
        'use strict';
        security.checkIfUserIsLoggedInAndIfSoReinitializeAppContext();
    });
