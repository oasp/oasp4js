describe('Module: \'app\'', function () {
    'use strict';

    it('sets the \'Hashbang\' mode', function () {
        // given
        var locationProvider;
        module('ng', function ($locationProvider) {
            locationProvider = $locationProvider;
            spyOn(locationProvider, 'html5Mode').andCallThrough();
        });
        // when
        module('app');
        // this is necessary to trigger loading the modules
        inject();
        // then
        expect(locationProvider.html5Mode).toHaveBeenCalledWith(false);
    });

    it('redirects to the Sign In dialog when user not signed in', function () {
        // given
        module('app.main', function ($provide) {
            $provide.value('security', {initializeUser: function () {
                /*jslint unparam: true*/
                return {
                    then: function (successFn, failureFn) {
                        failureFn();
                    }
                };
            }});
            /*jslint unparam: false*/
        });
        // when
        module('app');
        // then
        inject(function ($location, SIGN_IN_DLG_PATH) {
            expect($location.path()).toEqual(SIGN_IN_DLG_PATH);
        });
    });

    it('redirects to the user\'s home dialog when user signed in', function () {
        // given
        var userHomeDialogPath = '/some-component/some-dlg';
        module('app.main', function ($provide) {
            $provide.value('security', {initializeUser: function () {
                return {
                    then: function (successFn) {
                        successFn({
                            getHomeDialogPath: function () {
                                return userHomeDialogPath;
                            }
                        });
                    }
                };
            }});
        });
        // when
        module('app');
        // then
        inject(function ($location) {
            expect($location.path()).toEqual(userHomeDialogPath);
        });
    });

    it('adds the spinner upon route changes', function () {
        // given
        module('oasp-ui', function ($provide) {
            $provide.value('globalSpinner',
                jasmine.createSpyObj('globalSpinner', ['showOnRouteChangeStartAndHideWhenComplete']));
            // when
            module('app');
            // then
            inject(function (globalSpinner) {
                expect(globalSpinner.showOnRouteChangeStartAndHideWhenComplete).toHaveBeenCalled();
            });
        });
    });
});
