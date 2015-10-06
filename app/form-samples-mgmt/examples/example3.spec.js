describe('Tests for showcase example 3.', function () {
    'use strict';

    var $scope,
        directiveElem,
        TEMPLATE = '<div><ng-include src="\'form-samples-mgmt/examples/example3.html\'"></ng-include></div>',
        EMAIL = 'email',
        ASYNC_EMAIL = 'asyncEmail';


    beforeEach(module('app.form-samples-mgmt'));


    beforeEach(inject(function ($rootScope, $compile) {
        $scope = $rootScope.$new();
        directiveElem = $compile(TEMPLATE)($scope);
        $scope.$digest();
    }));

    // ---------- HELPERS ----------

    function getFormElem() {
        return directiveElem.find('form');
    }

    function getEmailInputElem() {
        return getFormElem().find('input[name=' + EMAIL + ']');
    }

    function getAsyncEmailInputElem() {
        return getFormElem().find('input[name=' + ASYNC_EMAIL + ']');
    }

    function getFormCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.example3Form;
    }

    function getExampleCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.E3C;
    }

    function getValidationScope(name) {
        if (name === EMAIL) {
            return directiveElem.find('[with-validation-messages] > div').eq(0).scope();
        } else if (name === ASYNC_EMAIL) {
            return directiveElem.find('[with-validation-messages] > div').eq(1).scope();
        }
        return null;
    }


    function triggerInput(inputElem, newValue) {
        inputElem.val(newValue);
        inputElem.triggerHandler('input');
        inputElem.blur();
    }

    // ---------- TESTS ----------

    it('should render user name and password input fields', function () {
        expect(getFormElem().length).toBe(1);
        expect(getEmailInputElem().length).toBe(1);
        expect(getAsyncEmailInputElem().length).toBe(1);
    });

    it('should have test prerequisites available under expected locations', function () {
        expect(getFormCtrl()).toBeDefined();
        expect(getFormCtrl()[EMAIL]).toBeDefined();
        expect(getFormCtrl()[ASYNC_EMAIL]).toBeDefined();
        expect(getExampleCtrl()).toBeDefined();
        expect(getExampleCtrl().customMessageRepo).toBeDefined();

        var emailValidationScope = getValidationScope(EMAIL);
        expect(emailValidationScope.isInputInvalid).toBeDefined();
        expect(emailValidationScope.items).toBeDefined();
        var asyncEmailValidationScope = getValidationScope(ASYNC_EMAIL);
        expect(asyncEmailValidationScope.isInputInvalid).toBeDefined();
        expect(asyncEmailValidationScope.items).toBeDefined();
    });

    it('should report email invalid when not matching email format', function () {
        var emailFormatError = {text: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORMAT', params: {}};

        triggerInput(getEmailInputElem(), 'notAnEmail');

        expect(getValidationScope(EMAIL).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(EMAIL).items()).toEqual([emailFormatError]);
    });

    it('should report email invalid when is forbidden', function () {
        var emailForbiddenError = {
            text: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORBIDDEN',
            params: {domain: '@forbidden.com'}
        };

        triggerInput(getEmailInputElem(), 'test@forbidden.com');

        expect(getValidationScope(EMAIL).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(EMAIL).items()).toEqual([emailForbiddenError]);
    });

    it('should report email valid', inject(function ($timeout) {

        triggerInput(getEmailInputElem(), 'test@notForbidden.com');

        expect(getValidationScope(EMAIL).isInputInvalid()).toBeFalsy();
    }));


    it('should report async email invalid when not matching email format', inject(function ($timeout) {
        var emailFormatError = {text: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORMAT', params: {}};

        triggerInput(getAsyncEmailInputElem(), 'notAnEmail');
        $timeout.flush();

        expect(getValidationScope(ASYNC_EMAIL).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(ASYNC_EMAIL).items()).toEqual([emailFormatError]);
    }));

    it('should report async email invalid when is forbidden', inject(function ($timeout) {
        var emailForbiddenError = {
            text: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORBIDDEN',
            params: {domain: '@forbidden.com'}
        };

        triggerInput(getAsyncEmailInputElem(), 'test@forbidden.com');
        $timeout.flush(); //controller init with empty val
        $timeout.flush(); //controller holding new value

        expect(getValidationScope(ASYNC_EMAIL).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(ASYNC_EMAIL).items()).toEqual([emailForbiddenError]);
    }));

    it('should report async email valid', inject(function ($timeout) {

        triggerInput(getAsyncEmailInputElem(), 'test@notForbidden.com');
        $timeout.flush(); //controller init with empty val
        $timeout.flush(); //controller holding new value

        expect(getValidationScope(ASYNC_EMAIL).isInputInvalid()).toBeFalsy();
    }));

});
