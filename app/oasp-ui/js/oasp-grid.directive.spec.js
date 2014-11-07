describe('oasp-grid directive specs', function () {
    "use strict";
    var $compile, $rootScope,
        elementHasRowsContainingLabels = function (element, rowNumber, labels) {
            var row = element.find('tbody tr').eq(rowNumber), cells = row.find('td'), i, currentLabel;
            expect(cells.length).toEqual(labels.length);
            for (i = 0; i < labels.length; i += 1) {
                currentLabel = cells.eq(i).text();
                expect(currentLabel.trim()).toEqual(labels[i]);
            }
        };

    beforeEach(module('oasp-ui'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('renders a title', function () {
        // when
        var element = $compile('<div data-oasp-grid="" title="Some Items"></div>')($rootScope);
        $rootScope.$digest();
        // then
        expect(element.find('h2').text()).toEqual('Some Items');
    });

    it('renders a row whose attribute is undefined', function () {
        // given
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [{}];
        // when
        var element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows"></div>')($rootScope);
        $rootScope.$digest();
        // then
        elementHasRowsContainingLabels(element, 0, ['']);
    });

    it('renders rows', function () {
        // given
        var firstNameLabel = 'First Name',
            lastNameLabel = 'Last Name',
            person1 = {firstName: 'John', lastName: 'Example'},
            person2 = {firstName: 'Joe', lastName: 'Smith'},
            elementHasHeaderRowContainingLabels = function (element, labels) {
                var headerRows = element.find('th'), i, currentLabel;
                expect(headerRows.length).toEqual(labels.length);
                for (i = 0; i < labels.length; i += 1) {
                    currentLabel = headerRows.eq(i).text();
                    expect(currentLabel.trim()).toEqual(labels[i]);
                }
            },
            element;
        $rootScope.columnDefs = [
            {field: 'firstName', label: firstNameLabel},
            {field: 'lastName', label: lastNameLabel}
        ];
        $rootScope.rows = [
            {firstName: person1.firstName, lastName: person1.lastName},
            {firstName: person2.firstName, lastName: person2.lastName}
        ];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows"></div>')($rootScope);
        $rootScope.$digest();
        // then
        elementHasHeaderRowContainingLabels(element, [firstNameLabel, lastNameLabel]);
        elementHasRowsContainingLabels(element, 0, [person1.firstName, person1.lastName]);
        elementHasRowsContainingLabels(element, 1, [person2.firstName, person2.lastName]);
    });

    it('renders using a renderer supplied', function () {
        // given
        var itemLabel = 'Item', priceLabel = 'Price',
            banana = {item: 'Banana', price: {amount: 2, currency: 'EUR'}},
            element;
        $rootScope.columnDefs = [
            {field: 'item', label: itemLabel},
            {field: 'price', label: priceLabel, renderer: function (row, column) {
                var currentPrice = row[column.field];
                return currentPrice.amount + ' ' + currentPrice.currency;
            }}
        ];
        $rootScope.rows = [banana];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows"></div>')($rootScope);
        $rootScope.$digest();
        // then
        elementHasRowsContainingLabels(element, 0, ['Banana', '2 EUR']);
    });

    it('selects a row', function () {
        // given
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [{attr : 'My value'}];
        // when
        var element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows"></div>')($rootScope);
        $rootScope.$digest();
        element.find('tbody tr').click();
        $rootScope.$digest();
        // then
        expect(element.find('tbody tr').hasClass('selected-row')).toBeTruthy();
    });

    it('calls a function back on a double click', function () {
        // given
        var row = {attr : 'My value'}, element;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [row];
        $rootScope.myCallback = angular.noop;
        spyOn($rootScope, 'myCallback');
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows" data-dblclick-callback="myCallback(row)"></div>')($rootScope);
        $rootScope.$digest();
        element.find('tbody tr').dblclick();
        $rootScope.$digest();
        // then
        expect($rootScope.myCallback).toHaveBeenCalledWith(row);
    });

    it('renders a button', function () {
        // given
        var buttonLabel = 'View Details', renderedButtonLabel, element;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [{attr : 'My value'}];
        $rootScope.buttonDefs = [
            {
                label: buttonLabel
            }
        ];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows" data-button-defs="buttonDefs"></div>')($rootScope);
        $rootScope.$digest();
        // then
        renderedButtonLabel = element.find('button').eq(0).text();
        expect(renderedButtonLabel.trim()).toEqual(buttonLabel);
    });
    it('deactivates a button when no row selected', function () {
        // given
        var element;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [{attr : 'My value'}];
        $rootScope.buttonDefs = [
            {
                label: 'View Details',
                isNotActive : function (selectedRow) {
                    return selectedRow === null;
                }
            }
        ];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows" data-button-defs="buttonDefs"></div>')($rootScope);
        $rootScope.$digest();
        // then
        expect(element.find('button').is(':disabled')).toBeTruthy();
    });
    it('activates a button when a row selected', function () {
        // given
        var element;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [{attr : 'My value'}];
        $rootScope.buttonDefs = [
            {
                label: 'View Details',
                isActive : function (selectedRow) {
                    return angular.isDefined(selectedRow);
                }
            }
        ];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows" data-button-defs="buttonDefs"></div>')($rootScope);
        $rootScope.$digest();
        element.find('tbody tr').click();
        $rootScope.$digest();
        // then
        expect(element.find('button').is(':disabled')).toBeFalsy();
    });
    it('calls onClick callback when button clicked', function () {
        // given
        var row = {attr : 'My value'}, element;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [row];
        $rootScope.buttonDefs = [
            {
                label: 'View Details',
                isNotActive : function (selectedRow) {
                    return selectedRow === null;
                },
                onClick: angular.noop
            }
        ];
        spyOn($rootScope.buttonDefs[0], 'onClick');
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows" data-button-defs="buttonDefs"></div>')($rootScope);
        $rootScope.$digest();
        element.find('tbody tr').click();
        $rootScope.$digest();
        element.find('button').click();
        // then
        expect($rootScope.buttonDefs[0].onClick).toHaveBeenCalledWith(row);
    });
});
