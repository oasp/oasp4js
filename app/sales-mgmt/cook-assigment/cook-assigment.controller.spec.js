describe('Module: salesMgmt, Controller: cook-assigment', function () {
    'use strict';
    var $scope, currentPositionsMock, deferred, positionStateNotification, positions;
    beforeEach(module('app.sales-mgmt'));

    beforeEach(inject(function ($rootScope, $controller, _positionStateNotification_, _positions_, $q) {
        //given
        deferred = $q.defer();
        positionStateNotification = _positionStateNotification_;
        positions = _positions_;
        spyOn(positionStateNotification, 'connect').and.returnValue(deferred.promise);
        spyOn(positionStateNotification, 'subscribe').and.callThrough();
        spyOn(positions, 'assignCookToPosition').and.returnValue(deferred.promise);
        spyOn(positions, 'setPositionStatusToPrepared').and.returnValue(deferred.promise);
        spyOn(positions, 'makePositionAvailable').and.returnValue(deferred.promise);
        $scope = $rootScope.$new();
        $controller('CookAssigmentCntl', {$scope: $scope, currentPositions: currentPositionsMock, positionStateNotification: positionStateNotification, positions: positions});
    }));

    it('should call positionStateNotification functions on controller initialization', function () {
        //given when
        deferred.resolve();
        $scope.$digest();
        //then
        expect(positionStateNotification.connect).toHaveBeenCalled();
        expect(positionStateNotification.subscribe).toHaveBeenCalled();
    });

    describe('testing $scope functions', function () {
        it('should return true when there are available positions selected', function () {
            //given
            $scope.positionsAvailableSelected = [];
            $scope.positionsAvailableSelected.push({id: 1});
            //when then
            expect($scope.isAvailablePositionSelected()).toBeTruthy();

            //when
            $scope.positionsAvailableSelected.length = 0;
            //then
            expect($scope.isAvailablePositionSelected()).toBeFalsy();
        });

        it('should return true when there are assigned positions selected', function () {
            //given
            $scope.positionsAssignedSelected = [];
            $scope.positionsAssignedSelected.push({id: 1});
            //when then
            expect($scope.isAssignedPositionSelected()).toBeTruthy();

            //when
            $scope.positionsAssignedSelected.length = 0;
            //then
            expect($scope.isAssignedPositionSelected()).toBeFalsy();
        });

        it('should assign cook to positions', inject(function (globalSpinner) {
            //given
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            $scope.positionsAvailableSelected = [];
            $scope.positionsAvailableSelected.push({id: 1});
            $scope.positionsAvailableSelected.push({id: 2});
            //when
            $scope.assignCookToPosition();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(positions.assignCookToPosition).toHaveBeenCalledWith($scope.positionsAvailableSelected[0].id);
            expect(positions.assignCookToPosition).toHaveBeenCalledWith($scope.positionsAvailableSelected[1].id);
        }));
    });

    describe('testing button definitions', function () {
        it('should call positions.setPositionStatusToPrepared when Done button is clicked', inject(function (globalSpinner) {
            //given
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            $scope.positionsAssignedSelected = [];
            $scope.positionsAssignedSelected.push({id: 1});
            $scope.positionsAssignedSelected.push({id: 2});
            //when
            $scope.buttonDefs[0].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(positions.setPositionStatusToPrepared).toHaveBeenCalledWith($scope.positionsAssignedSelected[0].id);
            expect(positions.setPositionStatusToPrepared).toHaveBeenCalledWith($scope.positionsAssignedSelected[1].id);
        }));

        it('should activate Done button where there is an assigned position selected', function () {
            //given
            $scope.positionsAssignedSelected = [];
            $scope.positionsAssignedSelected.push({id: 1});
            //when then
            expect($scope.buttonDefs[0].isActive()).toBeTruthy();
        });

        it('should call positions.makePositionAvailable when Reject button is clicked', inject(function (globalSpinner) {
            //given
            spyOn(globalSpinner, 'decorateCallOfFunctionReturningPromise').and.callThrough();
            $scope.positionsAssignedSelected = [];
            $scope.positionsAssignedSelected.push({id: 1});
            $scope.positionsAssignedSelected.push({id: 2});
            //when
            $scope.buttonDefs[1].onClick();
            //then
            expect(globalSpinner.decorateCallOfFunctionReturningPromise).toHaveBeenCalled();
            expect(positions.makePositionAvailable).toHaveBeenCalledWith($scope.positionsAssignedSelected[0].id);
            expect(positions.makePositionAvailable).toHaveBeenCalledWith($scope.positionsAssignedSelected[1].id);
        }));

        it('should activate Reject button where there is an assigned position selected', function () {
            //given
            $scope.positionsAssignedSelected = [];
            $scope.positionsAssignedSelected.push({id: 1});
            //when then
            expect($scope.buttonDefs[1].isActive()).toBeTruthy();
        });
    });
});
