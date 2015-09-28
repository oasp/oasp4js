describe('show-if-user-has-role directive specs', function () {
    'use strict';
    var $compile, waiterRole, richRole, userRolesDeferred, userRolesPromise, oaspAuthorizationService, $q, $rootScope, successCallback, failureCallback;

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
    beforeEach(inject(function (_$compile_, _oaspAuthorizationService_, _$q_, _$rootScope_) {
        oaspAuthorizationService = _oaspAuthorizationService_;
        $q = _$q_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $rootScope.cookRole = 'COOK';
        $rootScope.chiefRole = 'CHIEF';
        $rootScope.richRole = ['COOK', 'WAITER'];
        userRolesDeferred = $q.defer();
        userRolesPromise = userRolesDeferred.promise;

    }));

    it('adds ng-hide class to the div', function () {
        // given
        var renderedButtonLabel, element;
        userRolesDeferred.resolve($rootScope.chiefRole);
        // when
        element = $compile('<div show-if-user-has-role="cookRole"></div>')($rootScope);
        $rootScope.$digest();
        // then
        expect(element.attr('class').indexOf('ng-hide')).toEqual(-1);
    });
    it('adds ng-hide class to the div for rich user roles', function () {
        // given
        var renderedButtonLabel, element;
        userRolesDeferred.resolve($rootScope.richRole);
        // when
        element = $compile('<div show-if-user-has-role="cookRole"></div>')($rootScope);
        $rootScope.$digest();
        // then

        expect(element.attr('class').indexOf('ng-hide')).toEqual(-1);
    });
    it('leaves the div visible', function () {
        // given
        var renderedButtonLabel, element;
        userRolesDeferred.resolve($rootScope.cookRole);
        // when
        element = $compile('<div hide-if-user-has-role="cookRole"></div>')($rootScope);
        $rootScope.$digest();
        // then
        expect(element.attr('class').indexOf('ng-hide')).toBeGreaterThan(-1);
    });
});
