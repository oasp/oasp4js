angular.module('oasp-security')
    .provider('requestResendingQueue', function () {
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
                that.retryAll = function (csrfProtection) {
                    while (queue.length) {
                        queue.shift().retry(csrfProtection);
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
                            .then(function (csrfProtection) {
                                that.retryAll(csrfProtection);
                                notBeingAuthenticated = true;
                            }, function () {
                                that.cancelAll();
                                notBeingAuthenticated = true;
                            });
                        notBeingAuthenticated = false;
                    }
                };

                return {
                    addRequest: function (request) {
                        var deferredRetry = $q.defer(),
                            retryItem = {
                                retry: function (csrfProtection) {
                                    var resendRequestUpdatingItsCsrfProtectionData =
                                        function (request, csrfProtection) {
                                            var $http = $injector.get('$http');
                                            request.headers[csrfProtection.headerName] = csrfProtection.token;
                                            return $http(request);
                                        };
                                    resendRequestUpdatingItsCsrfProtectionData(request, csrfProtection)
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
