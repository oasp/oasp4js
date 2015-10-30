/**
 * @ngdoc object
 * @name oaspUi.errorNotificator
 * @module oasp.oaspUi
 * @requires oasp.templates
 * @requires angular-growl
 * @requires ngAnimate
 * @description
 * Module of an error notificator services that are designed to handle an error responses from the server.
 * It contains an configuration of angular-growl plugin.
 * Pushes an error-notificator-interceptor service into $httpProvider interceptors.
 */
angular.module('oasp.oaspUi.errorNotificator', ['oasp.templates', 'angular-growl', 'ngAnimate'])
    .config(function ($httpProvider, growlProvider) {
        'use strict';

        growlProvider.globalTimeToLive(2500);
        growlProvider.globalDisableCountDown(true);
        growlProvider.onlyUniqueMessages(false);
        growlProvider.globalPosition('top-right');

        $httpProvider.interceptors.push('oaspErrorNotificatorInterceptor');
    });
