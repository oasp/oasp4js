describe('Service: security', function () {
    'use strict';
    var security, $httpBackend, currentContextPath,
        contextPath = '/oasp-app/',
        successCallback = jasmine.createSpy('success'),
        failureCallback = jasmine.createSpy('failure'),
        mockCsrf = function () {
            $httpBackend.whenGET(contextPath + 'services/rest/security/csrfToken/').respond({
                headerName: 'CSRF-TOKEN',
                token: 'token'
            });
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
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('gets anonymous current user when no security.initialize() called before', function () {
        // given
        var user;
        // when
        user = security.getCurrentUser();
        // then
        expect(user.isLoggedIn()).toBeFalsy();
        expect(user.getUserName()).toEqual('');
    });

    it('logs in the user', function () {
        // given
        var currentUser = security.getCurrentUser();
        $httpBackend.whenPOST(contextPath + 'services/rest/login').respond(200);
        $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond({
            userName: 'joe',
            languageTag: 'en-US'
        });
        mockCsrf();
        // when
        security.logIn({j_username: 'joe', j_password: 'pass'})
            .success(successCallback).error(failureCallback);
        $httpBackend.flush();
        // then
        expect(currentUser.isLoggedIn()).toBeTruthy();
        expect(currentUser.getUserName()).toEqual('joe');
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });
    it('logs off the user', function () {
        // given
        var currentUser = security.getCurrentUser();
        // for simulating logging in
        $httpBackend.whenPOST(contextPath + 'services/rest/login').respond(200);
        $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond({
            userName: 'joe',
            languageTag: 'en-US'
        });
        mockCsrf();
        $httpBackend.whenGET(contextPath + 'services/rest/logout').respond(200);
        // simulate logging in
        security.logIn({j_username: 'joe', j_password: 'pass'});
        // flush responses used while logging in
        $httpBackend.flush(2);
        // when
        security.logOff()
            .success(successCallback).error(failureCallback);
        // then
        // here the log off response has not been received yet
        expect(currentUser.isLoggedIn()).toBeTruthy();
        expect(currentUser.getUserName()).toEqual('joe');
        // now comes the log off response
        $httpBackend.flush();
        expect(currentUser.isLoggedIn()).toBeFalsy();
        expect(currentUser.getUserName()).toEqual('');
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });
    it('initializes user', function () {
        // given
        $httpBackend.whenGET(contextPath + 'services/rest/security/currentUser').respond(200);
        mockCsrf();
        // when
        security.initializeUser()
            .success(successCallback).error(failureCallback);
        $httpBackend.flush();
        // then
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
    });

});