describe('Module: \'app.main\'', function () {
    'use strict';
    var routeProvider;

    beforeEach(function () {
        module('ngRoute', function ($routeProvider) {
            routeProvider = $routeProvider;
            spyOn(routeProvider, 'when').andCallThrough();
            spyOn(routeProvider, 'otherwise').andCallThrough();
        });
        module('app.main');
        // this is necessary to trigger loading the modules
        inject();
    });

    it('defines a route for the Sign In dialog', inject(function (SIGN_IN_DLG_PATH) {
        expect(routeProvider.when).toHaveBeenCalledWith(SIGN_IN_DLG_PATH, {templateUrl: 'html/main/sign-in.html'});
    }));

    it('defines a route for a blank page', inject(function () {
        expect(routeProvider.when).toHaveBeenCalledWith('/', {templateUrl: 'html/main/blank.html'});
    }));

    it('defines the default route redirecting to the welcome dialog', function () {
        expect(routeProvider.otherwise).toHaveBeenCalledWith({templateUrl: 'html/main/page-not-found.html'});
    });

});
