/*globals angular*/
angular.module('oasp.main', ['ngRoute'])
    .config(function ($routeProvider) {
        "use strict";
        $routeProvider.when('/main/sign-in', {templateUrl: 'html/main/sign-in.html'});
    })
    .controller('MainCntl', function ($scope, $location, security) {
        "use strict";
        security.initializeUser()
            .error(function () {
                $location.path('/main/sign-in');
            });

        $scope.currentUser = security.getCurrentUser();

        $scope.logOff = function () {
            security.logOff().success(function () {
                $location.path('/main/sign-in');
            });
        };
    })
    .factory('currentContextPath', function ($window) {
        "use strict";
        var contextPath = '';
        return {
            get : function () {
                var contextPathNotInitializedYet = contextPath ? false : true,
                    path,
                    splitPath,
                    parsedContextPath;
                if (contextPathNotInitializedYet) {
                    contextPath = '/';
                    path = $window.location.pathname;
                    if (path) {
                        splitPath = path.split('/');
                        if (splitPath.length > 1) {
                            parsedContextPath = splitPath[1];
                            if (parsedContextPath) {
                                contextPath += parsedContextPath + '/';
                            }
                        }
                    }
                }
                return contextPath;
            }
        };
    })
    .factory('security', function ($http, currentContextPath) {
        "use strict";
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
                    }
                };
            }(currentUserInternal)),
            onUserProfileChange = function (userProfile) {
                currentUserInternal.isLoggedIn = true;
                currentUserInternal.profile = userProfile;
            },
            onLoggingOff = function () {
                currentUserInternal.isLoggedIn = false;
                currentUserInternal.profile = undefined;
            },
            initializeUser = function () {
                return $http.get(currentContextPath.get() + 'services/rest/security/currentUser')
                    .success(function (userProfile) {
                        onUserProfileChange(userProfile);
                    });
            };
        return {
            getCurrentUser: function () {
                return currentUserExternal;
            },
            logIn: function (credentials) {
                return $http.post(currentContextPath.get() + 'services/rest/login', credentials)
                    .success(function () {
                        return initializeUser();
                    });
            },
            logOff: function () {
                return $http.get(currentContextPath.get() + 'services/rest/logout')
                    .success(function () {
                        onLoggingOff();
                    });
            },
            initializeUser: function () {
                return initializeUser();
            }
        };
    });