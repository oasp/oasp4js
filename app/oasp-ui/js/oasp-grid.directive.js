angular.module('oasp-ui').
    directive('oaspGrid', function ($sce) {
        'use strict';
        
        // used to translate between oasp-grid and ui-grid interfaces
        var transcodeRows = function(rows) {
        	// identity at the moment
        	return rows;
        },
        transcodeColumnDefs = function(columnDefs) {
        	return columnDefs && columnDefs.map(function(colDef) {
        		return {
        			field: colDef.field,
        			name: colDef.label,
        			renderer: colDef.renderer,
        			
        			cellTemplate: '<div class="ui-grid-cell-contents"'
        						 + ' data-ng-bind-html="getExternalScopes().render(row, col)">'
        						+ '</div>'
        		};
        	});
        };
        
        
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'oasp-ui/html/oasp-grid.html',
            scope: {
                title: '@?',
                rows: '=',
                columnDefs: '=',
                buttonDefs: '=?',
                dblclickCallback: '&?'
            },
            
            link: function (scope) {
            	// row selection placeholder
                scope.rowSelection = (function () {
                    var selectedRow = null;

                    return {
                        select: function (row) {
                            selectedRow = row;
                        },
                        isSelected: function (row) {
                            return selectedRow === row;
                        },
                        getSelected: function () {
                            return selectedRow;
                        }
                    };
                }());
                
                scope.noTitleDefined = function () {
                    return !scope.title;
                };
                
                // buttons interface
                scope.onButtonClick = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.onClick)) {
                        buttonDef.onClick(scope.rowSelection.getSelected());
                    }
                };
                scope.isButtonDisabled = function (buttonDef) {
                    if (buttonDef && angular.isFunction(buttonDef.isActive)) {
                        return !buttonDef.isActive(scope.rowSelection.getSelected());
                    }
                    if (buttonDef && angular.isFunction(buttonDef.isNotActive)) {
                        return buttonDef.isNotActive(scope.rowSelection.getSelected());
                    }
                    return true;
                };
                scope.onRowDblClick = function (row) {
                    scope.dblclickCallback({row: row});
                };
                
                scope.render = function (row, column) {
                    var result;
                    if (angular.isFunction(column.renderer)) {
                        result = column.renderer(row, column);
                        
                    } else {
                        result = '<span>' + (row[column.field] || '') + '</span>';
                    }
                    
                    return $sce.trustAsHtml(result);
                };
                
                // will be referenced from uiGrid getExternalScopes()
                scope.uiGridScopeWrapper = {
                	onRowDblClick: function(row) {
                		scope.onRowDblClick(row.entity);
	                },
	                isSelected: function(row) {
	                	return scope.rowSelection.isSelected(row.entity);
	                },
	                render: function(row, col) {
	                	return scope.render(row.entity, col.colDef);
	                }
                };
                
                // ui-grid options
                scope.gridData = {
                	data: transcodeRows(scope.rows),
                	columnDefs: transcodeColumnDefs(scope.columnDefs),
                	
                	enableRowHeaderSelection: false,
                	multiSelect: false,
                	
                	onRegisterApi: function(gridApi) {
                		gridApi.selection.on.rowSelectionChanged(scope, function(row) {
                			if (row.isSelected) {
                				scope.rowSelection.select(row.entity);
                				
                			} else {
                				// deselection
                				scope.rowSelection.select(null);
                			}
                		});
                	},
                	
                	// custom template, to e.g. enable double-click action
                	rowTemplate:  '<div class="rowWrapper"'
                				+ ' data-ng-class="{\'selected-row\': getExternalScopes().isSelected(row)}"'
                				+ ' data-ng-dblclick="getExternalScopes().onRowDblClick(row)">'
                				+ '  <div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name"'
                				+ '   class="ui-grid-cell" ui-grid-cell>'
                				+ '  </div>'
                				+ '</div>'


                };
            }
        };
    });