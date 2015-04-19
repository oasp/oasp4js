describe('Module: oasp-i18n', function () {
    'use strict';
    beforeEach(function () {
        angular.module('fake.module', ['oasp.oaspI18n'], function (oaspTranslationProvider) {
            oaspTranslationProvider.enableTranslationForModule('main', true);
            oaspTranslationProvider.setSupportedLanguages(
                [
                    {
                        key: 'en',
                        label: 'English'
                    },
                    {
                        key: 'de',
                        label: 'German',
                        'default': true
                    }
                ]
            );
        });

        module('fake.module');
    });
    it('interceptor should load part on template request', inject(function ($httpBackend, $http, $translatePartialLoader) {
        //given
        $httpBackend.whenGET('main/dialog.html').respond(200);
        spyOn($translatePartialLoader, 'addPart').and.callThrough();
        //when
        $http.get('main/dialog.html');
        $httpBackend.flush();
        //then
        expect($translatePartialLoader.addPart).toHaveBeenCalledWith('main');
    }));
    it('interceptor should not load part on template request if module does not provide translations', inject(function ($httpBackend, $http, $translatePartialLoader) {
        //given
        $httpBackend.whenGET('notranslation/dialog.html').respond(200);
        spyOn($translatePartialLoader, 'addPart').and.callThrough();
        //when
        $http.get('notranslation/dialog.html');
        $httpBackend.flush();
        //then
        expect($translatePartialLoader.addPart).not.toHaveBeenCalled();
    }));
    it('interceptor should not load part on template request if no template request', inject(function ($httpBackend, $http, $translatePartialLoader) {
        //given
        $httpBackend.whenGET('main/dialog').respond(200);
        spyOn($translatePartialLoader, 'addPart').and.callThrough();
        //when
        $http.get('main/dialog');
        $httpBackend.flush();
        //then
        expect($translatePartialLoader.addPart).not.toHaveBeenCalled();
    }));
    it('return default language', inject(function ($translate, $rootScope) {
        //when
        $rootScope.$digest();
        //then
        expect($translate.use()).toBe('de');
    }));
    afterEach(inject(function ($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));
});
