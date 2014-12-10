angular.module('app.table-mgmt')
    .filter('price', function () {
        'use strict';
        return function (item) {
            return item + ' EUR';
        };
    });