describe('Service: security', function () {
    'use strict';
    var security, $httpBackend,
        contextPath = '/oasp-app/',
        successCallback = jasmine.createSpy('success'),
        failureCallback = jasmine.createSpy('failure'),
        mockRestServiceReturningCurrentUser = function (userName) {
            $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond({
                userName: userName,
                languageTag: 'en-US',
                homeDialogPath: '/some-module/some-dialog'
            });
        },
        mockRestServiceReturningCsrfToken = function () {
            $httpBackend.whenGET(contextPath + 'services/rest/security/csrfToken/').respond({
                headerName: 'CSRF-TOKEN',
                token: 'token'
            });
        },
        mockRestServicesCalledWhileLoggingIn = function (userName) {
            $httpBackend.whenPOST(contextPath + 'services/rest/login').respond(200);
            mockRestServiceReturningCurrentUser(userName);
            mockRestServiceReturningCsrfToken();
        };

    beforeEach(function () {
        var currentContextPathMock = (function () {
            return {
                get: function () {
                    return contextPath;
                }
            };
        }());
        module('app.main', function ($provide) {
            $provide.value('currentContextPath', currentContextPathMock);
        });
    });

    beforeEach(inject(function (_$httpBackend_, _security_) {
        $httpBackend = _$httpBackend_;
        security = _security_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('gets anonymous current user when no security.initialize() called before', function () {
        // when
        var user = security.getCurrentUser();
        // then
        expect(user.isLoggedIn()).toBeFalsy();
        expect(user.getUserName()).toEqual('');
    });

    it('logs in the user', function () {
        // given
        var currentUser = security.getCurrentUser(),
            userName = 'joe';
        mockRestServicesCalledWhileLoggingIn(userName);
        // when
        security.logIn({j_username: userName, j_password: 'pass'})
            .then(successCallback, failureCallback);
        $httpBackend.flush();
        // then
        expect(currentUser.isLoggedIn()).toBeTruthy();
        expect(currentUser.getUserName()).toEqual(userName);
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });

    it('logs off the user', function () {
        // given
        var currentUser = security.getCurrentUser(),
            userName = 'joe';
        // for simulating logging in
        mockRestServicesCalledWhileLoggingIn(userName);
        $httpBackend.whenGET(contextPath + 'services/rest/logout').respond(200);
        // simulate logging in
        security.logIn({j_username: userName, j_password: 'pass'});
        // flush responses used while logging in
        $httpBackend.flush(2);
        // when
        security.logOff()
            .then(successCallback, failureCallback);
        // then
        // here the log off response has not been received yet
        expect(currentUser.isLoggedIn()).toBeTruthy();
        expect(currentUser.getUserName()).toEqual(userName);
        // now comes the log off response
        $httpBackend.flush();
        expect(currentUser.isLoggedIn()).toBeFalsy();
        expect(currentUser.getUserName()).toEqual('');
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });
    it('initializes user', function () {
        // given
        var userName = 'joe';
        mockRestServiceReturningCurrentUser(userName);
        mockRestServiceReturningCsrfToken();
        // when
        security.initializeUser()
            .then(successCallback, failureCallback);
        $httpBackend.flush();
        // then
        expect(successCallback.mostRecentCall.args[0].getUserName()).toEqual(userName);
        expect(failureCallback).not.toHaveBeenCalled();
    });
});