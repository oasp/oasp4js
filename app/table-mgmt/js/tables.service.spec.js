/*globals oasp*/
describe('Service: tables', function () {
    'use strict';
    var tableSearchCriteria = {
            pagination: {
                size: 4,
                page: 1,
                total: true
            }
        },
        tables,
        $httpBackend,
        listOfTables,
        contextPath = '/oasp-app/',
        mockPaginatedTableResponse = function () {
            $httpBackend.whenPOST(contextPath + 'services/rest/tablemanagement/v1/table/search', tableSearchCriteria).respond(
                {
                    pagination: {
                        size: 4,
                        page: 1,
                        total: 5
                    },
                    result: [
                        {
                            id: 101,
                            modificationCounter: 1,
                            revision: null,
                            waiterId: null,
                            number: 1,
                            state: 'OCCUPIED'
                        },
                        {
                            id: 102,
                            modificationCounter: 1,
                            revision: null,
                            waiterId: null,
                            number: 2,
                            state: 'FREE'
                        },
                        {
                            id: 103,
                            modificationCounter: 1,
                            revision: null,
                            waiterId: null,
                            number: 3,
                            state: 'FREE'
                        },
                        {
                            id: 104,
                            modificationCounter: 1,
                            revision: null,
                            waiterId: null,
                            number: 4,
                            state: 'FREE'
                        }
                    ]
                }
            );
        },
        mockTableStatusChange = function (table) {
            $httpBackend.whenPOST(contextPath + 'services/rest/tablemanagement/v1/table/', table).respond(200);
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
        mockPaginatedTableResponse();
        tables.getPaginatedTables(1, 4).then(function (paginatedTables) {
            listOfTables = paginatedTables.result;
        });
        $httpBackend.flush();

    });
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('loads tables from server', function () {
        // then
        expect(listOfTables.length).toBe(4);
        expect(listOfTables[0].id).toEqual(101);

    });
    it('loads a table', function () {
        // given
        var table = {
            id: 101,
            modificationCounter: 1,
            revision: null,
            waiterId: null,
            number: 1,
            state: 'OCCUPIED'
        }, loadedTable;
        $httpBackend.whenGET(contextPath + 'services/rest/tablemanagement/v1/table/101').respond(table);
        // when
        tables.loadTable(101)
            .then(function (table) {
                loadedTable = table;
            });
        $httpBackend.flush();
        // then
        expect(loadedTable).toEqual(table);
    });
    
    it('frees one table', function () {
        //given
        var table = {
            id: 101,
            state: 'FREE'
        };
        mockTableStatusChange(table);
        //when
        tables.free(table);
        $httpBackend.flush();
        // then
    });
    it('reserves one table', function () {
        //given
        var table = {
            id: 101,
            state: 'RESERVE'
        };
        mockTableStatusChange(table);
        //when
        tables.reserve(table);
        $httpBackend.flush();
        // then
    });
    it('occupies one table', function () {
        //given
        var table = {
            id: 101,
            state: 'OCCUPIED'
        };
        mockTableStatusChange(table);
        //when
        tables.occupy(table);
        $httpBackend.flush();
        // then
    });
    it('cancels reservation', function () {
        //given
        var table = {
            id: 101,
            state: 'FREE'
        };
        mockTableStatusChange(table);
        //when
        tables.cancelReservation(table);
        $httpBackend.flush();
        // then
    });
    
});