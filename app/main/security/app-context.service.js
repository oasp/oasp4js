/**
 * @ngdoc service
 * @name main.appContext
 * @module app.main
 * @requires main.oaspSecurityService
 * @requires $q
 */
angular.module('app.main')
    .factory('appContext', function (oaspSecurityService, $q) {
        'use strict';
        var currentUserInternal = {
                isLoggedIn: false
            },
            currentUserExternal = function (currentUser) {
                return {
                    isLoggedIn: function () {
                        return currentUser.isLoggedIn;
                    },
                    getUserRoles: function () {
                        return currentUser.profile && currentUser.profile.role;
                    },
                    getUserName: function () {
                        var userName = '';
                        if (currentUser.profile && currentUser.profile.firstName && currentUser.profile.lastName) {
                            userName = currentUser.profile.firstName + ' ' + currentUser.profile.lastName;
                        }
                        return userName;
                    },
                    getUserId: function () {
                        return currentUser.profile && currentUser.profile.id;
                    },
                    getHomeDialogPath: function () {
                        return (currentUser.profile && currentUser.profile.homeDialogPath) || '';
                    }
                };
            },
            updateUserProfile = function (userProfile) {
                currentUserInternal.isLoggedIn = true;
                currentUserInternal.profile = userProfile;
                // TODO remove it once implemented on the server
                if (angular.isUndefined(userProfile.homeDialogPath)) {
                    if (userProfile.role === 'WAITER') {
                        currentUserInternal.profile.homeDialogPath = '/table-mgmt/table-search';
                    } else if (userProfile.role === 'COOK') {
                        currentUserInternal.profile.homeDialogPath = '/sales-mgmt/cook-positions';
                    } else {
                        // TODO: add rest (+ default?) roles and dialogs
                        currentUserInternal.profile.homeDialogPath = '/table-mgmt/table-search';
                    }
                }
            },
            switchToAnonymousUser = function () {
                currentUserInternal.isLoggedIn = false;
                currentUserInternal.profile = undefined;
            },
            getCurrentUser = function () {
                var deferred = $q.defer();
                oaspSecurityService.getCurrentUserProfile()
                    .then(function (userProfile) {
                        if (userProfile) {
                            updateUserProfile(userProfile);
                        } else {
                            switchToAnonymousUser();
                        }
                        deferred.resolve(currentUserExternal(currentUserInternal));
                    });
                return deferred.promise;
            };

        return {
            /**
             * @ngdoc method
             * @name main.appContext#getUserRoles
             * @methodOf main.appContext
             *
             * @return {array} current user roles
             */
            getUserRoles: function () {
                return getCurrentUser()
                    .then(function (userProfile) {
                        return userProfile.getUserRoles();
                    });
            },
            /**
             * @ngdoc method
             * @name main.appContext#getCurrentUser
             * @methodOf main.appContext
             *
             * @return {promise} current user promise
             */
            getCurrentUser: getCurrentUser,
            /**
             * @ngdoc method
             * @name main.appContext#onLoggingIn
             * @methodOf main.appContext
             *
             * @params {object} userProfile current user profile
             */
            onLoggingIn: function (userProfile) {
                updateUserProfile(userProfile);
            },
            /**
             * @ngdoc method
             * @name main.appContext#onLoggingOff
             * @methodOf main.appContext
             *
             */
            onLoggingOff: function () {
                switchToAnonymousUser();
            }
        };
    });
