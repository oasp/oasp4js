/*globals oasp*/
describe('Service: tables', function () {
    'use strict';

    var tables, $httpBackend, listOfTables,
        contextPath = '/oasp-app/',
        mockAllTableResponse = function () {
            $httpBackend.whenGET(contextPath + 'services/rest/tablemanagement/table/').respond([
                {
                    id: '1',
                    state: 'FREE',
                    waiter: ''
                },
                {
                    id: '2',
                    state: 'FREE',
                    waiter: ''
                }
            ]);
        },
        mockTableStatusChange = function (tableId, status) {
            $httpBackend.whenPOST(contextPath + 'services/rest/tablemanagement/table/' + tableId + '/marktableas/' + status).respond(200);
        };
    beforeEach(module('app.table-mgmt'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
        });

        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            tables = $injector.get('tables');
        });
    });
    beforeEach(function () {
        // given // when
        mockAllTableResponse();
        tables.getAllTables().then(function (allTables) {
            listOfTables = allTables;
        });
        $httpBackend.flush();

    });
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('loads tables from server', function () {
        // then
        expect(listOfTables.length).toBe(2);
        expect(listOfTables[0].id).toEqual('1');

    });
    it('loads a table', function () {
        // given
        var table = {
            id: '1',
            state: 'FREE',
            waiter: ''
        }, loadedTable;
        $httpBackend.whenGET(contextPath + 'services/rest/tablemanagement/table/1').respond(table);
        // when
        tables.loadTable(1)
            .then(function (table) {
                loadedTable = table;
            });
        $httpBackend.flush();
        // then
        expect(loadedTable).toEqual(table);
    });
    it('frees one table', function () {
        //given
        mockTableStatusChange('1', 'FREE');
        //when
        tables.free(listOfTables[0]);
        $httpBackend.flush();
        // then
    });
    it('reserves one table', function () {
        //given
        mockTableStatusChange('1', 'RESERVED');
        //when
        tables.reserve(listOfTables[0]);
        $httpBackend.flush();
        // then
    });
    it('occupies one table', function () {
        //given
        mockTableStatusChange('1', 'OCCUPIED');
        //when
        tables.occupy(listOfTables[0]);
        $httpBackend.flush();
        // then
    });
    it('cancels reservation', function () {
        //given
        mockTableStatusChange('1', 'FREE');
        //when
        tables.cancelReservation(listOfTables[0]);
        $httpBackend.flush();
        // then
    });
});