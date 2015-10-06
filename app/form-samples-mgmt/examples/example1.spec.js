describe('Tests for showcase example 1.', function () {
    'use strict';

    var $scope,
        TEMPLATE = '<div><ng-include src="\'form-samples-mgmt/examples/example1.html\'"></ng-include></div>',
        addTranslatePartSpy = jasmine.createSpy('addTranslatePart');

    beforeEach(module('app.form-samples-mgmt', function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart = addTranslatePartSpy;
    }));

    describe('View initialization', function () {
        var viewHookElem, $state, $rootScope, $translate, changeLangSpy,
            PREF_LANG = 'en';

        beforeEach(inject(function ($templateCache, $compile, _$state_, _$rootScope_, _$translate_) {
            $state = _$state_;
            $rootScope = _$rootScope_;
            $translate = _$translate_;
            changeLangSpy = jasmine.createSpy('changeLangSpy');

            viewHookElem = $compile('<div data-ui-view>Loading ...</div>')($rootScope);
            $templateCache.put('form-samples-mgmt/validation-showcase.html', TEMPLATE);

        }));

        // ---------- HELPERS ----------

        function goToShowcaseView() {
            $state.go('validationShowcase');
            $rootScope.$digest();
        }

        function mockTranslate(usedLang) {
            $translate.preferredLanguage = function () {
                return PREF_LANG;
            };
            $translate.use = function (lang) {
                if (lang) {
                    changeLangSpy(lang);
                    return lang;
                }
                return usedLang;
            };
        }

        // ---------- TESTS ----------

        it('Should retrieve appropriate translation part when entering showcase view and preferred lang used', inject(function ($state, $rootScope, $translate) {
            //given
            mockTranslate();
            //when
            goToShowcaseView();
            //then
            expect(addTranslatePartSpy).toHaveBeenCalledWith('form-samples-mgmt');
            expect(changeLangSpy).toHaveBeenCalledWith(PREF_LANG);
        }));

        it('Should retrieve appropriate translation part when entering showcase view', inject(function ($state, $rootScope, $translate) {
            //given
            mockTranslate('en');
            //when
            goToShowcaseView();
            //then
            expect(addTranslatePartSpy).toHaveBeenCalledWith('form-samples-mgmt');
            expect(changeLangSpy).not.toHaveBeenCalled();
        }));
    });


    describe('Example 1 include', function () {
        var directiveElem,
            USER_NAME = 'userName',
            PASSWORD = 'password';

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();
            directiveElem = $compile(TEMPLATE)($scope);
            $scope.$digest();
        }));

        // ---------- HELPERS ----------

        function getFormElem() {
            return directiveElem.find('form');
        }

        function getUserInputElem() {
            return getFormElem().find('input[name=' + USER_NAME + ']');
        }

        function getPswdInputElem() {
            return getFormElem().find('input[name=' + PASSWORD + ']');
        }

        function getFormCtrl(formScope) {
            var formScope = getFormElem().scope();
            return formScope.example1Form;
        }

        function getExampleCtrl(formScope) {
            var formScope = getFormElem().scope();
            return formScope.E1C;
        }

        function getValidationScope(name) {
            if (name === USER_NAME) {
                return directiveElem.find('[with-validation-messages] > div').eq(0).scope();
            } else if (name === PASSWORD) {
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
            expect(getUserInputElem().length).toBe(1);
            expect(getPswdInputElem().length).toBe(1);
        });

        it('should have test prerequisites available under expected locations', function () {
            expect(getFormCtrl()).toBeDefined();
            expect(getFormCtrl()[USER_NAME]).toBeDefined();
            expect(getFormCtrl()[PASSWORD]).toBeDefined();
            expect(getExampleCtrl()).toBeDefined();

            var userValidationScope = getValidationScope(USER_NAME);
            expect(userValidationScope.isInputInvalid).toBeDefined();
            expect(userValidationScope.items).toBeDefined();
            var passwordValidationScope = getValidationScope(PASSWORD);
            expect(passwordValidationScope.isInputInvalid).toBeDefined();
            expect(passwordValidationScope.items).toBeDefined();
        });

        it('should report usareName required when touched and empty', function () {
            var requiredError = { text: 'OASP.VALIDATION.SHOWCASE.USER_REQUIRED', params: {} };

            triggerInput(getUserInputElem(), '');

            expect(getValidationScope(USER_NAME).isInputInvalid()).toBeTruthy();
            expect(getValidationScope(USER_NAME).items()).toEqual([requiredError]);
        });

        it('should report usareName max length exceeded', function () {
            var maxLengthError = { text: 'OASP.VALIDATION.SHOWCASE.USER_MAX_LENGTH', params: {number:20} };

            triggerInput(getUserInputElem(), 'This value has more than 20 characters');

            expect(getValidationScope(USER_NAME).isInputInvalid()).toBeTruthy();
            expect(getValidationScope(USER_NAME).items()).toEqual([maxLengthError]);

        });

        it('should report password required when touched and empty', function () {
            var requiredError = { text: 'OASP.VALIDATION.SHOWCASE.PSWD_REQUIRED', params: {} };

            triggerInput(getPswdInputElem(), '');

            expect(getValidationScope(PASSWORD).isInputInvalid()).toBeTruthy();
            expect(getValidationScope(PASSWORD).items()).toEqual([requiredError]);

        });

    });


});
