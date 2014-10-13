angular.module('app.main').factory('$translateStaticFilesLoader', function ($q) {
    'use strict';
    return function () {
        return $q.when({});
    };
});