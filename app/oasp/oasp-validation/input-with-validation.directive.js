'use strict';

angular.module('oasp.validation')
    .directive('withValidationMessages', function ($log) {

        var VALDR_PROPERTIES = ['field', 'message', 'type', 'valid', 'validator', 'value'];


        function getInputElement(transcludedElements) {
            var firstElement, ELEMENT_NODE_TYPE = 1;
            angular.forEach(transcludedElements, function (transcludedElem) {
                if (transcludedElem.nodeType === ELEMENT_NODE_TYPE) {
                    firstElement = transcludedElem;
                    return;
                }
            });
            return firstElement;
        }

        function hasValdrErrorMessage(errorKey, formItem) {
            var hasError = false,
                errorsOccurredOnInput = formItem.valdrViolations;
            angular.forEach(errorsOccurredOnInput, function (errorOnInput) {
                if (errorKey === errorOnInput.validator) {
                    hasError = true;
                    return;
                }
            });
            return hasError;
        }

        function isTranslationParameter(property) {
            return VALDR_PROPERTIES.indexOf(property) === -1;
        }

        function recalculateValdrErrors(formItem) {
            var newErrors = [];

            angular.forEach(formItem.valdrViolations, function (valdrError) {
                var params = {};
                if (hasValdrErrorMessage(valdrError.validator, formItem)) {
                    angular.forEach(valdrError, function (val, errorProp) {
                        if (isTranslationParameter(errorProp)) {
                            params[errorProp] = valdrError[errorProp];
                        }
                    });
                    newErrors.push({
                        text: valdrError.message,
                        params: params
                    });
                }
            });
            return newErrors;
        }

        function hasCustomErrorMessage(errorKey, formItem) {
            if (errorKey.substring(0, 5) === 'valdr') {
                return false;
            }
            var errorsOccurredOnInput = formItem.$error;
            return angular.isDefined(errorsOccurredOnInput[errorKey]);
        }

        function recalculateCustomErrors(formItem, customErrorMessagesRepo) {
            var newErrors = [];

            angular.forEach(formItem.$error, function (val, errorProp) {
                if (hasCustomErrorMessage(errorProp, formItem)) {
                    var customErrorDef = customErrorMessagesRepo[errorProp];
                    if (angular.isUndefined(customErrorDef)) {
                        $log.warn('There is no custom error definition available for detected error: \'' + errorProp +
                            '\'. Please check your configuration.');
                    }
                    newErrors.push({
                        text: customErrorDef ? customErrorDef.msg : ('Unknown: ' + errorProp),
                        params: customErrorDef ? customErrorDef.params || {} : {}
                    });
                }
            });
            return newErrors;
        }

        function isCustomErrorChanged(newCustomErrors, currentCustomErrors) {
            var isChanged = false;

            angular.forEach(newCustomErrors, function (val, prop) {
                if (angular.isDefined(currentCustomErrors) && currentCustomErrors.hasOwnProperty(prop)) {
                    if (newCustomErrors[prop] !== currentCustomErrors[prop]) {
                        isChanged = true;
                        return;
                    }
                } else {
                    isChanged = true;
                    return;
                }
            });
            return isChanged;
        }

        function isValdrErrorChanged(newValdrErrors, currentValdrErrors) {
            if (newValdrErrors.length !== currentValdrErrors.length) {
                return true;
            }
            for (var i = 0; i < newValdrErrors.length; i++) {
                if (newValdrErrors[i].text !== currentValdrErrors[i].text) {
                    return true;
                }
            }
            return false;
        }

        /**
         * @ngdoc directive
         * @name withValidationMessages
         * @module oasp.validation
         * @directive
         * @restrict A
         *
         * @description
         * Provides consistent way of displaying validation errors on different input components.
         *
         * Directive was designed to work with valdr and custom validators (default angular validators are handled as custom ones).
         * When working with custom validators - a message repository can be provided. For more details concerning valdr please
         * visit its home page: https://github.com/netceteragroup/valdr.
         *
         * @property  {=object} withValidationMessages directive can be optionally initialized with an expression that
         * should evaluate to a variable holding custom message repository. Such a repository will be used to provide messages
         * for custom validators (which means ones different from valdr ones)
         *
         * @usage
         * ```
         * <!--Example usage of withValidationMessages directive. Pleas enote that it requires appropriate valdr configuration -->
         * <form name="myTestForm" novalidate valdr-type="myTestType"> +
         *   <div with-validation-messages> +
         *     <input ng-model="ctrl.modelVal" name="requiredField" type="text">' +
         *   </div>' +
         * </form>';
         * ```
         * For more usage examples you can always check tests.

         */
        return {
            restrict: 'A',
            require: '^form',
            replace: true,
            transclude: true,
            templateUrl: 'oasp/oasp-validation/validation-messages.html',
            scope: {
                customErrorMessages: '=?withValidationMessages'
            },
            link: function (scope, element, attrs, form, transcludeFn) {
                var currentValdrErrors = [], currentCustomErrors = [], currentErrors = [],
                    getFormItem; // function initialized in transclude function, form item not accessible on link

                transcludeFn(function (clone) {
                    var inputElement = getInputElement(clone),
                        inputElementName = inputElement.getAttribute('name') || inputElement.getAttribute('data-name');

                    getFormItem = function () {
                        return form[inputElementName];
                    };
                    element.find('.input-with-validation-messages').prepend(clone);
                });

                function getErrors(customErrorMessagesRepo) {
                    var newValdrErrors = getFormItem().valdrViolations || [],
                        newCustomErrors = getFormItem().$error;
                    if (isCustomErrorChanged(newCustomErrors, currentCustomErrors) ||
                        isValdrErrorChanged(newValdrErrors, currentValdrErrors)) {
                        currentValdrErrors = angular.copy(newValdrErrors);
                        currentCustomErrors = angular.copy(newCustomErrors);

                        currentErrors = recalculateValdrErrors(getFormItem()).concat(recalculateCustomErrors(getFormItem(), customErrorMessagesRepo));
                    }
                    return currentErrors;
                }

                scope.customErrorMessages = scope.customErrorMessages || {};

                scope.isInputInvalid = function () {
                    if (angular.isUndefined(getFormItem())) {
                        return false;
                    }
                    return (getFormItem().$touched || form.$submitted) && getFormItem().$valid === false;
                };

                scope.items = function () {
                    return getErrors(scope.customErrorMessages);
                };

            }
        };
    });

