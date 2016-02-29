describe('Module: \'app.main\'', function () {
    'use strict';

    describe('static checks for state provider calls', function () {
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

        it('defines a route for login page', inject(function (SIGN_IN_DLG_PATH) {
            expect(stateProvider.state).toHaveBeenCalledWith('signIn', {
                name: 'signIn',
                url: SIGN_IN_DLG_PATH,
                templateUrl: 'main/sign-in/sign-in.html',
                controller: 'SignInCntl',
                controllerAs: 'SIC'
            });
        }));

        it('defines a route for page not found', function () {
            expect(stateProvider.state).toHaveBeenCalledWith('notFound', {
                name: 'notFound',
                templateUrl: 'main/layout/page-not-found.html'
            });
        });
    });

    describe('check redirecting and URL managment', function () {

        var goToFunc, viewHookElem,
            PAGE_NOT_FOUND_CONTENT = 'Page not found content',
            SIGN_IN_CONTENT = 'Login page content',
            contextPath;


        beforeEach(function () {
            module('app.main');
        });


        beforeEach(inject(function ($templateCache, $location, $rootScope, $compile, currentContextPath) {
            $templateCache.put('main/layout/page-not-found.html', PAGE_NOT_FOUND_CONTENT);
            $templateCache.put('main/sign-in/sign-in.html', SIGN_IN_CONTENT);
            viewHookElem = $compile('<div><div data-ui-view>Loading ...</div></div>')($rootScope);
            contextPath = currentContextPath.get();

            goToFunc = function(toPath){
                $location.path(toPath);
                $rootScope.$digest();
            }
        }));

        it('should redirect user to login page when entered root URL but not logged in', inject(function ($state, SIGN_IN_DLG_PATH, $location) {

            goToFunc('/');

            expect($location.path()).toEqual(SIGN_IN_DLG_PATH);
            expect($state.current.name).toEqual('signIn');
            expect(viewHookElem.html()).toContain(SIGN_IN_CONTENT);

        }));

        it('should redirect user to login page when entered only host name but not logged in', inject(function ($state, SIGN_IN_DLG_PATH, $location) {

            goToFunc('');

            expect($location.path()).toEqual(SIGN_IN_DLG_PATH);
            expect($state.current.name).toEqual('signIn');
            expect(viewHookElem.html()).toContain(SIGN_IN_CONTENT);

        }));

        it('should redirect user to page not found view when entered unknown URL', inject(function ($state, SIGN_IN_DLG_PATH, $location) {

            var unknownURL = '/unknownURL';
            goToFunc(unknownURL);

            expect($location.path()).toEqual(unknownURL);
            expect($state.current.name).toEqual('notFound');
            expect(viewHookElem.html()).toContain(PAGE_NOT_FOUND_CONTENT);

        }));

        it('should redirect user to home page when logged in', inject(function ($state, $httpBackend, $location, oaspSecurityService) {
            var loginData = {"j_username": "cook", "j_password": "cook"};
            $httpBackend.expectPOST(contextPath+'services/rest/login',  loginData).respond({});
            $httpBackend.expectGET(contextPath+'services/rest/security/v1/currentuser/').respond({});
            $httpBackend.expectGET(contextPath+'services/rest/security/v1/csrftoken/').respond({});


            oaspSecurityService.logIn('cook', 'cook');
            goToFunc('/');
            $httpBackend.flush();


            expect($location.path()).toEqual('/table-mgmt/table-search');
            //table mgmt module not loaded in this test, so state should be recognized as not found
            expect($state.current.name).toEqual('notFound');
            expect(viewHookElem.html()).toContain(PAGE_NOT_FOUND_CONTENT);

        }));

    });
});
