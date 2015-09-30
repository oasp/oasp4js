/**
 * @module oasp.oaspUi.errorNotificator
 *
 * Module of an error notificator services taht are designed to handle an error responses.
 *
 * It contains an configuration of {@link angular-growl} plugin.
 *
 * Pushes an {@link oaspErrorNotificatorInterceptor} service into {@link $httpProvider} interceptors.
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
