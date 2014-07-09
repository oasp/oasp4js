angular.module('oasp.main', ['ngRoute'])
    .config(function ($routeProvider) {
        "use strict";
        $routeProvider.when('/main/sign-in', {templateUrl: 'html/main/sign-in.html'});
    })
    .controller('MainCntl', function ($scope, $location, security) {
        "use strict";
        $scope.currentUser = {
            isLoggedIn: false,
            getUserName : function () {
                var name = '';
                if (this.profile) {
                    name = this.profile.userName;
                }
                return name;
            },
            onSuccessfulLogin : function (userProfile) {
                this.isLoggedIn = true;
                this.profile = userProfile;
            }
        };
        security.getCurrentUser()
            .success(function (userProfile) {
                $scope.currentUser.onSuccessfulLogin(userProfile);
            }).error(function (errorCode) {
                $location.path('/main/sign-in');
            });
        $scope.logOff = function () {
            security.logOff().success(function () {
                $scope.currentUser.isLoggedIn = false;
                delete $scope.currentUser.profile;
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
                    path, splitPath, parsedContextPath;
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
        return {
            logIn: function (credentials) {
                return $http.post(currentContextPath.get() + 'services/rest/login', credentials);
            },
            logOff: function () {
                return $http.get(currentContextPath.get() + 'services/rest/logout');
            },
            getCurrentUser: function () {
                return $http.get(currentContextPath.get() + 'services/rest/security/currentUser');
            }
        };
    });