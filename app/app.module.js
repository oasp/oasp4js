angular.module('app',
    ['ui.select', 'ngRoute', 'app.main', 'app.table-mgmt', 'app.cook-order-mgmt', 'app.offer-mgmt', 'app.sales-mgmt'])
    .config(function ($locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        uiSelectConfig.theme = 'bootstrap';
    })
    .run(function (globalSpinner) {
        'use strict';
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete();
    });