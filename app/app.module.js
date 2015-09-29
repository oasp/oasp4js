/**
 * @ngdoc object
 * @name app
 * @module app
 * @requires ui.select
 * @requires app.main
 * @requires app.table-mgmt
 * @requires app.sales-mgmt
 * @requires app.offer-mgmt
 */
angular.module('app',
    ['ui.select', 'app.main', 'app.table-mgmt', 'app.offer-mgmt', 'app.sales-mgmt'])
    .config(function ($locationProvider, uiSelectConfig) {
        'use strict';
        $locationProvider.html5Mode(false);
        uiSelectConfig.theme = 'bootstrap';
    })
    .run(function (globalSpinner) {
        'use strict';
        globalSpinner.showOnRouteChangeStartAndHideWhenComplete();
    });
