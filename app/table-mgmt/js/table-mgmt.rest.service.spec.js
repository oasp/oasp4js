describe('Module: tableMgmt, Service: tableManagementRestService', function () {
    'use strict';
    var tableManagementRestService;
    beforeEach(module('app.table-mgmt'));

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
        expect($http.get).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/' + id);
    }));

    it('should call $http.get when tableManagementRestService.getAllTables is called', inject(function ($http) {
        //given
        spyOn($http, 'get');
        //when
        tableManagementRestService.getAllTables();
        //then
        expect($http.get).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/');
    }));

    it('should call $http.put when tableManagementRestService.createTable is called', inject(function ($http) {
        //given
        var id = 'tableId', table = {state: 'FREE'};
        spyOn($http, 'put');
        //when
        tableManagementRestService.createTable(id, table);
        //then
        expect($http.put).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/' + id, table);
    }));

    it('should call $http.delete when tableManagementRestService.deleteTable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'delete');
        //when
        tableManagementRestService.deleteTable(id);
        //then
        expect($http.delete).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/' + id);
    }));

    it('should call $http.post when tableManagementRestService.marktableas is called', inject(function ($http) {
        //given
        var id = 'tableId', state = 'FREE';
        spyOn($http, 'post');
        //when
        tableManagementRestService.markTableAs(id, state);
        //then
        expect($http.post).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/' + id + '/marktableas/' + state);
    }));

    it('should call $http.get when tableManagementRestService.isTableReleasable is called', inject(function ($http) {
        //given
        var id = 'tableId';
        spyOn($http, 'get');
        //when
        tableManagementRestService.isTableReleasable(id);
        //then
        expect($http.get).toHaveBeenCalledWith('/context.html/services/rest/tablemanagement/table/' + id + '/istablereleasable/');
    }));
});