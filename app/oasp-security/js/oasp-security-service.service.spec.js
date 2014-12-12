describe('Module: \'oasp-security\', service: \'oaspSecurityService\'', function () {
    'use strict';
    var userProfile = {
        name: 'Joe'
    }, csrfProtection = {
        headerName: 'CSRF-TOKEN',
        token: 'asd-456f-gh5'
    }, currentUserPromise, csrfTokenPromise, logInPromise, logoutPromise, oaspSecurityService, $q, $rootScope, successCallback, failureCallback, myAppContext;

    beforeEach(function () {
        var mySecurityRestService = (function () {
            return {
                getCurrentUser: function () {
                    return currentUserPromise;
                },
                getCsrfToken: function () {
                    return csrfTokenPromise;
                },
                login: function () {
                    return logInPromise;
                },
                logout: function () {
                    return logoutPromise;
                }
            };
        }());
        myAppContext = (function () {
            return {
                onLoggingIn: jasmine.createSpy('onLoggingIn'),
                onLoggingOff: jasmine.createSpy('onLoggingOff')
            };
        }());
        angular.module('module-using-oasp-security', ['oasp-security'])
            .config(function (oaspSecurityServiceProvider) {
                oaspSecurityServiceProvider.setSecurityRestServiceName('mySecurityRestService');
                oaspSecurityServiceProvider.setAppContextServiceName('myAppContext');
            })
            .value('mySecurityRestService', mySecurityRestService)
            .value('myAppContext', myAppContext);

        module('module-using-oasp-security');
    });

    /*jslint nomen: true*/
    beforeEach(inject(function (_oaspSecurityService_, _$q_, _$rootScope_) {
        oaspSecurityService = _oaspSecurityService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        successCallback = jasmine.createSpy('success');
        failureCallback = jasmine.createSpy('failure');
        currentUserPromise = $q.when({
            data: userProfile
        });
        logInPromise = $q.when();
        logoutPromise = $q.when();
        csrfTokenPromise = $q.when({
            data: csrfProtection
        });

    }));
    /*jslint nomen: false*/

    it('calls onLoggingIn() passing user data when logging in successful', function () {
        // when
        oaspSecurityService.logIn('user', 'pass').then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
        expect(myAppContext.onLoggingIn).toHaveBeenCalledWith(userProfile);
    });

    it('calls onLoggingOff() when logging out successful', function () {
        // when
        oaspSecurityService.logOff().then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
        expect(myAppContext.onLoggingOff).toHaveBeenCalledWith();
    });

    it('gets current CSRF token when logging in successful', function () {
        // given
        var currentCsrfToken;
        oaspSecurityService.logIn('user', 'pass');
        $rootScope.$apply();
        // when
        currentCsrfToken = oaspSecurityService.getCurrentCsrfToken();
        // then
        expect(currentCsrfToken.hasToken()).toBeTruthy();
        expect(currentCsrfToken.getHeaderName()).toBe(csrfProtection.headerName);
        expect(currentCsrfToken.getToken()).toBe(csrfProtection.token);
    });

    it('no current CSRF token after successful logging off', function () {
        // given
        var currentCsrfToken;
        oaspSecurityService.logOff();
        $rootScope.$apply();
        // when
        currentCsrfToken = oaspSecurityService.getCurrentCsrfToken();
        // then
        expect(currentCsrfToken.hasToken()).toBeFalsy();
        expect(currentCsrfToken.getHeaderName()).toBeUndefined();
        expect(currentCsrfToken.getToken()).toBeUndefined();
    });
});