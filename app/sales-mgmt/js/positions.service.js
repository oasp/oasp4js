angular.module('app.sales-mgmt')
    .factory('positions', function (salesManagementRestService, offerManagementRestService, appContext, $q) {
        'use strict';
        var that = {},
            positionManager = (function () {
                var thisPositionManager = {},
                    allPositions = [],
                    positionsAssignedToCurrentUser = [],
                    offers = [],
                    products = [],
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
                    createDetailedPositions = function (positions) {
                        var detailedPositions = [], i, currentPosition, currentOffer, currentMeal, currentSideDish;

                        if (positions) {
                            for (i = 0; i < positions.length; i += 1) {
                                currentPosition = positions[i];
                                currentOffer = findItemById(offers, currentPosition.offerId);
                                if (currentOffer) {
                                    currentMeal = findItemById(products, currentOffer.mealId);
                                    currentSideDish = findItemById(products, currentOffer.sideDishId);
                                }

                                detailedPositions.push({
                                    id: currentPosition.id,
                                    orderId: currentPosition.orderId,
                                    offerName: currentPosition.offerName,
                                    mealName: (currentMeal && currentMeal.description) || '',
                                    sideDishName: (currentSideDish && currentSideDish.description) || ''
                                });
                            }
                        }

                        return detailedPositions;
                    },
                    extractUnassignedPositions = function (positions) {
                        var unassignedPositions = [], i, currentPosition, noCookAssigned;
                        if (positions) {
                            for (i = 0; i < positions.length; i += 1) {
                                currentPosition = positions[i];
                                noCookAssigned = !currentPosition.cookId;
                                if (noCookAssigned) {
                                    unassignedPositions.push(currentPosition);
                                }
                            }
                        }
                        return unassignedPositions;
                    };

                thisPositionManager.allPositions = function (allPositionsToSet) {
                    allPositions = allPositionsToSet;
                    return thisPositionManager;
                };

                thisPositionManager.assignedPositions = function (assignedPositions) {
                    positionsAssignedToCurrentUser = assignedPositions;
                    return thisPositionManager;
                };

                thisPositionManager.offers = function (offersToSet) {
                    offers = offersToSet;
                    return thisPositionManager;
                };

                thisPositionManager.products = function (productsToSet) {
                    products = productsToSet;
                    return thisPositionManager;
                };

                thisPositionManager.assignCookToPosition = function (cookId, positionId) {
                    var position = findItemById(allPositions, positionId);
                    if (position) {
                        position.cookId = cookId;
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
                    availableAndAssignedPositions.availablePositions =
                        createDetailedPositions(extractUnassignedPositions(allPositions));
                    availableAndAssignedPositions.positionsAssignedToCurrentUser =
                        createDetailedPositions(positionsAssignedToCurrentUser);

                    return availableAndAssignedPositions;
                };

                return thisPositionManager;
            }());

        that.get = function () {
            var deferredPositions = $q.defer(), cookId;

            appContext.getCurrentUser().then(function (currentUser) {
                cookId = currentUser.getUserId();
                if (cookId) {
                    $q.all([
                        salesManagementRestService.findOrderPositions({state: 'ORDERED', mealOrSideDish: true}),
                        salesManagementRestService.findOrderPositions({state: 'ORDERED', mealOrSideDish: true, cookId: cookId}),
                        offerManagementRestService.getAllOffers(),
                        offerManagementRestService.getAllProducts()
                    ]).then(function (allResults) {
                        positionManager
                            .allPositions(allResults[0].data)
                            .assignedPositions(allResults[1].data)
                            .offers(allResults[2].data)
                            .products(allResults[3].data);
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

        that.makePositionAvailable = function (positionId) {
            return salesManagementRestService.updateOrderPosition(positionManager.makePositionUnassigned(positionId))
                .then(function () {
                    return that.get();
                });
        };

        that.setPositionStatusToPrepared = function (positionId) {
            return salesManagementRestService.updateOrderPosition(positionManager.setStatusOfPosition('PREPARED',
                positionId))
                .then(function () {
                    return that.get();
                });
        };

        return that;
    });
