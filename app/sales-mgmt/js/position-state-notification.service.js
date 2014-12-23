/*global Stomp,SockJS*/
angular.module('app.sales-mgmt')
    .factory('positionStateNotification', function (currentContextPath, $q) {
        'use strict';

        var positionStompClient;

        return {
            connect: function () {
                var deferredConnection,
                    connectionPromise,
                    positionWebSocketUrl,
                    positionSocket,
                    headers = {},
                    successCallback = function () {
                        deferredConnection.resolve();
                    },
                    failureCallback = function () {
                        deferredConnection.reject();
                    },
                    notConnectedYet = positionStompClient ? false : true;

                if (notConnectedYet) {
                    deferredConnection = $q.defer();
                    connectionPromise = deferredConnection.promise;
                    positionWebSocketUrl = currentContextPath.get() + 'websocket/positions';
                    positionSocket = new SockJS(positionWebSocketUrl);
                    positionStompClient = Stomp.over(positionSocket);
                    positionStompClient.connect(headers, successCallback, failureCallback);
                } else {
                    connectionPromise = $q.when();
                }

                return connectionPromise;
            },
            subscribe: function (callbackFn) {
                var internalCallback = function (message) {
                    var parsedMessage = JSON.parse(message.body);

                    if (angular.isFunction(callbackFn)) {
                        callbackFn(parsedMessage);
                    }
                };

                if (positionStompClient) {
                    positionStompClient.subscribe('/topic/positionStatusChange', internalCallback);
                }
            },
            notify: function (positionId, newStatus) {
                var positionStatusChange = {
                    id: positionId,
                    status: newStatus
                };

                if (positionStompClient) {
                    positionStompClient.send('/sample/positions', {},
                        JSON.stringify(positionStatusChange));
                }
            }
        };
    });
