angular.module('app.table-mgmt').controller('TableDetailsCntl',
    function ($scope, $sce, $stateParams, tables, offers, sales, globalSpinner, positionStateNotification, $state) {
        'use strict';

        var tdcSelf = this;
        tdcSelf.model = {};
        tdcSelf.totalItems = 0;
        tdcSelf.table = [];

        tables.loadTable($stateParams.tableId)
            .then(function (table) {
                tdcSelf.table = table;
            });
        sales.loadOrderForTable($stateParams.tableId)
            .then(function (order) {
                tdcSelf.model.order = order;
                tdcSelf.totalItems = angular.isDefined(order) ? tdcSelf.model.order.positions.length : 0;
            });
        offers.loadAllOffers()
            .then(function (offers) {
                tdcSelf.allOffers = offers;
                tdcSelf.model.selected = offers.length ? offers[0] : undefined;
            });


        tdcSelf.selectedItems = [];
        tdcSelf.positionsShown = [];

        tdcSelf.numPerPage = 3;
        tdcSelf.currentPage = 1;
        tdcSelf.maxSize = 4;

        $scope.$watch(function () {
                var orderPositions; //TODO: Do we want to watch reference here all the collection changes?
                if (angular.isDefined(tdcSelf.model.order)) {
                    orderPositions = tdcSelf.model.order.positions;
                }
                return tdcSelf.currentPage + tdcSelf.numPerPage +
                    tdcSelf.totalItems + tdcSelf.model.order + orderPositions;
            },
            function () {
                if (angular.isDefined(tdcSelf.model.order)) {
                    var begin = ((tdcSelf.currentPage - 1) * tdcSelf.numPerPage),
                        end = begin + tdcSelf.numPerPage;
                    tdcSelf.positionsShown = tdcSelf.model.order.positions.slice(begin, end);
                    tdcSelf.totalItems = angular.isDefined(tdcSelf.model.order.positions) ? tdcSelf.model.order.positions.length : 0;
                }
            });

        tdcSelf.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };

        tdcSelf.noOrderAssigned = function () {
            return !tdcSelf.model.order;
        };
        tdcSelf.orderAssigned = function () {
            return !tdcSelf.noOrderAssigned();
        };
        tdcSelf.assignNewOrder = function () {
            tdcSelf.model.order = {
                order: {
                    tableId: tdcSelf.table.id,
                    state: 'OPEN'
                },
                positions: []
            };
        };

        // form container to access forms added in parent scopes
        //$scope.forms = {};

        tdcSelf.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                return sales.saveOrUpdateOrder(tdcSelf.model.order);
            }).then(function () {
                positionStateNotification.connect().then(function () {
                    var pos = tdcSelf.model.order.positions[0];
                    positionStateNotification.notify(pos.id, pos.status);
                    tdcSelf.goToSearchView();
                });
            });
        };

        tdcSelf.goToSearchView = function () {
            $state.go('tableMgmt.search');
        };

        tdcSelf.addPosition = function (offer) {
            tdcSelf.model.order.positions.push({
                revision: null,
                orderId: tdcSelf.model.order.order.id,
                offerId: offer.id,
                offerName: offer.description,
                state: 'ORDERED',
                price: offer.price,
                comment: ''
            });
            tdcSelf.totalItems = tdcSelf.model.order.positions.length;
        };

        tdcSelf.buttonDefs = [
            {
                label: 'TABLE_MGMT.REMOVE',
                onClick: function () {
                    tdcSelf.model.order.positions.splice(tdcSelf.model.order.positions.indexOf(tdcSelf.selectedItems[0]), 1);
                    tdcSelf.selectedItems.length = 0;
                },
                isActive: function () {
                    return tdcSelf.selectedItems.length;
                }
            }
        ];
    });
