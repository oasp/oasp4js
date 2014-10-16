describe('Module: \'oasp-security\', service: \'security\'', function () {
    'use strict';
    var currentUserPromise, csrfTokenPromise, logInPromise, logoutPromise,
        security, $q, $rootScope,
        successCallback = jasmine.createSpy('success'),
        failureCallback = jasmine.createSpy('failure'),
        onLoggingInSpy = jasmine.createSpy('onLoggingIn');

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
            }()),
            myAppContext = (function () {
                return {
                    onLoggingIn: onLoggingInSpy,
                    onLoggingOff: jasmine.createSpy('onLoggingOff')
                };
            }());
        angular.module('module-using-oasp-security', ['oasp-security'])
            .config(function (securityProvider) {
                securityProvider.setSecurityRestServiceName('mySecurityRestService');
                securityProvider.setAppContextServiceName('myAppContext');
            })
            .value('mySecurityRestService', mySecurityRestService)
            .value('myAppContext', myAppContext);

        module('oasp-security', 'module-using-oasp-security');
    });

    beforeEach(inject(function (_security_, _$q_, _$rootScope_) {
        security = _security_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('calls onLoggingIn() passing user data when logging in successful', function () {
        // given
        var userProfile = {
                name: 'Joe'
            },
            csrfProtection = {
                headerName: '',
                token: ''
            };
        currentUserPromise = $q.when({
            data: userProfile
        });
        csrfTokenPromise = $q.when({
            data: csrfProtection
        });
        logInPromise = $q.when();
        // when
        security.logIn({}).then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(successCallback).toHaveBeenCalled();
        expect(failureCallback).not.toHaveBeenCalled();
        expect(onLoggingInSpy).toHaveBeenCalledWith(userProfile);
    });
});