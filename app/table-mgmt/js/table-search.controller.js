/*
 app.table-mgmt module retrieval
 For details regarding angular.module() syntax please check: https://docs.angularjs.org/api/ng/function/angular.module
 The module is retrieved in order to define a controller in it.
 */
angular.module('app.table-mgmt')
    // TableSearchCntl definition
    // The definition contains:
    // - controller name as a first parameter
    // - controller constructor function with dependencies as a function parameters (injection of angular $scope object, UI Bootstrap $modal and
    // other OASP services)
    // For more details regarding controller concept and assigning model and behavior to $scope object, please check:
    // https://docs.angularjs.org/guide/controller
    .controller('TableSearchCntl', function ($scope, tables, paginatedTableList, $modal, globalSpinner, offers, sales) {
        'use strict';

        // Internal controller function returning the selected row in the tables table.
        // In general - if function should not be exposed outside (like for example $scope functions called in the html template)
        // they should be defined as variables with var keyword usage.
        var selectedTable = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };

        // $scope function definition for calling modal dialog for table edition. The function is indirectly called in the table-search.html -
        // the function call is hidden behind the buttonBar directive.
        $scope.openEditDialog = function (tableRow) {
            // modal dialog call
            // The modal dialog configuration is provided by the object passed as a parameter of $modal.open function.
            // The object indicates:
            // - modal dialog url
            // - controller for modal dialog
            // - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
            // For more details regarding $modal service please see https://angular-ui.github.io/bootstrap/#/modal
            $modal.open({
                templateUrl: 'table-mgmt/html/table-details.html',
                controller: 'TableDetailsCntl',
                resolve: {
                    tableDetails: function () {
                        return tables.loadTable(tableRow.id);
                    },
                    allOffers: function () {
                        return offers.loadAllOffers();
                    },
                    currentOrder: function () {
                        return sales.loadOrderForTable(tableRow.id);
                    }
                }
            });
        };

        // creating model - assigning data to $scope object. Data may come from different sources:
        // calculated by the controller logic / simple assignments / data from injected services
        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedTableList.pagination.total;
        $scope.numPerPage = paginatedTableList.pagination.size;
        $scope.currentPage = paginatedTableList.pagination.page;

        $scope.gridOptions = {
            data: paginatedTableList.result
        };

        // function used in pagination - it loads tables when the table page is changed
        $scope.reloadTables = function () {
            // calling service tables.getPaginatedTables function
            // The function fetches data from server (it creates http.get request).
            // The response handling (in case of success) is placed in the function wrapped in the 'then' object - the lines of code placed in there
            // will be executed when the successful response from server comes back.
            // The response is passed as a parameter of this function ('res' object).
            // For more info regarding running functions asynchronously please check: https://docs.angularjs.org/api/ng/service/$q
            tables.getPaginatedTables($scope.currentPage, $scope.numPerPage).then(function (res) {
                // These lines are executed only after successful server response.
                paginatedTableList = res;
                $scope.gridOptions.data = paginatedTableList.result;
            });
        };

        // registering a listener which is called whenever $scope.currentPage is changed
        // For more info regarding watchers please check: https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch
        $scope.$watch('currentPage', function () {
            // When user changes the current page, the request for tables on the selected page is sent.
            $scope.reloadTables();
        });

        // button definitions for managing tables (5 buttons under the html table on the table-search dialog)
        // The button definitions are passed into buttonBar directive (<button-bar button-defs="buttonDefs"></button-bar> in the html template).
        // The button bar directive is defined in the button-bar.directive.js file.
        // The html template of the directive is defined in the button-bar.html file.
        // In general <button-bar> html tag will be replaced in the table-search.html by the code of button-bar.html template.
        // Clicking on the buttons will run the functions specified below.
        // For more info regarding directives, please check: https://docs.angularjs.org/guide/directive
        $scope.buttonDefs = [
            {
                label: 'Edit...',
                onClick: function () {
                    // opens edit table dialog on edit button click
                    $scope.openEditDialog(selectedTable());
                },
                isActive: function () {
                    // makes button active when there is a table selected
                    return selectedTable();
                }
            },
            {
                label: 'Reserve',
                onClick: function () {
                    // changes status of the selected table
                    // globalSpinner OASP service is used here - wrapping long running tasks in it will result in showing spinner while request is
                    // processed.
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.reserve(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    // makes button active when there is a FREE table selected
                    return selectedTable() && selectedTable().state === 'FREE';
                }
            },
            {
                label: 'Cancel Reservation',
                onClick: function () {
                    // changes status of the selected table
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.cancelReservation(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    // makes button active when there is a RESERVED table selected
                    return selectedTable() && selectedTable().state === 'RESERVED';
                }
            },
            {
                label: 'Occupy',
                onClick: function () {
                    // changes status of the selected table
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.occupy(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    // makes button active when there is a RESERVED or FREE table selected
                    return selectedTable() && (selectedTable().state === 'RESERVED' || selectedTable().state === 'FREE');
                }
            },
            {
                label: 'Free',
                onClick: function () {
                    // changes status of the selected table
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return tables.free(selectedTable()).then($scope.reloadTables);
                    });
                },
                isActive: function () {
                    // makes button active when there is a OCCUPIED table selected
                    return selectedTable() && selectedTable().state === 'OCCUPIED';
                }
            }
        ];
    });