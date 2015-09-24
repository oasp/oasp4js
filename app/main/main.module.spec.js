describe('Module: \'app.main\'', function () {
    'use strict';
    var stateProvider;

    beforeEach(function () {
        module('ui.router', function ($stateProvider, $urlRouterProvider) {
            stateProvider = $stateProvider;
            spyOn(stateProvider, 'state').and.callThrough();
        });
        module('app.main');
        // this is necessary to trigger loading the modules
        inject();
    });

    it('defines a route for \'/\' delegating the RedirectorCntl', function () {
        expect(stateProvider.state).toHaveBeenCalledWith('blank', {
            name: 'blank',
            url: '/',
            templateUrl: 'main/layout/blank.html',
            controller: 'RedirectorCntl'
        });
    });

    it('defines the default route redirecting to the welcome dialog', function () {
        expect(stateProvider.state).toHaveBeenCalledWith('notFound', {
            name: 'notFound',
            templateUrl: 'main/layout/page-not-found.html'
        });
    });

});
