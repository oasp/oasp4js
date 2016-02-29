describe('error-log directive specs', function () {
    'use strict';
    var $compile, $scope, $timeout, element;
    var mockErrorLog = [];
    beforeEach(module('app.main', function ($provide) {
        $provide.value('oaspErrorNotificatorService', {
            getErrorLog: function () {
                return mockErrorLog;
            }
        });
    }));

    /*jslint nomen: true*/
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.errorLog = [];
        $timeout = _$timeout_;
    }));

    afterEach(function () {
        $scope.$destroy();
        jasmine.clock().uninstall();
    });

    function digest() {
        $scope.$digest();
        $timeout.flush();
    }

    function compileErrorLog() {
        element = $compile(angular.element('<error-log></error-log>'))($scope);
        digest();
    }

    function clickErrorLog() {
        element.find('a').click();
        digest();
    }


    it('should display list without errors', function () {
        // when
        compileErrorLog();
        clickErrorLog();

        // then
        expect(element.find('ul').attr('class')).toContain('dropdown-menu');
        expect(element.find('ul').html()).toContain('OASP.NO_ERROR');
        expect(element.find('li').length).toBe(1);
    });

    it('should display error', function () {
        //given
        var date = new Date();

        mockErrorLog.push({statusText: 'new error', date: date});
        // when
        compileErrorLog();
        clickErrorLog();

        // then
        expect($scope.errorLog.length).toBe(1);
        expect(element.find('ul').html()).toContain('new error');
        expect(element.find('li').length).toBe(2);
    });

});
