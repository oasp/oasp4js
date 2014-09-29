describe('spinner directive specs', function () {
    "use strict";
    var $compile, $rootScope;

    beforeEach(module('oasp.templates'));
    beforeEach(module('oasp.main'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('renders a spinner', function () {
        // when
        var element = $compile('<div data-spinner="globalSpinner"></div>')($rootScope);
        $rootScope.globalSpinner = true;
        $rootScope.$digest();
        // then
        expect(element.find('.spinner').length).toEqual(1);
    });
});
