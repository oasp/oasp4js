/**
 * @ngdoc module
 * @name errorNotificator
 * @requires $httpProvider
 * @requires angular-growl.growlProvider
 *
 * Module of an error notificator services that are designed to handle an error responses from the server.
 * It contains an configuration of {@link bower_components/angular-growl-v2/build/angular-growl.js} plugin.
 * Pushes an {@link app/oasp/oasp-ui/error-notificator/error-notificator-interceptor.service.js} service into {@link $httpProvider} interceptors.
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
