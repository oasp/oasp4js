/*globals describe, beforeEach, it, module, inject, expect, spyOn*/
describe('oasp-grid directive specs', function () {
    "use strict";
    var $compile, $rootScope,
        elementHasRowsContainingLabels = function (element, rowNumber, labels) {
            var row = element.find('tr').eq(rowNumber), cells = row.find('td'), i, currentLabel;
            expect(cells.length).toEqual(labels.length);
            for (i = 0; i < labels.length; i += 1) {
                currentLabel = cells.eq(i).text();
                expect(currentLabel.trim()).toEqual(labels[i]);
            }
        };

    beforeEach(module('oasp.templates'));
    beforeEach(module('oasp.main'));

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
        elementHasRowsContainingLabels(element, 1, ['']);
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
        elementHasRowsContainingLabels(element, 1, [person1.firstName, person1.lastName]);
        elementHasRowsContainingLabels(element, 2, [person2.firstName, person2.lastName]);
    });

    it('selects a row', function () {
        // given
        var row = {attr : 'My value'}, element, isolatedScope;
        $rootScope.columnDefs = [
            {field: 'attr', label: 'My attr'}
        ];
        $rootScope.rows = [row];
        // when
        element = $compile('<div data-oasp-grid="" data-title="Some Items" data-column-defs="columnDefs" data-rows="rows"></div>')($rootScope);
        $rootScope.$digest();
        isolatedScope = element.isolateScope();
        isolatedScope.rowSelection.select(row);
        $rootScope.$digest();
        // then
        expect(isolatedScope.rowSelection.isSelected(row)).toBeTruthy();
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
});
