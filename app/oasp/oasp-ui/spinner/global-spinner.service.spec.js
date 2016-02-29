describe('Module: \'oasp.oaspUi\', service: \'globalSpinner\'', function () {
    'use strict';

    var globalSpinner, $rootScope,
        broadcastRouteChangeSuccess = function ($rootScope) {
            $rootScope.$broadcast('$stateChangeStart', {
                resolve: []
            });
        };

    beforeEach(function () {
        module('oasp.oaspUi.spinner');
        /*jslint nomen: true */
        inject(function (_globalSpinner_, _$rootScope_) {
            globalSpinner = _globalSpinner_;
            $rootScope = _$rootScope_;
        });
        /*jslint nomen: false */
    });

    it('sets the \'globalSpinner\' flag on the $rootScope upon show', function () {
        // given
        $rootScope.globalSpinner = false;
        // when
        globalSpinner.show();
        // then
        expect($rootScope.globalSpinner).toBeTruthy();
    });

    it('resets the \'globalSpinner\' flag on the $rootScope upon hide', function () {
        // given
        $rootScope.globalSpinner = true;
        // when
        globalSpinner.hide();
        // then
        expect($rootScope.globalSpinner).toBeFalsy();
    });

    it('shows the spinner when a route change starts', function () {
        // given
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete($rootScope);
        // when
        broadcastRouteChangeSuccess($rootScope);
        // then
        expect($rootScope.globalSpinner).toBeTruthy();
    });

    it('hides the spinner when a route change start succeeded', function () {
        // given
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete($rootScope);
        broadcastRouteChangeSuccess($rootScope);
        // when
        $rootScope.$broadcast('$stateChangeSuccess');
        // then
        expect($rootScope.globalSpinner).toBeFalsy();
    });

    it('hides the spinner when a route change start failed', function () {
        // given
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete($rootScope);
        broadcastRouteChangeSuccess($rootScope);
        // when
        $rootScope.$broadcast('$stateChangeError');
        // then
        expect($rootScope.globalSpinner).toBeFalsy();
    });

    it('hides the spinner when a route change not found', function () {
        // given
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete($rootScope);
        broadcastRouteChangeSuccess($rootScope);
        // when
        $rootScope.$broadcast('$stateNotFound');
        // then
        expect($rootScope.globalSpinner).toBeFalsy();
    });

    it('does not define the spinner when event has no resolve', function () {
        spyOn(globalSpinner, 'show').and.callThrough();
        // given
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete($rootScope);
        // when
        $rootScope.$broadcast('$stateChangeStart', {
            resolve: undefined
        });
        // then
        expect($rootScope.globalSpinner).not.toBeDefined();
        expect(globalSpinner.show).not.toHaveBeenCalled();
    });
});
