describe('error-log directive specs', function () {
    'use strict';
    var $compile, $scope, $timeout, element;

    beforeEach(module('oasp.oaspUi.errorNotificator', function($controllerProvider) {
    }));

    beforeEach(function () {
        module('ui.bootstrap');
    });

    /*jslint nomen: true*/
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
    }));

    afterEach(function() {
        $scope.$destroy();
        jasmine.clock().uninstall();
    });

    function digest() {
        $scope.$digest();
        $timeout.flush();
    }

    function compileErrorLog () {
        element = $compile(angular.element('<error-log></error-log>'))($scope);
        digest();
    }

    function clickErrorLog() {
        element.find('a').click();
        digest();
    }

    function clickOnLogFooter() {
        element.find('li').click();
        digest();
    }

    it('should have "collapse" class in error log list', function () {
        // when
        compileErrorLog();
        clickErrorLog();
        clickOnLogFooter();

        // then
        expect(element.find('ul').attr('class')).toContain('collapse');
        expect(element.find('ul').attr('class')).not.toContain('in');
        expect(element.find('li').length).toBe(2);
    });

    it('should have "in" class in error log list', function () {
        // when
        compileErrorLog();
        clickErrorLog();

        // then
        expect(element.find('ul').attr('class')).toContain('in');
        expect(element.find('ul').attr('class')).not.toContain('collapse');
    });

});
