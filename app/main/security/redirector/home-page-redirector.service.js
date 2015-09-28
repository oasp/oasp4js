angular.module('app.main')
/**
 * @ngdoc service
 * @name homePageRedirector
 * @module app.main
 * @description
 *
 * Delivers helper for redirecting to user specific home page or login view.
 *
 * @returns {object} Helper object exposing following methods:
 * - `{promise}`  {@link app.main.homePageRedirector#redirect redirect()}
 *
 */
    .factory('homePageRedirector', function ($location, appContext, $q, $state) {
        'use strict';
        var instance = {};

        /**
         * @ngdoc method
         * @name homePageRedirector#redirect
         *
         * @description
         * Method executes user specific redirection to home page. When no user is logged in and
         * no home page can be provided - login view will be requested.
         *
         * @returns {promise} Promise object which will resolve success callback after redirecting requested.
         */
        instance.redirect = function () {
            return appContext.getCurrentUser().then(function (currentUser) {
                if (currentUser.isLoggedIn()) {
                    $location.url(currentUser.getHomeDialogPath());
                } else {
                    $state.go('signIn');
                }
            });
        };

        return instance;

    });
