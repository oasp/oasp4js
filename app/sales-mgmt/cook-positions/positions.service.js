/**
 * @ngdoc service
 * @name sales-mgmt.positions
 * @module app.sales-mgmt
 * @requires sales-mgmt.salesManagementRestService
 * @requires sales-mgmt.offers
 * @requires main.appContext
 * @requires $q
 */
angular.module('app.sales-mgmt')
    .factory('positions', function (salesManagementRestService, offers, appContext, $q) {
        'use strict';
        var that = {},
            positionManager = (function () {
                var thisPositionManager = {},
                    allPositions = [],
                    cookId,
                    allOffers = [],
                    allProducts = [],
                    availableAndAssignedPositions = {},
                    findItemById = function (items, id) {
                        var j, currentItem;
                        if (items && id) {
                            for (j = 0; j < items.length; j += 1) {
                                currentItem = items[j];
                                if (currentItem.id && currentItem.id === id) {
                                    return currentItem;
                                }
                            }
                        }
                    },
                    createDetailedPosition = function (position) {
                        var currentOffer, currentMeal, currentSideDish;

                        if (position) {
                            currentOffer = findItemById(allOffers, position.offerId);
                            if (currentOffer) {
                                currentMeal = findItemById(allProducts, currentOffer.mealId);
                                currentSideDish = findItemById(allProducts, currentOffer.sideDishId);
                            }

                            return {
                                id: position.id,
                                orderId: position.orderId,
                                offerName: position.offerName,
                                mealName: currentMeal && currentMeal.description,
                                sideDishName: currentSideDish && currentSideDish.description
                            };
                        }
                    };

                thisPositionManager.allPositions = function (allPositionsToSet) {
                    allPositions = allPositionsToSet;
                    return thisPositionManager;
                };

                thisPositionManager.currentUserId = function (cookIdToSet) {
                    cookId = cookIdToSet;
                    return thisPositionManager;
                };

                thisPositionManager.offers = function (offersToSet) {
                    allOffers = offersToSet;
                    return thisPositionManager;
                };

                thisPositionManager.products = function (productsToSet) {
                    allProducts = productsToSet;
                    return thisPositionManager;
                };

                thisPositionManager.assignCookToPosition = function (cookIdToSet, positionId) {
                    var position = findItemById(allPositions, positionId);
                    if (position) {
                        position.cookId = cookIdToSet;
                    }
                    return position;
                };

                thisPositionManager.setStatusOfPosition = function (status, positionId) {
                    var position = findItemById(allPositions, positionId);
                    if (position) {
                        position.state = status;
                    }
                    return position;
                };

                thisPositionManager.makePositionUnassigned = function (positionId) {
                    var position = findItemById(allPositions, positionId);
                    if (position) {
                        position.cookId = undefined;
                    }
                    return position;
                };

                thisPositionManager.getAvailableAndAssignedPositions = function () {
                    var available = [], assigned = [], i, currentPosition, noCookAssigned;
                    if (allPositions) {
                        for (i = 0; i < allPositions.length; i += 1) {
                            currentPosition = allPositions[i];
                            // 0 is falsy, but can be a valid ID
                            noCookAssigned = currentPosition.cookId === null || currentPosition.cookId === undefined;
                            if (noCookAssigned) {
                                available.push(createDetailedPosition(currentPosition));
                            } else if (cookId === currentPosition.cookId) {
                                assigned.push(createDetailedPosition(currentPosition));
                            } // ignoring positions assigned to other users
                        }
                    }
                    availableAndAssignedPositions.availablePositions = available;
                    availableAndAssignedPositions.positionsAssignedToCurrentUser = assigned;

                    return availableAndAssignedPositions;
                };

                return thisPositionManager;
            }());

        /**
         * @ngdoc method
         * @name sales-mgmt.positions#get
         * @methodOf sales-mgmt.positions
         *
         * @return {promise} promise
         */
        that.get = function () {
            var deferredPositions = $q.defer(), cookId;

            appContext.getCurrentUser().then(function (currentUser) {
                cookId = currentUser.getUserId();
                if (cookId) {
                    $q.all([
                        salesManagementRestService.findOrderPositions({state: 'ORDERED', mealOrSideDish: true}),
                        offers.loadAllOffers(),
                        offers.loadAllProducts()
                    ]).then(function (allResults) {
                        positionManager
                            .currentUserId(cookId)
                            .allPositions(allResults[0].data)
                            .offers(allResults[1])
                            .products(allResults[2]);
                        deferredPositions.resolve(positionManager.getAvailableAndAssignedPositions());
                    }, function (reject) {
                        deferredPositions.reject(reject);
                    });
                } else {
                    deferredPositions.reject();
                }
            });

            return deferredPositions.promise;
        };

        /**
         * @ngdoc method
         * @name sales-mgmt.positions#assignCookToPosition
         * @methodOf sales-mgmt.positions
         *
         * @return {promise} promise
         */
        that.assignCookToPosition = function (positionId) {
            var cookId;
            return appContext.getCurrentUser().then(function (currentUser) {
                cookId = currentUser.getUserId();
                return salesManagementRestService.updateOrderPosition(positionManager.assignCookToPosition(cookId, positionId))
                    .then(function () {
                        return that.get();
                    });
            });
        };

        /**
         * @ngdoc method
         * @name sales-mgmt.positions#makePositionAvailable
         * @methodOf sales-mgmt.positions
         *
         * @return {promise} promise
         */
        that.makePositionAvailable = function (positionId) {
            return salesManagementRestService.updateOrderPosition(positionManager.makePositionUnassigned(positionId))
                .then(function () {
                    return that.get();
                });
        };

        /**
         * @ngdoc method
         * @name sales-mgmt.positions#setPositionStatusToPrepared
         * @methodOf sales-mgmt.positions
         *
         * @return {promise} promise
         */
        that.setPositionStatusToPrepared = function (positionId) {
            return salesManagementRestService.updateOrderPosition(positionManager.setStatusOfPosition('PREPARED',
                positionId))
                .then(function () {
                    return that.get();
                });
        };

        return that;
    });
