angular.module('app.main').factory('security', function (securityRestService, $http, $q) {
    'use strict';
    var currentUserInternal = {
            isLoggedIn: false
        },
        currentUserExternal = (function (currentUser) {
            return {
                isLoggedIn: function () {
                    return currentUser.isLoggedIn;
                },
                getUserName: function () {
                    return (currentUser.profile && currentUser.profile.userName) || '';
                },
                getHomeDialogPath: function () {
                    return (currentUser.profile && currentUser.profile.homeDialogPath) || '';
                }
            };
        }(currentUserInternal)),
        updateUserProfile = function (userProfile) {
            currentUserInternal.isLoggedIn = true;
            currentUserInternal.profile = userProfile;
            // TODO remove it once implemented on the server
            if (angular.isUndefined(userProfile.homeDialogPath)) {
                currentUserInternal.profile.homeDialogPath = '/table-mgmt/table-search';
            }
        },
        switchToAnonymousUser = function () {
            currentUserInternal.isLoggedIn = false;
            currentUserInternal.profile = undefined;
        },
        enableCsrfProtection = function () {
            return securityRestService.getCsrfToken().then(function (response) {
                var csrfProtection = response.data;
                // from now on a CSRF token will be added to all HTTP requests
                $http.defaults.headers.common[csrfProtection.headerName] = csrfProtection.token;
            });
        },
        initializeUser = function () {
            var userInitializationDeferred = $q.defer();
            securityRestService.getCurrentUser()
                .then(function (response) {
                    updateUserProfile(response.data);
                    return enableCsrfProtection();
                }, function () {
                    userInitializationDeferred.reject('Requesting a user profile failed');
                })
                .then(function () {
                    userInitializationDeferred.resolve(currentUserExternal);
                });
            return userInitializationDeferred.promise;
        };
    return {
        getCurrentUser: function () {
            return currentUserExternal;
        },
        logIn: function (credentials) {
            var logInDeferred = $q.defer();
            securityRestService.login(credentials)
                .then(function () {
                    initializeUser()
                        .then(function (currentUser) {
                            logInDeferred.resolve(currentUser);
                        }, function (reason) {
                            logInDeferred.reject(reason);
                        });
                }, function () {
                    logInDeferred.reject('Authentication failed');
                });
            return logInDeferred.promise;
        },
        logOff: function () {
            return securityRestService.logout()
                .then(function () {
                    switchToAnonymousUser();
                });
        },
        initializeUser: function () {
            return initializeUser();
        }
    };
});