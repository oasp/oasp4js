/*global TrNgGrid*/
angular.module('oasp.oaspUi.oaspGrid', ['oasp.templates', 'trNgGrid']).run(function () {
    'use strict';
    TrNgGrid.tableCssClass = 'tr-ng-grid table table-striped';
});
