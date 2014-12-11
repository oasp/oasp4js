angular.module('app.sales-mgmt')
    .factory('positions', function (salesManagementRestService, offerManagementRestService, $q) {
        'use strict';
        var positions = (function () {
            var that = {},
                availablePositions = [],
                positionsAssignedToCurrentUser = [],
                offers = [],
                products = [],
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
                                mealName: (currentMeal && currentMeal.name) || '',
                                sideDishName: (currentSideDish && currentSideDish.name) || ''
                            });
                        }
                    }

                    return detailedPositions;
                },
                findPositionAndUpdate = function (positions, positionId, updateCallback) {
                    var i, currentPosition;
                    for (i = 0; i < positions.length; i += 1) {
                        currentPosition = positions[i];
                        if (currentPosition.id === positionId) {
                            updateCallback(currentPosition);
                            return;
                        }
                    }
                };

            that.availablePositions = function (availablePositionsToSet) {
                availablePositions = availablePositionsToSet;
                return that;
            };

            that.assignedPositions = function (assignedPositions) {
                positionsAssignedToCurrentUser = assignedPositions;
                return that;
            };

            that.offers = function (offersToSet) {
                offers = offersToSet;
                return that;
            };

            that.products = function (productsToSet) {
                products = productsToSet;
                return that;
            };

            that.assignCookToPosition = function (cookId, positionId) {
                var position = findItemById(availablePositions, positionId);
                if (position) {
                    position.cookId = cookId;
                }
            };

            that.setStatusOfPosition = function (status, positionId) {
                var position = findItemById(availablePositions, positionId);
                if (position) {
                    position.state = status;
                }
            };

            that.andTransformPositionForUpdate = function (positionId) {
                return findItemById(positionsAssignedToCurrentUser, positionId);
            };

            that.transformToDetailedPositions = function () {
                return {
                    availablePositions: createDetailedPositions(availablePositions),
                    positionsAssignedToCurrentUser: createDetailedPositions(positionsAssignedToCurrentUser)
                };
            };

            return that;
        }());

        return {
            get: function () {
                var deferredPositions = $q.defer();

                $q.all([
                    salesManagementRestService.findOrderPositions({state: 'ORDERED', mealOrSideDish: true}),
                    salesManagementRestService.findOrderPositions({state: 'ORDERED', mealOrSideDish: true, cookId: 1234}),
                    offerManagementRestService.getAllOffers(),
                    offerManagementRestService.getAllProducts()
                ]).then(function (allResults) {
                    positions
                        .availablePositions(allResults[0].data)
                        .assignedPositions(allResults[1].data)
                        .offers(allResults[2].data)
                        .products(allResults[3].data);
                    deferredPositions.resolve(positions.transformToDetailedPositions());
                }, function (reject) {
                    deferredPositions.reject(reject);
                });

                return deferredPositions.promise;
            },
            assignCookToPosition: function (cookId, positionId) {
                return salesManagementRestService.updateOrderPosition(positionId,
                    positions
                        .assignCookToPosition(cookId, positionId)
                        .andTransformPositionForUpdate(positionId))
                    .then(function (response) {
                        // positions.updatePosition(response.data);

                        return;
                    });
            },
            setPositionStatusToPrepared: function (positionId) {
                return salesManagementRestService.updateOrderPosition(positionId,
                    positions
                        .setStatusOfPosition('PREPARED', positionId)
                        .andTransformPositionForUpdate(positionId))
                    .then(function (response) {
                        // positions.updatePosition(response.data);

                        return;
                    });
            }
        };
    });
