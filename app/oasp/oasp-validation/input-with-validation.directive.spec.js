describe('Module: \'oasp.validation\', directive: \'with-validation-messages\'', function () {
    'use strict';
    var $compile, $scope, $validationScope,
        translatedRequiredErrorMessage = 'Dies ist ein Mussfeld',
        template,
        testConstraints = {
            myTestType: {
                requiredField: {
                    required: {
                        message: 'validation.msg.required'
                    }
                }
            }
        };

    beforeEach(module('oasp.validation', 'oasp.oaspI18n', function ($translateProvider) {
        $translateProvider.translations('de', {
            common: {
                validation: {
                    required: translatedRequiredErrorMessage
                }
            }
        });
        $translateProvider.preferredLanguage('de');
    }));


    beforeEach(inject(function (_$compile_, _$rootScope_, valdr) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        valdr.addConstraints(testConstraints);
    }));

// --------- HELPERS ---------

    function compileAndRun() {
        var directiveElem = $compile(template)($scope);
        $scope.$digest();
        $validationScope = directiveElem.find('div.input-with-validation-messages').scope();
        return directiveElem;
    }

    function expectSingleErrorAndReportInvalid() {
        expect($validationScope.items().length).toEqual(1);
        expect($validationScope.isInputInvalid()).toBeTruthy();
    }

    function expectSingleErrorButReportValid() {
        expect($validationScope.items().length).toEqual(1); //valdr validation failed
        expect($validationScope.isInputInvalid()).toBeFalsy(); //but considered as valid as it was not touched
    }

    function expectValid() {
        expect($validationScope.items()).toEqual([]);
        expect($validationScope.isInputInvalid()).toBeFalsy();
    }

// --------- TESTS ---------

    it('transcludes an input with no validation', function () {
        // given
        $scope.modelVal = 'AnyValue';
        template =
            '<form name="myTestForm" novalidate>' +
            '  <div with-validation-messages>' +
            '    <input ng-model="modelVal" name="someFieldWithoutValidationRules" type="text">' +
            '  </div>' +
            '</form>';

        //when
        var element = compileAndRun();
        // then
        expect(element.find('div.input-with-validation-messages > input').length).toEqual(1);
        expectValid();

    });

    it('transcludes an input with no name and valid input', function () {
        // given
        $scope.modelVal = 'NotEmpty';
        template =
            '<form name="myTestForm" novalidate>' +
            '  <div with-validation-messages>' +
            '    <input ng-model="modelVal" type="text" required="true">' +
            '  </div>' +
            '</form>';

        //when
        var element = compileAndRun();
        // then
        expect(element.find('div.input-with-validation-messages > input').length).toEqual(1);
        expect($validationScope.isInputInvalid()).toBeFalsy();
    });

    it('transcludes an input with no name and invalid input', function () {
        // given
        $scope.modelVal = '';
        template =
            '<form name="myTestForm" novalidate>' +
            '  <div with-validation-messages>' +
            '    <input ng-model="modelVal" type="text" required="true">' +
            '  </div>' +
            '</form>';

        //when
        var element = compileAndRun();
        // then
        expect(element.find('div.input-with-validation-messages > input').length).toEqual(1);
        expect($validationScope.isInputInvalid()).toBeFalsy(); //cannot bind to form, so cannot retrieve validation info

    });


    describe('Form with valdr required input ', function () {
        var formWithValdrRequiredInput =
            '<form name="myTestForm" novalidate valdr-type="myTestType">' +
            '  <div with-validation-messages>' +
            '    <input ng-model="modelVal" name="requiredField" type="text">' +
            '  </div>' +
            '</form>';
        it('should be reported as valid when touched and with NOT empty (valid) value', function () {
            // given
            $scope.modelVal = 'NotEmpty';
            template = formWithValdrRequiredInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredField.$setTouched();

            // then
            expectValid();
        });

        it('should be reported as invalid when touched and with empty (invalid) value', function () {
            // given
            $scope.modelVal = '';
            template = formWithValdrRequiredInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredField.$setTouched();

            // then
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual(testConstraints.myTestType.requiredField.required.message);
        });

        it('should be reported as valid when NOT touched and with empty (invalid) value', function () {
            // given
            $scope.modelVal = '';
            template = formWithValdrRequiredInput;
            //when
            var element = compileAndRun();

            // then
            expectSingleErrorButReportValid();
        });
    });


    describe('Form with required input (tests use angular validator, but in general any custom validator can be applied) ', function () {
        var formWithRequiredInput =
                '<form name="myTestForm" novalidate>' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" name="requiredFieldNotValdr" required="true" type="text">' +
                '  </div>' +
                '</form>',
            customErrorMsgRepo = {
                required: {
                    msg: 'This is a custom message for angular required validator',
                    params: {}
                }
            };

        beforeEach(function () {
            $scope.customErrorMsgRepo = customErrorMsgRepo;
        });


        it('should be reported as invalid valid when touched and with NOT empty (valid) value', function () {
            // given
            $scope.modelVal = 'NotEmpty';
            template = formWithRequiredInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredFieldNotValdr.$setTouched();

            // then
            expectValid();
        });

        it('should be reported as invalid when touched and with empty (invalid) value', function () {
            // given
            $scope.modelVal = '';
            template = formWithRequiredInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredFieldNotValdr.$setTouched();

            // then
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual(customErrorMsgRepo.required.msg);
        });

        it('should be reported as valid when NOT touched and with empty (invalid) value', function () {
            // given
            $scope.modelVal = '';
            template = formWithRequiredInput;
            //when
            var element = compileAndRun();

            // then
            expectSingleErrorButReportValid();
        });

        it('should be reported as invalid when invalid value provided and custom filter used without appropriate message repo entry', function () {
            // given
            $scope.modelVal = 'tooShort';
            template =
                '<form name="myTestForm" novalidate>' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" data-name="minLengthFieldNotValdr" ng-minlength="20" type="text">' +
                '  </div>' +
                '</form>';
            //when
            var element = compileAndRun();
            $scope.myTestForm.minLengthFieldNotValdr.$setTouched();

            // then
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual('Unknown: minlength');
        });

    });


    describe('Form having input with parametrized size valdr validator', function () {
        var sizeConstraint = {
                myTestType: {
                    sizeRangeValdrField: {
                        size: {
                            min: 50,
                            max: 90,
                            message: 'validation.msg.size'
                        }
                    },
                    minMaxRangeValdrField: {
                        minLength: {
                            number: 30,
                            message: 'validation.msg.minLength'
                        },
                        maxLength: {
                            number: 40,
                            message: 'validation.msg.maxLength'
                        }
                    }
                }
            };



        beforeEach(inject(function (_$compile_, _$rootScope_, valdr) {
            valdr.addConstraints(sizeConstraint);
        }));

        it('should be reported as invalid valid when touched and with NOT empty (valid) value', function () {
            // given
            $scope.modelVal = 'Value length not in range 50-90';
            template =
                '<form name="myTestForm" novalidate valdr-type="myTestType">' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" name="sizeRangeValdrField" type="text">' +
                '  </div>' +
                '</form>';

            //when
            var element = compileAndRun();
            $scope.myTestForm.sizeRangeValdrField.$setTouched();

            // then
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual(sizeConstraint.myTestType.sizeRangeValdrField.size.message);
            expect($validationScope.items()[0].params).toEqual({min: 50, max: 90});
        });


        it('should recalculate errors when switched from one valdr violation to another', function () {
            // given
            $scope.modelVal = 'Value length lower than 30';
            template =
                '<form name="myTestForm" novalidate valdr-type="myTestType">' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" name="minMaxRangeValdrField" type="text">' +
                '  </div>' +
                '</form>';

            //when
            var element = compileAndRun();
            $scope.myTestForm.minMaxRangeValdrField.$setTouched();
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual(sizeConstraint.myTestType.minMaxRangeValdrField.minLength.message);
            expect($validationScope.items()[0].params).toEqual({number: 30});

            $scope.modelVal = 'Now this value length should exceed 40....................';
            $scope.$digest();
            // then
            expectSingleErrorAndReportInvalid();
            expect($validationScope.items()[0].text).toEqual(sizeConstraint.myTestType.minMaxRangeValdrField.maxLength.message);
            expect($validationScope.items()[0].params).toEqual({number: 40});
        });


        it('should return independent errors for independent inputs', function () {
            // given
            $scope.modelVal = 'This value length should be between 40 and 50';

            template =
                '<form name="myTestForm" novalidate valdr-type="myTestType">' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" name="minMaxRangeValdrField" type="text">' +
                '  </div>' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '     <input ng-model="modelVal" name="sizeRangeValdrField" type="text">' +
                '  </div>' +
                '</form>';

            //when
            var element = compileAndRun(),
                validationElem = element.find('div.input-with-validation-messages'),
                $minMaxValidationScope = validationElem.eq(0).scope(),
                $sizeRangeValidationScope = validationElem.eq(1).scope();


            $scope.myTestForm.minMaxRangeValdrField.$setTouched();
            $scope.myTestForm.sizeRangeValdrField.$setTouched();



            expect($minMaxValidationScope.items().length).toEqual(1);
            expect($minMaxValidationScope.items()[0].text).toEqual(sizeConstraint.myTestType.minMaxRangeValdrField.maxLength.message);
            expect($minMaxValidationScope.items()[0].params).toEqual({number: 40});

            expect($sizeRangeValidationScope.items().length).toEqual(1);
            expect($sizeRangeValidationScope.items()[0].text).toEqual(sizeConstraint.myTestType.sizeRangeValdrField.size.message);
            expect($sizeRangeValidationScope.items()[0].params).toEqual({min: 50, max: 90});

        });

    });


    describe('Form with input required by Valdr and angular required validator (valdr and custom validator working together) ', function () {
        var formWithMixedValidatorsInput =
                '<form name="myTestForm" novalidate valdr-type="myTestType">' +
                '  <div with-validation-messages="customErrorMsgRepo">' +
                '    <input ng-model="modelVal" name="requiredField" required="true" type="text">' +
                '  </div>' +
                '</form>',
            customErrorMsgRepo = {
                required: {
                    msg: 'This is a custom message for angular required validator',
                    params: {}
                }
            };

        beforeEach(function () {
            $scope.customErrorMsgRepo = customErrorMsgRepo;
        });


        it('should be reported as invalid valid when touched and with NOT empty (valid) value', function () {
            // given
            $scope.modelVal = '';
            template = formWithMixedValidatorsInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredField.$setTouched();

            // then
            expect($validationScope.isInputInvalid()).toBeTruthy();
            var errors = $validationScope.items();
            expect(errors.length).toEqual(2);
            expect(errors).toContain({text: customErrorMsgRepo.required.msg, params: {}});
            expect(errors).toContain({text: testConstraints.myTestType.requiredField.required.message, params: {}});

        });

        it('should recalculate errors when violations removed', function () {
            // given
            $scope.modelVal = '';
            template = formWithMixedValidatorsInput;

            //when
            var element = compileAndRun();
            $scope.myTestForm.requiredField.$setTouched();
            expect($validationScope.items().length).toEqual(2);
            $scope.modelVal = 'Now this value is valid (not empty)';
            $scope.$digest();
            // then
            expectValid();
        });

    });


});
