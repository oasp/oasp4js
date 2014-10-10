angular.module('app.main').factory('$translateStaticFilesLoader', function ($q) {
    'use strict';
    return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    };
});