describe('Tests for showcase example 4.', function () {
    'use strict';

    var $scope,
        directiveElem,
        TEMPLATE = '<div><ng-include src="\'form-samples-mgmt/examples/example4.html\'"></ng-include></div>',
        PASSWORD = 'password',
        CONFIRM_PASSWORD = 'confirm_password';


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

    function getPasswordInputElem() {
        return getFormElem().find('input[name=' + PASSWORD + ']');
    }

    function getConfirmPasswordInputElem() {
        return getFormElem().find('input[name=' + CONFIRM_PASSWORD + ']');
    }

    function getFormCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.example4Form;
    }

    function getExampleCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.E4C;
    }

    function getValidationScope(name) {
        if (name === PASSWORD) {
            return directiveElem.find('[with-validation-messages] > div').eq(0).scope();
        } else if (name === CONFIRM_PASSWORD) {
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
        expect(getPasswordInputElem().length).toBe(1);
        expect(getConfirmPasswordInputElem().length).toBe(1);
    });

    it('should have test prerequisites available under expected locations', function () {
        expect(getFormCtrl()).toBeDefined();
        expect(getFormCtrl()[PASSWORD]).toBeDefined();
        expect(getFormCtrl()[CONFIRM_PASSWORD]).toBeDefined();
        expect(getExampleCtrl()).toBeDefined();
        expect(getExampleCtrl().customMessageRepo).toBeDefined();

        var emailValidationScope = getValidationScope(PASSWORD);
        expect(emailValidationScope.isInputInvalid).toBeDefined();
        expect(emailValidationScope.items).toBeDefined();
        var asyncEmailValidationScope = getValidationScope(CONFIRM_PASSWORD);
        expect(asyncEmailValidationScope.isInputInvalid).toBeDefined();
        expect(asyncEmailValidationScope.items).toBeDefined();
    });

    it('should report password required when touched and empty', function () {
        var requiredError = { text: 'OASP.VALIDATION.SHOWCASE.PSWD_REQUIRED', params: {} };

        triggerInput(getPasswordInputElem(), '');

        expect(getValidationScope(PASSWORD).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(PASSWORD).items()).toEqual([requiredError]);
    });

    it('should report confirmed password not equal to original password', function () {
        var requiredError = { text: 'OASP.VALIDATION.SHOWCASE.PSWD_EQUAL', params: {} };

        triggerInput(getPasswordInputElem(), 'someData');
        triggerInput(getConfirmPasswordInputElem(), 'otherData');

        expect(getValidationScope(CONFIRM_PASSWORD).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(CONFIRM_PASSWORD).items()).toEqual([requiredError]);
    });


});
