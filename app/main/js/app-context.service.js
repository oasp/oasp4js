angular.module('app.main')
    .factory('appContext', function () {
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
                        var userName = '';
                        if (currentUser.profile && currentUser.profile.firstName && currentUser.profile.lastName) {
                            userName = currentUser.profile.firstName + ' ' + currentUser.profile.lastName;
                        }
                        return userName;
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
            };

        return {

          /**
           * @ngdoc function
           * @name getCurrentUser
           * @module app.main
           * @kind function
           *
           * @description
           *Invoke to log in user
           *
           * @returned {Object} currentUser
           */
            getCurrentUser: function () {
                return currentUserExternal;
            },



          /**
           * @ngdoc function
           * @name onLoggingIn
           * @module app.main
           * @kind function
           *
           * @description
           *Invoke to log in user
           *
           * @param {Object} currentUser
           */
            onLoggingIn: function (currentUser) {
                updateUserProfile(currentUser);
            },


          /**
           * @ngdoc function
           * @name onLoggingOff
           * @module app.main
           * @kind function
           *
           * @description
           * Invoke when you logoff User
           *
           */
            onLoggingOff: function () {
                switchToAnonymousUser();
            }
        };
    });
