/*globals describe, beforeEach, module, afterEach, it, inject, spyOn, expect*/
describe('Module: main', function () {
    "use strict";
    describe('Controller: MainCntl', function () {
        var $scope, $location, initializeUserHttpDeferredMock, logOffHttpDeferredMock;
        beforeEach(module('oasp.main'));
        beforeEach(inject(function ($rootScope, $controller, _$location_, $q) {
            var httpDeferredMockFactory = function ($q) {
                var httpDeferredMock = $q.defer(),
                    httpPromiseMock = httpDeferredMock.promise;
                httpPromiseMock.success = function (fn) {
                    httpPromiseMock.then(function () {
                        fn();
                    });
                    return httpPromiseMock;
                };

                httpPromiseMock.error = function (fn) {
                    httpPromiseMock.then(null, function () {
                        fn();
                    });
                    return httpPromiseMock;
                };
                return httpDeferredMock;
            }, security = {
                initializeUser: function () {
                    initializeUserHttpDeferredMock = httpDeferredMockFactory($q);
                    return initializeUserHttpDeferredMock.promise;
                },
                logOff: function () {
                    logOffHttpDeferredMock = httpDeferredMockFactory($q);
                    return logOffHttpDeferredMock.promise;
                },
                getCurrentUser: function () {
                    return {
                        isLoggedIn: function () {
                            return false;
                        },
                        getUserName: function () {
                            return '';
                        }
                    };
                }
            };
            $location = _$location_;
            $scope = $rootScope;

            $controller('MainCntl', {$scope: $scope, $location: $location, security: security});
        }));

        it('goes to /main/sign-in when initializing fails', function () {
            // when
            initializeUserHttpDeferredMock.reject();
            $scope.$apply();
            // then
            expect($location.path()).toEqual('/main/sign-in');
            expect($scope.currentUser.isLoggedIn()).toBeFalsy();
        });

        it('exposes currentUser.isLoggedIn() on $scope which returns false for anonymous user', function () {
            // when
            initializeUserHttpDeferredMock.resolve();
            $scope.$apply();
            // then
            expect($scope.currentUser.isLoggedIn()).toBeFalsy();
        });

        it('exposes currentUser.getName() on $scope which returns empty string if for anonymous user', function () {
            // when
            initializeUserHttpDeferredMock.resolve();
            $scope.$apply();
            // then
            expect($scope.currentUser.getUserName()).toEqual('');
        });

        it('exposes logOff() on $scope which redirects to /main/sign-in on success', function () {
            // given
            initializeUserHttpDeferredMock.resolve();
            $scope.$apply();
            $location.path('/table-mgmt/table-search');
            // when
            $scope.logOff();
            logOffHttpDeferredMock.resolve();
            $scope.$apply();
            // then
            expect($location.path()).toEqual('/main/sign-in');
        });
    });

    describe('Service: security', function () {
        var security, $httpBackend, currentContextPath,
            contextPath = '/oasp-app/',
            callbacks = {
                success : function () {},
                failure : function () {}
            };

        beforeEach(module('oasp.main'));

        beforeEach(function () {
            currentContextPath = (function () {
                return {
                    get: function () {
                        return contextPath;
                    }
                };
            }());

            module(function ($provide) {
                $provide.value('currentContextPath', currentContextPath);
            });

            inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');
                security = $injector.get('security');
            });

            // register callbacks
            spyOn(callbacks, 'success');
            spyOn(callbacks, 'failure');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('gets anonymous current user when no security.initialize() called before', inject(function (security) {
            // given
            var user;
            // when
            user = security.getCurrentUser();
            // then
            expect(user.isLoggedIn()).toBeFalsy();
            expect(user.getUserName()).toEqual('');
        }));

        it('logs in the user', inject(function (security) {
            // given
            var currentUser = security.getCurrentUser();
            $httpBackend.whenPOST(contextPath + 'services/rest/login').respond(200);
            $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond({
                userName : 'joe',
                languageTag : 'en-US'
            });
            // when
            security.logIn({j_username : 'joe', j_password : 'pass'})
                .success(callbacks.success).error(callbacks.failure);
            $httpBackend.flush();
            // then
            expect(currentUser.isLoggedIn()).toBeTruthy();
            expect(currentUser.getUserName()).toEqual('joe');
            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();
        }));
        it('logs off the user', inject(function (security) {
            // given
            var currentUser = security.getCurrentUser();
            // for simulating logging in
            $httpBackend.whenPOST(contextPath + 'services/rest/login').respond(200);
            $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond({
                userName : 'joe',
                languageTag : 'en-US'
            });
            $httpBackend.whenGET(contextPath + 'services/rest/logout').respond(200);
            // simulate logging in
            security.logIn({j_username : 'joe', j_password : 'pass'});
            // flush responses used while logging in
            $httpBackend.flush(2);
            // when
            security.logOff()
                .success(callbacks.success).error(callbacks.failure);
            // then
            // here the log off response has not been received yet
            expect(currentUser.isLoggedIn()).toBeTruthy();
            expect(currentUser.getUserName()).toEqual('joe');
            // now comes the log off response
            $httpBackend.flush();
            expect(currentUser.isLoggedIn()).toBeFalsy();
            expect(currentUser.getUserName()).toEqual('');
            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();
        }));
        it('initializes user', inject(function (security) {
            // given
            $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond(200);
            // when
            security.initializeUser()
                .success(callbacks.success).error(callbacks.failure);
            $httpBackend.flush();
            // then
            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();
        }));

    });

    describe('Service: currentContextPath', function () {
        var currentContextPath, $window;

        beforeEach(module('oasp.main'));

        beforeEach(function () {
            $window = (function () {
                var location = {};
                return {
                    location: location,
                    letLocationPathnameBe: function (pathnameToBeReturned) {
                        location.pathname = pathnameToBeReturned;
                    }
                };
            }());

            module(function ($provide) {
                $provide.value('$window', $window);
            });

            inject(function ($injector) {
                currentContextPath = $injector.get('currentContextPath');
            });
        });

        it('extracts context path when location path has 2 elements', inject(function (currentContextPath, $location) {
            //given
            var path;
            $window.letLocationPathnameBe('/myContext/some-other-elements');
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/myContext/');
        }));
        it('returns // when no path contained in the location', inject(function (currentContextPath, $location) {
            //given
            var path;
            $window.letLocationPathnameBe('/');
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/');
        }));
        it('returns // when path contained in the location is undefined', inject(function (currentContextPath, $location) {
            //given
            var path;
            //when
            path = currentContextPath.get();
            //then
            expect(path).toEqual('/');
        }));
    });
});
