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
        };/*,
        
        The markTableAs function will be replaced by using a saveTable() function, so this mock is obsolete
        mockTableStatusChange = function (tableId, status) {
            $httpBackend.whenPOST(contextPath + 'services/rest/tablemanagement/v1/table/' + tableId + '/marktableas/' + status).respond(200);
        }*/
    
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
    
    /*
    The markTableAs function will be replaced by using a saveTable() function, so these tests are obsolete
    
    it('frees one table', function () {
        //given
        mockTableStatusChange(1, 'FREE');
        //when
        tables.free(1);
        $httpBackend.flush();
        // then
    });
    it('reserves one table', function () {
        //given
        mockTableStatusChange(1, 'RESERVED');
        //when
        tables.reserve(1);
        $httpBackend.flush();
        // then
    });
    it('occupies one table', function () {
        //given
        mockTableStatusChange(1, 'OCCUPIED');
        //when
        tables.occupy(1);
        $httpBackend.flush();
        // then
    });
    it('cancels reservation', function () {
        //given
        mockTableStatusChange(1, 'FREE');
        //when
        tables.cancelReservation(1);
        $httpBackend.flush();
        // then
    });*/
    
});