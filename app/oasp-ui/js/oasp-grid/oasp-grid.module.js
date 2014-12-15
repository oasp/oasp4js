/*global TrNgGrid*/
angular.module('oasp-ui.oasp-grid', ['app.oasp-ui.templates', 'trNgGrid']).run(function () {
    'use strict';
    TrNgGrid.tableCssClass = "tr-ng-grid table table-striped";
});
