angular.module('table-mgmt', [])
    .config(function ($routeProvider) {
        "use strict";

        $routeProvider.when('/table-mgmt/table-search', {templateUrl: 'html/table-mgmt/table-search.html'});
    });
