angular.module('app',
    ['ui.select', 'ngRoute', 'oasp', 'app.main', 'app.tableMgmt', 'app.offerMgmt', 'app.salesMgmt'])
    .config(function ($routeProvider, $locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        uiSelectConfig.theme = 'bootstrap';
        $routeProvider
            .when('/', {templateUrl: 'html/main/blank.html'})
            .otherwise({templateUrl: 'html/main/page-not-found.html'});
    })
    .run(function (SIGN_IN_DLG_PATH, $rootScope, globalSpinner, $location, security) {
        'use strict';
        security.initializeUser()
            .then(function (currentUser) {
                $location.path(currentUser.getHomeDialogPath());
            }, function () {
                $location.path(SIGN_IN_DLG_PATH);
            });
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