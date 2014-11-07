angular.module('oasp-ui').config(function ($provide) {
    'use strict';
    var $modalDecorator = function ($delegate, globalSpinner) {
        return {
            open: function (options) {
                globalSpinner.show();
                var result = $delegate.open(options);
                result.opened
                    .then(function () {
                        globalSpinner.hide();
                    }, function () {
                        globalSpinner.hide();
                    });
                return result;
            }
        };
    };
    $provide.decorator('$modal', $modalDecorator);
});