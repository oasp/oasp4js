describe('sign-in', function () {
    "use strict";
    var $scope;

    beforeEach(module('oasp.main'));
    beforeEach(inject(function (_$rootScope_) {
        $scope = _$rootScope_;
    }));

    it('should test sign-in dialog', inject(function ($controller) {
        //given //when
        $controller('SignInCntl', {$scope: $scope});
        //then
        expect($scope.sample).toBeTruthy();
    }));
});