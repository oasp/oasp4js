angular.module('oasp-security')
    .provider('retryRequestQueue', function () {
        'use strict';
        var config = {
            authenticatorServiceName: 'authenticator'
        };

        return {
            setAuthenticatorServiceName: function (authenticatorServiceName) {
                config.authenticatorServiceName = authenticatorServiceName || config.authenticatorServiceName;
            },
            $get: function ($q, $injector) {
                var that = {},
                    queue = [],
                    notBeingAuthenticated = true;

                that.push = function (retryItem) {
                    queue.push(retryItem);
                    that.onItemAdded();
                };
                that.retryAll = function () {
                    while (queue.length) {
                        queue.shift().retry();
                    }
                };
                that.cancelAll = function () {
                    while (queue.length) {
                        queue.shift().cancel();
                    }
                };
                that.onItemAdded = function () {
                    var authenticator;
                    if (notBeingAuthenticated) {
                        authenticator = $injector.get(config.authenticatorServiceName);
                        authenticator.execute()
                            .then(function () {
                                that.retryAll();
                                notBeingAuthenticated = true;
                            }, function () {
                                that.cancelAll();
                                notBeingAuthenticated = true;
                            });
                        notBeingAuthenticated = false;
                    }
                };

                return {
                    addRetryFn: function (reason, retryFn) {
                        var deferredRetry = $q.defer(),
                            retryItem = {
                                reason: reason,
                                retry: function () {
                                    $q.when(retryFn())
                                        .then(function (value) {
                                            deferredRetry.resolve(value);
                                        }, function (value) {
                                            deferredRetry.reject(value);
                                        });
                                },
                                cancel: function () {
                                    deferredRetry.reject();
                                }
                            };
                        that.push(retryItem);
                        return deferredRetry.promise;
                    }
                };
            }
        };
    });
