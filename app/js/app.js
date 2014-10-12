angular.module('app',
    ['ui.select', 'ngRoute', 'oasp-ui', 'app.main', 'app.tableMgmt', 'app.offerMgmt', 'app.salesMgmt'])
    .config(function ($locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        uiSelectConfig.theme = 'bootstrap';
    })
    .run(function (SIGN_IN_DLG_PATH, globalSpinner, $location, security) {
        'use strict';
        security.initializeUser()
            .then(function (currentUser) {
                $location.path(currentUser.getHomeDialogPath());
            }, function () {
                $location.path(SIGN_IN_DLG_PATH);
            });
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete();
    });