/*
 app.table-mgmt module definition
 For details regarding angular.module() syntax please check: https://docs.angularjs.org/api/ng/function/angular.module
 The definition contains:
 - the name of the module (app.table-mgmt) as a first parameter
 - array of dependencies to other angular modules as a second parameter
 - optional configuration function as a third parameter. The Angular provider $routeProvider and OASP provider oaspTranslationProvider are injected
 into configuration function.
 */
angular.module('app.table-mgmt', ['ngRoute', 'app.offer-mgmt', 'app.sales-mgmt', 'app.main', 'app.tableMgmt.templates'], function ($routeProvider, oaspTranslationProvider) {
    'use strict';
    // calling method of the oaspTranslationProvider in order to enable i18n support in the whole module
    oaspTranslationProvider.enableTranslationForModule('table-mgmt');
    // adding a new route definition for the given url postfix
    // Basically if there will be successful path match then a new dialog will be opened with:
    // - template indicated by templateUrl property
    // - controller indicated by the controller property
    // - dependencies injected into controller indicated by the resolve property ({Object.<string, function>=} map)
    // For details regarding AngularJS $routeProvider please check: https://docs.angularjs.org/api/ngRoute/provider/$routeProvider.
    $routeProvider.when('/table-mgmt/table-search', {
        templateUrl: 'table-mgmt/html/table-search.html',
        controller: 'TableSearchCntl',
        resolve: {
            // Please notice that the TableSearchCntl has paginatedTableList injected.
            // Before loading the dialog, the function defined below will be called.
            // The function is defined in the tables service (please see tables service defined in the tables.service.js file).
            // The function will load the tables data before dialog is loaded. Later on the data is used by the TableSearchCntl.
            paginatedTableList: ['tables', function (tables) {
                return tables.getPaginatedTables(1, 4).then(function (paginatedTables) {
                    return paginatedTables;
                });
            }]
        }
    });
});