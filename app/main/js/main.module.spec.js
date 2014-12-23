describe('Module: \'app.main\'', function () {
    'use strict';
    var routeProvider;

    beforeEach(function () {
        module('ngRoute', function ($routeProvider) {
            routeProvider = $routeProvider;
            spyOn(routeProvider, 'when').and.callThrough();
            spyOn(routeProvider, 'otherwise').and.callThrough();
        });
        module('app.main');
        // this is necessary to trigger loading the modules
        inject();
    });

    it('defines a route for the Sign In dialog', inject(function (SIGN_IN_DLG_PATH) {
        expect(routeProvider.when).toHaveBeenCalledWith(SIGN_IN_DLG_PATH, {templateUrl: 'main/html/sign-in.html'});
    }));

    it('defines the default route redirecting to the welcome dialog', function () {
        expect(routeProvider.otherwise).toHaveBeenCalledWith({templateUrl: 'main/html/page-not-found.html'});
    });

});
