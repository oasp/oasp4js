describe('Module: \'oasp.oaspUi.errorNotificator\', service: \'oaspErrorNotificatorService\'', function () {
    'use strict';

    var oaspErrorNotificatorService,
        timerCallback,
        defaultErrorLogLimit = 10;

    beforeEach(function () {
        module('oasp.oaspUi.errorNotificator');
        timerCallback = jasmine.createSpy("timerCallback");
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    /*jslint nomen: true*/
    beforeEach(inject(function (_oaspErrorNotificatorService_) {
        oaspErrorNotificatorService = _oaspErrorNotificatorService_;
    }));
    /*jslint nomen: false*/

    beforeEach(function () {
        expect(oaspErrorNotificatorService.getErrorLogLimit()).toBe(defaultErrorLogLimit);
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(0);
    });

    it('logs an new errors with date field into an errorLog', function () {
        var error = {
            data: {
                message: 'Test message'
            },
            status: 400,
            statusText: "Test status text"
            },
            baseTime = new Date(2015, 9, 29);

        jasmine.clock().mockDate(baseTime);

        //when
        for (var i=0; i<10; i++) {
            oaspErrorNotificatorService.logError(error);
        }

        //then
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(10);
        expect(oaspErrorNotificatorService.getErrorLog()).toEqual(jasmine.arrayContaining([jasmine.objectContaining(error)]));
        expect(oaspErrorNotificatorService.getErrorLog()).toEqual(jasmine.arrayContaining([jasmine.objectContaining({date: baseTime})]));
    });

    it('removes first added error from errorLog when adding a new error while error log limit is reached', function () {
        var error = {
                data: {
                    message: 'Test message'
                },
                status: 400,
                statusText: "Test status text"
            },
            firstError = {
                data: {
                    message: 'First error message'
                },
                status: 400,
                statusText: "First error status text"
            };

        //given
        oaspErrorNotificatorService.logError(firstError);
        for (var i=0; i<(defaultErrorLogLimit-1); i++) {
            oaspErrorNotificatorService.logError(error);
        }
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(defaultErrorLogLimit);

        //when
        oaspErrorNotificatorService.logError(error);

        //then
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(defaultErrorLogLimit);
        expect(oaspErrorNotificatorService.getErrorLog()).not.toEqual(jasmine.arrayContaining([jasmine.objectContaining(firstError)]));
        expect(oaspErrorNotificatorService.getErrorLog()).toEqual(jasmine.arrayContaining([jasmine.objectContaining(error)]));
    });

    it('sets a new error log limit', function () {
        //when
        oaspErrorNotificatorService.setErrorLogLimit(5);

        //then
        expect(oaspErrorNotificatorService.getErrorLogLimit()).toBe(5);
    });

    it('trims an errorLog when new error log limit is smaller than errorLog count', function () {
        var error = {
                data: {
                    message: 'Test message'
                },
                status: 400,
                statusText: "Test status text"
            };

        //given
        for (var i=0; i<defaultErrorLogLimit; i++) {
            oaspErrorNotificatorService.logError(error);
        }
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(defaultErrorLogLimit);

        //when
        oaspErrorNotificatorService.setErrorLogLimit(10);

        //then
        expect(oaspErrorNotificatorService.getErrorLog().length).toBe(10);
    });
});
