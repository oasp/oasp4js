describe('Tests for showcase example 5.', function () {
    'use strict';

    var $scope,
        directiveElem,
        TEMPLATE = '<div><ng-include src="\'form-samples-mgmt/examples/example5.html\'"></ng-include></div>',
        DOMAIN = 'forbiddenDomain',
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

    function getDomainInputElem() {
        return getFormElem().find('input[name=' + DOMAIN + ']');
    }

    function getAsyncEmailInputElem() {
        return getFormElem().find('input[name=' + ASYNC_EMAIL + ']');
    }

    function getFormCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.example5Form;
    }

    function getExampleCtrl(formScope) {
        var formScope = getFormElem().scope();
        return formScope.E5C;
    }

    function getValidationScope(name) {
        if (name === DOMAIN) {
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
        expect(getDomainInputElem().length).toBe(1);
        expect(getAsyncEmailInputElem().length).toBe(1);
    });

    it('should have test prerequisites available under expected locations', function () {
        expect(getFormCtrl()).toBeDefined();
        expect(getFormCtrl()[DOMAIN]).toBeDefined();
        expect(getFormCtrl()[ASYNC_EMAIL]).toBeDefined();
        expect(getExampleCtrl()).toBeDefined();
        expect(getExampleCtrl().customMessageRepo).toBeDefined();

        var emailValidationScope = getValidationScope(DOMAIN);
        expect(emailValidationScope.isInputInvalid).toBeDefined();
        expect(emailValidationScope.items).toBeDefined();
        var asyncEmailValidationScope = getValidationScope(ASYNC_EMAIL);
        expect(asyncEmailValidationScope.isInputInvalid).toBeDefined();
        expect(asyncEmailValidationScope.items).toBeDefined();
    });

    it('should have @forbidden.com domain on blacklist by default', inject(function ($timeout) {
        expect(getExampleCtrl().forbiddenDomains).toBeDefined();
        expect(getExampleCtrl().forbiddenDomains.indexOf('@forbidden.com') !== -1).toBeTruthy();
    }));

    ///////////////////   DOMAIN    ///////////////////

    it('should report domain invalid when not matching email format', inject(function ($timeout) {
        var domainFormatError = {text: 'OASP.VALIDATION.SHOWCASE.DOMAIN_VALID', params: {}};

        triggerInput(getDomainInputElem(), 'notADomain');

        expect(getValidationScope(DOMAIN).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(DOMAIN).items()).toEqual([domainFormatError]);
    }));

    it('should report domain invalid when exceeding max length', inject(function ($timeout) {
        var domainFormatError = {text: 'OASP.VALIDATION.SHOWCASE.DOMAIN_MAX_LENGTH', params: {number: 15}};

        triggerInput(getDomainInputElem(), '@this.domain.is.too.long.com');

        expect(getValidationScope(DOMAIN).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(DOMAIN).items()).toEqual([domainFormatError]);
    }));

    it('should report domain invalid when is duplicated', inject(function ($timeout) {
        var newForbiddenDomain = '@sth.com',
            domainDuplicatedError = {text: 'OASP.VALIDATION.SHOWCASE.DOMAIN_DUPLICATE', params: {}};
        getExampleCtrl().addToBlacklist(newForbiddenDomain);

        triggerInput(getDomainInputElem(), newForbiddenDomain);

        expect(getValidationScope(DOMAIN).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(DOMAIN).items()).toEqual([domainDuplicatedError]);
    }));

    it('should report domain valid', inject(function ($timeout) {
        triggerInput(getAsyncEmailInputElem(), '@fine.com');
        expect(getValidationScope(DOMAIN).isInputInvalid()).toBeFalsy();
    }));

    it('should properly remove domain', inject(function ($timeout) {
        getExampleCtrl().removeFromBlacklist(0);
        expect(getExampleCtrl().forbiddenDomains).toEqual([]);
    }));


    ///////////////////   EMAIL    ///////////////////

    it('should report async email invalid when not matching email format', inject(function ($timeout) {
        var emailFormatError = {text: 'OASP.VALIDATION.SHOWCASE.EMAIL_FORMAT', params: {}};

        triggerInput(getAsyncEmailInputElem(), 'notAnEmail');
        $timeout.flush();

        expect(getValidationScope(ASYNC_EMAIL).isInputInvalid()).toBeTruthy();
        expect(getValidationScope(ASYNC_EMAIL).items()).toEqual([emailFormatError]);
    }));

    it('should report async email exceeds max length', inject(function ($timeout) {
        var emailFormatError = {text: 'OASP.VALIDATION.SHOWCASE.EMAIL_MAX_LENGTH', params: {number: 25}};

        triggerInput(getAsyncEmailInputElem(), 'valid@but.definitely.too.long.com');
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
