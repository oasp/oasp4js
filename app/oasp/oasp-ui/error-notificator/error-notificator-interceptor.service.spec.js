describe('Module: \'errorNotificator\', service: \'oaspErrorNotificatorInterceptor\'', function () {
    'use strict';
    var $httpBackend, $http,
        logErrorSpy = jasmine.createSpy('logErrorSpy'),
        errorSpy = jasmine.createSpy('errorSpy');

    beforeEach(function () {
        module('oasp.oaspUi.errorNotificator', function ($provide) {
            $provide.value('oaspErrorNotificatorService', (function () {
                return {
                    logError: logErrorSpy
                };
            }()));
        });
        module('angular-growl', function ($provide) {
            $provide.value('growl', (function () {
                return {
                    error: errorSpy
                };
            }()));
        });
    });

    /*jslint nomen: true*/
    beforeEach(inject(function (_$httpBackend_, _$http_) {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
    }));
    /*jslint nomen: false*/

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('logs an error response and triggers a growl message', function () {
        var requestPath = '/some-request',
            response = {
                'data': {
                    'message': 'Test message'
                },
                status: 400,
                statusText: "Test status text"
            };
        $httpBackend.whenGET(requestPath).respond(response.status, response.data, {}, response.statusText);

        // when
        $http.get(requestPath);
        $httpBackend.flush();

        // then
        expect(logErrorSpy).toHaveBeenCalledWith(jasmine.objectContaining(response));
        expect(errorSpy).toHaveBeenCalledWith(response.data.message, {title: response.statusText});
    });

    it('is not called when response is an success response', function () {
        var requestPath = '/some-request';
        $httpBackend.whenGET(requestPath).respond(200);

        // when
        $http.get(requestPath);
        $httpBackend.flush();

        // then
        expect(logErrorSpy).not.toHaveBeenCalled;
        expect(errorSpy).not.toHaveBeenCalled;
    });
});
