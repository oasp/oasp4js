/*globals oasp*/
describe('Module: tableMgmt, Service: tableManagementRestService', function () {
    'use strict';
    var tableManagementRestService, contextPath = '/contextPath/';

    beforeEach(module('app.table-mgmt', function ($provide) {
        $provide.value('currentContextPath', oasp.mock.currentContextPathReturning(contextPath));
    }));

    beforeEach(inject(function (_tableManagementRestService_) {
        tableManagementRestService = _tableManagementRestService_;
    }));

    it('should call $http.get when tableManagementRestService.getTable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'get');
        //when
        tableManagementRestService.getTable(id);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id);
    }));

    it('should call $http.post when tableManagementRestService.getPaginatedTables is called', inject(function ($http) {
        //given
        spyOn($http, 'post');
        //when
        tableManagementRestService.getPaginatedTables(1, 3);
        //then
        expect($http.post).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/search',
            {
                pagination: {
                    size: 3,
                    page: 1,
                    total: true
                }
            });
    }));

    it('should call $http.put when tableManagementRestService.createTable is called', inject(function ($http) {
        //given
        var id = 'tableId', table = {state: 'FREE'};
        spyOn($http, 'put');
        //when
        tableManagementRestService.createTable(id, table);
        //then
        expect($http.put).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id, table);
    }));

    it('should call $http.delete when tableManagementRestService.deleteTable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'delete');
        //when
        tableManagementRestService.deleteTable(id);
        //then
        expect($http.delete).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id);
    }));

    it('should call $http.post when tableManagementRestService.saveTable is called', inject(function ($http) {
        //given
        var table = {state: 'FREE'};
        spyOn($http, 'post');
        //when
        tableManagementRestService.saveTable(table);
        //then
        expect($http.post).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/', table);
    }));

    it('should call $http.get when tableManagementRestService.isTableReleasable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'get');
        //when
        tableManagementRestService.isTableReleasable(id);
        //then
        expect($http.get).toHaveBeenCalledWith(contextPath + 'services/rest/tablemanagement/v1/table/' + id + '/istablereleasable/');
    }));
});