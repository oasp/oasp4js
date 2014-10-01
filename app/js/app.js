angular.module('oasp', ['oasp.templates', 'oasp.main']);
angular.module('gastronomy',
    ['ui.select', 'ngRoute', 'oasp', 'gastronomy.tableMgmt', 'gastronomy.offerMgmt', 'gastronomy.salesMgmt'])
    .config(function ($routeProvider, $locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        $routeProvider.otherwise({
            templateUrl: 'html/main/sign-in.html'
        });
        uiSelectConfig.theme = 'bootstrap';
    })
    .run(function ($rootScope, globalSpinner) {
        'use strict';
        $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
            if (curr.$$route && curr.$$route.resolve) {
                globalSpinner.show();
            }
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            globalSpinner.hide();
        });
        $rootScope.$on('$routeChangeError', function () {
            globalSpinner.hide();
        });
    });