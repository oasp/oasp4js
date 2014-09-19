/*globals angular*/
angular.module('oasp.main').
    directive('oaspGrid', function () {
        "use strict";

        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/main/oasp-grid.html',
            scope: {
                title: '@?',
                rows: '=',
                columnDefs: '=',
                buttonDefs: '=?',
                dblclickCallback : '&?'
            },
            link: function (scope) {
                scope.rowSelection = (function () {
                    var selectedRow = null;

                    return {
                        select: function (row) {
                            selectedRow = row;
                        },
                        isSelected: function (row) {
                            return selectedRow === row;
                        },
                        getSelected: function () {
                            return selectedRow;
                        }
                    };
                }());
                scope.noTitleDefined = function () {
                    return !scope.title;
                };
                scope.onButtonClick = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.onClick)) {
                        buttonDef.onClick(scope.rowSelection.getSelected());
                    }
                };
                scope.isButtonDisabled = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.isActive)) {
                        return !buttonDef.isActive(scope.rowSelection.getSelected());
                    }
                    if (buttonDef && angular.isFunction(buttonDef.isNotActive)) {
                        return buttonDef.isNotActive(scope.rowSelection.getSelected());
                    }
                    return true;
                };
                scope.onRowDblClick = function (row) {
                    scope.dblclickCallback({row: row});
                };
            }
        };
    });