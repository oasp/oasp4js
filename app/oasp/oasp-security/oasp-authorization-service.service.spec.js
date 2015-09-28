describe('Module: \'oasp-security\', service: \'oaspAuthorizationService\'', function () {
    'use strict';
    var cookRole, waiterRole, richRole, userRolesDeferred, userRolesPromise, oaspAuthorizationService, $q, $rootScope, successCallback, failureCallback;

    beforeEach(function () {
        var myAppContext = (function () {
            return {
                getUserRoles: function () {
                    return userRolesPromise;
                }
            };
        }());
        angular.module('module-using-oasp-security', ['oasp.oaspSecurity'])
            .config(function (oaspAuthorizationServiceProvider) {
                oaspAuthorizationServiceProvider.setAppContextServiceName('myAppContext');
            })
            .value('myAppContext', myAppContext);

        module('module-using-oasp-security');
    });

    /*jslint nomen: true*/
    beforeEach(inject(function (_oaspAuthorizationService_, _$q_, _$rootScope_) {
        oaspAuthorizationService = _oaspAuthorizationService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        successCallback = jasmine.createSpy('success');
        failureCallback = jasmine.createSpy('failure');
        cookRole = 'COOK';
        waiterRole = 'WAITER';
        richRole = ['COOK', 'WAITER'];
        userRolesDeferred = $q.defer();
        userRolesPromise = userRolesDeferred.promise;

    }));

    it('authorizationCheckResolver() rejects for no permissions', function () {
        // given
        userRolesDeferred.resolve(waiterRole);
        // when
        oaspAuthorizationService.authorizationCheckResolver(cookRole).then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(failureCallback).toHaveBeenCalled();
        expect(successCallback).not.toHaveBeenCalled();
    });

    it('authorizationCheckResolver() resolves for permissions', function () {
        // given
        userRolesDeferred.resolve(cookRole);
        // when
        oaspAuthorizationService.authorizationCheckResolver(cookRole).then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(failureCallback).not.toHaveBeenCalled();
        expect(successCallback).toHaveBeenCalled();
    });

    it('authorizationCheckResolver() resolves for rich user roles ', function () {
        // given
        userRolesDeferred.resolve(richRole);
        // when
        oaspAuthorizationService.authorizationCheckResolver(cookRole).then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(failureCallback).not.toHaveBeenCalled();
        expect(successCallback).toHaveBeenCalled();
    });
    it('authorizationCheckResolver() resolves for rich requested roles ', function () {
        // given
        userRolesDeferred.resolve(cookRole);
        // when
        oaspAuthorizationService.authorizationCheckResolver(richRole).then(successCallback, failureCallback);
        $rootScope.$apply();
        // then
        expect(failureCallback).not.toHaveBeenCalled();
        expect(successCallback).toHaveBeenCalled();
    });
});
