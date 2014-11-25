angular.module('oasp-security')
    .provider('security', function () {
        'use strict';
        var config = {
            securityRestServiceName: 'securityRestService',
            appContextServiceName: 'appContext'
        };

        return {
            setSecurityRestServiceName: function (securityRestServiceName) {
                config.securityRestServiceName = securityRestServiceName || config.securityRestServiceName;
            },
            setAppContextServiceName: function (appContextServiceName) {
                config.appContextServiceName = appContextServiceName || config.appContextServiceName;
            },
            $get: function ($injector, $http, $q) {
                var getSecurityRestService = function () {
                        return $injector.get(config.securityRestServiceName);
                    },
                    getAppContextService = function () {
                        return $injector.get(config.appContextServiceName);
                    },
                    enableCsrfProtection = function () {
                        return getSecurityRestService().getCsrfToken()
                            .then(function (response) {
                                var csrfProtection = response.data;
                                // from now on a CSRF token will be added to all HTTP requests
                                $http.defaults.headers.common[csrfProtection.headerName] = csrfProtection.token;
                                return csrfProtection;
                            }, function () {
                                return 'Requesting a CSRF token failed';
                            });
                    };

                return {
                    logIn: function (credentials) {
                        var logInDeferred = $q.defer();
                        getSecurityRestService().login(credentials)
                            .then(function () {
                                $q.all([
                                    getSecurityRestService().getCurrentUser(),
                                    enableCsrfProtection()
                                ]).then(function (allResults) {
                                    getAppContextService().onLoggingIn(allResults[0].data);
                                    logInDeferred.resolve(allResults[1]);
                                }, function (reject) {
                                    logInDeferred.reject(reject);
                                });
                            }, function () {
                                logInDeferred.reject('Authentication failed');
                            });
                        return logInDeferred.promise;
                    },
                    logOff: function () {
                        return getSecurityRestService().logout()
                            .then(function () {
                                getAppContextService().onLoggingOff();
                            });
                    },
                    checkIfUserIsLoggedInAndIfSoReinitializeAppContext: function () {
                        getSecurityRestService().getCurrentUser().then(function (response) {
                            var userProfile = response.data;
                            enableCsrfProtection().then(function () {
                                getAppContextService().onLoggingIn(userProfile);
                            });
                        });
                    }
                };
            }
        };
    });