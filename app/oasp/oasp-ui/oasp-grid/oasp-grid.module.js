/*global TrNgGrid*/
/**
 * @ngdoc object
 * @name oaspUi.oaspGrid
 * @module oasp.oaspUi
 * @requires oasp.templates
 * @requires trNgGrid
 */
angular.module('oasp.oaspUi.oaspGrid', ['oasp.templates', 'trNgGrid']).run(function () {
    'use strict';
    TrNgGrid.tableCssClass = 'tr-ng-grid table table-striped';
});
